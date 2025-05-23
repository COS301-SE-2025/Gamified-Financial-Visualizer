
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
   is_recurring: boolean;
}




// We need to create and link to categories table
export async function createTransaction(transaction: Transaction) {
   const {id, user_id, amount, type, description, account_id, date, category_id } = transaction;

   // create 


   // if is recurring transaction, add to recurring transactions table also

   // if
   const query = `
    INSERT INTO transactions (id, user_id, amount, type, description, account_id, date, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (id) DO NOTHING;
  `;

   try {
      await pool.query(query, [user_id, amount, type, description, account_id, date, category_id ]);
      logger.info(`[TransactionService] Created transaction: ${description}`);
   } catch (error) {
      logger.error(`[TransactionService] Error creating transaction ${description}:`, error);
      throw error;
   }
}

export async function createAccount(userid: number, bankName: string, accountName: string, balance: number, type: string) {
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


export async function getAccounts(user_id: number) {
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

// Acount number - returns everything
export async function getTransactionByAccount(account_id: number) {
   const query = `
    SELECT * FROM transactions WHERE account_id = $1;
  `;

   try {
      const result = await pool.query(query, [ account_id ]);
      return result.rows;
   }
   catch (error) {
      logger.error(`[TransactionService] Error fetching transactions for account ${account_id}:`, error);
      throw error;
   }
}

// get transactions by account with date range or limit
// need to add date range and limit
// export async function getTransactionByAccountWithDateRange(account_id: number, startDate: string, endDate: string) {


 
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

// // link to user - getusertransactonsbyctegory
// export async function getTransactionByDate(date: string) {
// get user first

// user id makes sure. it must be cascading deletes, delete all transactions for the user
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

// transaction-id
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
// get transactions by date range
// export async function getTransactionByDateRange(user_id: number, startDate: string, endDate: string) {

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


// get total (check total balance)
// check and add account id for specfic accounts 
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

// create a networth function which calculates your gross worth across all accounts - output single balance
// export async function getNetWorth(user_id: number) {


// add and link to a specfic user
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

// outputs how much you have spent in a given date range
// ADD account number and user id link
// check data format type API
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


// needs to link to account number
// budget - specific to monthly, weekly, yearly only FREQUENCY
// must check if overspending
// no event
// add account number
export async function createBudget(user_id: number, amount: number, category_id: number, startDate: string, endDate: string, frequency: string) {
   const query = `
    INSERT INTO budgets (user_id, amount, category_id, start_date, end_date, frequency)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id) DO NOTHING;
  `;

   try {
      await pool.query(query, [ user_id, amount, category_id, startDate, endDate, frequency ]);
      logger.info(`[TransactionService] Created budget for user ${user_id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error creating budget for user ${user_id}:`, error);
      throw error;
   }

}

// returns all budgets for a user
export async function getBudget(user_id: number) {
   const query = `
    SELECT * FROM budgets WHERE user_id = $1;
  `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[TransactionService] Error fetching budget for user ${user_id}:`, error);
      throw error;
   }
}

// view budget by view singular
// example: getBudgetByCategory(user_id: number, category_id: number) {


// date data type
export async function resetBudget(user_id: number) { // must be reset based on the frequency
   // if budget is expired, reset it to 0
   const query = `
    UPDATE budgets
    SET amount = 0
    WHERE user_id = $1 AND end_date < NOW();
  `;

   try {
      await pool.query(query, [ user_id ]);
      logger.info(`[TransactionService] Reset budget for user ${user_id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error resetting budget for user ${user_id}:`, error);
      throw error;
   }
}

// add budget id for specific budget
export async function deleteBudget(user_id: number) {
   const query = `
    DELETE FROM budgets WHERE user_id = $1;
  `;

   try {
      await pool.query(query, [ user_id ]);
      logger.info(`[TransactionService] Deleted budget for user ${user_id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error deleting budget for user ${user_id}:`, error);
      throw error;
   }
}


// notifyoverbudget - need to link to a user - send message
// export async function notifyOverBudget(user_id: number) {


export async function updateBudget(user_id: number, amount: number) {
   const query = `
    UPDATE budgets
    SET amount = $1
    WHERE user_id = $2;
  `;

   try {
      await pool.query(query, [ amount, user_id ]);
      logger.info(`[TransactionService] Updated budget for user ${user_id}`);
   } catch (error) {
      logger.error(`[TransactionService] Error updating budget for user ${user_id}:`, error);
      throw error;
   }
}


// commentout update functions - ALL

// gets transactions - needs to be joins to not get values but actual names


//getexpensesbycategory -- need to do the most




// need to sort out what stats will be showing
// how much you have spent in a given date range
// second line will be average community spending


