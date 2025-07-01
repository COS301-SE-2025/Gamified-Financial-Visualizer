// goal.service.ts
// Handles operations for personal and community goals
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../../../config/logger';
import pool from '../../../config/db';
import { redisClient } from '../../../config/redis';

/**
 * Represents a financial goal personal (user_id) .
 */
export interface Goal {
  goal_id?: number;
  user_id?: number;
  goal_name: string;
  goal_type: 'savings' | 'debt' | 'investment' | 'spending limit' | 'donation';
  target_amount: number;
  current_amount?: number;
  start_date: string; // YYYY-MM-DD
  target_date: string; // YYYY-MM-DD
  goal_status?: 'in-progress' | 'completed' | 'paused' | 'cancelled' | 'failed';
  banner_id?: number; // ID of the banner image
  category_id?: number; // ID of the category (if applicable)
  custom_category_id?: number; // ID of the custom category (if applicable)
}

/**
 * Create a new financial goal.
 * If `user_id` is provided, creates a personal goal.
 * Returns the newly created goal_id.
 */
export async function createGoal(goal: Goal): Promise<number> {
  const {
    user_id = null,
    goal_name,
    goal_type,
    target_amount,
    current_amount = 0,
    start_date,
    target_date,
    goal_status = 'in-progress',
    banner_id = 1,
    category_id,
    custom_category_id
  } = goal;

  const sql = `
    INSERT INTO goals (
       user_id, goal_name, goal_type,
      target_amount, current_amount,
      start_date, target_date,
      goal_status, banner_id,
      category_id, custom_category_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING goal_id;
  `;
  try {
    const res = await pool.query(sql, [
      user_id,
      goal_name,
      goal_type,
      target_amount,
      current_amount,
      start_date,
      target_date,
      goal_status,
      banner_id,
      category_id,
      custom_category_id
    ]);
    const newId = res.rows[ 0 ].goal_id;
    logger.info(`[GoalService] Created goal ID=${newId}`);
     // 🟢 Invalidate or update user goals cache after creation
    if (user_id) {
      const cacheKey = `user_goals:${user_id}`;
      // Option 1: Invalidate cache (recommended for consistency)
      await redisClient.del(cacheKey);
      getUserGoals(user_id); // Ensure we fetch the latest goals
    }
    return newId;
  } catch (error) {
    logger.error(`[GoalService] Error creating goal:`, error);
    throw error;
  }
}

/**
 * Fetch a single goal by its ID.
 */
export async function getGoal(goal_id: number): Promise<Goal | null> {
  const sql = `SELECT * FROM goals WHERE goal_id = $1;`;
  try {
    const res = await pool.query(sql, [ goal_id ]);
    return res.rows[ 0 ] ?? null;
  } catch (error) {
    logger.error(`[GoalService] Error fetching goal ${goal_id}:`, error);
    throw error;
  }
}

/**
 * Fetch all personal goals for a user.
 */
export async function getUserGoals(user_id: number): Promise<Goal[]> {
  const sql = `SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC;`;
  try {


    const res = await pool.query(sql, [ user_id ]);
    // cache the result


    if (res.rows.length === 0) {
      logger.info(`[GoalService] No goals found for user ${user_id}`);
    }
    return res.rows;
  } catch (error) {
    logger.error(`[GoalService] Error fetching goals for user ${user_id}:`, error);
    throw error;
  }
}

export async function getGoalsSummary(user_id: number) {
  const updateStatusSql = `
    UPDATE goals
    SET goal_status = CASE
      WHEN current_amount >= target_amount THEN 'completed'
      WHEN target_date < CURRENT_DATE AND current_amount < target_amount THEN 'failed'
      ELSE goal_status
    END
    WHERE user_id = $1;
  `;
  try {
    await pool.query(updateStatusSql, [ user_id ]);
  } catch (error) {
    logger.error(`[GoalService] Error updating goal statuses for user ${user_id}:`, error);
    throw error;
  }

  const sql = `
    SELECT
      COUNT(*) AS total_goals,
      COUNT(*) FILTER (WHERE goal_status = 'completed') AS completed_goals,
      COUNT(*) FILTER (WHERE goal_status = 'in-progress') AS in_progress_goals,
      COUNT(*) FILTER (WHERE goal_status = 'paused') AS paused_goals,
      COUNT(*) FILTER (WHERE goal_status = 'cancelled') AS cancelled_goals,
      COUNT(*) FILTER (WHERE goal_status = 'failed') AS failed_goals
    FROM goals
    WHERE user_id = $1;
  `;
  try {
    const res = await pool.query(sql, [ user_id ]);
    if (!res.rows || res.rows.length === 0) {
      return {
        total_goals: 0,
        completed_goals: 0,
        in_progress_goals: 0,
        overdue_goals: 0
      };
    }
    return res.rows[0];
  } catch (error) {
    logger.error(`[GoalService] Error fetching goals summary for user ${user_id}:`, error);
    throw error;
  }
}

export async function getGoalCategorySummary(user_id: number) {
  const sql = `
    SELECT goal_type, COUNT(*) AS count
    FROM goals
    WHERE user_id = $1
    GROUP BY goal_type
  `;

  try {
    const res = await pool.query(sql, [ user_id ]);
    return res.rows;
  } catch (error) {
    logger.error('[GoalService] Failed to fetch category summary', error);
    throw error;
  }
}


/**
 * Update fields of an existing goal.
 */
export async function updateGoal( // delete
  goal_id: number,
  updates: Partial<Omit<Goal, 'goal_id' | 'user_id' | 'community_id'>>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [ key, val ] of Object.entries(updates)) {
    fields.push(`${key} = $${idx}`);
    values.push(val);
    idx++;
  }
  if (!fields.length) return;

  const sql = `
    UPDATE goals
    SET ${fields.join(', ')}
    WHERE goal_id = $${idx};
  `;
  values.push(goal_id);
  try {
    await pool.query(sql, values);
    logger.info(`[GoalService] Updated goal ID=${goal_id}`);
  } catch (error) {
    logger.error(`[GoalService] Error updating goal ${goal_id}:`, error);
    throw error;
  }
}

/**
 * Delete a goal (and cascades to goal_progress).
 */
export async function deleteGoal(goal_id: number): Promise<void> {
  const sql = `DELETE FROM goals WHERE goal_id = $1;`;
  try {
    await pool.query(sql, [ goal_id ]);
    logger.info(`[GoalService] Deleted goal ID=${goal_id}`);
  } catch (error) {
    logger.error(`[GoalService] Error deleting goal ${goal_id}:`, error);
    throw error;
  }
}

export async function getTotalGoalValue(user_id: number): Promise<number> {
  const query = `
    SELECT COALESCE(SUM(current_amount), 0) AS total_goal_value
    FROM goals
    WHERE user_id = $1;
  `;

  try {
    const result = await pool.query(query, [ user_id ]);
    return Number(result.rows[ 0 ].total_goal_value);
  } catch (error) {
    console.error('[GoalService] Failed to get total goal value:', error);
    throw error;
  }
}

/**
 * Add progress (contribution) to a goal.
 * Returns the new progress_id.
 */
export async function addGoalProgress(
  goal_id: number,
  contributor_id: number,
  amount_added: number
): Promise<number> {
  if (goal_id == null || contributor_id == null || amount_added == null) {
    throw new Error('[GoalService] addGoalProgress: goal_id, contributor_id, and amount_added must be provided');
  }
  const sql = `
    INSERT INTO goal_progress (goal_id, contributor_id, amount_added)
    VALUES ($1, $2, $3)
    RETURNING progress_id;
  `;
  try {
    const res = await pool.query(sql, [ goal_id, contributor_id, amount_added ]);
    const pid = res.rows[ 0 ].progress_id;
    logger.info(`[GoalService] Added progress ID=${pid} to goal ID=${goal_id}`);
    return pid;
  } catch (error) {
    logger.error(`[GoalService] Error adding progress to goal ${goal_id}:`, error);
    throw error;
  }
}

export async function getWeeklyGoalCompletions(userId: number) {
  const sql = `
    SELECT
      TO_CHAR(DATE(t.transaction_date), 'Dy') AS day,
      COUNT(*) AS count
    FROM transactions t
    INNER JOIN goals g ON t.linked_goal_id = g.goal_id
    WHERE g.user_id = $1
      AND t.linked_goal_id IS NOT NULL
      AND t.transaction_date >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY DATE(t.transaction_date)
    ORDER BY MIN(DATE(t.transaction_date));
  `;
  try {
    // Check cache first
    const cacheKey = `weekly_goal_completions:${userId}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const result = await pool.query(sql, [ userId ]);
    // Cache the result for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result.rows), {
      EX: 60 * 60 // 1 hour
    });

    if (result.rows.length === 0) {
      logger.info(`[GoalService] No weekly completions found for user ${userId}`);
      return [];
    }

    return result.rows; // e.g., [{ day: 'Mon', count: 2 }, ...]
  } catch (err) {
    console.error('[GoalService] Error fetching goal progress frequency', err);
    throw err;
  }
}

export async function calculateGoalPerformance(userId: number) {
  const result = await pool.query(`
    WITH stats AS (
      SELECT 
        COUNT(*) FILTER (WHERE goal_status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE goal_status = 'failed' OR goal_status = 'cancelled') AS failed,
        COUNT(*) AS total,
        AVG(current_amount / target_amount) AS avg_progress
      FROM goals
      WHERE user_id = $1
    ),
    consistency AS (
      SELECT COUNT(*) AS streak_count
      FROM goal_progress
      WHERE contributor_id = $1 AND progress_date >= CURRENT_DATE - INTERVAL '6 days'
    )
    SELECT 
      stats.completed,
      stats.failed,
      stats.total,
      stats.avg_progress,
      consistency.streak_count
    FROM stats, consistency;
  `, [ userId ]);

  const { completed, failed, total, avg_progress, streak_count } = result.rows[ 0 ];

  if (total === 0) return 0;

  const completedScore = (completed / total) * 200;
  const progressScore = (avg_progress || 0) * 150;
  const streakScore = Math.min(streak_count, 5) / 5 * 100;
  const penalty = (failed / total) * 50;

  return Math.round(completedScore + progressScore + streakScore - penalty);
}

/**
 * Mark a goal as completed and award points.
 */
export async function completeGoal(goal_id: number, points = 10): Promise<void> {
  const updateGoalSql = `UPDATE goals SET goal_status = 'completed' WHERE goal_id = $1;`;
  const updatePointsSql = `
    UPDATE user_points
    SET total_points = total_points + $2, last_updated = CURRENT_TIMESTAMP
    WHERE user_id = (SELECT user_id FROM goals WHERE goal_id = $1);
  `;
  try {
    await pool.query(updateGoalSql, [ goal_id ]);
    await pool.query(updatePointsSql, [ goal_id, points ]);
    logger.info(`[GoalService] Completed goal ID=${goal_id}, awarded ${points} points`);
  } catch (error) {
    logger.error(`[GoalService] Error completing goal ${goal_id}:`, error);
    throw error;
  }
}

/**
 * Reduce goal progress and deduct points.
 */
export async function reduceGoalProgress(goal_id: number, amount: number, points = 5): Promise<void> {
  const updateGoalSql = `
    UPDATE goals
    SET current_amount = current_amount - $1
    WHERE goal_id = $2;
  `;
  const updatePointsSql = `
    UPDATE user_points
    SET total_points = total_points - $2, last_updated = CURRENT_TIMESTAMP
    WHERE user_id = (SELECT user_id FROM goals WHERE goal_id = $1);
  `;
  try {
    await pool.query(updateGoalSql, [ amount, goal_id ]);
    await pool.query(updatePointsSql, [ goal_id, points ]);
    logger.info(`[GoalService] Reduced goal ID=${goal_id} by ${amount}, deducted ${points} points`);
  } catch (error) {
    logger.error(`[GoalService] Error reducing progress for goal ${goal_id}:`, error);
    throw error;
  }
}

/**
 * Fetch all goals (personal and community).
 */
export async function getAllGoals(): Promise<Goal[]> { // delete
  const sql = `SELECT * FROM goals ORDER BY created_at DESC;`;
  try {
    // Check cache first
    const cacheKey = 'all_goals';
    const cachedGoals = await redisClient.get(cacheKey);
    if (cachedGoals) {
      return JSON.parse(cachedGoals) as Goal[];
    }
    const res = await pool.query(sql);
    // Cache the result for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(res.rows), {
      EX: 60 * 60 // cache for 1 hour
    });
    return res.rows;
  } catch (error) {
    logger.error(`[GoalService] Error fetching all goals:`, error);
    throw error;
  }
}

export async function getUserGoalStats(user_id: number) {
  await getGoalsSummary(user_id); // Ensure goal statuses are updated first
  
  const sql = `
    SELECT
      COUNT(*) FILTER (WHERE user_id = $1) AS total_goals,
      COUNT(*) FILTER (WHERE user_id = $1 AND goal_status = 'completed') AS completed_goals,
      COALESCE(SUM(current_amount), 0) AS total_saved
    FROM goals
    WHERE user_id = $1;
  `;

  // Check cache first
  const cacheKey = `user_goal_stats:${user_id}`;
  const cachedStats = await redisClient.get(cacheKey);
  if (cachedStats) {
    return JSON.parse(cachedStats);
  }

  const result = await pool.query(sql, [ user_id ]);
  // cache the result for 1 hour
  await redisClient.set(cacheKey, JSON.stringify(result.rows[0]), {
    EX: 60 * 60 // cache for 1 hour
  });
  return result.rows[ 0 ];
}

/**
 * Fetches all goals for a user that are due within the next 7 days
 * and still in progress.
 */
export async function getUpcomingGoals(user_id: number) {
  const daysAhead = 30
  const query = `
    SELECT *
    FROM goals
    WHERE user_id = $1
      AND goal_status = 'in-progress'
      AND target_date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
    ORDER BY target_date ASC;
  `;

  try {
    // Check cache first
    const cacheKey = `upcoming_goals:${user_id}`;
    const cachedGoals = await redisClient.get(cacheKey);
    if (cachedGoals) {
      return JSON.parse(cachedGoals);
    }
    const result = await pool.query(query, [ user_id ]);
    // Cache the result for 1 hour
    await redisClient.set(cacheKey, JSON.stringify(result.rows), {
      EX: 60 * 60 // cache for 1 hour
    });
    return result.rows;
  } catch (err) {
    logger.error(`[GoalService] Failed to fetch upcoming goals for user ID ${user_id}:`, err);
    throw err;
  }
}