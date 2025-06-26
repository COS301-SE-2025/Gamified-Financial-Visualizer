import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import pool from '../../config/db';
import * as learning from '../../modules/learning/services/learning.service';
import { logger } from '../../config/logger';

const mockQueryResponse = (rows: any[]) => ({
  rows,
  rowCount: rows.length
});

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
        { module_id: 1, title: 'Budgeting Basics', lesson_count: 5 },
        { module_id: 2, title: 'Investment Fundamentals', lesson_count: 5 },
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
    // Unable to mock this test due to the complexity of the query and the need for a user_id parameter and user actions
    it('should return completed modules for a user', async () => {
      const mockModules = [
        { module_id: 1, title: 'Completed Module', lesson_count: 3 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockModules });

      const userId = 1;
      const result = await learning.getCompletedModules(userId);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE qa.user_id = $1 AND qa.passed = true'), [ userId ]);
      expect(result).toEqual(mockModules);
    });

    it('should handle errors and return error object', async () => {
      const error = new Error('DB Error');
      (pool.query as jest.Mock).mockRejectedValueOnce(error);

      const result = await learning.getCompletedModules(99);

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

      // Mock the query result as if the user has not completed the required quiz
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockModules });

      const userId = 1;
      const result = await learning.getUncompletedModules(userId);

      // Assert your SQL logic is invoked with a NOT EXISTS or appropriate condition
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('NOT EXISTS'), [ userId ]);
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
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockModule ] });

      const result = await learning.getModuleById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM learning_modules WHERE module_id = $1', [ 1 ]);
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

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE module_id = $1'), [ 1 ]);
      expect(result).toEqual(mockLessons);
    });
  });

  describe('getLessonById', () => {
    it('should return a lesson by ID', async () => {
      const mockLesson = { lesson_id: 1, title: 'Test Lesson' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockLesson ] });

      const result = await learning.getLessonById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM lessons WHERE lesson_id = $1', [ 1 ]);
      expect(result).toEqual(mockLesson);
    });
  });

  describe('getQuizByModuleId', () => {
    it('should return quiz for a module', async () => {
      const mockQuiz = { quiz_id: 1, module_id: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockQuiz ] });

      const result = await learning.getQuizByModuleId(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE module_id = $1'), [ 1 ]);
      expect(result).toEqual([ mockQuiz ]);
    });
  });

  describe('getQuizById', () => {
    it('should return a quiz by ID', async () => {
      const mockQuiz = { quiz_id: 1, title: 'Test Quiz' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockQuiz ] });

      const result = await learning.getQuizById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM quizzes WHERE quiz_id = $1', [ 1 ]);
      expect(result).toEqual(mockQuiz);
    });
  });

  describe('submitQuizAttempt', () => {
    const userId = 1;
    const quizId = 1;
    const attemptScore = 85;
    const passed = true;
    const mockAttempt = {
      attempt_id: 1,
      user_id: userId,
      quiz_id: quizId,
      attempt_score: attemptScore,
      passed,
      attempt_number: 1
    };

    beforeEach(() => {
      jest.clearAllMocks();

      // Default mock responses for successful first attempt
      (pool.query as jest.Mock)
        // 1. Get module difficulty (intermediate)
        .mockResolvedValueOnce(mockQueryResponse([ { difficulty: 'intermediate' } ]))
        // 2. Check if already passed (empty = first attempt)
        .mockResolvedValueOnce(mockQueryResponse([]))
        // 3. Check user points (empty = no points yet)
        .mockResolvedValueOnce(mockQueryResponse([]))
        // 4. Add points (20 for intermediate)
        .mockResolvedValueOnce(mockQueryResponse([]))
        // 5. Update tier status
        .mockResolvedValueOnce(mockQueryResponse([]))
        // 6. Insert attempt (success)
        .mockResolvedValueOnce(mockQueryResponse([ mockAttempt ]));
    });

    it('should submit a quiz attempt and award points for first pass', async () => {
      const result = await learning.submitQuizAttempt(userId, quizId, attemptScore, passed);

      expect(result).toEqual(mockAttempt);

      // Verify points were added (20 for intermediate)
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_points'),
        [ userId, 20 ]
      );

      // Verify the attempt was inserted
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO quiz_attempts'),
        [ userId, quizId, attemptScore, passed ]
      );
    });


    it('should not award points for subsequent passes', async () => {
      // Mock responses in exact order they're called
      (pool.query as jest.Mock)
        .mockReset()
        // 1. Get module difficulty (first query in function)
        .mockResolvedValueOnce({
          rows: [ { difficulty: 'beginner' } ]
        })
        // 2. Check if already passed (second query in function)
        .mockResolvedValueOnce({
          rows: [ {} ] // any row indicates already passed
        })
        // 3. Tier status update (happens before attempt insertion)
        .mockResolvedValueOnce({
          rowCount: 1
        })
        // 4. Insert the new attempt (final query)
        .mockResolvedValueOnce({
          rows: [ {
            attempt_id: 2,
            user_id: userId,
            quiz_id: quizId,
            attempt_score: 90,
            passed: true,
            attempt_number: 2
          } ]
        });

      const result = await learning.submitQuizAttempt(userId, quizId, 90, true);

      // Verify attempt was returned
      expect(result.attempt_id).toBe(2);
      expect(result.attempt_number).toBe(2);

      // Verify no points were added
      const allQueries = (pool.query as jest.Mock).mock.calls.map(call => call[ 0 ]);
      expect(allQueries.some(q =>
        q.includes('INSERT INTO user_points') ||
        q.includes('UPDATE user_points SET total_points')
      )).toBe(false);
    });

    it('should handle failed quiz submission', async () => {
      // Mock failed attempt insertion
      (pool.query as jest.Mock)
        .mockReset()
        // 1. Get module difficulty
        .mockResolvedValueOnce(mockQueryResponse([ { difficulty: 'beginner' } ]))
        // 2. Check if already passed
        .mockResolvedValueOnce(mockQueryResponse([]))
        // 3. Failed attempt insertion
        .mockResolvedValueOnce(mockQueryResponse([]));

      await expect(learning.submitQuizAttempt(userId, quizId, 50, false))
        .rejects.toThrow('Failed to submit quiz attempt');
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

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1'), [ 1 ]);
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

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = $1 AND quiz_id = $2'), [ 1, 1 ]);
      expect(result).toEqual(mockAttempts);
    });
  });

  describe('getLearningPerformance', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a number even with missing data', async () => {
      // Mock empty results for all queries
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [ {} ] }) // accuracy query
        .mockResolvedValueOnce({ rows: [ {} ] }); // points query

      const result = await learning.getLearningPerformance(1);

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(300);
      expect(result).toBeLessThanOrEqual(850);
    });

    it('should return minimum score for new users', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [ {
            total_passed: 0,
            total_attempts: 0,
            average_score: 0
          } ]
        })
        .mockResolvedValueOnce({
          rows: [ {
            quiz_points: 0
          } ]
        });

      const result = await learning.getLearningPerformance(1);
      expect(result).toBe(320); // Minimum score
    });

    it('should calculate proper score with data', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({
          rows: [ {
            total_passed: 8,
            total_attempts: 10,
            average_score: 85.5
          } ]
        })
        .mockResolvedValueOnce({
          rows: [ {
            quiz_points: 80
          } ]
        });

      const result = await learning.getLearningPerformance(1);
      expect(result).toBeGreaterThan(300);
      expect(result).toBeLessThanOrEqual(850);
    });
  });


  describe('getLearningSummary', () => {
    // In your test file (learning.test.ts)
    it('should return a comprehensive learning summary with all expected fields', async () => {
      // Mock all the database queries in order

      (pool.query as jest.Mock).mockImplementation((query: string) => {
        if (query.includes('SUM(CASE WHEN passed')) {
          return Promise.resolve({ rows: [ { quiz_points: '50' } ] });
        }
        if (query.includes('FROM quiz_attempts') && query.includes('COUNT(*)')) {
          return Promise.resolve({ rows: [ { total_attempts: '10' } ] });
        }
        if (query.includes('LEFT JOIN quiz_attempts')) {
          return Promise.resolve({ rows: [ { total_left: '3' } ] });
        }
        if (query.includes('FROM learning_modules')) {
          return Promise.resolve({ rows: [ { total_modules: '5' } ] });
        }
        if (query.includes('DISTINCT quiz_id')) {
          return Promise.resolve({ rows: [ { completed_quizzes: '2' } ] });
        }
        return Promise.resolve({ rows: [] });
      });

      const result = await learning.getLearningSummary(1);

      expect(result).toEqual({
        modules: 5,
        points: 50,
        total_attempts: 10,
        total_quizzes_left: 3,
        total_views: 1,
        score: expect.any(Number),
        percent: '40.00' // (2 completed / 5 total modules)
      });
    });
  });

});