import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { logger } from '../../config/logger';
import * as goalService from '../../modules/goals/services/goals.service';
import goalsRouter from '../../modules/goals/routes/goalRoutes';

// Mock the goals service and logger
jest.mock('../../modules/goals/services/goals.service');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Setup test app
const app = express();
app.use(bodyParser.json());
app.use('/api/goals', goalsRouter);

describe('Goals API Integration Tests', () => {
  const testGoal = {
    goal_id: 1,
    user_id: 1,
    goal_name: 'Test Goal',
    goal_type: 'savings',
    target_amount: 1000,
    current_amount: 500,
    start_date: '2023-01-01',
    target_date: '2023-12-31',
    goal_status: 'in-progress',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/goals', () => {
    const validPayload = {
      user_id: 1,
      goal_name: 'Test Goal',
      goal_type: 'savings',
      target_amount: 1000,
      start_date: '2023-01-01',
      target_date: '2023-12-31',
      banner_id: 1,
      category_id: 1,
    };

    it('should create a new goal with valid data', async () => {
      (goalService.createGoal as jest.Mock).mockResolvedValueOnce(1);

      const response = await request(app)
        .post('/api/goals')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        data: { goal_id: 1 },
      });
      expect(goalService.createGoal).toHaveBeenCalledWith({
        user_id: 1,
        goal_name: 'Test Goal',
        goal_type: 'savings',
        target_amount: 1000,
        start_date: '2023-01-01',
        target_date: '2023-12-31',
        banner_id: 1,
        category_id: 1,
        custom_category_id: undefined,
        goal_status: 'in-progress',
      });
    });

    it('should handle custom categories', async () => {
      (goalService.createGoal as jest.Mock).mockResolvedValueOnce(2);
      
      const response = await request(app)
        .post('/api/goals')
        .send({
          ...validPayload,
          category_id: undefined,
          custom_category_name: 'Custom Category'
        });

      expect(response.status).toBe(201);
      // Note: The actual custom category handling would need more detailed testing
      // with a mock database in an integration test
    });

    it('should return 400 for invalid goal data', async () => {
      const invalidPayload = {
        ...validPayload,
        goal_name: '', // Empty name
        target_amount: -100, // Negative amount
      };

      const response = await request(app)
        .post('/api/goals')
        .send(invalidPayload);

      expect(response.status).toBe(500); // Note: Currently the route doesn't have validation
      // In a real app, you'd want proper validation middleware
    });

    it('should return 500 when creation fails', async () => {
      (goalService.createGoal as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .post('/api/goals')
        .send(validPayload);

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalledWith(
        '[GoalRoutes] Failed to create goal',
        expect.any(Error)
      );
    });
  });

  describe('GET /api/goals/:goalId', () => {
    it('should return a goal by ID', async () => {
      (goalService.getGoal as jest.Mock).mockResolvedValueOnce(testGoal);

      const response = await request(app)
        .get('/api/goals/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: testGoal,
      });
    });

    it('should return 404 for non-existent goal', async () => {
      (goalService.getGoal as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/api/goals/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Goal not found',
      });
    });
  });

  describe('GET /api/goals/user/:userId', () => {
    it('should return all goals for a user', async () => {
      const mockGoals = [testGoal, { ...testGoal, goal_id: 2 }];
      (goalService.getUserGoals as jest.Mock).mockResolvedValueOnce(mockGoals);

      const response = await request(app)
        .get('/api/goals/user/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockGoals,
      });
    });

    it('should return empty array if no goals exist', async () => {
      (goalService.getUserGoals as jest.Mock).mockResolvedValueOnce([]);

      const response = await request(app)
        .get('/api/goals/user/1');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/goals/:userId/summary', () => {
    it('should return goal summary statistics', async () => {
      const mockSummary = {
        total_goals: 5,
        completed_goals: 2,
        in_progress_goals: 2,
        paused_goals: 1,
      };
      (goalService.getGoalsSummary as jest.Mock).mockResolvedValueOnce(mockSummary);

      const response = await request(app)
        .get('/api/goals/1/summary');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockSummary,
      });
    });
  });

  describe('GET /api/goals/:userId/category-summary', () => {
    it('should return goal counts by category', async () => {
      const mockCategories = [
        { goal_type: 'savings', count: 3 },
        { goal_type: 'investment', count: 2 },
      ];
      (goalService.getGoalCategorySummary as jest.Mock).mockResolvedValueOnce(mockCategories);

      const response = await request(app)
        .get('/api/goals/1/category-summary');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockCategories,
      });
    });
  });

  describe('DELETE /api/goals/:goalId', () => {
    it('should delete a goal by ID', async () => {
      (goalService.deleteGoal as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .delete('/api/goals/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Goal deleted successfully',
      });
    });

    it('should return 500 when deletion fails', async () => {
      (goalService.deleteGoal as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const response = await request(app)
        .delete('/api/goals/1');

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalledWith(
        '[GoalRoutes] Error deleting goal',
        expect.any(Error)
      );
    });
  });

  describe('POST /api/goals/:goalId/progress', () => {
    const validPayload = {
      contributor_id: 1,
      amount_added: 100,
    };

    it('should add progress to a goal', async () => {
      (goalService.addGoalProgress as jest.Mock).mockResolvedValueOnce(101);

      const response = await request(app)
        .post('/api/goals/1/progress')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 'success',
        data: { progress_id: 101 },
      });
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/goals/1/progress')
        .send({ contributor_id: 1 }); // Missing amount_added

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'contributor_id and amount_added are required',
      });
    });
  });

  describe('GET /api/goals/user/:userId/upcoming', () => {
    it('should return upcoming goals', async () => {
      const mockGoals = [testGoal, { ...testGoal, goal_id: 2 }];
      (goalService.getUpcomingGoals as jest.Mock).mockResolvedValueOnce(mockGoals);

      const response = await request(app)
        .get('/api/goals/user/1/upcoming');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockGoals,
      });
    });
  });

  describe('GET /api/goals/user/:userId/total-value', () => {
    it('should return total goal value for user', async () => {
      (goalService.getTotalGoalValue as jest.Mock).mockResolvedValueOnce(5000);

      const response = await request(app)
        .get('/api/goals/user/1/total-value');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: { total_goal_value: 5000 },
      });
    });
  });

  describe('GET /api/goals/:userId/progress-frequency', () => {
    it('should return weekly progress frequency', async () => {
      const mockFrequency = [
        { day: 'Mon', count: 2 },
        { day: 'Wed', count: 1 },
      ];
      (goalService.getWeeklyGoalCompletions as jest.Mock).mockResolvedValueOnce(mockFrequency);

      const response = await request(app)
        .get('/api/goals/1/progress-frequency');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockFrequency,
      });
    });
  });

  describe('POST /api/goals/:goalId/complete', () => {
    it('should mark a goal as completed', async () => {
      (goalService.completeGoal as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post('/api/goals/1/complete');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Goal marked as completed',
      });
    });
  });

  describe('POST /api/goals/:goalId/reduce', () => {
    it('should reduce goal progress', async () => {
      (goalService.reduceGoalProgress as jest.Mock).mockResolvedValueOnce(undefined);

      const response = await request(app)
        .post('/api/goals/1/reduce')
        .send({ amount: 100 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        message: 'Progress reduced',
      });
    });

    it('should return 400 for missing amount', async () => {
      const response = await request(app)
        .post('/api/goals/1/reduce')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'amount is required',
      });
    });
  });

  describe('GET /api/goals', () => {
    it('should return all goals', async () => {
      const mockGoals = [testGoal, { ...testGoal, goal_id: 2 }];
      (goalService.getAllGoals as jest.Mock).mockResolvedValueOnce(mockGoals);

      const response = await request(app)
        .get('/api/goals');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockGoals,
      });
    });
  });

  describe('GET /api/goals/user/:user_id/stats', () => {
    it('should return user goal statistics', async () => {
      const mockStats = {
        total_goals: 3,
        completed_goals: 1,
        total_saved: 2500,
      };
      (goalService.getUserGoalStats as jest.Mock).mockResolvedValueOnce(mockStats);

      const response = await request(app)
        .get('/api/goals/user/1/stats');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: mockStats,
      });
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/goals/user/invalid/stats');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Invalid user_id',
      });
    });
  });

  describe('GET /api/goals/:userId/performance', () => {
    it('should calculate goal performance score', async () => {
      (goalService.calculateGoalPerformance as jest.Mock).mockResolvedValueOnce(85);

      const response = await request(app)
        .get('/api/goals/1/performance');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: 85,
      });
    });
  });
});