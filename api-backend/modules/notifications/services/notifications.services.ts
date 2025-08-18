
// services/notification.service.ts
import { redisClient } from '../../../config/redis';
import pool from '../../../config/db';

export type Notification = {
  type: string;
  payload: any;
  timestamp: number;
  message?: string;
  expiresAt?: number;
  key?: string; // <- stable identity for dismissing
};

const INBOX_TTL_SECONDS = 3600;
const VIEWED_SET_TTL_SECONDS = 30 * 24 * 3600;
const HIDE_VIEWED_AFTER_MS = 3 * 24 * 3600 * 1000;

function dismissedKey(userId: number) {
  return `notif:dismissed:${userId}`;
}

function makeKey(note: Notification): string {
  // Build a stable key per type using identifying fields
  try {
    const p = note.payload || {};
    switch (note.type) {
      case 'friend_request':       return `fr:${p.from}`;
      case 'friend_request_accepted':
                                   return `fr_ok:${p.from || p.userId || 'unknown'}`;
      case 'achievement':          return `goal_completed:${p.goalId}:${note.timestamp}`;
      case 'goal_reminder':        return `goal_due:${p.goalId}:${new Date(p.dueDate).toISOString().slice(0,10)}`;
      case 'challenge_invite':     return `challenge_joined:${p.challengeId}:${note.timestamp}`;
      case 'budget_over': {
        // Use budget_id + period_end date if present, else today's date to avoid respam
        const day = p.periodEnd ? new Date(p.periodEnd).toISOString().slice(0,10)
                                : new Date().toISOString().slice(0,10);
        return `budget_over:${p.budgetId}:${day}`;
      }
      case 'budget_due': {
        const day = p.dueDate ? new Date(p.dueDate).toISOString().slice(0,10)
                              : new Date(note.timestamp).toISOString().slice(0,10);
        return `budget_due:${p.budgetId}:${day}`;
      }
      case 'insight':              return `insight:${new Date(note.timestamp).toISOString().slice(0,10)}`;
      default:                     return `${note.type}:${note.timestamp}`;
    }
  } catch {
    return `${note.type}:${note.timestamp}`;
  }
}

export async function markDismissed(userId: number, key: string) {
  await redisClient.sAdd(dismissedKey(userId), key);
  // Keep dismiss marks for a while (30 days)
  await redisClient.expire(dismissedKey(userId), VIEWED_SET_TTL_SECONDS);
}

export async function filterOutDismissed(userId: number, items: Notification[]) {
  if (!items.length) return items;
  const keys = items.map(n => n.key || makeKey(n));
  // Use SMISMEMBER if available; fallback to SISMEMBER loop
  let flags: boolean[] = [];
  try {
    // @ts-ignore
    const res = await (redisClient as any).sMIsMember(dismissedKey(userId), keys);
    flags = res.map(Boolean);
  } catch {
    const checks = await Promise.all(keys.map(k => redisClient.sIsMember(dismissedKey(userId), k)));
    flags = checks.map(Boolean);
  }
  return items.filter((_, i) => !flags[i]);
}

export async function filterOutExpiredViewed(userId: number, items: Notification[]) {
  if (items.length === 0) return items;
  const key = `notif:viewed:${userId}`;
  const tsStrings = items.map(n => String(n.timestamp));
  let flags: boolean[] = [];
  try {
    // @ts-ignore
    flags = (await (redisClient as any).sMIsMember(key, tsStrings)).map(Boolean);
  } catch {
    const checks = await Promise.all(tsStrings.map(t => redisClient.sIsMember(key, t)));
    flags = checks.map(n => Boolean(n));
  }
  const now = Date.now();
  return items.filter((note, i) => !(flags[i] && (now - note.timestamp) > HIDE_VIEWED_AFTER_MS));
}


/**
 * Push a new notification onto user’s list *and* publish
 */
export async function notifyUser(userId: number, type: string, payload: any) {
  const base: Notification = { type, payload, timestamp: Date.now() };
  base.key = makeKey(base);
  const channel = `notifications:${userId}`;
  const inboxKey = `notif:inbox:${userId}`;
  const msg = JSON.stringify(base);
  await redisClient.multi()
    .lPush(inboxKey, msg)
    .lTrim(inboxKey, 0, 99)
    .expire(inboxKey, INBOX_TTL_SECONDS)
    .publish(channel, msg)
    .exec();
}

function viewedKey(userId: number) {
  return `notif:viewed:${userId}`;
}

export async function markNotificationsViewed(userId: number, timestamps: number[]) {
  if (!timestamps.length) return;
  const key = viewedKey(userId);
  const args = timestamps.map(String);
  await redisClient.multi()
    .sAdd(key, args)
    .expire(key, VIEWED_SET_TTL_SECONDS)
    .exec();
}


/**
 * Get the last N notifications for a user
 */
export async function getUserNotifications(
   userId: number,
   count = 50
): Promise<Notification[]> {
   const inboxKey = `notif:inbox:${userId}`;
   const raw = await redisClient.lRange(inboxKey, 0, count - 1);
   return raw.map((s) => JSON.parse(s) as Notification);
}


/**
 * Fetch all friend‐requests pending *to* this user,
 * and map them into our Notification shape.
 */
export async function getPendingFriendRequests(userId: number): Promise<Notification[]> {
   const sql = `
    SELECT
      f.user_id   AS requester_id,
      u.username,
      pts.total_points,
      pts.tier_status,
      ai.avatar_image_path,
      f.created_at
    FROM friendships f
    JOIN users u ON u.user_id = f.user_id
    JOIN user_preferences up ON up.user_id = u.user_id
    JOIN user_points pts ON pts.user_id = u.user_id
    JOIN avatar_images ai ON ai.avatar_id = up.avatar_id
    WHERE f.friend_id = $1
      AND f.relationship_status = 'pending'
    LIMIT 50
  `;
   const { rows } = await pool.query(sql, [ userId ]);

   interface FriendRequestRow {
      requester_id: number;
      username: string;
      avatar_image_path: string;
      created_at: string;
      total_points: number;
      tier_status: string;
   }

   interface FriendRequestPayload {
      from: number;
      username: string;
      avatar: string;
      totalPoints: number;
      tierStatus: string;
   }

   return (rows as FriendRequestRow[]).map((r): Notification => ({
      type: 'friend_request',
      payload: {
         from: r.requester_id,
         username: r.username,
         avatar: r.avatar_image_path,
         totalPoints: r.total_points,
         tierStatus: r.tier_status,
      } as FriendRequestPayload,
      timestamp: new Date(r.created_at).getTime(),
        key: `fr:${r.requester_id}`
   }));
}

export async function getGoalMilestones(userId: number): Promise<Notification[]> {
   const completedSql = `
    SELECT goal_id, banner_images.banner_image_path ,goal_name, updated_at
    FROM goals
    JOIN banner_images ON banner_images.banner_id = goals.banner_id
    WHERE user_id = $1
      AND current_amount >= target_amount
      AND updated_at >= NOW() - INTERVAL '24 hours'
  `;
   const remindSql = `
    SELECT goal_id, goal_name, target_date
    FROM goals
    WHERE user_id = $1
      AND target_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'
  `;
   const [ compRes, remRes ] = await Promise.all([
      pool.query(completedSql, [ userId ]),
      pool.query(remindSql, [ userId ]),
   ]);

const completed = compRes.rows.map(r => ({
  type: 'achievement',
  payload: {
    goalId: r.goal_id,
    title: r.goal_name,
    banner: r.banner_image_path,
  },
  timestamp: new Date(r.updated_at).getTime(),
  message: `You completed your "${r.goal_name}" goal!`,
}));

const reminders = remRes.rows.map(r => ({
  type: 'goal_reminder',
  payload: {
    goalId: r.goal_id,
    title: r.goal_name,
    dueDate: new Date(r.target_date).toISOString(),
  },
  timestamp: new Date(r.target_date).getTime(),
  message: `"${r.goal_name}" is due on ${new Date(r.target_date).toISOString().slice(0,10)}`,
}));


   return [ ...completed, ...reminders ];
}

/**
 * 4) New challenge invites in last 24h
 */
export async function getChallengeInvites(userId: number): Promise<Notification[]> {
   const sql = `
    SELECT c.challenge_id, c.challenge_title, cp.join_date
    FROM challenge_progress cp
    JOIN challenges c ON c.challenge_id = cp.challenge_id
    WHERE cp.user_id = $1
      AND cp.participation_status = 'joined'
      AND cp.join_date >= NOW() - INTERVAL '24 hours'
  `;
   const { rows } = await pool.query(sql, [ userId ]);
   return rows.map(r => ({
      type: 'challenge_invite',
      payload: { challengeId: r.challenge_id, title: r.challenge_title },
      timestamp: new Date(r.join_date).getTime(),
      message: `You joined "${r.challenge_title}"`,
      key: `ci:${r.challenge_id}`
   }));
}

/**
 * 5) Budget alerts: over‐limit or about to reset
 */
export async function getBudgetAlerts(userId: number): Promise<Notification[]> {
   const sqlOver = `
    SELECT b.budget_id, b.budget_name, b.period_end, bc.current_amount ,  bc.target_amount
    FROM budgets b
    JOIN budget_categories bc ON b.budget_id = bc.budget_id
    WHERE b.user_id = $1
      AND bc.current_amount >= bc.target_amount 
  `;
   const sqlDue = `
    SELECT b.budget_id, b.budget_name, b.period_end, bc.current_amount, bc.target_amount
    FROM budgets b
    JOIN budget_categories bc ON b.budget_id = bc.budget_id
    WHERE b.user_id = $1
      AND bc.target_amount > 0
      AND bc.current_amount >= 0.8 * bc.target_amount
      AND bc.current_amount < bc.target_amount
      AND b.period_end BETWEEN NOW() AND NOW() + INTERVAL '3 days'
  `;
   const [ over, due ] = await Promise.all([
      pool.query(sqlOver, [ userId ]),
      pool.query(sqlDue, [ userId ]),
   ]);

const tooMuch = over.rows.map(r => ({
  type: 'budget_over',
  payload: {
    budgetId: r.budget_id,
    category: r.budget_name,           // keep "category" for frontend text
    spent: Number(r.current_amount),
    limit: Number(r.target_amount),
  },
  timestamp: Date.now(),
  message: `"${r.budget_name}" budget exceeded (${r.current_amount}/${r.target_amount})`,
  key: `bu:${r.budget_id}`
}));

const upcoming = due.rows.map(r => ({
  type: 'budget_due',
  payload: {
    budgetId: r.budget_id,
    category: r.budget_name,
    amount: Number(r.current_amount),
    dueDate: new Date(r.period_end).toISOString(), // frontend formats it
  },
  timestamp: new Date(r.period_end).getTime(),
  message: `"${r.budget_name}" resets on ${new Date(r.period_end).toISOString().slice(0,10)}`,
  key: `bu_due:${r.budget_id}:${new Date(r.period_end).toISOString().slice(0,10)}`
}));


   return [ ...tooMuch, ...upcoming ];
}

/**
 * 6) Weekly financial insights digest (one notification)
 */
export async function getFinancialInsightsDigest(userId: number): Promise<Notification[]> {
   // Just a stub: you’d compute actual metrics in SQL or a nightly job.
   const spending = await pool.query(`
    SELECT SUM(transaction_amount) AS total
    FROM transactions
    JOIN accounts ON accounts.account_id = transactions.account_id
    WHERE accounts.user_id = $1
      AND transaction_date >= NOW() - INTERVAL '7 days'
  `, [ userId ]);

   const income = await pool.query(`
    SELECT SUM(transaction_amount) AS total
    FROM transactions
    JOIN accounts ON accounts.account_id = transactions.account_id
    WHERE accounts.user_id = $1
      AND transaction_date >= NOW() - INTERVAL '7 days'
      AND transaction_amount > 0
  `, [ userId ]);

   const spent = spending.rows[ 0 ]?.total;
   const earned = income.rows[ 0 ]?.total;

   if (spent === null || earned === null) {
      // don't send notification
      return [];
   }
   return [ {
      type: 'insight',
      payload: {
         message: `Last week: you earned ${earned}, spent ${spent}`,
         spent, earned
      },
      timestamp: Date.now(),
      key: `insight:${userId}`
   } ];
}

export async function removeNotification(
  userId: number,
  timestamp: number
): Promise<void> {
  const inboxKey = `notif:inbox:${userId}`;
  // fetch the entire list (small—capped at 100)
  const entries = await redisClient.lRange(inboxKey, 0, -1);
  // find the exact JSON string to remove
  const match = entries.find(e => {
    try {
      return JSON.parse(e).timestamp === timestamp;
    } catch {
      return false;
    }
  });
  if (match) {
    // remove exactly one occurrence
    await redisClient.lRem(inboxKey, 1, match);
  }
}

/**
 * Clear all notifications for a user
 */
export async function clearUserNotifications(userId: number) {
   const inboxKey = `notif:inbox:${userId}`;
   await redisClient.del(inboxKey);
}
