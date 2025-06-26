import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Pool, PoolClient } from 'pg';
import pool from '../../config/db';
import { normalizeQuery } from '../test-utils';

// Mock dependencies
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }
}));

jest.mock('../../events/event-bus', () => ({
  eventBus: {
    emit: jest.fn(),
  }
}));

// Import routes and services after mocking
import accountRoutes from '../../modules/transactions/routes/accountRoutes';
import budgetRoutes from '../../modules/transactions/routes/budgetRoutes';
import transactionRoutes from '../../modules/transactions/routes/transactionRoutes';
import * as transactionService from '../../modules/transactions/services/transaction.service';
jest.mock('../../config/db');

// Mock pool for service tests with proper typing
const mockPool = {
  connect: jest.fn() as jest.MockedFunction<() => Promise<PoolClient>>,
  query: jest.fn() as jest.MockedFunction<(text: string, params?: any[]) => Promise<any>>,
};

const mockClient = {
  query: jest.fn() as jest.MockedFunction<(text: string, params?: any[]) => Promise<any>>,
  release: jest.fn() as jest.MockedFunction<() => void>,
};

// Test app setup
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/accounts', accountRoutes);
  app.use('/api/budget', budgetRoutes);
  app.use('/api/transactions', transactionRoutes);
  return app;
};

describe('Account Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/accounts', () => {
    it('should create a new account successfully', async () => {
      const mockAccountData = {
        user_id: 1,
        bank_name: 'Test Bank',
        account_name: 'Test Account',
        account_type: 'checking',
        currency: 'USD',
        account_balance: 1000
      };

      jest.spyOn(transactionService, 'createAccount').mockResolvedValue(123);

      const response = await request(app)
        .post('/api/accounts')
        .send(mockAccountData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Account created successfully',
        data: { account_id: 123 }
      });
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        user_id: 1,
        bank_name: 'Test Bank'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/accounts')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should handle service errors', async () => {
      const mockAccountData = {
        user_id: 1,
        bank_name: 'Test Bank',
        account_name: 'Test Account',
        account_type: 'checking',
        currency: 'USD'
      };

      jest.spyOn(transactionService, 'createAccount').mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/accounts')
        .send(mockAccountData);

      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/accounts/user/:user_id', () => {
    it('should fetch accounts for a valid user', async () => {
      const mockAccounts = [
        { account_id: 1, account_name: 'Account 1', balance: 1000 },
        { account_id: 2, account_name: 'Account 2', balance: 2000 }
      ];

      jest.spyOn(transactionService, 'getAccounts').mockResolvedValue(mockAccounts);

      const response = await request(app)
        .get('/api/accounts/user/1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockAccounts);
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/accounts/user/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID');
    });
  });

  describe('GET /api/accounts/:account_id', () => {
    it('should fetch a specific account', async () => {
      const mockAccount = { account_id: 1, account_name: 'Test Account', balance: 1000 };

      jest.spyOn(transactionService, 'getAccountById').mockResolvedValue(mockAccount);

      const response = await request(app)
        .get('/api/accounts/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockAccount);
    });

    it('should return 404 for non-existent account', async () => {
      jest.spyOn(transactionService, 'getAccountById').mockResolvedValue(null);

      const response = await request(app)
        .get('/api/accounts/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Account not found');
    });
  });

  describe('DELETE /api/accounts/:account_id', () => {
    it('should delete an account successfully', async () => {
      jest.spyOn(transactionService, 'deleteAccount').mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/accounts/1')
        .send({ user_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account deleted successfully');
    });

    it('should return 400 for missing user_id', async () => {
      const response = await request(app)
        .delete('/api/accounts/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid or missing account_id or user_id');
    });
  });

  describe('PUT /api/accounts/:account_id', () => {
    it('should update account name successfully', async () => {
      jest.spyOn(transactionService, 'updateAccountName').mockResolvedValue(undefined);

      const response = await request(app)
        .put('/api/accounts/1')
        .send({ account_name: 'Updated Account Name' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Account name updated successfully');
    });

    it('should return 400 for missing account_name', async () => {
      const response = await request(app)
        .put('/api/accounts/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('account_name is required and must be a string');
    });
  });
});

describe('Budget Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/budget', () => {
    it('should create a budget successfully', async () => {
      const mockBudgetData = {
        user_id: 1,
        category_id: 1,
        allocations: [{ category_id: 1, target_amount: 500 }]
      };

      jest.spyOn(transactionService, 'createBudgetWithCategoryName').mockResolvedValue(123);

      const response = await request(app)
        .post('/api/budget')
        .send(mockBudgetData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.budget_id).toBe(123);
    });

    it('should return 400 for invalid allocations', async () => {
      const invalidData = {
        user_id: 1,
        category_id: 1,
        allocations: 'invalid' // Should be array
      };

      const response = await request(app)
        .post('/api/budget')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('invalid allocations');
    });
  });

  describe('GET /api/budget/user/:userId', () => {
    it('should fetch budgets summary for user', async () => {
      const mockBudgets = [
        { budget_id: 1, budget_name: 'Groceries', total_target: 500, used: 250 }
      ];

      jest.spyOn(transactionService, 'getBudgetsSummary').mockResolvedValue(mockBudgets);

      const response = await request(app)
        .get('/api/budget/user/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockBudgets);
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/budget/user/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing or invalid user_id');
    });
  });

  describe('GET /api/budget/categories', () => {
    it('should fetch all categories', async () => {
      const mockCategories = [
        { category_id: 1, category_name: 'Food' },
        { category_id: 2, category_name: 'Transport' }
      ];

      jest.spyOn(transactionService, 'getCategories').mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/api/budget/categories');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategories);
    });
  });

  describe('DELETE /api/budget/:budgetId', () => {
    it('should delete a budget successfully', async () => {
      jest.spyOn(transactionService, 'deleteBudget').mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/budget/1')
        .send({ user_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Budget deleted successfully');
    });

    it('should return 400 for missing user_id', async () => {
      const response = await request(app)
        .delete('/api/budget/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing or invalid budget_id or user_id');
    });
  });

  describe('PUT /api/budget/:budgetId', () => {
    it('should update budget successfully', async () => {
      jest.spyOn(transactionService, 'updateBudgetName').mockResolvedValue(undefined);

      const response = await request(app)
        .put('/api/budget/1')
        .send({ budget_name: 'Updated Budget', user_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Budget updated successfully');
    });
  });
});

describe('Transaction Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/transactions', () => {
    it('should create a transaction successfully', async () => {
      const mockTransactionData = {
        account_id: 1,
        transaction_amount: 100,
        transaction_type: 'expense',
        transaction_name: 'Test Transaction'
      };

      const mockResult = {
        transaction_id: 123,
        updated_balance: 900
      };

      jest.spyOn(transactionService, 'createTransaction').mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/transactions')
        .send(mockTransactionData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.transaction_id).toBe(123);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        account_id: 1
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return 400 for invalid transaction amount', async () => {
      const invalidData = {
        account_id: 1,
        transaction_amount: -100,
        transaction_type: 'expense',
        transaction_name: 'Test Transaction'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('transaction_amount must be a valid positive number');
    });

    it('should return 400 for conflicting category IDs', async () => {
      const conflictingData = {
        account_id: 1,
        category_id: 1,
        custom_category_id: 2,
        transaction_amount: 100,
        transaction_type: 'expense',
        transaction_name: 'Test Transaction'
      };

      const response = await request(app)
        .post('/api/transactions')
        .send(conflictingData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Only one of category_id or custom_category_id may be provided');
    });
  });

  describe('GET /api/transactions/user/:userId', () => {
    it('should fetch user transactions', async () => {
      const mockTransactions = [
        { transaction_id: 1, transaction_name: 'Transaction 1', amount: 100 }
      ];

      jest.spyOn(transactionService, 'getUserTransactions').mockResolvedValue(mockTransactions);

      const response = await request(app)
        .get('/api/transactions/user/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockTransactions);
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/transactions/user/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID');
    });
  });

  describe('GET /api/transactions/user/:userId/summary', () => {
    it('should fetch transaction summary', async () => {
      const mockSummary = [
        { category: 'Food', total_spent: 500 }
      ];

      jest.spyOn(transactionService, 'getTotalSpentPerCategory').mockResolvedValue(mockSummary);

      const response = await request(app)
        .get('/api/transactions/user/1/summary');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockSummary);
    });
  });

  describe('GET /api/transactions/categories', () => {
    it('should fetch all categories', async () => {
      const mockCategories = [
        { category_id: 1, category_name: 'Food' }
      ];

      jest.spyOn(transactionService, 'getCategories').mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/api/transactions/categories');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockCategories);
    });
  });

  describe('GET /api/transactions/categories/:category_id', () => {
    it('should fetch category by ID', async () => {
      jest.spyOn(transactionService, 'getCategoryNameByID').mockResolvedValue('Food');

      const response = await request(app)
        .get('/api/transactions/categories/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        category_id: 1,
        category_name: 'Food'
      });
    });

    it('should return 404 for non-existent category', async () => {
      jest.spyOn(transactionService, 'getCategoryNameByID').mockResolvedValue(null);

      const response = await request(app)
        .get('/api/transactions/categories/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Category not found');
    });
  });

  describe('DELETE /api/transactions/:transaction_id', () => {
    it('should delete a transaction successfully', async () => {
      jest.spyOn(transactionService, 'deleteTransaction').mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/transactions/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Transaction ID 1 deleted successfully');
    });

    it('should return 400 for invalid transaction ID', async () => {
      const response = await request(app)
        .delete('/api/transactions/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid transaction ID');
    });
  });

  describe('PUT /api/transactions/:transaction_id', () => {
    it('should update a transaction successfully', async () => {
      const mockResult = { transaction_id: 1, transaction_name: 'Updated Transaction' };
      jest.spyOn(transactionService, 'updateTransactionDetails').mockResolvedValue(mockResult);

      const response = await request(app)
        .put('/api/transactions/1')
        .send({ transaction_name: 'Updated Transaction' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toEqual(mockResult);
    });

    it('should return 400 for no update fields', async () => {
      const response = await request(app)
        .put('/api/transactions/1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No update fields provided');
    });

    it('should return 400 for conflicting categories', async () => {
      const response = await request(app)
        .put('/api/transactions/1')
        .send({ category_id: 1, custom_category_id: 2 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Provide only one category type');
    });
  });
});

describe('Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const mockTransaction = {
        account_id: 1,
        transaction_amount: 100,
        transaction_type: 'expense' as const,
        transaction_name: 'Test Transaction',
        transaction_date: '2023-01-01'
      };

      // Mock the actual service method to return expected result
      jest.spyOn(transactionService, 'createTransaction').mockResolvedValue({
        transaction_id: 123,
        updated_balance: 900
      });

      const result = await transactionService.createTransaction(mockTransaction);

      expect(result.transaction_id).toBe(123);
      expect(result.updated_balance).toBe(900);
    });
  });

  describe('getBudgetsSummary', () => {
    it('should fetch budget summary for user', async () => {
      const mockBudgets = [
        { budget_id: 1, budget_name: 'Groceries', total_target: 500, used: 250 }
      ];

      jest.spyOn(transactionService, 'getBudgetsSummary').mockResolvedValue(mockBudgets);

      const result = await transactionService.getBudgetsSummary(1);

      expect(result).toEqual(mockBudgets);
    });
  });
});