import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import learningRouter from '../../modules/learning/routes/learningRoutes';
import * as learningService from '../../modules/learning/services/learning.service';
import { logger } from '../../config/logger';
import { Pool } from 'pg';

jest.mock('../../modules/learning/services/learning.service');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/learning', learningRouter);

describe('Learning Routes Integration Tests', () => {
  const mockModule = {
    module_id: 1,
    title: 'Budgeting Basics',
    difficulty: 'beginner',
    lesson_count: 5
  };

  const mockLesson = {
    lesson_id: 1,
    module_id: 1,
    title: 'Budgeting Basics',
    content: 'Learn more about budgeting basics for your finances',
    lesson_number: 1
  };

  const mockQuiz = {
    quiz_id: 1,
    module_id: 1,
    questions: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock implementations
    (learningService as any).getAllModules.mockReset();
    (learningService as any).getCompletedModules.mockReset();
  });

  describe('GET /api/learning', () => {
    it('should return modules with lesson counts', async () => {
      (learningService.getAllModules as jest.Mock).mockResolvedValue([
        { ...mockModule, lesson_count: 5 }
      ]);

      const response = await request(app).get('/api/learning');
      
      expect(response.status).toBe(200);
      expect(response.body.data[0]).toHaveProperty('lesson_count');
      expect(learningService.getAllModules).toHaveBeenCalled();
    });
  });

  describe('Completed/Uncompleted Modules', () => {
    it('should return completed modules with proper structure', async () => {
      (learningService.getCompletedModules as jest.Mock).mockResolvedValue([
        { ...mockModule, lesson_count: 2 }
      ]);

      const response = await request(app).get('/api/learning/completed/1');
      
      expect(response.body.data[0]).toMatchObject({
        module_id: expect.any(Number),
        lesson_count: expect.any(Number)
      });
    });

    it('should return empty array when no completed modules exist', async () => {
      (learningService.getCompletedModules as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/learning/completed/1');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should return uncompleted modules with proper filtering', async () => {
      (learningService.getUncompletedModules as jest.Mock).mockResolvedValue([
        { ...mockModule, lesson_count: 3 }
      ]);

      const response = await request(app).get('/api/learning/uncompleted/1');
      
      expect(response.body.data[0]).toHaveProperty('module_id');
    });
  });

  describe('Quiz Submission', () => {
    it('should handle quiz submission with points calculation', async () => {
      // Mock the entire quiz submission flow
      (learningService.submitQuizAttempt as jest.Mock).mockImplementation(async (userId, quizId, score, passed) => {
        return {
          attempt_id: 1,
          user_id: userId,
          quiz_id: quizId,
          attempt_score: score,
          passed
        };
      });

      const response = await request(app)
        .post('/api/learning/quizzes/1/submit')
        .send({
          userId: 1,
          quiz_id: 1,
          attempt_score: 85,
          passed: true,
          answers: []
        });

      expect(response.status).toBe(200);
      expect(response.body.data.passed).toBe(true);
    });

    it('should handle failed quiz attempts', async () => {
      (learningService.submitQuizAttempt as jest.Mock).mockResolvedValue({
        attempt_id: 1,
        passed: false
      });

      const response = await request(app)
        .post('/api/learning/quizzes/1/submit')
        .send({
          userId: 1,
          quiz_id: 1,
          attempt_score: 50,
          passed: false,
          answers: []
        });

      expect(response.body.data.passed).toBe(false);
    });
  });

  describe('Learning Performance', () => {
    it('should return properly scaled performance score', async () => {
      (learningService.getLearningPerformance as jest.Mock).mockImplementation(async (userId) => {
        // Mock the complex calculation
        return Math.round((850 - 300) * 0.7 + 300); // Example score
      });

      const response = await request(app).get('/api/learning/score/1');
      
      expect(response.body.data).toBeGreaterThanOrEqual(300);
      expect(response.body.data).toBeLessThanOrEqual(850);
    });
  });

  describe('Learning Summary', () => {
    it('should return comprehensive summary data', async () => {
      (learningService.getLearningSummary as jest.Mock).mockResolvedValue({
        modules: 5,
        points: 100,
        total_attempts: 10,
        total_quizzes_left: 2,
        score: 650,
        percent: "60.00"
      });

      const response = await request(app).get('/api/learning/summary/1');
      
      expect(response.body.data).toEqual({
        modules: expect.any(Number),
        points: expect.any(Number),
        total_attempts: expect.any(Number),
        total_quizzes_left: expect.any(Number),
        score: expect.any(Number),
        percent: expect.stringMatching(/\d+\.\d{2}/)
      });
    });
  });

  // Add tests for error scenarios
  describe('Error Handling', () => {
    it('should handle database errors in getModuleById', async () => {
      (learningService.getModuleById as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await request(app).get('/api/learning/1');
      
      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should return 404 for non-existent lesson', async () => {
      (learningService.getLessonById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/api/learning/lessons/999');
      
      expect(response.status).toBe(404);
    });
  });
});