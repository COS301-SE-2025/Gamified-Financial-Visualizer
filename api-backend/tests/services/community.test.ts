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

describe('Community Service', () => {
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

  describe('addCommunityMember', () => {
    it('should add a member successfully', async () => {
      const mockMember = {
        community_id: 1,
        user_id: 2,
        membership_status: 'accepted'
      };

      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockMember]
      });

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

  describe('getChallengesByUserCategorized', () => {
    it('should categorize challenges correctly', async () => {
      const mockRows = [
        {
          challenge_status: 'active',
          challenge_id: 1,
          challenge_title: 'Active Challenge',
          current_value: 50,
          target_amount: 100,
          end_date: new Date(Date.now() + 86400000).toISOString()
        },
        {
          challenge_status: 'upcoming',
          challenge_id: 2,
          challenge_title: 'Upcoming Challenge',
          current_value: 0,
          target_amount: 100,
          end_date: new Date(Date.now() + 86400000).toISOString()
        },
        {
          challenge_status: 'completed',
          challenge_id: 3,
          challenge_title: 'Completed Challenge',
          current_value: 100,
          target_amount: 100,
          end_date: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });

      const result = await service.getChallengesByUserCategorized(1);
      
      expect(result.active).toHaveLength(1);
      expect(result.upcoming).toHaveLength(1);
      expect(result.completed).toHaveLength(1);
      expect(result.active[0].title).toBe('Active Challenge');
      expect(result.upcoming[0].title).toBe('Upcoming Challenge');
      expect(result.completed[0].title).toBe('Completed Challenge');
    });

    it('should calculate progress correctly', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{
          challenge_status: 'active',
          challenge_id: 1,
          challenge_title: 'Test',
          current_value: 75,
          target_amount: 100,
          end_date: new Date().toISOString()
        }]
      });

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
