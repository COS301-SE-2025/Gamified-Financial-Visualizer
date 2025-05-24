// goal.service.ts
// Handles operations for personal and community goals

import { Pool } from 'pg';
import { logger } from '../config/logger';
import { stat } from 'fs';

const pool = new Pool();

interface Goal {
  goal_name: string;
  goal_type: string;
  target_amount: number;
  target_date: string;
  user_id?: number;
  community_id?: number;
}

interface GoalUpdate {
  goal_name?: string;
  goal_type?: string;
  target_amount?: number;
  target_date?: string;
  goal_status?: string;
}

export async function createPersonalGoal(goal: Goal) {
  const query = `
    INSERT INTO goals (user_id, goal_name, goal_type, target_amount, target_date, goal_status)
    VALUES ($1, $2, $3, $4, $5, 'in-progress')
    RETURNING *;
  `;
  const result = await pool.query(query, [
    goal.user_id,
    goal.goal_name,
    goal.goal_type,
    goal.target_amount,
    goal.target_date
  ]);
  return result.rows[0];
}

export async function createCommunityGoal(goal: Goal) {
  const query = `
    INSERT INTO goals (community_id, goal_name, goal_type, target_amount, target_date, goal_status)
    VALUES ($1, $2, $3, $4, $5, 'in-progress')
    RETURNING *;
  `;
  const result = await pool.query(query, [
    goal.community_id,
    goal.goal_name,
    goal.goal_type,
    goal.target_amount,
    goal.target_date
  ]);
  return result.rows[0];
}

export async function getCommunityGoals(community_id: number) {
  const result = await pool.query('SELECT * FROM goals WHERE community_id = $1', [community_id]);
  return result.rows;
}

export async function getLatestGoal(user_id: number) {
  const result = await pool.query(
    'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [user_id]
  );
  return result.rows[0];
}

export async function updateGoal(goal_id: number, updates: GoalUpdate) {
  const existing = await pool.query('SELECT * FROM goals WHERE goal_id = $1', [goal_id]);
  if (!existing.rows.length) throw new Error('Goal not found');

  const { goal_name, goal_type, target_amount, target_date, goal_status } = updates;

  if (goal_status && !VALID_GOAL_STATUSES.includes(goal_status)) {
    throw new Error(`Invalid goal status: ${goal_status}`);
  }

  const query = `
    UPDATE goals SET
      goal_name = COALESCE($1, goal_name),
      goal_type = COALESCE($2, goal_type),
      target_amount = COALESCE($3, target_amount),
      target_date = COALESCE($4, target_date),
      goal_status = COALESCE($5, goal_status),
      updated_at = CURRENT_TIMESTAMP
    WHERE goal_id = $6
    RETURNING *;
  `;

  const result = await pool.query(query, [
    goal_name,
    goal_type,
    target_amount,
    target_date,
    goal_status,
    goal_id
  ]);

  return result.rows[0];
}

const VALID_GOAL_STATUSES = ['in-progress', 'completed', 'paused', 'cancelled', 'failed'];

export async function updateGoalStatus(goal_id: number, status: string) {
  if (!VALID_GOAL_STATUSES.includes(status)) {
    throw new Error(`Invalid goal status: ${status}`);
  }

  const result = await pool.query(
    'UPDATE goals SET goal_status = $1, updated_at = CURRENT_TIMESTAMP WHERE goal_id = $2 RETURNING *',
    [status, goal_id]
  );
  return result.rows[0];
}

export async function addGoalProgress(goal_id: number, user_id: number, amount: number) {
  const insert = `
    INSERT INTO goal_progress (goal_id, contributor_id, amount_added)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const update = `
    UPDATE goals SET current_amount = current_amount + $1 WHERE goal_id = $2;
  `;
  const result = await pool.query(insert, [goal_id, user_id, amount]);
  await pool.query(update, [amount, goal_id]);
  return result.rows[0];
}

export async function getGoalProgress(goal_id: number) {
  const result = await pool.query(
    'SELECT * FROM goal_progress WHERE goal_id = $1 ORDER BY progress_date DESC',
    [goal_id]
  );
  return result.rows;
}

export async function reduceProgress(goal_id: number, amount: number) {
  await pool.query('UPDATE goals SET current_amount = current_amount - $1 WHERE goal_id = $2', [amount, goal_id]);
  await pool.query(
    'UPDATE user_points SET total_points = total_points - 5 WHERE user_id = (SELECT user_id FROM goals WHERE goal_id = $1)',
    [goal_id]
  );
}

export async function getUserPoints(user_id: number) {
  const result = await pool.query('SELECT total_points FROM user_points WHERE user_id = $1', [user_id]);
  return result.rows[0]?.total_points || 0;
}

export async function getGoalStats(user_id: number) {
  const result = await pool.query(
    `SELECT COUNT(*) as total_goals,
             SUM(current_amount) as total_saved,
             SUM(target_amount) as total_target
      FROM goals WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
}

export async function getGoalBadges(user_id: number) {
  const result = await pool.query(
    `SELECT a.achievement_title, a.badge_icon_url
     FROM user_achievements ua
     JOIN achievements a ON a.achievement_id = ua.achievement_id
     WHERE ua.user_id = $1 AND a.trigger_condition_json::text LIKE '%goal%'`,
    [user_id]
  );
  return result.rows;
}

export async function getGoal(goal_id: number) {
  const query = 'SELECT * FROM goals WHERE goal_id = $1';
  const result = await pool.query(query, [goal_id]);
  return result.rows[0];
}

export async function getUserGoals(user_id: number) {
  const query = 'SELECT * FROM goals WHERE user_id = $1';
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function getFriendsGoals(user_id: number) {
  const query = `
    SELECT g.*
    FROM goals g
    JOIN friendships f ON (f.friend_id = g.user_id OR f.user_id = g.user_id)
    WHERE (f.user_id = $1 OR f.friend_id = $1)
      AND f.relationship_status = 'accepted'
      AND g.goal_status = 'in-progress'
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function deleteGoal(goal_id: number) {
  const query = 'DELETE FROM goals WHERE goal_id = $1';
  try {
    await pool.query(query, [goal_id]);
    logger.info(`[GoalService] Deleted goal: ${goal_id}`);
  } catch (err) {
    logger.error(`[GoalService] Error deleting goal ${goal_id}:`, err);
    throw err;
  }
}

export async function completeGoal(goal_id: number) {
  const client = await pool.connect();

  const updateStatusQuery = `
    UPDATE goals
    SET goal_status = 'completed',
        updated_at = CURRENT_TIMESTAMP
    WHERE goal_id = $1
  `;

  const awardPointsQuery = `
    UPDATE user_points
    SET total_points = total_points + 10,
        last_updated = CURRENT_TIMESTAMP
    WHERE user_id = (SELECT user_id FROM goals WHERE goal_id = $1)
  `;

  try {
    await client.query('BEGIN');

    await client.query(updateStatusQuery, [goal_id]);
    await client.query(awardPointsQuery, [goal_id]);

    await client.query('COMMIT');
    logger.info(`[GoalService] Completed goal: ${goal_id}`);
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`[GoalService] Error completing goal ${goal_id}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getPersonalGoals(user_id: number) {
  const query = 'SELECT * FROM goals WHERE user_id = $1 AND community_id IS NULL';
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function getCommunityGoalsForUser(user_id: number) {
  const query = `
    SELECT g.* FROM goals g
    JOIN community_members cm ON g.community_id = cm.community_id
    WHERE cm.user_id = $1 AND g.user_id IS NULL
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function createBanner(image_url: string, alt_text: string) {
  const result = await pool.query(
    'INSERT INTO banner_images (image_url, alt_text) VALUES ($1, $2) RETURNING *',
    [image_url, alt_text]
  );
  return result.rows[0];
}

export async function getBanners() {
  const result = await pool.query('SELECT * FROM banner_images ORDER BY created_at DESC');
  return result.rows;
}
