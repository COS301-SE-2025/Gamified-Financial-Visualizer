import { Pool } from 'pg';
import { logger } from '../config/logger';
import { stat } from 'fs';

const pool = new Pool();

interface Goal {
   id: number;
   user_id: number;
   name: string;
   target_amount: number;
   current_amount: number;
   start_date: string;
   end_date: string;
   status: string;
}

export async function createGoal(goal: Goal) {
   const { id, user_id, name, target_amount, current_amount, start_date, end_date, status } = goal;

   const query = `
     INSERT INTO goals (id, user_id, name, target_amount, current_amount, start_date, end_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7 , $8)
     ON CONFLICT (id) DO NOTHING;
   `;

   try {
      await pool.query(query, [ id, user_id, name, target_amount, current_amount, start_date, end_date, stat ]);
      logger.info(`[GoalService] Created goal: ${id}`);
   } catch (error) {
      logger.error(`[GoalService] Error creating goal ${id}:`, error);
      throw error;
   }
}

export async function getGoal(id: number) {
   const query = `
     SELECT * FROM goals WHERE id = $1;
   `;

   try {
      const result = await pool.query(query, [ id ]);
      return result.rows[ 0 ];
   } catch (error) {
      logger.error(`[GoalService] Error fetching goal ${id}:`, error);
      throw error;
   }
}

export async function getUserGoals(user_id: number) {
   const query = `
     SELECT * FROM goals WHERE user_id = $1;
   `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;    
   } catch (error) {
      logger.error(`[GoalService] Error fetching goals for user ${user_id}:`, error);
      throw error;
   }
}

interface UpdateGoal {
   name?: string;
   target_amount?: number;
   current_amount?: number;
   start_date?: string;
   end_date?: string;
   status?: string;
}

export async function updateGoal(id: number, updates: UpdateGoal) {
   const { name, target_amount, current_amount, start_date, end_date , status} = updates;

   const query = `
     UPDATE goals
     SET name = $1, target_amount = $2, current_amount = $3, start_date = $4, end_date = $5, status = $6
     WHERE id = $7;
   `;

   try {
      await pool.query(query, [ name, target_amount, current_amount, start_date, end_date, status ]);
      logger.info(`[GoalService] Updated goal: ${id}`);
   } catch (error) {
      logger.error(`[GoalService] Error updating goal ${id}:`, error);
      throw error;
   }
}

export async function deleteGoal(id: number) {
   const query = `
     DELETE FROM goals WHERE id = $1;
   `;

   try {
      await pool.query(query, [ id ]);
      logger.info(`[GoalService] Deleted goal: ${id}`);
   } catch (error) {
      logger.error(`[GoalService] Error deleting goal ${id}:`, error);
      throw error;
   }
}

interface GoalTransaction {
   id: number;
   user_id: number;
   amount: number;
   date: string;
}

export async function addTransactionToGoal(goal_id: number, transaction: GoalTransaction) {
   const { id, user_id, amount, date } = transaction;

   const query = `
     INSERT INTO goal_transactions (goal_id, id, user_id, amount, date)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO NOTHING;
   `;

   try {
      await pool.query(query, [ goal_id, id, user_id, amount, date ]);
      logger.info(`[GoalService] Added transaction ${id} to goal ${goal_id}`);
   } catch (error) {
      logger.error(`[GoalService] Error adding transaction ${id} to goal ${goal_id}:`, error);
      throw error;
   }
}

// if goal is completed, update the goal status and add points to the user
export async function completeGoal(goal_id: number) {
   const query = `
     UPDATE goals
     SET status = 'Completed'
     WHERE id = $1;
   `;

   const pointsQuery = `
     UPDATE users
     SET points = points + 10
     WHERE id = (SELECT user_id FROM goals WHERE id = $1);`

   try {
      await pool.query(query, [ goal_id ]);
      await pool.query(pointsQuery, [ goal_id ]);
      logger.info(`[GoalService] Completed goal: ${goal_id}`);
   } catch (error) {
      logger.error(`[GoalService] Error completing goal ${goal_id}:`, error);
      throw error;
   }
}

export async function reduceProgress(goal_id: number, amount: number) {
   const query = `
     UPDATE goals
     SET current_amount = current_amount - $1
     WHERE id = $2;
   `;

   const pointsQuery = `
     UPDATE users
     SET points = points - 5
     WHERE id = (SELECT user_id FROM goals WHERE id = $1);
   `;

   try {
      await pool.query(query, [ amount, goal_id ]);
      await pool.query(pointsQuery, [ goal_id ]);
      logger.info(`[GoalService] Reduced progress of goal ${goal_id} by ${amount}`);
   } catch (error) {
      logger.error(`[GoalService] Error reducing progress of goal ${goal_id}:`, error);
      throw error;
   }
}

export async function getAllGoals() {
   const query = `
     SELECT * FROM goals;
   `;

   try {
      const result = await pool.query(query);
      return result.rows;
   } catch (error) {
      logger.error(`[GoalService] Error fetching all goals:`, error);
      throw error;
   }
}

