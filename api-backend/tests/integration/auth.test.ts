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


describe('GET /api/auth/top-bar/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and top bar data on success', async () => {
    const mockData = {
      username: 'bob',
      total_points: 1234,
      tier_status: 'Gold',
      avatar_image_path: 'avatar.png',
    };
    (userService.getProfileTopBar as jest.Mock).mockResolvedValueOnce(mockData);

    const res = await request(app).get('/api/auth/top-bar/55');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      message: 'Profile top bar data loaded.',
      data: mockData,
    });
  });

  it('should return 500 and log error when service throws', async () => {
    const err = new Error('Something went wrong');
    (userService.getProfileTopBar as jest.Mock).mockRejectedValueOnce(err);

    const res = await request(app).get('/api/auth/top-bar/77');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      message: 'Failed to load profile top bar data.',
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[Auth] Failed to fetch top bar for user ID 77:'),
      err
    );
  });

  it('should call service with NaN when userId is non-numeric and still succeed if service does', async () => {
    const mockData = { foo: 'bar' };
    (userService.getProfileTopBar as jest.Mock).mockImplementationOnce((uid: any) => {
      expect(Number.isNaN(uid)).toBe(true); // ensure NaN passed
      return Promise.resolve(mockData);
    });

    const res = await request(app).get('/api/auth/top-bar/not-a-number');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      message: 'Profile top bar data loaded.',
      data: mockData,
    });
  });
});

  describe('GET /api/auth/sidebar/:userId', () => {
    it('should return user sidebar stats successfully', async () => {
      const mockStats = {
        totalCommunities: 5,
        totalGoals: 10,
        totalAchievements: 20,
      };
      (userService.getUserSidebarStats as jest.Mock).mockResolvedValueOnce(mockStats);

      const response = await request(app)
        .get('/api/auth/sidebar/1');
      expect(response.status).toBe(200);    
      expect(response.body).toEqual({
        status: 'success',
        data: mockStats,
        message: "Sidebar statistics loaded.",
      });
      expect(userService.getUserSidebarStats).toHaveBeenCalledWith(1);
    });

    it('should return 500 for non-existent user sidebar stats', async () => {
      (userService.getUserSidebarStats as jest.Mock).mockRejectedValueOnce(new Error('User not found'));

      const response = await request(app)
        .get('/api/auth/sidebar/999');

 expect(response.status).toBe(500);
expect(response.body).toEqual({
  status: 'error',
  message: 'Failed to load sidebar stats.',
});
expect(logger.error).toHaveBeenCalledWith(
  expect.stringContaining("[Auth] Failed to get sidebar stats for user ID 999:"),
  expect.any(Error)
);
    });
  });
  describe('GET /profile/performance-stats/:userId', () => {
    it('should return user performance stats successfully', async () => {
      const mockStats = {
        totalActivities: 100,
        averageScore: 90,
        recentAchievements: 10,
      };
      (userService.getUserPerformanceStats as jest.Mock).mockResolvedValueOnce(mockStats);

      const response = await request(app)
        .get('/api/auth/profile/performance-stats/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockStats,
        message: "Performance stats fetched successfully."
      });
      expect(userService.getUserPerformanceStats).toHaveBeenCalledWith(1);
    });

    it('should return 500 for non-existent user performance stats', async () => {
      (userService.getUserPerformanceStats as jest.Mock).mockRejectedValueOnce(new Error('User not found'));

      const response = await request(app)
        .get('/api/auth/profile/performance-stats/999');

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to fetch performance stats for user ID 999:',
        expect.any(Error)
      );
    });
  });

  describe('GET /api/auth/profile/recent-achievements/:userId', () => {
    it('should return recent achievements for user', async () => {
      const mockAchievements = [
        { id: 1, title: 'First Login', date: '2023-01-01' },
        { id: 2, title: 'Completed Tutorial', date: '2023-01-02' },
      ];
      (userService.getRecentAchievements as jest.Mock).mockResolvedValueOnce(mockAchievements);

      const response = await request(app)
        .get('/api/auth/profile/recent-achievements/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockAchievements,
        message: 'Recent achievements fetched successfully.',
      });
      expect(userService.getRecentAchievements).toHaveBeenCalledWith(1);
    });

    it('should return 500 for non-existent user achievements', async () => {
      (userService.getRecentAchievements as jest.Mock).mockRejectedValueOnce(new Error('User not found'));

      const response = await request(app)
        .get('/api/auth/profile/recent-achievements/999');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
 message: 'Could not load recent achievements.',
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to fetch recent achievements for user ID 999:',
        expect.any(Error)
      );
    });
  });

  describe('GET /api/auth/profile/performance-summary/:userId', () => {
    it('should return user performance summary successfully', async () => {
      const mockSummary = {
        totalActivities: 50,
        averageScore: 85,
        recentAchievements: 5,
      };
      (userService.getUserPerformanceSummary as jest.Mock).mockResolvedValueOnce(mockSummary);

      const response = await request(app)
        .get('/api/auth/profile/performance-summary/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockSummary,
        message: "Performance summary retrieved successfully.",
      });
      expect(userService.getUserPerformanceSummary).toHaveBeenCalledWith(1);
    });

    it('should return 500 for non-existent user performance summary', async () => {
      (userService.getUserPerformanceSummary as jest.Mock).mockRejectedValueOnce(new Error('User not found'));

      const response = await request(app)
        .get('/api/auth/profile/performance-summary/999');

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to fetch performance summary for user ID 999:',
        expect.any(Error)
      );
    });
  });

  describe('GET /api/auth/profile/level-progress/:userId', () => {
    it('should return user level progress successfully', async () => {
      const mockProgress = {
        currentLevel: 5,
        nextLevel: 6,
        progressPercentage: 75,
      };
      (userService.getUserLevelProgress as jest.Mock).mockResolvedValueOnce(mockProgress);

      const response = await request(app)
        .get('/api/auth/profile/level-progress/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockProgress,
        message: "Level progress retrieved successfully.",
      });
      expect(userService.getUserLevelProgress).toHaveBeenCalledWith(1);
    });

    it('should return 500 for non-existent user level progress', async () => {
      (userService.getUserLevelProgress as jest.Mock).mockRejectedValueOnce(new Error('User not found'));

      const response = await request(app)
        .get('/api/auth/profile/level-progress/999');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
          message: 'Could not load level progress.',
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to fetch level progress for user ID 999:',
        expect.any(Error)
      );
    });
  });


 describe('PUT /api/auth/:userId/change-password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields missing', async () => {
    const res = await request(app)
      .put('/api/auth/10/change-password')
      .send({}); // empty body

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body.errors).toBeInstanceOf(Array);
    expect(logger.warn).toHaveBeenCalledWith(
      '[Auth] Change password validation failed',
      expect.any(Array)
    );
  });

  it('should return 400 for password mismatch', async () => {
    const res = await request(app)
      .put('/api/auth/10/change-password')
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        confirmPassword: 'Different123!',
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'Passwords do not match' }),
      ])
    );
    expect(logger.warn).toHaveBeenCalledWith(
      '[Auth] Change password validation failed',
      expect.any(Array)
    );
  });

  it('should return 400 for weak newPassword (missing requirements)', async () => {
    // missing uppercase, special char, number etc.
    const res = await request(app)
      .put('/api/auth/10/change-password')
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'short',
        confirmPassword: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.errors).toBeInstanceOf(Array);
    // should include multiple validation failure messages
    const messages = res.body.errors.map((e: any) => e.msg);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.stringContaining('New password must be at least 8 characters'),
        expect.stringContaining('Include uppercase'),
        expect.stringContaining('Include a number'),
        expect.stringContaining('Include a special character'),
      ])
    );
    expect(logger.warn).toHaveBeenCalledWith(
      '[Auth] Change password validation failed',
      expect.any(Array)
    );
  });

  it('should return 200 when password change succeeds', async () => {
    (userService.changeUserPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const res = await request(app)
      .put('/api/auth/15/change-password')
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'NewStrong1!',
        confirmPassword: 'NewStrong1!',
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      message: 'Password updated successfully.',
    });
  });

  it('should return 500 when underlying service fails', async () => {
    const err = new Error('DB error');
    (userService.changeUserPassword as jest.Mock).mockRejectedValueOnce(err);

    const res = await request(app)
      .put('/api/auth/20/change-password')
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'NewStrong1!',
        confirmPassword: 'NewStrong1!',
      });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      message: err.message,
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[Auth] Failed to change password for user ID 20:'),
      err
    );
  });
});


 describe('GET /api/auth/:userId/settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for non-numeric userId', async () => {
    const response = await request(app).get('/api/auth/notanumber/settings');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Invalid user ID.',
    });
  });

  it('should return 200 and settings on success', async () => {
    const mockSettings = {
      status: 'success',
      data: {
        username: 'alice',
        theme: 'dark',
        avatar_id: 3,
        inAppNotifications: true,
        outOfAppEnabled: false,
        twoFactorEnabled: false,
      },
    };
    (userService.getUserSettings as jest.Mock).mockResolvedValueOnce(mockSettings);

    const response = await request(app).get('/api/auth/42/settings');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSettings);
  });

  it('should return 404 when userService throws "User not found"', async () => {
    const err = new Error('User not found');
    (userService.getUserSettings as jest.Mock).mockRejectedValueOnce(err);

    const response = await request(app).get('/api/auth/99/settings');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      message: 'User not found.',
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[Auth] Failed to fetch settings for user ID 99:'),
      err
    );
  });

  it('should return 500 on generic failure', async () => {
    const err = new Error('DB connection lost');
    (userService.getUserSettings as jest.Mock).mockRejectedValueOnce(err);

    const response = await request(app).get('/api/auth/100/settings');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Failed to retrieve user settings.',
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[Auth] Failed to fetch settings for user ID 100:'),
      err
    );
  });
});

describe('PUT /api/auth/:userId/settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when userId is invalid (non-number)', async () => {
    const response = await request(app)
      .put('/api/auth/notanumber/settings')
      .send({ username: 'validname' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Invalid user ID.',
    });
  });

  it('should return 400 when body is empty', async () => {
    const response = await request(app)
      .put('/api/auth/1/settings')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Missing user ID or updates in request body.',
    });
  });

  it('should return 400 for invalid field in updates', async () => {
    const response = await request(app)
      .put('/api/auth/1/settings')
      .send({ foo: 'bar' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Invalid fields in request body: foo',
    });
  });

  it('should return 400 for invalid username format', async () => {
    const response = await request(app)
      .put('/api/auth/2/settings')
      .send({ username: 'Bad*Name' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message:
        'Username must contain only lowercase letters, numbers, dots, or underscores.',
    });
  });

  it('should return 400 for invalid theme', async () => {
    const response = await request(app)
      .put('/api/auth/3/settings')
      .send({ theme: 'blue' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Theme must be either "light" or "dark".',
    });
  });

  it('should return 400 for invalid avatar_id type', async () => {
    const response = await request(app)
      .put('/api/auth/4/settings')
      .send({ avatar_id: 'not-a-number' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Avatar ID must be a number.',
    });
  });

  it('should return 400 for invalid twoFactorEnabled type', async () => {
    const response = await request(app)
      .put('/api/auth/5/settings')
      .send({ twoFactorEnabled: 'yes' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Two-factor enabled must be a boolean value.',
    });
  });

  it('should return 400 when twoFactorEnabled is true but secret missing', async () => {
    const response = await request(app)
      .put('/api/auth/6/settings')
      .send({ twoFactorEnabled: true });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Two-factor authentication requires a valid secret.',
    });
  });

  it('should return 200 on successful update', async () => {
    (userService.updateUserSettings as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app)
      .put('/api/auth/7/settings')
      .send({ username: 'valid_user' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'success',
      message: 'User settings updated successfully.',
    });
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('[Auth] Settings updated for user ID 7')
    );
  });

  it('should return 409 when username already taken', async () => {
    const err = new Error('Username already taken');
    (userService.updateUserSettings as jest.Mock).mockRejectedValueOnce(err);

    const response = await request(app)
      .put('/api/auth/8/settings')
      .send({ username: 'takenname' });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      status: 'error',
      message: 'That username is already in use.',
    });
  });

  it('should return 500 on generic failure', async () => {
    const err = new Error('DB is down');
    (userService.updateUserSettings as jest.Mock).mockRejectedValueOnce(err);

    const response = await request(app)
      .put('/api/auth/9/settings')
      .send({ username: 'valid_user2' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Internal server error while updating user settings.',
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[Auth] Failed to update settings for user ID 9:'),
      err
    );
  });
});

  describe('GET /api/auth/avatars', () => {
    it('should return avatar URLs for all users', async () => {
      const mockAvatars = [
        { user_id: 1, avatar_url: 'http://example.com/avatar1.png' },
        { user_id: 2, avatar_url: 'http://example.com/avatar2.png' },
      ];

      (userService.getAllAvatars as jest.Mock).mockResolvedValueOnce(mockAvatars);

      const response = await request(app)
        .get('/api/auth/avatars');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockAvatars,
      });
    }
    );

    it('should return 500 when fetching avatars fails', async () => {
      (userService.getAllAvatars as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .get('/api/auth/avatars');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: "Could not fetch avatars.",
      });
      expect(logger.error).toHaveBeenCalledWith(
        '[Auth] Failed to fetch avatars:',
        expect.any(Error)
      );
    });
  });
});