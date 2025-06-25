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

});