// api-backend/tests/unittttt/achievement.test.ts
import pool from '../../config/db';
import { redisClient, redisSubscriber } from '../../config/redis';
import { logger } from '../../config/logger';
import {
  getAllAchievements,
  ensureUserAchievements,
  getUserAchievements,
  updateAchievementsForEvent,
  AchievementDefinition,
} from '../../modules/achievements/services/achievement.service';

jest.mock('../../config/db');
jest.mock('../../config/logger', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));
jest.mock('../../config/redis', () => ({
  redisClient: { on: jest.fn(), connect: jest.fn() },
  redisSubscriber: { on: jest.fn(), connect: jest.fn() },
}));

describe('Achievement Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAchievements', () => {
    it('should fetch definitions and prepend the image path', async () => {
      const mockRows = [
        {
          achievement_id: 1,
          parent_id: null,
          badge_id: 10,
          achievement_title: 'First',
          achievement_description: 'Desc',
          achievement_type: 'transaction',
          points_awarded: 5,
          trigger_condition_json: {},
          is_umbrella: false,
          display_order: 1,
          image_path: 'badge.png',
          rarity: 'Rare',
        },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });

      const result = await getAllAchievements();

      // SQL is called
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM achievements a'),
      );
      // Mapping and path prefixing
      expect(result).toEqual([
        {
          ...mockRows[0],
          image_path: '../../assets/Images/badge.png',
        },
      ]);
    });
  });

  describe('ensureUserAchievements', () => {
    it('should run the INSERT ... WHERE NOT EXISTS query', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({});

      await ensureUserAchievements(42);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_achievements'),
        [42],
      );
    });
  });

  describe('getUserAchievements', () => {
    it('should first ensure, then select and prepend badge path', async () => {
      // First call: ensureUserAchievements → pool.query
      // Second call: the SELECT …
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // ensureUserAchievements
        .mockResolvedValueOnce({
          rows: [
            {
              user_id: 7,
              achievement_id: 99,
              progress_value: 3,
              achievement_status: 'incomplete',
              awarded_at: '2025-08-03T12:00:00Z',
              achievement_title: 'A',
              achievement_description: 'B',
              points_awarded: 2,
              badge_image_path: 'icon.png',
              rarity: 'Common',
            },
          ],
        });

      const result = await getUserAchievements(7);

      // ensureUserAchievements call
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('INSERT INTO user_achievements'),
        [7],
      );
      // select call
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('SELECT ua.user_id'),
        [7],
      );
      expect(result).toEqual([
        {
          user_id: 7,
          achievement_id: 99,
          progress_value: 3,
          achievement_status: 'incomplete',
          awarded_at: '2025-08-03T12:00:00Z',
          achievement_title: 'A',
          achievement_description: 'B',
          points_awarded: 2,
          badge_image_path: '../../assets/Images/icon.png',
          rarity: 'Common',
        },
      ]);
    });
  });

  describe('updateAchievementsForEvent', () => {
    it('should increment progress and mark complete when condition met', async () => {
      const defs: AchievementDefinition = {
        achievement_id: 5,
        parent_id: null,
        badge_id: 2,
        achievement_title: 'Tcount',
        achievement_description: '',
        achievement_type: 'transaction',
        points_awarded: 10,
        trigger_condition_json: {
          type: 'transaction_count',
          operator: '>=',
          value: 3,
        },
        is_umbrella: false,
        display_order: 1,
      };

      // 1) defsSql
      // 2) ensureUserAchievements
      // 3) progSql → return current progress = 1
      // 4) update (complete)
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [defs] })
        .mockResolvedValueOnce({}) // ensure
        .mockResolvedValueOnce({ rows: [{ progress_value: '1' }] })
        .mockResolvedValueOnce({}); // update

      await updateAchievementsForEvent(123, 'transaction', 3);

      // definitions fetch
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM achievements'),
        ['transaction'],
      );
      // ensureUserAchievements
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO user_achievements'),
        [123],
      );
      // progress fetch
      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('SELECT progress_value'),
        [123, 5],
      );
      // update call: progress is capped at threshold (3), status = 'complete'
      expect(pool.query).toHaveBeenNthCalledWith(
        4,
        expect.stringContaining('UPDATE user_achievements'),
        [3, 'complete', 123, 5],
      );
    });

    it('should do nothing when inc is zero', async () => {
      const defs: AchievementDefinition = {
        achievement_id: 7,
        parent_id: null,
        badge_id: 3,
        achievement_title: 'NoOp',
        achievement_description: '',
        achievement_type: 'transaction',
        points_awarded: 0,
        trigger_condition_json: {
          type: 'single_transaction',
          min_amount: 100,
        },
        is_umbrella: false,
        display_order: 1,
      };

      // defsSql
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [defs] })
        .mockResolvedValueOnce({}); // ensure

      await updateAchievementsForEvent(99, 'transaction', 50);

      // definitions fetch only, no further queries
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM achievements'),
        ['transaction'],
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO user_achievements'),
        [99],
      );
    });
  });
});
