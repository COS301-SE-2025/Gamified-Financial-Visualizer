import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import {
  createTransaction,
  getTransaction,
  getUserTransactions,
  getTransactionByType,
  getTransactionByCategory,
  getTransactionByAccount,
  deleteTransaction,
  getBalance
} from '../../services/transactions.service';

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const testId = Math.floor(Math.random() * 1000000);
const testUserId = 6;
const testAccountId = 1;
const testCategoryId = Math.floor(Math.random() * 50) + 1;

const transaction = {
  transaction_id: testId,
  transaction_amount: 250,
  transaction_type: 'income' as 'income',
  description: 'Test transaction',
  account_id: testAccountId,
  transaction_date: new Date().toISOString().split('T')[0],
  category_id: testCategoryId,
  is_recurring: false
};

describe('Transaction Service', () => {
  it('should create a transaction', async () => {
    const result = await createTransaction(transaction);
    assert.ok(result, 'Transaction ID should be returned');
    assert.strictEqual(typeof result, 'number');
  });

  it('should fetch transaction by user', async () => {
    const txns = await getUserTransactions(testUserId);
    assert.ok(txns.length > 0, 'User should have transactions');
  });

  it('should fetch transaction by account', async () => {
    const results = await getTransactionByAccount(transaction.account_id);

    const match = results.find((t: any) => t.transaction_id === transaction.transaction_id);
    assert.ok(results.length > 0, 'Account should have transactions');
   // assert.ok(match, 'Transaction should be found by account ID');
  });

  it('should fetch transaction by category', async () => {
    const results = await getTransactionByCategory(transaction.category_id);
    assert.ok(results.length > 0, 'category should have transactions');
    //assert.ok(match, 'Transaction should be found by category ID');
  });

  it('should fetch transaction by type', async () => {
    const results = await getTransactionByType(transaction.transaction_type);
    const match = results.find((t: any) => t.transaction_id === transaction.transaction_id);
     assert.ok(results.length > 0, 'User should have transactions');
  });

  it('should calculate balance correctly', async () => {
    const balance = await getBalance(testUserId);
    assert.ok(Number(balance) >= transaction.transaction_amount, 'Balance should be accurate');
  });

  it('should delete a transaction', async () => {
    await deleteTransaction(transaction.transaction_id);
    const result = await getTransaction(transaction.transaction_id);
    assert.strictEqual(result, undefined);
  });
});
