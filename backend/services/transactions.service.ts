
import { Pool } from 'pg';
import { logger } from '../config/logger';

const pool = new Pool();

interface Transaction {
   id: number;
   user_id: number;
   amount: number;
   type: string; // income or expense
   description: string;
   account_id: number;
   date: string; // YYYY-MM-DD format
   category_id: number;
}


export async function createTransaction(transaction: Transaction) {
   const { id, user_id, amount, type, description , account_id, date,category_id } = transaction;

   // create 


   // if is recurring transaction, add to recurring transactions table also

   // if
   const query = `
    INSERT INTO transactions (id, user_id, amount, type, description, account_id, date, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO NOTHING;
  `;

   try {
      await pool.query(query, [ id, user_id, amount, type, description, account_id, date, category_id ]);
      logger.info(`[TransactionService] Created transaction: ${id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error creating transaction ${id}:`, error);
      throw error;
   }
}

export async function createAccount(userid:number, bankName: string, accountName:string, balance: number, type:string ) {
   const query = `
    INSERT INTO accounts (user_id, bank_name, account_name, balance, type)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (account_number) DO NOTHING;
  `;

   try {
      await pool.query(query, [ userid, bankName, accountName, balance, type ]);
      logger.info(`[TransactionService] Created account for user ${userid}`);
   } catch (error) {
      logger.error(`[TransactionService] Error creating account for user ${userid}:`, error);
      throw error;
   }
}


export async function getAccount(user_id: number) {
   const query = `
    SELECT * FROM accounts WHERE user_id = $1;
  `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[TransactionService] Error fetching account for user ${user_id}:`, error);
      throw error;
   }
}


export async function getTransactionByAccount(account_id: number) {
   const query = `
    SELECT * FROM transactions WHERE account_id = $1;
  `;

   try {
      const result  = await pool.query(query, [ account_id ]);
      return result.rows;
   }
   catch (error) {
      logger.error(`[TransactionService] Error fetching transactions for account ${account_id}:`, error);
      throw error;
   }
}

export async function getTransactionByCategory(category_id: number) {
   const query = `
    SELECT * FROM transactions WHERE category_id = $1;
  `;

   try {
      const result = await pool.query(query, [ category_id ]);
      return result.rows;
   } 
   catch (error) {
      logger.error(`[TransactionService] Error fetching transactions for category ${category_id}:`, error);
      throw error;
   }
}

export async function deleteAccount(account_id: number, userID: number) {
   const query = `
    DELETE FROM accounts WHERE id = $1 AND user_id = $2;
  `;

   try {
      await pool.query(query, [ account_id, userID ]);
      logger.info(`[TransactionService] Deleted account: ${account_id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error deleting account ${account_id}:`, error);
      throw error;
   }
}

export async function getTransaction(id: number) {
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

export async function getUserTransactions(user_id: number) {
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

/*
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
*/


export async function deleteTransaction(id: number) {
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



export async function getBalance(user_id: number) {
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

export async function getTransactionByType(type: string) {
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

export async function getExpenseTotalByRange(user_id: number, startDate: number, endDate: number) {
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


