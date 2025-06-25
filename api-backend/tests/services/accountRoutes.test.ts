import {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccountName,
  deleteAccount,
} from '../../modules/transactions/services/transaction.service';

import pool from '../../config/db';
import { logger } from '../../config/logger';

// Mocks
jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }
}));

describe('Account Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create an account and return its ID', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { account_id: 1 } ] });

      const result = await createAccount(1, 'BankX', 'Primary', 'savings', 'USD', 1000);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO accounts'),
        [1, 'BankX', 'Primary', 'savings', 'USD', 1000]
      );
      expect(result).toBe(1);
    });

    it('should default balance to 0 if not provided', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { account_id: 2 } ] });

      await createAccount(2, 'BankY', 'Emergency', 'checking', 'ZAR');

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO accounts'),
        [2, 'BankY', 'Emergency', 'checking', 'ZAR', 0]
      );
    });

    it('should log and rethrow errors', async () => {
      const err = new Error('insert error');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);

      await expect(
        createAccount(1, 'BankX', 'Primary', 'savings', 'USD', 1000)
      ).rejects.toThrow(err);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error creating account'),
        err
      );
    });
  });

  describe('getAccounts', () => {
    it('should return a list of accounts for a user', async () => {
      const mockAccounts = [{ account_id: 1 }, { account_id: 2 }];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAccounts });

      const result = await getAccounts(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM accounts WHERE user_id = $1;',
        [1]
      );
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('getAccountById', () => {
    it('should return the account if found', async () => {
      const mockAccount = { account_id: 1, account_name: 'Primary' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockAccount] });

      const result = await getAccountById(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM accounts WHERE account_id = $1',
        [1]
      );
      expect(result).toEqual(mockAccount);
    });

    it('should return null if account not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getAccountById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateAccountName', () => {
    it('should update the account name', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await updateAccountName(1, 'Updated Name');

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE accounts SET account_name = $1 WHERE account_id = $2',
        ['Updated Name', 1]
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account by account_id and user_id', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await deleteAccount(1, 2);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM accounts WHERE account_id = $1 AND user_id = $2;',
        [1, 2]
      );
    });
  });
});
