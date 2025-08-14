import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { Router } from 'express';
import { logger } from '../../config/logger';
import * as userService from '../../modules/auth/services/auth.service';
import authRouter from '../../modules/auth/routes/authRoutes';

// Mock the auth service and logger
jest.mock('../../modules/auth/services/auth.service');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock argon2 and paseto
jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  verify: jest.fn().mockResolvedValue(true),
}));

jest.mock('paseto', () => ({
  V3: {
    encrypt: jest.fn().mockResolvedValue('mocktoken'),
  },
}));

// Setup test app
const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRouter);

describe('Auth API Integration Tests', () => {
  const testUser = {
    user_id: 1,
    username: 'testuser',
    full_name: 'Test User',
    email: 'test@example.com',
    hashed_password: 'hashedpassword',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PASETO_LOCAL_KEY = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    process.env.TOKEN_TTL_SECONDS = '3600';
  });

  describe('POST /api/auth/register', () => {
    const validPayload = {
      full_name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'ValidPass123!',
    };

    it('should register a new user with valid data', async () => {
      (userService.createUser as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...testUser,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        message: 'User registered successfully.',
        data: {
          user: {
            id: 1,
            full_name: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
          },
        },
         timestamp: expect.any(String)
      });

      expect(userService.createUser).toHaveBeenCalledWith({
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        hashed_password: 'hashedpassword',
      });
    });

    it('should return 400 for invalid registration data', async () => {
      const invalidPayload = {
        full_name: 'Test', // Missing last name
        username: 'test user', // Contains space
        email: 'invalid-email',
        password: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
      expect(logger.warn).toHaveBeenCalledWith(
        '[Auth] Registration validation failed',
        expect.any(Array)
      );
    });

    it('should return 500 when registration fails', async () => {
      (userService.createUser as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .post('/api/auth/register')
        .send(validPayload);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Internal server error during registration',
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Registration failed',
        expect.any(Error)
      );
    });
  });

  describe('POST /api/auth/login', () => {
    const validPayload = {
      username: 'testuser',
      password: 'ValidPass123!',
    };

    it('should authenticate user and return token', async () => {
      (userService.getUserByUsername as jest.Mock).mockResolvedValueOnce(testUser);
      (userService.upsertToken as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validPayload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          user: { id: 1, username: 'testuser' },
          token: 'mocktoken',
          expires_at: expect.any(String),
        },
      });
      expect(userService.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(userService.upsertToken).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        '[Auth] Login success: testuser'
      );
    });

    it('should return 401 for invalid credentials', async () => {
      (userService.getUserByUsername as jest.Mock).mockResolvedValueOnce(testUser);
      (require('argon2').verify as jest.Mock).mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validPayload);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid credentials',
      });
    });

    it('should return 400 for invalid login data', async () => {
      const invalidPayload = {
        username: '', // Empty
        password: '', // Empty
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(logger.warn).toHaveBeenCalledWith(
        '[Auth] Login validation failed',
        expect.any(Array)
      );
    });

    it('should return 500 when login fails', async () => {
      (userService.getUserByUsername as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send(validPayload);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Internal server error',
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Login failed:',
        expect.any(Error)
      );
    });
  });

  describe('GET /api/auth/user-id/:username', () => {
    it('should return user ID for valid username', async () => {
      (userService.getUserID as jest.Mock).mockResolvedValueOnce(1);

      const response = await request(app)
        .get('/api/auth/user-id/testuser');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'User ID retrieved for testuser',
        data: { user_id: 1 },
      });
    });

    it('should return 404 for non-existent username', async () => {
      (userService.getUserID as jest.Mock).mockRejectedValueOnce(new Error('User not found'));

      const response = await request(app)
        .get('/api/auth/user-id/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'User nonexistent not found',
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to get user ID for nonexistent:',
        expect.any(Error)
      );
    });
  });

  describe('DELETE /api/auth/:userId', () => {
    it('should delete user account successfully', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .delete('/api/auth/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'User account with ID 1 deleted successfully.',
      });
      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(logger.info).toHaveBeenCalledWith(
        '[Auth] User with ID 1 deleted successfully.'
      );
    });

    it('should return 500 when deletion fails', async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .delete('/api/auth/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Internal server error while deleting user account.',
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to delete user with ID 1:',
        expect.any(Error)
      );
    });
  });


});