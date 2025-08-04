// api-backend/tests/integration/achievement.test.ts
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import achievementsRouter from '../../modules/achievements/routes/achievementRoute';
import * as achievementService from '../../modules/achievements/services/achievement.service';
import { logger } from '../../config/logger';

// Mock the achievement service and logger
jest.mock('../../modules/achievements/services/achievement.service');
jest.mock('../../config/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

// Optionally stub Redis so the router import doesn’t blow up
jest.mock('../../config/redis', () => ({
  redisClient: { on: jest.fn(), connect: jest.fn() },
  redisSubscriber: { on: jest.fn(), connect: jest.fn() },
}));

// Build a test Express app
const app = express();
app.use(bodyParser.json());
app.use('/api/achievements', achievementsRouter);

describe('Achievements API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/achievements/', () => {
    it('should return all definitions', async () => {
      const defs = [
        { achievement_id: 1, achievement_title: 'First', display_order: 1 },
        { achievement_id: 2, achievement_title: 'Second', display_order: 2 },
      ];
      (achievementService.getAllAchievements as jest.Mock).mockResolvedValue(defs);

      const res = await request(app).get('/api/achievements/').expect(200);
      expect(res.body).toEqual({ status: 'success', data: defs });
      expect(achievementService.getAllAchievements).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      (achievementService.getAllAchievements as jest.Mock).mockRejectedValue(new Error('boom'));

      const res = await request(app).get('/api/achievements/').expect(500);
      expect(res.body).toEqual({ status: 'error', error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch achievements:', expect.any(Error));
    });
  });

  describe('GET /api/achievements/:title', () => {
    it('should return a single achievement when found', async () => {
      const defs = [
        { achievement_id: 1, achievement_title: 'First', display_order: 1 },
      ];
      (achievementService.getAllAchievements as jest.Mock).mockResolvedValue(defs);

      const res = await request(app).get('/api/achievements/First').expect(200);
      expect(res.body).toEqual({ status: 'success', data: defs[0] });
    });

    it('should 404 when not found', async () => {
      (achievementService.getAllAchievements as jest.Mock).mockResolvedValue([]);
      const res = await request(app).get('/api/achievements/DoesntExist').expect(404);
      expect(res.body).toEqual({ status: 'error', error: 'Achievement not found' });
    });

    it('should handle service errors', async () => {
      (achievementService.getAllAchievements as jest.Mock).mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/api/achievements/First').expect(500);
      expect(res.body).toEqual({ status: 'error', error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch achievement First:', expect.any(Error));
    });
  });

  describe('GET /api/achievements/user/:userId', () => {
    it('should 400 on invalid userId', async () => {
      const res = await request(app).get('/api/achievements/user/notanumber').expect(400);
      expect(res.body).toEqual({ status: 'error', error: 'Invalid user ID' });
    });

    it('should return user achievements', async () => {
      (achievementService.ensureUserAchievements as jest.Mock).mockResolvedValue(undefined);
      const userRows = [{ achievement_id: 5, progress_value: 2 }];
      (achievementService.getUserAchievements as jest.Mock).mockResolvedValue(userRows);

      const res = await request(app).get('/api/achievements/user/7').expect(200);
      expect(res.body).toEqual({ status: 'success', data: userRows });
      expect(achievementService.ensureUserAchievements).toHaveBeenCalledWith(7);
      expect(achievementService.getUserAchievements).toHaveBeenCalledWith(7);
    });

    it('should handle service errors', async () => {
      (achievementService.ensureUserAchievements as jest.Mock).mockRejectedValue(new Error('db'));
      const res = await request(app).get('/api/achievements/user/1').expect(500);
      expect(res.body).toEqual({ status: 'error', error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch user achievements:', expect.any(Error));
    });
  });

  describe('POST /api/achievements/user/:userId/event', () => {
    it('should 400 on invalid params', async () => {
      await request(app)
        .post('/api/achievements/user/xyz/event')
        .send({ eventType: 'transaction', delta: 3 })
        .expect(400);
      await request(app)
        .post('/api/achievements/user/1/event')
        .send({ eventType: '', delta: 'nope' })
        .expect(400);
    });

    it('should update then return updated achievements', async () => {
      (achievementService.updateAchievementsForEvent as jest.Mock).mockResolvedValue(undefined);
      const updated = [{ achievement_id: 9, progress_value: 4 }];
      (achievementService.getUserAchievements as jest.Mock).mockResolvedValue(updated);

      const res = await request(app)
        .post('/api/achievements/user/3/event')
        .send({ eventType: 'transaction', delta: 2 })
        .expect(200);

      expect(achievementService.updateAchievementsForEvent).toHaveBeenCalledWith(3, 'transaction', 2);
      expect(achievementService.getUserAchievements).toHaveBeenCalledWith(3);
      expect(res.body).toEqual({ status: 'success', data: updated });
    });

    it('should handle service errors', async () => {
      (achievementService.updateAchievementsForEvent as jest.Mock).mockRejectedValue(new Error('oops'));
      const res = await request(app)
        .post('/api/achievements/user/4/event')
        .send({ eventType: 'transaction', delta: 1 })
        .expect(500);
      expect(res.body).toEqual({ status: 'error', error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to update achievements for user 4:',
        expect.any(Error)
      );
    });
  });

  describe('GET /api/achievements/task/:title/:userId', () => {
    it('should 400 on missing title or invalid userId', async () => {
      await request(app).get('/api/achievements/task//5').expect(404);
      await request(app).get('/api/achievements/task/MyUmbrella/abc').expect(400);
    });

    it('should return tasks', async () => {
      const tasks = [{ achievement_id: 11, title: 'SubAch', progress: 1, total: 5, status: 'incomplete' }];
      (achievementService.fetchAchievementTasks as jest.Mock).mockResolvedValue(tasks);

      const res = await request(app).get('/api/achievements/task/MyUmbrella/8').expect(200);
      expect(achievementService.fetchAchievementTasks).toHaveBeenCalledWith('MyUmbrella', 8);
      expect(res.body).toEqual({ status: 'success', data: tasks });
    });

    it('should handle errors', async () => {
      (achievementService.fetchAchievementTasks as jest.Mock).mockRejectedValue(new Error('bad'));
      const res = await request(app).get('/api/achievements/task/Any/2').expect(500);
      expect(res.body).toEqual({ status: 'error', error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith('Failed to fetch achievement tasks:', expect.any(Error));
    });
  });

  describe('GET /api/achievements/performance/:userId', () => {
    it('should 400 on invalid userId', async () => {
      await request(app).get('/api/achievements/performance/NaN').expect(400);
    });

    it('should return sidebar stats', async () => {
      const stats = { performance: 80, quizzes: 5, accuracy: 90, leaderboardRank: 1, goalsCompleted: 2, goalsTotal: 3, badgesEarned: 4, challengesJoined: 2, creditScore: 700, level: 'Silver', avatar_url: '', totalXp: 30 };
      (achievementService.getSidebarStats as jest.Mock).mockResolvedValue(stats);

      const res = await request(app).get('/api/achievements/performance/12').expect(200);
      expect(achievementService.getSidebarStats).toHaveBeenCalledWith(12);
      expect(res.body).toEqual({ status: 'success', data: stats });
    });

    it('should handle service errors', async () => {
      (achievementService.getSidebarStats as jest.Mock).mockRejectedValue(new Error('fail'));
      const res = await request(app).get('/api/achievements/performance/7').expect(500);
      expect(res.body).toEqual({ status: 'error', error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to fetch sidebar stats for user 7:',
        expect.any(Error)
      );
    });
  });
});
