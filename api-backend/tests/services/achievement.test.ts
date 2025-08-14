// api-backend/tests/unit/achievement.service.test.ts
import pool from '../../config/db';
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

describe('Achievement Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAchievements', () => {
    it('fetches umbrella rows, parses/normalizes fields, and prefixes image path', async () => {
      const mockRows = [
        {
          achievement_id: '1',
          parent_id: null,
          badge_id: '10',
          achievement_title: 'First',
          achievement_description: 'Desc',
          achievement_type: 'transaction',
          points_awarded: '5',
          trigger_condition_json: '{}',             // can be string from DB
          is_umbrella: true,
          display_order: '1',
          image_path: 'badges/accepted.png',        // relative path
          rarity: 'Rare',
          child_task_count: '4',                    // aggregated counts often strings
          completed_task_count: '2',
        },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });

      const result = await getAllAchievements(7);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM achievements a'),
        [7]
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          achievement_id: 1,
          parent_id: null,
          badge_id: 10,
          achievement_title: 'First',
          achievement_description: 'Desc',
          achievement_type: 'transaction',
          points_awarded: 5,
          trigger_condition_json: {},               // parsed
          is_umbrella: true,
          display_order: 1,
          image_path: '../../assets/Images/badges/accepted.png', // prefixed
          rarity: 'Rare',
          child_task_count: 4,                      // coerced to number
          completed_task_count: 2,
        })
      );
    });
  });

  describe('ensureUserAchievements', () => {
    it('runs INSERT ... WHERE NOT EXISTS', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({});
      await ensureUserAchievements(42);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_achievements'),
        [42]
      );
    });
  });

  describe('getUserAchievements', () => {
    it('ensures rows, then selects and prefixes badge path', async () => {
      (pool.query as jest.Mock)
        // ensureUserAchievements
        .mockResolvedValueOnce({ rows: [] })
        // select user achievements
        .mockResolvedValueOnce({
          rows: [
            {
              user_id: '7',
              achievement_id: '99',
              progress_value: '3',
              achievement_status: 'incomplete',
              awarded_at: '2025-08-03T12:00:00Z',
              achievement_title: 'A',
              achievement_description: 'B',
              points_awarded: '2',
              badge_image_path: 'icons/icon.png',
              rarity: 'Common',
            },
          ],
        });

      const result = await getUserAchievements(7);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('INSERT INTO user_achievements'),
        [7]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('SELECT ua.user_id'),
        [7]
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
          badge_image_path: '../../assets/Images/icons/icon.png',
          rarity: 'Common',
        },
      ]);
    });
  });

  describe('updateAchievementsForEvent', () => {
    it('increments progress and completes when threshold met (transaction_count)', async () => {
      const defsRow: Partial<AchievementDefinition> = {
        achievement_id: 5,
        parent_id: null,
        badge_id: 2,
        achievement_title: 'Tcount',
        achievement_description: '',
        achievement_type: 'transaction',
        points_awarded: 10,
        trigger_condition_json: { type: 'transaction_count', operator: '>=', value: 3 },
        is_umbrella: false,
        display_order: 1,
      };

      (pool.query as jest.Mock)
        // defsSql
        .mockResolvedValueOnce({ rows: [defsRow] })
        // ensureUserAchievements
        .mockResolvedValueOnce({})
        // current progress
        .mockResolvedValueOnce({ rows: [{ progress_value: '1' }] })
        // update to complete
        .mockResolvedValueOnce({});

      await updateAchievementsForEvent(123, 'transaction', 3);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM achievements'),
        ['transaction']
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO user_achievements'),
        [123]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('SELECT progress_value'),
        [123, 5]
      );
      // capped at threshold (3), status complete
      expect(pool.query).toHaveBeenNthCalledWith(
        4,
        expect.stringContaining('UPDATE user_achievements'),
        [3, 'complete', 123, 5]
      );
    });

    it('skips when increment is zero (single_transaction below min)', async () => {
      const defsRow: Partial<AchievementDefinition> = {
        achievement_id: 7,
        parent_id: null,
        badge_id: 3,
        achievement_title: 'NoOp',
        achievement_description: '',
        achievement_type: 'transaction',
        points_awarded: 0,
        trigger_condition_json: { type: 'single_transaction', min_amount: 100 },
        is_umbrella: false,
        display_order: 1,
      };

      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [defsRow] }) // defs
        .mockResolvedValueOnce({});                 // ensure

      await updateAchievementsForEvent(99, 'transaction', 50);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM achievements'),
        ['transaction']
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO user_achievements'),
        [99]
      );
    });
  });
});
