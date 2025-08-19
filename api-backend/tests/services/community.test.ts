// tests/services/community.service.test.ts
import * as service from '../../modules/community/services/community.service';
import pool from '../../config/db';
import { logger } from '../../config/logger';

// Mock the database and logger
jest.mock('../../config/db', () => ({
  query: jest.fn(),
  connect: jest.fn(() => Promise.resolve({
    query: jest.fn(),
    release: jest.fn(),
  })),
}));

jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Import the mocked redisClient for use in tests
import { redisClient } from '../../config/redis';

// Stub Redis so tests never connect to a real instance
jest.mock('../../config/redis', () => ({
  redisClient: { get: jest.fn().mockResolvedValue(null), set: jest.fn() },
}));


// Helper to get the mocked client for pool.connect usage
const getMockClient = () =>
  Promise.resolve({
    query: jest.fn(),
    release: jest.fn(),
  });

describe('Community Service - additional functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCommunity', () => {
    it('should create a community successfully', async () => {
      const mockCommunity = {
        owner_id: 1,
        community_name: 'Test Community',
        description: 'Test description',
        banner_id: 2,
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          community_id: 1,
          ...mockCommunity
        }]
      });

      const result = await service.createCommunity(mockCommunity);
      
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO communities'),
        [1, 'Test Community', 'Test description', 2]
      );
      expect(result).toHaveProperty('community_id', 1);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Created community: Test Community')
      );
    });

    it('should handle database errors', async () => {
      const mockCommunity = {
        owner_id: 1,
        community_name: 'Test Community',
      };

      const mockError = new Error('Database error');
      (pool.query as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(service.createCommunity(mockCommunity)).rejects.toThrow(mockError);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create community'),
        mockError
      );
    });
  });

  describe('getCommunityById', () => {
    it('should return a community', async () => {
      const mockCommunity = {
        community_id: 1,
        community_name: 'Test Community',
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockCommunity]
      });

      const result = await service.getCommunityById(1);
      expect(result).toEqual(mockCommunity);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM communities WHERE community_id = $1',
        [1]
      );
    });

    it('should return undefined for non-existent community', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: []
      });

      const result = await service.getCommunityById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getPendingInvites', () => {
    it('should return pending invites for user', async () => {
      const pending = [ { community_id: 1, membership_status: 'invited' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: pending });

      const result = await service.getPendingInvites(5);
      expect(result).toEqual(pending);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT[\s\S]*community_id[\s\S]*membership_status/),
        [ 5 ]
      );
    });

    it('should handle no pending invites', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const result = await service.getPendingInvites(10);
      expect(result).toEqual([]);
    });
  });

  describe('getCommunityInvites', () => {
    it('should return invites for community', async () => {
      const invites = [ { user_id: 2, username: 'invitee' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: invites });

      const result = await service.addCommunityMember(1, 2, 'accepted');
      expect(result).toEqual(mockMember);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Membership updated: user 2 in community 1')
      );
    });

    it('should handle membership status updates', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          community_id: 1,
          user_id: 2,
          membership_status: 'invited'
        }]
      });

      await service.addCommunityMember(1, 2, 'invited');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO community_members'),
        [1, 2, 'invited']
      );
    });
  });

  describe('getCommunityChallenges', () => {
    const mockCommunityId = 5;
    let redisGetSpy: jest.SpyInstance;
    let redisSetSpy: jest.SpyInstance;
    let poolQuerySpy: jest.SpyInstance;
    let updateChallengeStateSpy: jest.SpyInstance;
    let loggerInfoSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();

      // Common mocks
      redisGetSpy = jest.spyOn(redisClient, 'get');
      redisSetSpy = jest.spyOn(redisClient, 'set');
      poolQuerySpy = jest.spyOn(pool, 'query');
      updateChallengeStateSpy = jest.spyOn(service, 'updateChallengeState').mockResolvedValue(undefined);
      loggerInfoSpy = jest.spyOn(logger, 'info');
      loggerErrorSpy = jest.spyOn(logger, 'error');
    });

    it('should return challenges from database when cache is empty', async () => {
      // Arrange
      const mockChallenges = [ {
        challenge_id: 1,
        challenge_title: 'Challenge 1'
      } ];

      poolQuerySpy.mockResolvedValue({ rows: mockChallenges });

      // Act
      const result = await service.getCommunityChallenges(mockCommunityId);

      // Assert
      expect(result).toEqual(mockChallenges);
      expect(poolQuerySpy).toHaveBeenCalledWith(expect.any(String), [ mockCommunityId ]);
      expect(loggerInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Retrieved challenges for community ID ${mockCommunityId}`)
      );
    });

    it('should handle no challenges found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const result = await service.getCommunityChallenges(99);
      expect(result).toEqual([]);
      expect(poolQuerySpy).toHaveBeenCalled();
    });
  });

  describe('getChallengesByUserCategorized', () => {
    it('should return categorized challenges for user', async () => {
      // raw rows as the SQL would return them
      const now = new Date();
      const future = new Date(now.getTime() + 2 * 86400000).toISOString(); // upcoming
      const past = new Date(now.getTime() - 2 * 86400000).toISOString(); // completed
      const activeRow = {
        challenge_id: 1,
        challenge_title: 'Active Challenge',
        challenge_status: 'active', // Must match exactly
        challenge_type: 'donation',
        category_id: 1,
        target_amount: 100,
        current_value: 50,
        actual_start: new Date(Date.now() - 86400000).toISOString(), // Started 1 day ago
        end_date: new Date(Date.now() + 86400000).toISOString(), // Ends in 1 day
        difficulty: 'easy',
        community_name: 'Test Community',
        banner_image_path: '/test.jpg',
        participants: 3
      };
      const upcomingRow = {
        challenge_status: 'upcoming',
        challenge_id: 2,
        challenge_title: 'Upcoming Challenge',
        challenge_type: 'type',
        category_id: 6,
        target_amount: 200,
        current_value: 0,
        actual_start: new Date(now.getTime() + 5 * 86400000).toISOString(), // starts later
        actual_end: null,
        difficulty: 'easy',
        end_date: future,
        community_name: 'Comm',
        banner_image_path: 'banner.png',
        participants: 2,
      };
      const completedRow = {
        challenge_status: 'completed',
        challenge_id: 3,
        challenge_title: 'Completed Challenge',
        challenge_type: 'type',
        category_id: 7,
        target_amount: 150,
        current_value: 150,
        actual_start: past,
        actual_end: past,
        difficulty: 'hard',
        end_date: past,
        community_name: 'Comm',
        banner_image_path: 'banner.png',
        participants: 1,
      };
      const expiredRow = {
        challenge_status: 'expired',
        challenge_id: 4,
        challenge_title: 'Expired Challenge',
        challenge_type: 'type',
        category_id: 8,
        target_amount: 100,
        current_value: 100,
        actual_start: past,
        actual_end: past,
        difficulty: 'medium',
        end_date: past,
        community_name: 'Comm',
        banner_image_path: 'banner.png',
        participants: 0,
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [ activeRow, upcomingRow, completedRow, expiredRow ],
      });

      const result = await service.getChallengesByUserCategorized(1);
      
      expect(result.active).toHaveLength(1);
      expect(result.upcoming).toHaveLength(1);
      expect(result.completed).toHaveLength(1);
      expect(result.expired).toHaveLength(1);

      expect(result.active[ 0 ].title).toBe('Active Challenge');
      expect(result.upcoming[ 0 ].title).toBe('Upcoming Challenge');
      expect(result.completed[ 0 ].title).toBe('Completed Challenge');
      expect(result.expired[ 0 ].title).toBe('Expired Challenge');

      // progress calculation sanity check
      expect(result.active[ 0 ].progress).toBe(
        Math.min(Math.round((50 / 100) * 100), 100)
      );
      expect(result.completed[ 0 ].completedOn).toBe(
        new Date(completedRow.end_date).toISOString().split('T')[ 0 ]
      );
    });
    it('should propagate database errors', async () => {
      const err = new Error('DB fail');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.getChallengesByUserCategorized(10)).rejects.toThrow(err);
    });

  });

  describe('getAllBanners', () => {
    it('should return banner list', async () => {
      const banners = [ { banner_id: 1, banner_image_path: 'a.png' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: banners });

      const result = await service.getChallengesByUserCategorized(1);
      expect(result.active[0].progress).toBe(75);
      expect(result.active[0].progressText).toBe('75% complete');
    });
  });

  describe('createChallenge', () => {
    it('should create a challenge with calculated XP', async () => {
      const mockChallenge = {
        creator_id: 1,
        community_id: 1,
        challenge_title: 'Save 1000',
        challenge_type: 'savings',
        measurement_type: 'amount',
        target_amount: 1000,
        start_date: '2023-01-01',
        target_date: '2023-12-31',
        category_id: 1
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ ...mockChallenge, challenge_id: 1, xp_reward: 10 }]
      });

      const result = await service.createChallenge(mockChallenge);
      expect(result.xp_reward).toBe(10);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO challenges'),
        expect.arrayContaining([1000, 10])
      );
    });

    it('should validate category requirements', async () => {
      const mockChallenge = {
        creator_id: 1,
        community_id: 1,
        challenge_title: 'Invalid',
        target_amount: 100,
        start_date: '2023-01-01',
        target_date: '2023-01-31'
      };

      await expect(service.createChallenge(mockChallenge as any)).rejects.toThrow(
        "Exactly one of 'category_id' or 'custom_category_id' must be provided"
      );
    });
  });

  describe('deleteCommunityById', () => {
    it('should delete a community', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ community_id: 1 }]
      });

      await service.deleteCommunityById(1);
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM communities WHERE community_id = $1 RETURNING *;',
        [1]
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Deleted community ID 1')
      );
    });

    it('should throw if community not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 0
      });

      await expect(service.deleteCommunityById(999)).rejects.toThrow(
        'Community ID 999 not found'
      );
    });
  });

})
