import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../../../config/logger';
import pool from '../../../config/db';
import { redisClient } from '../../../config/redis';

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
}

export interface UserAchievement {
  user_id: number;
  achievement_id: number;
  progress_value: number;
  achievement_status: 'incomplete' | 'complete';
  awarded_at: string;
  achievement_title: string;
  achievement_description: string;
  points_awarded: number;
  badge_image_path: string;
  rarity: string;
}

export async function getAllAchievements(): Promise<AchievementDefinition[]> {
   const imgPath = '../../assets/Images/';
   const sql = `
      SELECT a.*, b.image_path, b.rarity
      FROM achievements a
      JOIN badges b ON a.badge_id = b.badge_id
      ORDER BY a.display_order;
   `;
   const { rows } = await pool.query(sql);
   // Concatenate image path
   return rows.map(row => ({
      ...row,
      image_path: imgPath + row.image_path
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
   const imgPath = '../../assets/Images/';
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

    return rows.map(row => ({
      ...row,
      badge_image_path: imgPath + row.badge_image_path
   }));
}

async function checkAndComplete(
  userId: number,
  ach: AchievementDefinition,
  newValue: number
): Promise<void> {
  const { achievement_id, trigger_condition_json } = ach;
  const { operator, value } = trigger_condition_json;

  const progress = Math.min(newValue, value);
  let status: 'incomplete' | 'complete' = 'incomplete';

  switch (operator) {
    case '>=':
      if (progress >= value) status = 'complete';
      break;
    case '==':
      if (progress === value) status = 'complete';
      break;
    default:
      break;
  }

  const update = `
    UPDATE user_achievements
    SET progress_value = $1,
        achievement_status = $2,
        awarded_at = CASE WHEN ua.achievement_status = 'incomplete' AND $2 = 'complete' THEN CURRENT_TIMESTAMP ELSE ua.awarded_at END
    FROM user_achievements ua
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
  if (Number(rows[0].incomplete_count) === 0) {
    const upd = `
      UPDATE user_achievements
      SET achievement_status = 'complete', awarded_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND achievement_id = $2;
    `;
    await pool.query(upd, [userId, parentId]);
  }
}

/**
 * Update achievements for an event based on trigger JSON
 * eventType: 'transaction', 'goal', 'budget', etc.
 * delta: numeric (count or amount)
 */
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

  for (const ach of defs as AchievementDefinition[]) {
    const { type, count, min_amount, max_days, weeks } = ach.trigger_condition_json;
    let inc = 0;

    switch (type) {
      case 'transaction_count':
        inc = delta;
        break;
      case 'single_transaction':
        inc = delta >= min_amount ? 1 : 0;
        break;
      case 'goal_completed':
        inc = delta;
        break;
      case 'goal_speed':
        inc = delta <= max_days ? 1 : 0;
        break;
      case 'budget_created':
        inc = delta;
        break;
      case 'budget_streak':
        inc = delta >= weeks ? 1 : 0;
        break;
      default:
        inc = 0;
    }

    if (inc > 0) {
      const progSql = `
        SELECT progress_value
        FROM user_achievements
        WHERE user_id = $1 AND achievement_id = $2;
      `;
      const { rows: pRows } = await pool.query(progSql, [userId, ach.achievement_id]);
      const current = pRows.length ? Number(pRows[0].progress_value) : 0;
      const newValue = current + inc;
      await checkAndComplete(userId, ach, newValue);
    }
  }
}

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ----- Types -----
export interface AchievementDef {
  achievement_id: number;
  parent_id: number | null;
  badge_id: number;
  achievement_title: string;
  achievement_description: string;
  achievement_type: string;
  points_awarded: number;
  trigger_condition_json: Record<string, any>;
  is_umbrella: boolean;
  display_order: number;
  badge_image_path?: string;
  rarity?: string;
}

export interface UserAchievementData {
  user_id: number;
  achievement_id: number;
  progress_value: number;
  achievement_status: 'incomplete' | 'complete';
  awarded_at: string;
}

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

// ----- API calls -----
/** Fetch all achievement definitions */
export async function fetchAchievementDefinitions(): Promise<AchievementDef[]> {
  const res = await fetch(`${API_BASE}/achievements/`);
  if (!res.ok) throw new Error('Failed to load definitions');
  const payload = await res.json() as { status: string; data: AchievementDef[] };
  return payload.data;
}

export async function fetchUserAchievements(userId: number): Promise<UserAchievementData[]> {
  const res = await fetch(`${API_BASE}/achievements/user/${userId}`);
  if (!res.ok) throw new Error('Failed to load user achievements');
  const payload = await res.json() as { status: string; data: UserAchievementData[] };
  return payload.data;
}
// ----- Merged tasks for a given umbrella -----
/**
 * For a given umbrella title, returns its child achievements merged
 * with the user's progress info.
 */
export async function fetchAchievementTasks(
  umbrellaTitle: string,
  userId: number
): Promise<AchievementTask[]> {
  // parallel fetch
  const [defs, userData] = await Promise.all([
    fetchAchievementDefinitions(),
    fetchUserAchievements(userId)
  ]);

  // find umbrella definition
  const umbrella = defs.find(d => d.achievement_title === umbrellaTitle);
  if (!umbrella) {
    throw new Error(`Achievement "${umbrellaTitle}" not found`);
  }

  // get children
  const children = defs.filter(d => d.parent_id === umbrella.achievement_id);

  // merge user data
  const tasks: AchievementTask[] = children.map(def => {
    const ua = userData.find(u => u.achievement_id === def.achievement_id);
    const progress = ua ? ua.progress_value : 0;

    // determine total from trigger JSON
    const t = def.trigger_condition_json;
    const total =
      (t.count as number) ??
      (t.value as number) ??
      (t.min_amount as number) ??
      (t.weeks as number) ??
      1;

    return {
      achievement_id: def.achievement_id,
      title: def.achievement_title,
      description: def.achievement_description,
      points_awarded: def.points_awarded,
      trigger: def.trigger_condition_json,
      progress,
      total,
      status: ua ? ua.achievement_status : 'incomplete',
      badge_image: def.badge_image_path || '',
      rarity: def.rarity || 'Common',
    };
  });

  return tasks;
}

export interface SidebarStats {
  performance: number;           // percent 0-100
  performanceLabel: string;
  creditScore: number;           // 300-850
  level: string;                 // e.g. Bronze, Silver, etc.
  avatar_url: string;
  totalXp: number;              // total XP earned
  quizzes: number;
  accuracy: number;              // percent correct
  leaderboardRank: number;
  goalsCompleted: number;
  goalsTotal: number;
  badgesEarned: number;
  challengesJoined: number;
}

/**
 * Fetch all stats needed for the account sidebar in one go.
 */
export async function getSidebarStats(userId: number): Promise<SidebarStats> {
  // 1) XP performance: collected vs goal
  const xpRes = await pool.query(
    `
      WITH xp AS (
        SELECT
          COALESCE(SUM(
            GREATEST(10, FLOOR(ch.target_amount/100))
          ),0) AS collected,
          COALESCE(SUM(
            GREATEST(10, FLOOR(ch.target_amount/100))
          ) FILTER (WHERE ch.community_id = ch.community_id), 0) AS goal
        FROM challenges ch
        JOIN challenge_progress cp ON ch.challenge_id = cp.challenge_id AND cp.user_id = $1
        WHERE cp.participation_status = 'joined'
      )
      SELECT collected, goal FROM xp;
    `,
    [userId]
  );
  const { collected, goal } = xpRes.rows[0];
  const performance = goal > 0 ? Math.round((collected/goal)*100) : 0;
  let performanceLabel = 'Poor';
  if (performance >= 80) performanceLabel = 'Excellent';
  else if (performance >= 50) performanceLabel = 'Good';
  else if (performance > 0) performanceLabel = 'Fair';

  // credit score: map performance% to 300-850
  const creditScore = Math.min(850, Math.round(300 + (performance/100) * (850 - 300)));

  // level from credit score
  let level = 'Bronze';
  if (creditScore >= 750) level = 'Gold';
  else if (creditScore >= 600) level = 'Silver';
  else if (creditScore >= 450) level = 'Bronze';

  // avatar URL
  const avatarRes = await pool.query(
    `SELECT CONCAT('../../assets/Images', '/', ai.avatar_image_path) AS avatar_url
     FROM user_preferences up
     JOIN avatar_images ai ON up.avatar_id = ai.avatar_id
     WHERE up.user_id = $1;
    `,
    [userId]
  );
  const avatar_url = avatarRes.rows[0]?.avatar_url || '';

  // quizzes & accuracy
  const quizRes = await pool.query(
    `
      SELECT
        COUNT(*) AS quizzes,
        CASE WHEN COUNT(*)=0 THEN 0
             ELSE ROUND(100.0 * SUM(attempt_score::int) / COUNT(*))
        END AS accuracy
      FROM quiz_attempts
      WHERE user_id = $1;
    `,
    [userId]
  );
  const { quizzes, accuracy } = quizRes.rows[0];

  // leaderboard rank by total XP earned
  const rankRes = await pool.query(
    `
      SELECT rank FROM (
        SELECT user_id,
               RANK() OVER (ORDER BY SUM(progress_value) DESC) AS rank
        FROM user_achievements ua
        WHERE achievement_status='complete'
        GROUP BY user_id
      ) sub
      WHERE user_id = $1;
    `,
    [userId]
  );
  const leaderboardRank = rankRes.rows[0]?.rank || 0;

  const totalXpRes = await pool.query(
    `
      SELECT SUM(a.points_awarded) AS totalXp
      FROM user_achievements
      JOIN achievements a ON user_achievements.achievement_id = a.achievement_id
      WHERE user_id = $1
        AND achievement_status = 'complete'; 
    `,
    [userId]
  );

  const totalXp = totalXpRes.rows[0]?.totalxp || 0;
  // goals completed/total
  const goalsRes = await pool.query(
    `
      SELECT
        COUNT(*) FILTER (WHERE ch.challenge_status='completed') AS goalsCompleted,
        COUNT(*) AS goalsTotal
      FROM challenge_progress cp
      JOIN challenges ch ON cp.challenge_id = ch.challenge_id
      WHERE cp.user_id = $1;
    `,
    [userId]
  );
  const { goalscompleted, goalstotal } = goalsRes.rows[0];

  // badges earned
  const badgeRes = await pool.query(
    `
      SELECT COUNT(*) AS badgesEarned
      FROM user_achievements
      WHERE user_id = $1
        AND achievement_status = 'complete';
    `,
    [userId]
  );
  const badgesEarned = badgeRes.rows[0].badgeseaned || 0;

  // challenges joined
  const challRes = await pool.query(
    `
      SELECT COUNT(*) AS challengesJoined
      FROM challenge_progress
      WHERE user_id = $1
        AND participation_status = 'joined';
    `,
    [userId]
  );
  const challengesJoined = challRes.rows[0].challengesjoined || 0;

  return {
    performance,
    performanceLabel,
    creditScore,
    level,
    avatar_url,
    totalXp: Number(totalXp),
    quizzes: Number(quizzes),
    accuracy: Number(accuracy),
    leaderboardRank: Number(leaderboardRank),
    goalsCompleted: Number(goalscompleted),
    goalsTotal: Number(goalstotal),
    badgesEarned: Number(badgesEarned),
    challengesJoined: Number(challengesJoined),
  };
}