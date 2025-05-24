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
import pool from '../../db/index';

describe('Transaction Service', () => {
  const testId = Math.floor(Math.random() * 100000);
  const testUserId = testId + 1;
  const testAccountId = testId + 2;
  const testCategoryId = testId + 3;

  const transaction = {
    id: testId,
    user_id: testUserId,
    amount: 250,
    type: 'expense',
    description: 'Test transaction',
    account_id: testAccountId,
    date: new Date().toISOString().split('T')[0],
    category_id: testCategoryId
  };

  it('should create a transaction', async () => {
    await createTransaction(transaction);
    const result = await getTransaction(transaction.id);
    assert.notStrictEqual(result, undefined);
    assert.strictEqual(result.amount, transaction.amount);
  });

  it('should fetch transaction by user', async () => {
    const results = await getUserTransactions(transaction.user_id);
    const match = results.find(t => t.id === transaction.id);
    assert.notStrictEqual(match, undefined);
  });

  it('should fetch transaction by account', async () => {
    const results = await getTransactionByAccount(transaction.account_id);
    assert.strictEqual(results.some(t => t.id === transaction.id), true);
  });

  it('should fetch transaction by category', async () => {
    const results = await getTransactionByCategory(transaction.category_id);
    expect(results.some(t => t.id === transaction.id)).toBe(true);
    assert.strictEqual(results.some(t => t.id === transaction.id), true);

  it('should fetch transaction by type', async () => {
    const results = await getTransactionByType(transaction.type);
    expect(results.some(t => t.id === transaction.id)).toBe(true);
  });

  it('should calculate balance correctly', async () => {
    const balance = await getBalance(transaction.user_id);
    assert.ok(Number(balance) >= transaction.amount);
  });

  it('should delete a transaction', async () => {
    await deleteTransaction(transaction.id);
    const result = await getTransaction(transaction.id);
    assert.strictEqual(result, undefined);
  });
})
});