import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import pool from '../../config/db';
import * as learning from '../../modules/learning/services/learning.service';
import { logger } from '../../config/logger';

// Mock the database pool and logger
jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Learning Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllModules', () => {
    it('should return all learning modules with lesson counts', async () => {
      const mockModules = [
        { module_id: 1, title: 'Module 1', lesson_count: 3 },
        { module_id: 2, title: 'Module 2', lesson_count: 5 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockModules });

      const result = await learning.getAllModules();

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT lm.*, COUNT(l.lesson_id) AS lesson_count'));
      expect(result).toEqual(mockModules);
    });

    it('should handle database errors', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      await expect(learning.getAllModules()).rejects.toThrow('DB Error');
    });
  });

  describe('getCompletedModules', () => {
    it('should return completed modules for a user', async () => {
      const mockModules = [
        { module_id: 1, title: 'Completed Module', lesson_count: 3 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockModules });

      const userId = 1;
      const result = await learning.getCompletedModules(userId);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE qa.user_id = $1 AND qa.passed = true'), [userId]);
      expect(result).toEqual(mockModules);
    });

    it('should handle errors and return error object', async () => {
      const error = new Error('DB Error');
      (pool.query as jest.Mock).mockRejectedValueOnce(error);

      const result = await learning.getCompletedModules(1);

      expect(logger.error).toHaveBeenCalledWith('Error fetching completed modules:', error);
      expect(result).toEqual({
        status: "error",
        message: "Failed to fetch completed modules"
      });
    });
  });

  describe('getUncompletedModules', () => {
    it('should return uncompleted modules for a user', async () => {
      const mockModules = [
        { module_id: 2, title: 'Uncompleted Module', lesson_count: 2 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockModules });

      const userId = 1;
      const result = await learning.getUncompletedModules(userId);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('NOT EXISTS'), [userId]);
      expect(result).toEqual(mockModules);
    });

    it('should handle errors and return error message', async () => {
      const error = new Error('DB Error');
      (pool.query as jest.Mock).mockRejectedValueOnce(error);

      const result = await learning.getUncompletedModules(1);

      expect(logger.error).toHaveBeenCalledWith('Error fetching uncompleted modules:', error);
      expect(result).toEqual("Failed to fetch uncompleted modules");
    });
  });

  describe('getModuleById', () => {
    it('should return a module by ID', async () => {
      const mockModule = { module_id: 1, title: 'Test Module' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockModule] });

      const result = await learning.getModuleById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM learning_modules WHERE module_id = $1', [1]);
      expect(result).toEqual(mockModule);
    });

    it('should return undefined for non-existent module', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await learning.getModuleById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('getLessonsByModule', () => {
    it('should return lessons for a module', async () => {
      const mockLessons = [
        { lesson_id: 1, title: 'Lesson 1' },
        { lesson_id: 2, title: 'Lesson 2' },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockLessons });

      const result = await learning.getLessonsByModule(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE module_id = $1'), [1]);
      expect(result).toEqual(mockLessons);
    });
  });

  describe('getLessonById', () => {
    it('should return a lesson by ID', async () => {
      const mockLesson = { lesson_id: 1, title: 'Test Lesson' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockLesson] });

      const result = await learning.getLessonById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM lessons WHERE lesson_id = $1', [1]);
      expect(result).toEqual(mockLesson);
    });
  });

  describe('getQuizByModuleId', () => {
    it('should return quiz for a module', async () => {
      const mockQuiz = { quiz_id: 1, module_id: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockQuiz] });

      const result = await learning.getQuizByModuleId(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE module_id = $1'), [1]);
      expect(result).toEqual([mockQuiz]);
    });
  });

  describe('getQuizById', () => {
    it('should return a quiz by ID', async () => {
      const mockQuiz = { quiz_id: 1, title: 'Test Quiz' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockQuiz] });

      const result = await learning.getQuizById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM quizzes WHERE quiz_id = $1', [1]);
      expect(result).toEqual(mockQuiz);
    });
  });

  describe('submitQuizAttempt', () => {
    const userId = 1;
    const quizId = 1;
    const attemptScore = 80;
    const passed = true;

    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();

      // Mock the difficulty query
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ difficulty: 'intermediate' }] }) // difficulty query
        .mockResolvedValueOnce({ rows: [] }) // check passed query (no previous passes)
        .mockResolvedValueOnce({ rows: [] }) // check user points (no existing entry)
        .mockResolvedValueOnce({ rows: [{ attempt_id: 1 }] }); // attempt insertion
    });

    it('should submit a quiz attempt and award points for first pass', async () => {
      const result = await learning.submitQuizAttempt(userId, quizId, attemptScore, passed);

      // Verify database calls
      expect(pool.query).toHaveBeenCalledTimes(5); // difficulty + check passed + check points + update points + insert attempt
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO quiz_attempts'), [
        userId, quizId, attemptScore, passed
      ]);

      // Verify points were added (20 for intermediate)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_points'),
        [userId, 20]
      );

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Created points entry'));
      expect(result).toEqual({ attempt_id: 1 });
    });

    it('should not award points for subsequent passes', async () => {
      // Mock that user already passed this quiz
      (pool.query as jest.Mock)
        .mockReset()
        .mockResolvedValueOnce({ rows: [{ difficulty: 'easy' }] }) // difficulty
        .mockResolvedValueOnce({ rows: [{}] }) // already passed
        .mockResolvedValueOnce({ rows: [{ attempt_id: 1 }] }); // attempt insertion

      await learning.submitQuizAttempt(userId, quizId, attemptScore, passed);

      // Should only be 3 queries (difficulty + check passed + insert attempt)
      expect(pool.query).toHaveBeenCalledTimes(3);
    });

    it('should handle database errors', async () => {
      (pool.query as jest.Mock)
        .mockReset()
        .mockRejectedValueOnce(new Error('DB Error'));

      await expect(learning.submitQuizAttempt(userId, quizId, attemptScore, passed)).rejects.toThrow('DB Error');
    });
  });

  describe('getUserQuizAttempts', () => {
    it('should return quiz attempts for a user', async () => {
      const mockAttempts = [
        { attempt_id: 1, quiz_id: 1 },
        { attempt_id: 2, quiz_id: 2 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAttempts });

      const result = await learning.getUserQuizAttempts(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), [1]);
      expect(result).toEqual(mockAttempts);
    });
  });

  describe('getUserQuizAttemptsForQuiz', () => {
    it('should return quiz attempts for a specific user and quiz', async () => {
      const mockAttempts = [
        { attempt_id: 1, quiz_id: 1, attempt_number: 1 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAttempts });

      const result = await learning.getUserQuizAttemptsForQuiz(1, 1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1 AND quiz_id = $2'), [1, 1]);
      expect(result).toEqual(mockAttempts);
    });
  });

  describe('getLearningPeformance', () => {
    it('should calculate a learning performance score', async () => {
      // Mock the accuracy query
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ 
          rows: [{ 
            total_passed: 5, 
            total_attempts: 10, 
            average_score: 75 
          }] 
        })
        // Mock the points query
        .mockResolvedValueOnce({ 
          rows: [{ total_points: 100 }] 
        });

      const result = await learning.getLearningPeformance(1);

      // Verify the calculation
      // averageScore (75) * 0.5 = 37.5
      // totalPoints (100) * 0.5 = 50
      // viewCount (1) * 0.1 = 0.1
      // total_attempts (10) * 0.4 = 4
      // total_passed (5) * 0.7 = 3.5
      // Total = 37.5 + 50 + 0.1 + 4 + 3.5 = 95.1
      // Scaled: (95.1 / 206) * 550 + 300 ≈ 553.96 → 554
      expect(result).toBe(554);
    });

    it('should handle missing data', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{}] }) // empty accuracy
        .mockResolvedValueOnce({ rows: [] }); // no points

      const result = await learning.getLearningPeformance(1);

      // With all values 0, score should be 300 (minimum)
      expect(result).toBe(300);
    });
  });

  describe('getLearningSummary', () => {
    it('should return a comprehensive learning summary', async () => {
      // Mock performance score
      jest.spyOn(require('./learning.service'), 'getLearningPeformance')
        .mockResolvedValueOnce(650);

      // Mock all the queries in getLearningSummary
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ quiz_points: 120 }] }) // quiz points
        .mockResolvedValueOnce({ rows: [{ total_attempts: 15 }] }) // quiz attempts
        .mockResolvedValueOnce({ rows: [{ total_left: 3 }] }) // quizzes left
        .mockResolvedValueOnce({ rows: [{ total_modules: 10 }] }) // total modules
        .mockResolvedValueOnce({ rows: [{ completed_quizzes: 7 }] }); // completed quizzes

      const result = await learning.getLearningSummary(1);

      expect(result).toEqual({
        modules: 10,
        points: 120,
        total_attempts: 15,
        total_quizzes_left: 3,
        total_views: 1,
        score: 650,
        percent: '70.00' // 7/10 = 70%
      });
    });
  });
});