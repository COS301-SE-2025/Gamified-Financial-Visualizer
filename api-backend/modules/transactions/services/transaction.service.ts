// services/transaction.service.ts
//import { Pool } from 'pg';
import { logger } from '../../../config/logger';
import pool from '../../../config/db';
import { eventBus } from "../../../events/event-bus"

export interface Transaction {
  transaction_id?: number;  // optional, DB will AUTO_INCREMENT
  account_id: number;
  category_id: number;
  transaction_amount: number;
  transaction_type: 'expense' | 'income' | 'transfer' | 'fee' | 'withdrawal' | 'deposit';
  description: string;
  transaction_date: string;   // YYYY-MM-DD
  is_recurring?: boolean;
}

/**
 * Create a new transaction. Auto-generates transaction_id if not provided.
 * Inserts into recurring_transactions if is_recurring = true.
 */
export async function createTransaction(txn: Transaction) {
  const {
    account_id,
    category_id,
    transaction_amount,
    transaction_type,
    description,
    transaction_date,
    is_recurring = false
  } = txn;

  const insertTxnSql = `
    INSERT INTO transactions
      (account_id, category_id, transaction_amount, transaction_type,
       description, transaction_date, is_recurring)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING transaction_id;
  `;

  try {
    const res = await pool.query(insertTxnSql, [
      account_id,
      category_id,
      transaction_amount,
      transaction_type,
      description,
      transaction_date,
      is_recurring
    ]);
    const newId = res.rows[ 0 ].transaction_id;
    logger.info(`[TransactionService] Created transaction ID=${newId}`);

    eventBus.emit('transaction.created', {
      transaction_id: txn.transaction_id,
      account_id: txn.account_id,
      amount: txn.transaction_amount,
      category_id: txn.category_id,
      type: txn.transaction_type,
      timestamp: txn.transaction_date
    });
    
    if (is_recurring) {
      const insertRecSql = `
        INSERT INTO recurring_transactions
          (transaction_id, frequency, next_occurrence)
        VALUES ($1, $2, $3)
        ON CONFLICT (transaction_id) DO NOTHING;
      `;
      // Here we set frequency to 'monthly' and next_occurrence equal to transaction_date
      await pool.query(insertRecSql, [
        newId,
        'monthly',
        transaction_date
      ]);
      logger.info(`[TransactionService] Marked transaction ID=${newId} as recurring.`);
    }

    return newId;
  } catch (error) {
    logger.error(`[TransactionService] Error creating transaction:`, error);
    throw error;
  }
}

/**
 * Create a new account for a user.
 */
export async function createAccount(
  user_id: number,
  bank_name: string,
  account_name: string,
  account_type: string,
  currency: string,
  account_number?: string
) {
  const insertAccSql = `
    INSERT INTO accounts
      (user_id, bank_name, account_name, account_type, currency, account_number)
    VALUES ($1, $2, $3, $4, $5, COALESCE($6, CONCAT('GFV-', $1, '-', nextval('accounts_account_id_seq'))))
    RETURNING account_id;
  `;

  try {
    const res = await pool.query(insertAccSql, [
      user_id,
      bank_name,
      account_name,
      account_type,
      currency,
      account_number || null
    ]);
    const accId = res.rows[ 0 ].account_id;
    logger.info(`[TransactionService] Created account ID=${accId} for user ${user_id}`);
    return accId;
  } catch (error) {
    logger.error(`[TransactionService] Error creating account for user ${user_id}:`, error);
    throw error;
  }
}

export async function getAccounts(user_id: number) {
  const sql = `SELECT * FROM accounts WHERE user_id = $1;`;
  try {
    const res = await pool.query(sql, [ user_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching accounts for user ${user_id}:`, error);
    throw error;
  }
}

export async function getTransactionByAccount(account_id: number) {
  const sql = `SELECT * FROM transactions WHERE account_id = $1 ORDER BY transaction_date DESC;`;
  try {
    const res = await pool.query(sql, [ account_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching transactions for account ${account_id}:`, error);
    throw error;
  }
}

export async function getTransactionByCategory(category_id: number) {
  const sql = `SELECT * FROM transactions WHERE category_id = $1 ORDER BY transaction_date DESC;`;
  try {
    const res = await pool.query(sql, [ category_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching transactions for category ${category_id}:`, error);
    throw error;
  }
}

export async function getTotalSpentPerCategory(user_id: number) {
  const sql = `
    SELECT 
      COALESCE(c.category_name, cc.custom_category_name) AS category,
      SUM(t.transaction_amount) AS total_spent
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    LEFT JOIN categories c ON t.category_id = c.category_id
    LEFT JOIN custom_categories cc ON t.custom_category_id = cc.custom_category_id
    WHERE 
      a.user_id = $1
      AND t.transaction_type = 'expense'
      AND t.transaction_date >= (CURRENT_DATE - INTERVAL '1 month')
    GROUP BY category
    ORDER BY total_spent DESC;
  `;
  try {
    const res = await pool.query(sql, [ user_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching last month's spending by category for user ${user_id}:`, error);
    throw error;
  }
}

export async function getCategoryNameByID(categoryID: number) {
  const sql = `SELECT category_name FROM categories WHERE category_id = $1;`;
  try {
    const res = await pool.query(sql, [ categoryID ]);
    return res.rows[ 0 ]?.category_name || null;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching category name for ID ${categoryID}:`, error);
    throw error;
  }

}
export async function deleteAccount(account_id: number, user_id: number) {
  const sql = `DELETE FROM accounts WHERE account_id = $1 AND user_id = $2;`;
  try {
    await pool.query(sql, [ account_id, user_id ]);
    logger.info(`[TransactionService] Deleted account ID=${account_id} for user ${user_id}`);
  } catch (error) {
    logger.error(`[TransactionService] Error deleting account ID=${account_id}:`, error);
    throw error;
  }
}

export async function getTransaction(id: number) {
  const sql = `SELECT * FROM transactions WHERE transaction_id = $1;`;
  try {
    const res = await pool.query(sql, [ id ]);
    return res.rows[ 0 ];
  } catch (error) {
    logger.error(`[TransactionService] Error fetching transaction ${id}:`, error);
    throw error;
  }
}

export async function getUserTransactions(user_id: number) {
  const sql = `
    SELECT
      t.transaction_id,
      t.transaction_amount,
      t.transaction_type,
      a.account_name,
      t.description,
      t.transaction_date,
      c.category_name
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    JOIN categories c ON t.category_id = c.category_id
    WHERE a.user_id = $1
    ORDER BY t.transaction_date DESC;
  `;
  try {
    const res = await pool.query(sql, [ user_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching user ${user_id} transactions:`, error);
    throw error;
  }
}

export async function deleteTransaction(id: number) {
  const sql = `DELETE FROM transactions WHERE transaction_id = $1;`;
  try {
    await pool.query(sql, [ id ]);
    logger.info(`[TransactionService] Deleted transaction ID=${id}`);
  } catch (error) {
    logger.error(`[TransactionService] Error deleting transaction ${id}:`, error);
    throw error;
  }
}

export async function getBalance(user_id: number) {
  const sql = `
    SELECT COALESCE(SUM(t.transaction_amount),0) AS balance
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    WHERE a.user_id = $1;
  `;
  try {
    const res = await pool.query(sql, [ user_id ]);
    return Number(res.rows[ 0 ].balance);
  } catch (error) {
    logger.error(`[TransactionService] Error fetching balance for user ${user_id}:`, error);
    throw error;
  }
}

export async function getTransactionByType(transaction_type: string) {
  const sql = `SELECT * FROM transactions WHERE transaction_type = $1 ORDER BY transaction_date DESC;`;
  try {
    const res = await pool.query(sql, [ transaction_type ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching transactions of type ${transaction_type}:`, error);
    throw error;
  }
}

export async function getExpenseTotalByRange(
  user_id: number,
  startDate: string,
  endDate: string
) {
  const sql = `
    SELECT COALESCE(SUM(t.transaction_amount),0) AS total_expense
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    WHERE a.user_id = $1
      AND t.transaction_type = 'expense'
      AND t.transaction_date BETWEEN $2 AND $3;
  `;
  try {
    const res = await pool.query(sql, [ user_id, startDate, endDate ]);
    return Number(res.rows[ 0 ].total_expense);
  } catch (error) {
    logger.error(`[TransactionService] Error fetching total expenses for user ${user_id} between ${startDate} and ${endDate}:`, error);
    throw error;
  }
}

export async function getCategories() {
  const sql = `SELECT category_id, category_name FROM categories;`
  try {
    const res = await pool.query(sql);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching categories:`, error);
    throw error;
  }
}

/**
 * Budgets: Two-step process: create budget, then allocate category targets
 */
export async function createBudget(
  user_id: number,
  budget_name: string,
  period_start: string,
  period_end: string,
  allocations: Array<{ category_id: number; target_amount: number }>
) {
  const insertBudgetSql = `
    INSERT INTO budgets
      (user_id, budget_name, period_start, period_end)
    VALUES ($1, $2, $3, $4)
    RETURNING budget_id;
  `;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(insertBudgetSql, [
      user_id,
      budget_name,
      period_start,
      period_end
    ]);
    const budgetId = res.rows[ 0 ].budget_id;

    const insertAllocSql = `
      INSERT INTO budget_categories
        (budget_id, category_id, target_amount)
      VALUES ($1, $2, $3);
    `;
    for (const alloc of allocations) {
      await client.query(insertAllocSql, [
        budgetId,
        alloc.category_id,
        alloc.target_amount
      ]);
    }

    await client.query('COMMIT');
    logger.info(`[TransactionService] Created budget ID=${budgetId} for user ${user_id}`);
    return budgetId;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`[TransactionService] Error creating budget for user ${user_id}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getBudget(user_id: number) {
  const sql = `
    SELECT b.*, bc.category_id, bc.target_amount
    FROM budgets b
    LEFT JOIN budget_categories bc ON b.budget_id = bc.budget_id
    WHERE b.user_id = $1;
  `;
  try {
    const res = await pool.query(sql, [ user_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching budget for user ${user_id}:`, error);
    throw error;
  }
}

export async function deleteBudget(budget_id: number, user_id: number) {
  const sql = `DELETE FROM budgets WHERE budget_id = $1 AND user_id = $2;`;
  try {
    await pool.query(sql, [ budget_id, user_id ]);
    logger.info(`[TransactionService] Deleted budget ID=${budget_id} for user ${user_id}`);
  } catch (error) {
    logger.error(`[TransactionService] Error deleting budget ${budget_id}:`, error);
    throw error;
  }
}

export async function makeBudgetProgress(budget_id: number, amount: number) {
  const sql = `
    UPDATE budgets
    SET current_amount = COALESCE(current_amount, 0) + $1
    WHERE budget_id = $2;
  `;
  try {
    await pool.query(sql, [ amount, budget_id ]);
    logger.info(`[TransactionService] Updated budget ID=${budget_id} with progress of ${amount}`);
  } catch (error) {
    logger.error(`[TransactionService] Error updating budget progress for ID=${budget_id}:`, error);
    throw error;
  }
}


export async function updateBudget(
  budget_id: number,
  fields: Partial<{ budget_name: string; period_start: string; period_end: string }>
) {
  const sets: string[] = [];
  const vals: any[] = [];
  let idx = 1;
  for (const [ key, value ] of Object.entries(fields)) {
    sets.push(`${key} = $${idx}`);
    vals.push(value);
    idx++;
  }
  if (!sets.length) return;

  const sql = `
    UPDATE budgets SET ${sets.join(', ')} WHERE budget_id = $${idx};
  `;
  try {
    await pool.query(sql, [ ...vals, budget_id ]);
    logger.info(`[TransactionService] Updated budget ID=${budget_id}`);


  } catch (error) {
    logger.error(`[TransactionService] Error updating budget ${budget_id}:`, error);
    throw error;
  }
}

export async function getBudgetsSummary(user_id: number) {
  const sql = `
    SELECT b.budget_id, b.budget_name, b.current_amount,  b.period_start, b.period_end,
           COALESCE(SUM(bc.target_amount), 0) AS total_target
    FROM budgets b
    LEFT JOIN budget_categories bc ON b.budget_id = bc.budget_id
    WHERE b.user_id = $1
    GROUP BY b.budget_id;
  `;
  try {
    const res = await pool.query(sql, [ user_id ]);
    return res.rows;
  } catch (error) {
    logger.error(`[TransactionService] Error fetching budgets for user ${user_id}:`, error);
    throw error;
  }
}

