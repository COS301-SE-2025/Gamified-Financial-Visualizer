
import { Pool } from 'pg';
import { logger } from '../config/logger';

const pool = new Pool();

export async function createTransaction(transaction) {
   const { id, user_id, amount, type, description , account_id, date,category_id } = transaction;

   // create 


   // if is recurring transaction, add to recurring transactions table also

   // if
   const query = `
    INSERT INTO transactions (id, user_id, amount, type, status)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO NOTHING;
  `;

   try {
      await pool.query(query, [ id, user_id, amount, type, status ]);
      logger.info(`[TransactionService] Created transaction: ${id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error creating transaction ${id}:`, error);
      throw error;
   }
}

export async function getTransaction(id) {
   const query = `
    SELECT * FROM transactions WHERE id = $1;
  `;

   try {
      const result = await pool.query(query, [ id ]);
      return result.rows[ 0 ];
   } catch (error) {
      logger.error(`[TransactionService] Error fetching transaction ${id}:`, error);
      throw error;
   }
}

export async function getUserTransactions(user_id) {
   const query = `
    SELECT * FROM transactions WHERE user_id = $1;
  `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   }
   catch (error) {
      logger.error(`[TransactionService] Error fetching transactions for user ${user_id}:`, error);
      throw error;
   }
}

export async function updateTransaction(id, status) {
   // update transaction fields 
   const query = `
    UPDATE transactions
    SET status = $1
    WHERE id = $2;
  `;

   try {
      await pool.query(query, [ status, id ]);
      logger.info(`[TransactionService] Updated transaction ${id} status to ${status}`);
   } catch (error) {
      logger.error(`[TransactionService] Error updating transaction ${id} status:`, error);
      throw error;
   }
}

export async function deleteTransaction(id) {
   const query = `
    DELETE FROM transactions WHERE id = $1;
  `;

   try {
      await pool.query(query, [ id ]);
      logger.info(`[TransactionService] Deleted transaction: ${id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error deleting transaction ${id}:`, error);
      throw error;
   }
}

export async function getTransactionByUserId(user_id) {
   const query = `
    SELECT * FROM transactions WHERE user_id = $1;
  `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[TransactionService] Error fetching transactions for user ${user_id}:`, error);
      throw error;
   }
}

export async function getBalance(user_id) {
   const query = `
    SELECT SUM(amount) AS balance FROM transactions WHERE user_id = $1;
  `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows[ 0 ].balance;
   } catch (error) {
      logger.error(`[TransactionService] Error fetching balance for user ${user_id}:`, error);
      throw error;
   }
}

export async function getTransactionByType(type) {
   const query = `
    SELECT * FROM transactions WHERE type = $1;
  `;

   try {
      const result = await pool.query(query, [ type ]);
      return result.rows;
   } catch (error) {
      logger.error(`[TransactionService] Error fetching transactions of type ${type}:`, error);
      throw error;
   }
}

export async function getExpenseTotalByRange(user_id, startDate, endDate) {
   const query = `
    SELECT SUM(amount) AS total_expense
    FROM transactions
    WHERE user_id = $1 AND type = 'expense' AND date BETWEEN $2 AND $3;
  `;

   try {
      const result = await pool.query(query, [ user_id, startDate, endDate ]);
      return result.rows[ 0 ].total_expense;
   } catch (error) {
      logger.error(`[TransactionService] Error fetching total expenses for user ${user_id} between ${startDate} and ${endDate}:`, error);
      throw error;
   }
}


