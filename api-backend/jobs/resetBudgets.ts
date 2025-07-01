import pool from '../config/db';
import { logger } from '../config/logger';
import cron from 'node-cron';

// This job resets all user budgets at month-end,
// awards points to users who stayed under budget,
// and handles recurring budget extension or cleanup.

export async function resetBudgetsAndAllocatePoints() {
   try {
      // 1. Get all budgets that ended yesterday (i.e. last day of the previous month)
      logger.info('[LeaderboardJob] Starting monthly budget reset and point allocation...');
      
      const budgetsResult = await pool.query(`
      SELECT 
        b.budget_id,
        b.user_id,
        COALESCE(SUM(bc.current_amount), 0) AS total_spent,
        COALESCE(SUM(bc.target_amount), 0) AS total_target
      FROM budgets b
      JOIN budget_categories bc ON b.budget_id = bc.budget_id
      WHERE b.period_end = CURRENT_DATE - INTERVAL '1 day'
      GROUP BY b.budget_id, b.user_id
    `);

      for (const budget of budgetsResult.rows) {
         const { budget_id, user_id, total_spent, total_target } = budget;

         // 2. Award points if user stayed under budget
         if (parseFloat(total_spent) < parseFloat(total_target)) {
            await pool.query(
               `UPDATE user_points
           SET total_points = total_points + 20,
               last_updated = CURRENT_TIMESTAMP
           WHERE user_id = $1`,
               [ user_id ]
            );
            logger.info(`[LeaderboardJob] Allocated 20 points to user ${user_id} for staying under budget.`);
         }

         // 3. Reset current_amounts for the new month
         await pool.query(
            `UPDATE budget_categories
         SET current_amount = 0
         WHERE budget_id = $1`,
            [ budget_id ]
         );
         logger.info(`[LeaderboardJob] Reset budget for user ${user_id}, budget ${budget_id}.`);
      }

      // 4. Handle recurring budgets
      // Delete budgets that are past their end date
      await pool.query(
         `DELETE FROM budgets WHERE period_end < CURRENT_DATE`
      );
      logger.info('[LeaderboardJob] Budget reset, point allocation, and recurring budget handling completed.');
   } catch (error) {
      logger.error('[LeaderboardJob] Error during budget reset and point allocation:', error);
   }
}

// Schedule to run at midnight on the 1st of every month
cron.schedule('0 0 1 * *', async () => {
   logger.info('[LeaderboardJob] Running scheduled monthly budget reset and point allocation...');
   await resetBudgetsAndAllocatePoints();
});