import dotenv from 'dotenv';
dotenv.config();
import pool from '../../../config/db';
import { logger } from '../../../config/logger';

/** ---------- Types ---------- */
export interface AchievementDefinition {
  achievement_id: number;
  parent_id: number | null;
  badge_id: number;
  achievement_title: string;
  achievement_description: string;
  achievement_type: string;
  points_awarded: number;
  trigger_condition_json: any;
  is_umbrella: boolean;
  display_order: number;
  image_path: string;
  rarity: string;
  child_task_count: number;
  completed_task_count: number;
}

export interface UserAchievement {
  user_id: number;
  achievement_id: number;
  progress_value: number;
  achievement_status: 'incomplete' | 'complete';
  awarded_at: string | null;
  achievement_title: string;
  achievement_description: string;
  points_awarded: number;
  badge_image_path: string;
  rarity: string;
}

/** ---------- Helpers ---------- */
const toNum = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseJsonSafe = (v: any): Record<string, any> => {
  if (!v) return {};
  if (typeof v === 'object') return v;
  try { return JSON.parse(String(v)); } catch { return {}; }
};

const joinImagePath = (p: string | null | undefined): string => {
  if (!p) return '';
  // If already absolute or has ../ prefix, leave as-is
  if (/^https?:\/\//i.test(p) || p.startsWith('../') || p.startsWith('/')) return p;
  return `../../assets/Images/${p}`;         // expect DB to store e.g. "badges/accepted.png"
};

/** ---------- Queries ---------- */

export async function getAllAchievements(userId: number): Promise<AchievementDefinition[]> {
  const sql = `
    SELECT
      a.*,
      b.image_path,
      b.rarity,
      COALESCE(child.total, 0) AS child_task_count,
      COALESCE(child.completed, 0) AS completed_task_count
    FROM achievements a
    JOIN badges b ON a.badge_id = b.badge_id
    LEFT JOIN (
      SELECT
        parent_id,
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE ua.achievement_status = 'complete') AS completed
      FROM achievements ach
      LEFT JOIN user_achievements ua
        ON ach.achievement_id = ua.achievement_id AND ua.user_id = $1
      WHERE ach.is_umbrella = FALSE
      GROUP BY parent_id
    ) child ON child.parent_id = a.achievement_id
    WHERE a.is_umbrella = TRUE
    ORDER BY a.display_order;
  `;
  const { rows } = await pool.query(sql, [userId]);

  return rows.map((r) => ({
    achievement_id: toNum(r.achievement_id),
    parent_id: r.parent_id === null ? null : toNum(r.parent_id),
    badge_id: toNum(r.badge_id),
    achievement_title: r.achievement_title,
    achievement_description: r.achievement_description,
    achievement_type: r.achievement_type,
    points_awarded: toNum(r.points_awarded),
    trigger_condition_json: parseJsonSafe(r.trigger_condition_json),
    is_umbrella: !!r.is_umbrella,
    display_order: toNum(r.display_order),
    image_path: joinImagePath(r.image_path),
    rarity: r.rarity || 'Common',
    child_task_count: toNum(r.child_task_count),
    completed_task_count: toNum(r.completed_task_count),
  }));
}

export async function ensureUserAchievements(userId: number): Promise<void> {
  const sql = `
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT $1, a.achievement_id
    FROM achievements a
    WHERE NOT EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.user_id = $1 AND ua.achievement_id = a.achievement_id
    );
  `;
  await pool.query(sql, [userId]);
}

export async function getUserAchievements(userId: number): Promise<UserAchievement[]> {
  await ensureUserAchievements(userId);
  const sql = `
    SELECT ua.user_id, ua.achievement_id, ua.progress_value,
           ua.achievement_status, ua.awarded_at,
           a.achievement_title, a.achievement_description,
           a.points_awarded, b.image_path AS badge_image_path,
           b.rarity
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.achievement_id
    JOIN badges b       ON a.badge_id = b.badge_id
    WHERE ua.user_id = $1
    ORDER BY a.display_order;
  `;
  const { rows } = await pool.query(sql, [userId]);

  return rows.map((r) => ({
    user_id: toNum(r.user_id),
    achievement_id: toNum(r.achievement_id),
    progress_value: toNum(r.progress_value),
    achievement_status: r.achievement_status,
    awarded_at: r.awarded_at ?? null,
    achievement_title: r.achievement_title,
    achievement_description: r.achievement_description,
    points_awarded: toNum(r.points_awarded),
    badge_image_path: joinImagePath(r.badge_image_path),
    rarity: r.rarity || 'Common',
  }));
}

async function checkAndComplete(
  userId: number,
  ach: AchievementDefinition,
  newValue: number
): Promise<void> {
  const { achievement_id } = ach;
  const cond = parseJsonSafe(ach.trigger_condition_json);
  const operator = cond.operator ?? '>=';
  const value = toNum(cond.value, 0);

  const progress = Math.min(newValue, value || newValue);
  let status: 'incomplete' | 'complete' = 'incomplete';

  switch (operator) {
    case '>=': if (progress >= value && value > 0) status = 'complete'; break;
    case '==': if (value > 0 && progress === value) status = 'complete'; break;
    default:   if (value > 0 && progress >= value) status = 'complete';
  }

  const update = `
    UPDATE user_achievements AS ua
    SET progress_value = $1,
        achievement_status = $2,
        awarded_at = CASE
          WHEN ua.achievement_status = 'incomplete' AND $2 = 'complete'
          THEN CURRENT_TIMESTAMP
          ELSE ua.awarded_at
        END
    WHERE ua.user_id = $3 AND ua.achievement_id = $4;
  `;
  await pool.query(update, [progress, status, userId, achievement_id]);

  if (status === 'complete' && ach.parent_id) {
    await tryCompleteParent(userId, ach.parent_id);
  }
}

async function tryCompleteParent(userId: number, parentId: number): Promise<void> {
  const check = `
    SELECT COUNT(*) AS incomplete_count
    FROM achievements a
    JOIN user_achievements ua ON a.achievement_id = ua.achievement_id
    WHERE a.parent_id = $1
      AND ua.user_id = $2
      AND ua.achievement_status = 'incomplete';
  `;
  const { rows } = await pool.query(check, [parentId, userId]);
  if (toNum(rows?.[0]?.incomplete_count) === 0) {
    await pool.query(
      `UPDATE user_achievements
       SET achievement_status = 'complete', awarded_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND achievement_id = $2;`,
      [userId, parentId]
    );
  }
}

/** Update achievements for an event based on trigger JSON */
export async function updateAchievementsForEvent(
  userId: number,
  eventType: string,
  delta: number
): Promise<void> {
  const defsSql = `
    SELECT *
    FROM achievements
    WHERE achievement_type = $1
      AND is_umbrella = FALSE;
  `;
  const { rows: defs } = await pool.query(defsSql, [eventType]);

  await ensureUserAchievements(userId);

  for (const raw of defs) {
    const ach: AchievementDefinition = {
      ...raw,
      trigger_condition_json: parseJsonSafe(raw.trigger_condition_json),
      achievement_id: toNum(raw.achievement_id),
      parent_id: raw.parent_id === null ? null : toNum(raw.parent_id),
      points_awarded: toNum(raw.points_awarded),
      is_umbrella: !!raw.is_umbrella,
      display_order: toNum(raw.display_order),
      image_path: String(raw.image_path ?? ''),
      rarity: String(raw.rarity ?? 'Common'),
      child_task_count: 0,
      completed_task_count: 0,
      badge_id: toNum(raw.badge_id),
    };

    const { type, min_amount, max_days, weeks } = ach.trigger_condition_json || {};
    let inc = 0;

    switch (type) {
      case 'transaction_count': inc = delta; break;
      case 'single_transaction': inc = delta >= toNum(min_amount, Infinity) ? 1 : 0; break;
      case 'goal_completed': inc = delta; break;
      case 'goal_speed': inc = delta <= toNum(max_days, -Infinity) ? 1 : 0; break;
      case 'budget_created': inc = delta; break;
      case 'budget_streak': inc = delta >= toNum(weeks, Infinity) ? 1 : 0; break;
      default: inc = 0;
    }

    if (inc > 0) {
      const { rows: pRows } = await pool.query(
        `SELECT progress_value FROM user_achievements WHERE user_id = $1 AND achievement_id = $2;`,
        [userId, ach.achievement_id]
      );
      const current = pRows.length ? toNum(pRows[0].progress_value) : 0;
      const newValue = current + inc;
      await checkAndComplete(userId, ach, newValue);
    }
  }
}

/** Child tasks for an umbrella (by title) merged with user's progress */
export interface AchievementTask {
  achievement_id: number;
  title: string;
  description: string;
  points_awarded: number;
  trigger: Record<string, any>;
  progress: number;
  total: number;
  status: 'incomplete' | 'complete';
  badge_image: string;
  rarity: string;
}

export async function fetchAchievementTasks(umbrellaTitle: string, userId: number): Promise<AchievementTask[]> {
  const query = `
    WITH umbrella AS (
      SELECT achievement_id
      FROM achievements
      WHERE achievement_title = $2
      LIMIT 1
    )
    SELECT
      a.achievement_id,
      a.achievement_title AS title,
      a.achievement_description AS description,
      a.points_awarded,
      a.trigger_condition_json AS trigger,
      COALESCE(c.progress_value, 0) AS progress,
      COALESCE(
        (a.trigger_condition_json::json->>'count')::int,
        (a.trigger_condition_json::json->>'value')::int,
        (a.trigger_condition_json::json->>'min_amount')::int,
        (a.trigger_condition_json::json->>'weeks')::int,
        1
      ) AS total,
      COALESCE(c.achievement_status, 'incomplete') AS status,
      COALESCE(b.image_path, '') AS badge_image,
      COALESCE(b.rarity, 'Common') AS rarity
    FROM achievements a
    JOIN umbrella u ON a.parent_id = u.achievement_id
    LEFT JOIN badges b ON a.badge_id = b.badge_id
    LEFT JOIN user_achievements c
      ON a.achievement_id = c.achievement_id AND c.user_id = $1
    WHERE a.is_umbrella = FALSE
    ORDER BY a.display_order;
  `;
  const { rows } = await pool.query(query, [userId, umbrellaTitle]);

  return rows.map((r) => ({
    achievement_id: toNum(r.achievement_id),
    title: r.title,
    description: r.description,
    points_awarded: toNum(r.points_awarded),
    trigger: parseJsonSafe(r.trigger),
    progress: toNum(r.progress),
    total: Math.max(1, toNum(r.total, 1)),
    status: r.status,
    badge_image: joinImagePath(r.badge_image),
    rarity: r.rarity || 'Common',
  }));
}

/** Sidebar stats in one query set */
export interface SidebarStats {
  performance: number;
  performanceLabel: string;
  creditScore: number;
  level: string;
  avatar_url: string;
  totalXp: number;
  quizzes: number;
  accuracy: number;
  leaderboardRank: number;
  goalsCompleted: number;
  goalsTotal: number;
  badgesEarned: number;
  challengesJoined: number;
}

export async function getSidebarStats(userId: number): Promise<SidebarStats> {
  // XP performance (placeholder logic kept)
  const xpRes = await pool.query(
    `
      WITH xp AS (
        SELECT
          COALESCE(SUM(GREATEST(10, FLOOR(ch.target_amount/100))),0) AS collected,
          COALESCE(SUM(GREATEST(10, FLOOR(ch.target_amount/100))), 0) AS goal
        FROM challenges ch
        JOIN challenge_progress cp ON ch.challenge_id = cp.challenge_id AND cp.user_id = $1
        WHERE cp.participation_status = 'joined'
      )
      SELECT collected, goal FROM xp;
    `,
    [userId]
  );
  const collected = toNum(xpRes.rows?.[0]?.collected);
  const goal = toNum(xpRes.rows?.[0]?.goal);
  const performance = goal > 0 ? Math.round((collected / goal) * 100) : 0;
  const performanceLabel =
    performance >= 80 ? 'Excellent' :
    performance >= 50 ? 'Good' :
    performance > 0   ? 'Fair' : 'Poor';
  const creditScore = Math.min(850, Math.round(300 + (performance / 100) * (850 - 300)));
  const level = creditScore >= 750 ? 'Gold' : creditScore >= 600 ? 'Silver' : 'Bronze';

  const avatarRes = await pool.query(
    `SELECT CONCAT('../../assets/Images', '/', ai.avatar_image_path) AS avatar_url
     FROM user_preferences up
     JOIN avatar_images ai ON up.avatar_id = ai.avatar_id
     WHERE up.user_id = $1;`,
    [userId]
  );
  const avatar_url = avatarRes.rows?.[0]?.avatar_url || '';

  const quizRes = await pool.query(
    `
      SELECT
        COUNT(*)::int AS quizzes,
        CASE WHEN COUNT(*)=0 THEN 0
             ELSE ROUND(100.0 * SUM(attempt_score::int) / COUNT(*))::int
        END AS accuracy
      FROM quiz_attempts
      WHERE user_id = $1;
    `,
    [userId]
  );
  const quizzes = toNum(quizRes.rows?.[0]?.quizzes);
  const accuracy = toNum(quizRes.rows?.[0]?.accuracy);

  const rankRes = await pool.query(
    `
      SELECT rank FROM (
        SELECT user_id,
               RANK() OVER (ORDER BY SUM(progress_value) DESC) AS rank
        FROM user_achievements
        WHERE achievement_status='complete'
        GROUP BY user_id
      ) sub
      WHERE user_id = $1;
    `,
    [userId]
  );
  const leaderboardRank = toNum(rankRes.rows?.[0]?.rank);

  const totalXpRes = await pool.query(
    `
      SELECT COALESCE(SUM(a.points_awarded),0) AS totalxp
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.achievement_id
      WHERE ua.user_id = $1 AND ua.achievement_status = 'complete';
    `,
    [userId]
  );
  const totalXp = toNum(totalXpRes.rows?.[0]?.totalxp);

  const goalsRes = await pool.query(
    `
      SELECT
        COUNT(*) FILTER (WHERE ch.challenge_status='completed')::int AS goalscompleted,
        COUNT(*)::int AS goalstotal
      FROM challenge_progress cp
      JOIN challenges ch ON cp.challenge_id = ch.challenge_id
      WHERE cp.user_id = $1;
    `,
    [userId]
  );
  const goalsCompleted = toNum(goalsRes.rows?.[0]?.goalscompleted);
  const goalsTotal = toNum(goalsRes.rows?.[0]?.goalstotal);

  const badgeRes = await pool.query(
    `
      SELECT COUNT(*)::int AS badgesearned
      FROM user_achievements
      WHERE user_id = $1 AND achievement_status = 'complete';
    `,
    [userId]
  );
  const badgesEarned = toNum(badgeRes.rows?.[0]?.badgesearned);

  const challRes = await pool.query(
    `
      SELECT COUNT(*)::int AS challengesjoined
      FROM challenge_progress
      WHERE user_id = $1 AND participation_status = 'joined';
    `,
    [userId]
  );
  const challengesJoined = toNum(challRes.rows?.[0]?.challengesjoined);

  return {
    performance,
    performanceLabel,
    creditScore,
    level,
    avatar_url,
    totalXp,
    quizzes,
    accuracy,
    leaderboardRank,
    goalsCompleted,
    goalsTotal,
    badgesEarned,
    challengesJoined,
  };
}
