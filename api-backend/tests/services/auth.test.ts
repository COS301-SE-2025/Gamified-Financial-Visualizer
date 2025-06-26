import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import pool from '../../config/db';
import * as auth from '../../modules/auth/services/auth.service';
import { Pool } from 'pg';

// Sample user data
import { logger } from '../../config/logger';

// Mock the database pool and logger
jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));





describe('Auth Service', () => {
  // Test user data
  type UserRecord = {
    email: string;
    username: string;
    full_name: string;
    hashed_password: string;
    user_id?: number;
  };
  
    const testUser: UserRecord = {
      email: 'test@example.com',
      username: 'testuser',
      full_name: 'Test User',
      hashed_password: 'hashedpassword123',
    };

  let createdUserId: number;

  beforeAll(() => {
    // Mock pool.connect() for transaction tests
    (pool.connect as jest.Mock) = jest.fn().mockResolvedValue({
      query: jest.fn(),
      release: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user when username and email are unique', async () => {
      // Mock username and email checks
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // username check
        .mockResolvedValueOnce({ rows: [] }) // email check
        .mockResolvedValueOnce({ rows: [{ ...testUser, user_id: 1 }] }); // insert

      const result = await auth.createUser(testUser);

      expect(pool.query).toHaveBeenCalledTimes(3);
      expect(result).toEqual(expect.objectContaining(testUser));
      createdUserId = result.user_id;
    });

    it('should throw error when username is taken', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [testUser] }); // username exists

      await expect(auth.createUser(testUser)).rejects.toThrow(`Username '${testUser.username}' is already taken.`);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(`Registration failed: Username ${testUser.username} already exists`)
      );
    });

    it('should throw error when email is taken', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // username available
        .mockResolvedValueOnce({ rows: [testUser] }); // email exists

      await expect(auth.createUser(testUser)).rejects.toThrow(`Email '${testUser.email}' is already registered.`);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(`Registration failed: Email ${testUser.email} already exists`)
      );
    });

    it('should log and rethrow database errors', async () => {
      const dbError = new Error('DB connection failed');
      (pool.query as jest.Mock).mockRejectedValueOnce(dbError);

      await expect(auth.createUser(testUser)).rejects.toThrow(dbError);
      expect(logger.error).toHaveBeenCalledWith('[AuthService] Registration failed:', dbError);
    });
  });

  describe('token management', () => {
    it('should upsert a token for a user', async () => {
      const token = 'testtoken';
      const expiresAt = new Date();

      await auth.upsertToken(1, token, expiresAt);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM user_tokens WHERE user_id = $1',
        [1]
      );
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO user_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [1, token, expiresAt]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Token updated for user 1')
      );
    });

    it('should store user tokens', async () => {
      const token = 'accesstoken';
      const expiresAt = new Date();

      await auth.storeUserTokens(1, token, expiresAt);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_tokens'),
        [1, token, expiresAt]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Tokens stored for user ID 1')
      );
    });
  });

  describe('authentication', () => {
    it('should authenticate user with correct credentials', async () => {
      const mockUser = { ...testUser, user_id: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await auth.authenticateUser(testUser.username, testUser.hashed_password);

      expect(result).toEqual(mockUser);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = $1 AND hashed_password = $2',
        [testUser.username, testUser.hashed_password]
      );
    });

    it('should throw error when authentication fails', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(auth.authenticateUser('wrong', 'credentials')).rejects.toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('user retrieval', () => {
    const mockUser = { ...testUser, user_id: 1 };

    beforeEach(() => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
    });

    it('should get user by ID', async () => {
      const result = await auth.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should get user ID by username', async () => {
      const result = await auth.getUserID(testUser.username);
      expect(result).toEqual(1);
    });

    it('should throw when username not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      await expect(auth.getUserID('nonexistent')).rejects.toThrow(
        "User with username 'nonexistent' not found"
      );
    });

    it('should get user by email', async () => {
      const result = await auth.getUserByEmail(testUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should get user by username', async () => {
      const result = await auth.getUserByUsername(testUser.username);
      expect(result).toEqual(mockUser);
    });
  });


  describe('user deletion', () => {
 it('should delete a user', async () => {
  const mockClient = await pool.connect(); // Get the mock client

    await auth.deleteUser(1);

    expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
    expect(mockClient.query).toHaveBeenCalledWith('DELETE FROM users WHERE user_id = $1', [1]);
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });
  });



  describe('two-factor authentication', () => {
    it('should enable 2FA', async () => {
      await auth.setTwoFactorEnabled(1, true);

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET two_factor_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [true, 1]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Updated 2FA setting for user ID 1 to true')
      );
    });
  });

  describe('password reset', () => {
    it('should set password reset token', async () => {
      const token = 'resettoken';
      const expiresAt = new Date();

      await auth.setPasswordResetToken(1, token, expiresAt);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_tokens'),
        [1, token, expiresAt]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Password reset token set for user ID 1')
      );
    });

    it('should reset password with valid token', async () => {
      const token = 'validtoken';
      const newPassword = 'newhashedpassword';
      const mockToken = { user_id: 1 };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockToken] }) // token check
        .mockResolvedValueOnce({}) // update password
        .mockResolvedValueOnce({}); // delete token

      await auth.resetPassword(token, newPassword);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT user_id FROM user_tokens WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP',
        [token]
      );
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET hashed_password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
        [newPassword, mockToken.user_id]
      );
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM user_tokens WHERE user_id = $1',
        [mockToken.user_id]
      );
    });

    it('should reject invalid reset token', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(auth.resetPassword('invalid', 'newpass')).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('updateUserSettings', () => {
    const mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };

    beforeEach(() => {
      (pool.connect as jest.Mock).mockResolvedValue(mockClient);
      mockClient.query.mockImplementation(() => Promise.resolve({ rows: [] }));
    });

    it('should rollback on error', async () => {
      const error = new Error('Update failed');
      mockClient.query.mockRejectedValueOnce(error);

      await expect(auth.updateUserSettings(1, { username: 'new' })).rejects.toThrow(error);
      
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update settings for user ID 1'),
        error
      );
    });

    it('should validate avatar_id', async () => {
      await expect(auth.updateUserSettings(1, { avatar_id: -1 })).rejects.toThrow(
        'Invalid avatar_id: must be a positive integer.'
      );
    });
  });
});