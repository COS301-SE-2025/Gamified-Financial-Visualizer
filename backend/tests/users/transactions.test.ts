import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import pool from '../../db/index';

import {
  createTransaction,
  getTransaction,
  getUserTransactions,
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByAccount,
  deleteTransaction,
  getBalance,
  createBudget
} from '../../services/transactions.service';

const testId = Math.floor(Math.random() * 1000000);
const testUserId = 1;
const testAccountId = 1;
const testCategoryId = Math.floor(Math.random() * 50) + 1;

const transaction = {
  transaction_id: testId,
  transaction_amount: 250,
  transaction_type: 'income' as const,
  description: 'Test transaction',
  account_id: testAccountId,
  transaction_date: new Date().toISOString().split('T')[0],
  category_id: testCategoryId,
  is_recurring: false
};

describe('Transaction Service', () => {
  it('should create a transaction', async () => {
    const result = await createTransaction(transaction);
    expect(typeof result).toBe('number');
  });

  it('should fetch transaction by user', async () => {
    const txns = await getUserTransactions(testUserId);
    expect(txns.length).toBeGreaterThan(0);
  });

  it('should fetch transaction by account', async () => {
    const results = await getTransactionByAccount(transaction.account_id);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should fetch transaction by category', async () => {
    const results = await getTransactionByCategory(transaction.category_id);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should fetch transaction by type', async () => {
    const results = await getTransactionByType(transaction.transaction_type);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should calculate balance correctly', async () => {
    const balance = await getBalance(testUserId);
    expect(Number(balance)).toBeGreaterThanOrEqual(transaction.transaction_amount);
  });

  it('should delete a transaction', async () => {
    await deleteTransaction(transaction.transaction_id);
    const result = await getTransaction(transaction.transaction_id);
    expect(result).toBeUndefined();
  });

  it('should create a budget with category allocations', async () => {
    const budgetName = `TestBudget_${Math.floor(Math.random() * 10000)}`;
    const periodStart = new Date().toISOString().split('T')[0];
    const periodEnd = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const allocations = [
      { category_id: 1, target_amount: 1000 },
      { category_id: 2, target_amount: 500 }
    ];

    const budgetId = await createBudget(testUserId, budgetName, periodStart, periodEnd, allocations);
    expect(typeof budgetId).toBe('number');
  });

  afterAll(async () => {
    await pool.end(); // Important for Jest to exit cleanly
  });
});
