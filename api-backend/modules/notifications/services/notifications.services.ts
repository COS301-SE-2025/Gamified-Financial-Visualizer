// services/notification.service.ts
import { redisClient } from '../../../config/redis';
import pool from '../../../config/db';

export type Notification = {
   type: string;          // e.g. "friend_request", "achievement", …
   payload: any;          // whatever meta you need
   timestamp: number;     // ms since epoch
};

/**
 * Push a new notification onto user’s list *and* publish
 */
export async function notifyUser(
   userId: number,
   type: string,
   payload: any
) {
   const note: Notification = { type, payload, timestamp: Date.now() };
   const channel = `notifications:${userId}`;
   const inboxKey = `notif:inbox:${userId}`;
   const msg = JSON.stringify(note);

   const TTL_SECONDS = 1 * 3600;

   // atomic: push to list, trim, then publish
   await redisClient.multi()
      .lPush(inboxKey, msg)
      .lTrim(inboxKey, 0, 99)
      .expire(inboxKey, TTL_SECONDS)
      .publish(channel, msg)
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
      ai.avatar_image_path,
      f.created_at
    FROM friendships f
    JOIN users u ON u.user_id = f.user_id
    JOIN user_preferences up ON up.user_id = u.user_id
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
   }

   interface FriendRequestPayload {
      from: number;
      username: string;
      avatar: string;
   }

   return (rows as FriendRequestRow[]).map((r): Notification => ({
      type: 'friend_request',
      payload: {
         from: r.requester_id,
         username: r.username,
         avatar: r.avatar_image_path,
      } as FriendRequestPayload,
      timestamp: new Date(r.created_at).getTime(),
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
      payload: { goalId: r.goal_id, title: r.goal_name },
      timestamp: new Date(r.updated_at).getTime(),
      message: `You completed your ${r.goal_name} goal!`,
   }));

   const reminders = remRes.rows.map(r => ({
      type: 'goal_reminder',
      payload: { goalId: r.goal_id, title: r.goal_name },
      timestamp: new Date(r.target_date).getTime(),
      message: `"${r.goal_title}" is due on ${r.target_date.toISOString().slice(0, 10)}`,
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
      payload: { budgetId: r.budget_id, name: r.budget_name, spent: r.spent, limit: r.limit },
      timestamp: Date.now(),
      message: `"${r.name}" budget exceeded (${r.spent}/${r.limit})`,
   }));

   const upcoming = due.rows.map(r => ({
      type: 'budget_due',
      payload: { budgetId: r.budget_id, name: r.budget_name },
      timestamp: new Date(r.period_end).getTime(),
      message: `"${r.name}" resets on ${r.period_end.toISOString().slice(0, 10)}`,
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

   const spent = spending.rows[ 0 ]?.total || 0;
   const earned = income.rows[ 0 ]?.total || 0;

   return [ {
      type: 'insight',
      payload: {
         message: `Last week: you earned ${earned}, spent ${spent}`,
         spent, earned
      },
      timestamp: Date.now()
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
