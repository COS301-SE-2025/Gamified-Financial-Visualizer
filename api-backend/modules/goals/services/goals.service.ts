// goal.service.ts
// Handles operations for personal and community goals

import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../../../config/logger';
import pool from '../../../config/db';


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
  target_date: string; // YYYY-MM-DD
  goal_status?: 'in-progress' | 'completed' | 'paused' | 'cancelled' | 'failed';
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
    target_date,
    goal_status = 'in-progress'
  } = goal;

  const sql = `
    INSERT INTO goals (
      user_id, goal_name, goal_type,
      target_amount, current_amount, target_date, goal_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING goal_id;
  `;
  try {
    const res = await pool.query(sql, [
      user_id,
      goal_name,
      goal_type,
      target_amount,
      current_amount,
      target_date,
      goal_status
    ]);
    const newId = res.rows[0].goal_id;
    logger.info(`[GoalService] Created goal ID=${newId}`);
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
    const res = await pool.query(sql, [goal_id]);
    return res.rows[0] ?? null;
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
    const res = await pool.query(sql, [user_id]);
    return res.rows;
  } catch (error) {
    logger.error(`[GoalService] Error fetching goals for user ${user_id}:`, error);
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

  for (const [key, val] of Object.entries(updates)) {
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
    await pool.query(sql, [goal_id]);
    logger.info(`[GoalService] Deleted goal ID=${goal_id}`);
  } catch (error) {
    logger.error(`[GoalService] Error deleting goal ${goal_id}:`, error);
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
  const sql = `
    INSERT INTO goal_progress (goal_id, contributor_id, amount_added)
    VALUES ($1, $2, $3)
    RETURNING progress_id;
  `;
  try {
    const res = await pool.query(sql, [goal_id, contributor_id, amount_added]);
    const pid = res.rows[0].progress_id;
    logger.info(`[GoalService] Added progress ID=${pid} to goal ID=${goal_id}`);
    return pid;
  } catch (error) {
    logger.error(`[GoalService] Error adding progress to goal ${goal_id}:`, error);
    throw error;
  }
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
    await pool.query(updateGoalSql, [goal_id]);
    await pool.query(updatePointsSql, [goal_id, points]);
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
    await pool.query(updateGoalSql, [amount, goal_id]);
    await pool.query(updatePointsSql, [goal_id, points]);
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
    const res = await pool.query(sql);
    return res.rows;
  } catch (error) {
    logger.error(`[GoalService] Error fetching all goals:`, error);
    throw error;
  }
}

export async function getUserGoalStats(user_id: number) {
  const sql = `
    SELECT
      COUNT(*) FILTER (WHERE user_id = $1) AS total_goals,
      COUNT(*) FILTER (WHERE user_id = $1 AND goal_status = 'completed') AS completed_goals,
      COALESCE(SUM(current_amount), 0) AS total_saved
    FROM goals
    WHERE user_id = $1;
  `;
  const result = await pool.query(sql, [user_id]);
  return result.rows[0];
}

/**
 * Fetches all goals for a user that are due within the next 7 days
 * and still in progress.
 */
export async function getUpcomingGoals(user_id: number, daysAhead: number = 30) {
  const query = `
    SELECT *
    FROM goals
    WHERE user_id = $1
      AND goal_status = 'in-progress'
      AND target_date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
    ORDER BY target_date ASC;
  `;

  try {
    const result = await pool.query(query, [user_id]);
    logger.info(`[GoalService] Fetched upcoming goals for user ID ${user_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[GoalService] Failed to fetch upcoming goals for user ID ${user_id}:`, err);
    throw err;
  }
}