import {
  createGoal,
  getGoal,
  getUserGoals,
  getGoalsSummary,
  getGoalCategorySummary,
  updateGoal,
  deleteGoal,
  getTotalGoalValue,
  addGoalProgress,
  getWeeklyGoalCompletions,
  calculateGoalPerformance,
  completeGoal,
  reduceGoalProgress,
  getAllGoals,
  getUserGoalStats,
  getUpcomingGoals,
  Goal,
} from '../../modules/goals/services/goals.service';
import pool from '../../config/db';
import { logger } from '../../config/logger';
import { normalizeQuery } from '../test-utils'

// Mock the database pool and logger
jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

const testGoal: Goal = {
  goal_name: 'Test Goal',
  goal_type: 'savings',
  target_amount: 1000,
  start_date: '2023-01-01',
  target_date: '2023-12-31',
};

const testUserGoal: Goal = {
  ...testGoal,
  user_id: 1,
  goal_id: 1,
  current_amount: 500,
  goal_status: 'in-progress',
};

describe('Goal Service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGoal', () => {
    it('should create a new goal and return its ID', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { goal_id: 1 } ] });

      const result = await createGoal(testGoal);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO goals'),
        [
          null, // user_id
          testGoal.goal_name,
          testGoal.goal_type,
          testGoal.target_amount,
          0, // current_amount default
          testGoal.start_date,
          testGoal.target_date,
          'in-progress', // goal_status default
          1, // banner_id default
          undefined, // category_id
          undefined, // custom_category_id
        ]
      );
      expect(result).toBe(1);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Created goal ID=1')
      );
    });

    it('should create a user-specific goal when user_id is provided', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { goal_id: 2 } ] });

      const result = await createGoal({ ...testGoal, user_id: 1 });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO goals'),
        expect.arrayContaining([ 1 ]) // user_id
      );
      expect(result).toBe(2);
    });

    it('should log and rethrow database errors', async () => {
      const error = new Error('DB Error');
      (pool.query as jest.Mock).mockRejectedValueOnce(error);

      await expect(createGoal(testGoal)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error creating goal:'),
        error
      );
    });
  });

  describe('getGoal', () => {
    it('should return a goal by ID', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ testUserGoal ] });

      const result = await getGoal(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM goals WHERE goal_id = $1;',
        [ 1 ]
      );
      expect(result).toEqual(testUserGoal);
    });

    it('should return null for non-existent goal', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getGoal(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserGoals', () => {
    it('should return all goals for a user', async () => {
      const mockGoals = [ testUserGoal, { ...testUserGoal, goal_id: 2 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockGoals });

      const result = await getUserGoals(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC;',
        [ 1 ]
      );
      expect(result).toEqual(mockGoals);
    });

    it('should log when no goals found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getUserGoals(1);

      expect(result).toEqual([]);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('No goals found for user 1')
      );
    });
  });

  describe('getGoalsSummary', () => {
    it('should return goal summary statistics', async () => {
      const mockSummary = {
        total_goals: 5,
        completed_goals: 2,
        in_progress_goals: 2,
        paused_goals: 1,
        cancelled_goals: 0,
        failed_goals: 0,
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockSummary ] });

      const result = await getGoalsSummary(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) FILTER'),
        [ 1 ]
      );
      expect(result).toEqual(mockSummary);
    });
  });

  // Utility function for SQL normalization in tests
  const normalize = (sql: string) => sql.replace(/\s+/g, ' ').trim().toLowerCase();

  describe('getGoalCategorySummary', () => {
    it('should return goal counts by category', async () => {
      const mockCategories = [
        { goal_type: 'savings', count: 3 },
        { goal_type: 'investment', count: 2 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockCategories });

      const result = await getGoalCategorySummary(1);

      expect(
        normalize((pool.query as jest.Mock).mock.calls[ 0 ][ 0 ])
      ).toBe(
        normalize('SELECT goal_type, COUNT(*) AS count FROM goals WHERE user_id = $1 GROUP BY goal_type')
      );
      expect(result).toEqual(mockCategories);
    });
  });


  describe('updateGoal', () => {
    it('should update specified goal fields', async () => {
      const updates = {
        goal_name: 'Updated Goal',
        target_amount: 1500,
      };

      await updateGoal(1, updates);

      expect(normalizeQuery((pool.query as jest.Mock).mock.calls[0][0])).toBe(
        normalizeQuery('UPDATE goals SET goal_name = $1, target_amount = $2 WHERE goal_id = $3;')
      );
      expect((pool.query as jest.Mock).mock.calls[0][1]).toEqual([ updates.goal_name, updates.target_amount, 1 ]);

    });

    it('should do nothing if no updates provided', async () => {
      await updateGoal(1, {});

      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal by ID', async () => {
      await deleteGoal(1);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM goals WHERE goal_id = $1;',
        [ 1 ]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Deleted goal ID=1')
      );
    });
  });

  describe('getTotalGoalValue', () => {
    it('should return sum of all goal targets for user', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { total_goal_value: 5000 } ] });

      const result = await getTotalGoalValue(1);

      expect(result).toBe(5000);
    });

    it('should return 0 when no goals exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { total_goal_value: null } ] });

      const result = await getTotalGoalValue(1);

      expect(result).toBe(0);
    });
  });

  describe('addGoalProgress', () => {
    it('should add progress to a goal and return progress ID', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { progress_id: 101 } ] });

      const result = await addGoalProgress(1, 1, 100);

      expect(normalizeQuery((pool.query as jest.Mock).mock.calls[0][0])).toBe(
        normalizeQuery('INSERT INTO goal_progress (goal_id, contributor_id, amount_added) VALUES ($1, $2, $3) RETURNING progress_id;')
      );
      expect((pool.query as jest.Mock).mock.calls[0][1]).toEqual([ 1, 1, 100 ]);
      expect(result).toBe(101);
    });
  });

  describe('getWeeklyGoalCompletions', () => {
    it('should return weekly completion counts', async () => {
      const mockCompletions = [
        { day: 'Mon', count: 2 },
        { day: 'Wed', count: 1 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockCompletions });

      const result = await getWeeklyGoalCompletions(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('TO_CHAR(progress_date, \'Dy\') AS day'),
        [ 1 ]
      );
      expect(result).toEqual(mockCompletions);
    });
  });

  describe('calculateGoalPerformance', () => {
    it('should calculate performance score based on goal metrics', async () => {
      const mockStats = {
        completed: 3,
        failed: 1,
        total: 5,
        avg_progress: 0.6,
        streak_count: 4,
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockStats ] });

      const result = await calculateGoalPerformance(1);

      // Test calculation:
      // completedScore = (3/5)*200 = 120
      // progressScore = 0.6*150 = 90
      // streakScore = (4/5)*100 = 80
      // penalty = (1/5)*50 = 10
      // Total = 120 + 90 + 80 - 10 = 280
      expect(result).toBe(280);
    });

    it('should return 0 when no goals exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ { total: 0 } ] });

      const result = await calculateGoalPerformance(1);

      expect(result).toBe(0);
    });
  });

  describe('completeGoal', () => {
    it('should mark goal as completed and award points', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({}) // update goal
        .mockResolvedValueOnce({}); // update points

      await completeGoal(1, 15);

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE goals SET goal_status = 'completed' WHERE goal_id = $1;",
        [ 1 ]
      );
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_points'),
        [ 1, 15 ]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Completed goal ID=1, awarded 15 points')
      );
    });
  });

describe('reduceGoalProgress', () => {
  it('should reduce progress and deduct points', async () => {
    // Mock the pool queries
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({}) // First update
      .mockResolvedValueOnce({}); // Second update

    await reduceGoalProgress(1, 100, 10);

    // Get all query calls
    const queryCalls = (pool.query as jest.Mock).mock.calls;

    // Verify first query (goal update)
    expect(normalizeQuery(queryCalls[0][0])).toBe(
      normalizeQuery(`
        UPDATE goals
        SET current_amount = current_amount - $1
        WHERE goal_id = $2;
      `)
    );
    expect(queryCalls[0][1]).toEqual([100, 1]);

    // Verify second query (points update)
    expect(normalizeQuery(queryCalls[1][0])).toBe(
      normalizeQuery(`
        UPDATE user_points
        SET total_points = total_points - $2, last_updated = CURRENT_TIMESTAMP
        WHERE user_id = (SELECT user_id FROM goals WHERE goal_id = $1);
      `)
    );
    expect(queryCalls[1][1]).toEqual([1, 10]); // Note: 10 is the points deducted
  });
});

  describe('getAllGoals', () => {
    it('should return all goals sorted by creation date', async () => {
      const mockGoals = [ testUserGoal, { ...testUserGoal, goal_id: 2 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockGoals });

      const result = await getAllGoals();

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM goals ORDER BY created_at DESC;'
      );
      expect(result).toEqual(mockGoals);
    });
  });

  describe('getUserGoalStats', () => {
    it('should return user goal statistics', async () => {
      const mockStats = {
        total_goals: 3,
        completed_goals: 1,
        total_saved: 2500,
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ mockStats ] });

      const result = await getUserGoalStats(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) FILTER'),
        [ 1 ]
      );
      expect(result).toEqual(mockStats);
    });
  });

  describe('getUpcomingGoals', () => {
    it('should return goals due within next 30 days', async () => {
      const mockGoals = [
        { ...testUserGoal, target_date: new Date(Date.now() + 86400000).toISOString() }, // tomorrow
        { ...testUserGoal, goal_id: 2, target_date: new Date(Date.now() + 86400000 * 7).toISOString() }, // 7 days
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockGoals });

      const result = await getUpcomingGoals(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("target_date <= CURRENT_DATE + INTERVAL '30 days'"),
        [ 1 ]
      );
      expect(result).toEqual(mockGoals);
    });
  });
  
});