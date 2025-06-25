// tests/services/transaction.service.test.ts

import * as service from '../../modules/transactions/services/transaction.service';
import pool from '../../config/db';
import { logger } from '../../config/logger';
import { eventBus } from '../../events/event-bus';

jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('../../events/event-bus', () => ({
  eventBus: {
    emit: jest.fn(),
  },
}));

const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockClient = {
  query: mockQuery,
  release: mockRelease,
};

jest.mock('../../config/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(() => Promise.resolve(mockClient)),
  },
}));

describe('transaction.service (pure unit tests)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create account and return ID', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ account_id: 123 }] });
      const result = await service.createAccount(1, 'Bank', 'Acc', 'type', 'ZAR', 1000);
      expect(result).toBe(123);
    });

    it('should throw if DB fails', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      await expect(service.createAccount(1, '', '', '', '', 0)).rejects.toThrow('DB error');
    });
  });

  describe('getAccounts', () => {
    it('should return accounts', async () => {
      const rows = [{ account_id: 1 }];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows });
      const res = await service.getAccounts(1);
      expect(res).toEqual(rows);
    });
  });

  describe('getAccountById', () => {
    it('should return account', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ account_id: 1 }] });
      const res = await service.getAccountById(1);
      expect(res).toEqual({ account_id: 1 });
    });

    it('should return null if not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const res = await service.getAccountById(999);
      expect(res).toBeNull();
    });
  });

  describe('updateAccountName', () => {
    it('should update account name', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({});
      await service.updateAccountName(1, 'New Name');
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should delete account', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({});
      await service.deleteAccount(1, 1);
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('should create a transaction and update balance', async () => {
      mockQuery
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ account_balance: 1000, user_id: 1 }] }) // balance check
        .mockResolvedValueOnce({ rows: [{ transaction_id: 1 }] }) // insert txn
        .mockResolvedValueOnce({ rows: [{ account_balance: 900 }] }) // update balance
        .mockResolvedValueOnce({}); // COMMIT

      const res = await service.createTransaction({
        account_id: 1,
        transaction_amount: 100,
        transaction_type: 'expense',
        transaction_name: 'Groceries',
        transaction_date: '2023-01-01',
      });
      expect(res.transaction_id).toBe(1);
      expect(res.updated_balance).toBe(900);
    });

    it('should throw if insufficient funds', async () => {
      mockQuery
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ account_balance: 10, user_id: 1 }] }); // balance check
      
      await expect(service.createTransaction({
        account_id: 1,
        transaction_amount: 100,
        transaction_type: 'expense',
        transaction_name: 'Fail',
        transaction_date: '2023-01-01',
      })).rejects.toThrow('Insufficient funds');
    });
  });

  describe('getTransactionByAccount', () => {
    it('should return transactions', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ transaction_id: 1 }] });
      const res = await service.getTransactionByAccount(1);
      expect(res).toEqual([{ transaction_id: 1 }]);
    });
  });

  describe('getTransactionByCategory', () => {
    it('should return transactions', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ transaction_id: 1 }] });
      const res = await service.getTransactionByCategory(1);
      expect(res).toEqual([{ transaction_id: 1 }]);
    });
  });

  describe('getTotalSpentPerCategory', () => {
    it('should return total spent data', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ category: 'Food', total_spent: 200 }] });
      const res = await service.getTotalSpentPerCategory(1);
      expect(res).toEqual([{ category: 'Food', total_spent: 200 }]);
    });
  });

  describe('getCategoryNameByID', () => {
    it('should return category name', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ category_name: 'Utilities' }] });
      const res = await service.getCategoryNameByID(1);
      expect(res).toBe('Utilities');
    });

    it('should return null if not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const res = await service.getCategoryNameByID(99);
      expect(res).toBeNull();
    });
  });

  describe('updateTransactionDetails', () => {
    it('should update a transaction', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ transaction_id: 1 }] });
      const res = await service.updateTransactionDetails(1, { transaction_name: 'Updated' });
      expect(res.transaction_id).toBe(1);
    });

    it('should throw if no fields', async () => {
      await expect(service.updateTransactionDetails(1, {})).rejects.toThrow();
    });
  });

  describe('getTransaction', () => {
    it('should return transaction', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ transaction_id: 1 }] });
      const res = await service.getTransaction(1);
      expect(res.transaction_id).toBe(1);
    });
  });

  describe('getUserTransactions', () => {
    it('should return transactions', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ transaction_id: 1 }] });
      const res = await service.getUserTransactions(1);
      expect(res).toEqual([{ transaction_id: 1 }]);
    });
  });

  describe('deleteTransaction', () => {
    it('should delete transaction and restore balance', async () => {
      (pool.query as jest.Mock).mockResolvedValue({});
      await service.deleteTransaction(1);
      expect(pool.query).toHaveBeenCalled();
    });
  });

  describe('getBalance', () => {
    it('should return user balance', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ balance: '500' }] });
      const res = await service.getBalance(1);
      expect(res).toBe(500);
    });
  });

  describe('getTransactionByType', () => {
    it('should return transactions by type', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ transaction_type: 'income' }] });
      const res = await service.getTransactionByType('income');
      expect(res).toEqual([{ transaction_type: 'income' }]);
    });
  });

  describe('getExpenseTotalByRange', () => {
    it('should return total expense in range', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ total_expense: '150' }] });
      const res = await service.getExpenseTotalByRange(1, '2023-01-01', '2023-01-31');
      expect(res).toBe(150);
    });
  });

  describe('getCategories', () => {
    it('should return categories', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ category_id: 1 }] });
      const res = await service.getCategories();
      expect(res).toEqual([{ category_id: 1 }]);
    });
  });

  describe('createBudget', () => {
    it('should create budget and allocations', async () => {
      mockQuery
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ budget_id: 123 }] }) // insert budget
        .mockResolvedValueOnce({}) // insert allocation
        .mockResolvedValueOnce({}); // COMMIT
      
      const res = await service.createBudget(1, 'My Budget', '2023-01-01', '2023-01-31', [
        { category_id: 1, target_amount: 500 }
      ]);
      expect(res).toBe(123);
    });
  });

  describe('getBudget', () => {
    it('should return budgets', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ budget_id: 1 }] });
      const res = await service.getBudget(1);
      expect(res).toEqual([{ budget_id: 1 }]);
    });
  });

  describe('deleteBudget', () => {
    it('should delete budget', async () => {
      (pool.query as jest.Mock).mockResolvedValue({});
      await service.deleteBudget(1, 1);
    });
  });

  describe('makeBudgetProgress', () => {
    it('should update budget progress', async () => {
      (pool.query as jest.Mock).mockResolvedValue({});
      await service.makeBudgetProgress(1, 100);
    });
  });

  describe('updateBudget', () => {
    it('should update budget fields', async () => {
      (pool.query as jest.Mock).mockResolvedValue({});
      await service.updateBudget(1, { budget_name: 'Updated' });
    });
  });

});