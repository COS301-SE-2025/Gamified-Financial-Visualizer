// tests/services/community.service.remaining.test.ts
import * as service from '../../modules/community/services/community.service';
import pool from '../../config/db';
import { logger } from '../../config/logger';

// Mock the database and logger (shared with existing tests—adjust as needed)
jest.mock('../../config/db', () => ({
  query: jest.fn(),
  connect: jest.fn(() =>
    Promise.resolve({
      query: jest.fn(),
      release: jest.fn(),
    })
  ),
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

  describe('updateCommunity', () => {
    it('should update community successfully', async () => {
      const updated = {
        community_id: 5,
        community_name: 'New Name',
        description: 'New Desc',
        bannerId: 3,
      };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [ updated ] });

      const result = await service.updateCommunity(5, {
        community_name: 'New Name',
        description: 'New Desc',
      });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE communities'),
        [ 5, 'New Name', 'New Desc' ]
      );
      expect(result).toEqual(updated);
    });

    it('should throw if community not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(
        service.updateCommunity(999, {
          community_name: 'X',
          description: 'Y',
        })
      ).rejects.toThrow('Community 999 not found');
    });
  });

  describe('listCommunitiesByUser', () => {
    it('should return list of communities', async () => {
      const mockRows = [ { community_id: 1 }, { community_id: 2 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });

      const result = await service.listCommunitiesByUser(10);
      expect(result).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT c.*'),
        [ 10 ]
      );
    });

    it('should log and throw on error', async () => {
      const err = new Error('db fail');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.listCommunitiesByUser(10)).rejects.toThrow(err);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to list communities for user ID 10:'),
        err
      );
    });
  });

  describe('getRecommendedCommunities', () => {
    it('should fetch recommended communities', async () => {
      const mockRows = [ { community_id: 7, community_name: 'Rec' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockRows });

      const result = await service.getRecommendedCommunities(42);
      expect(result).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [ 42 ]);
    });

    it('should handle db error', async () => {
      const err = new Error('fail');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.getRecommendedCommunities(1)).rejects.toThrow(err);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to fetch recommended communities for user ID 1:'),
        err
      );
    });
  });

  // get community members
  describe('getCommunityMembers', () => {
    it('should return community members', async () => {
      const members = [ { user_id: 1, username: 'user1' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: members });

      const result = await service.getCommunityMembers(3);
      expect(result).toEqual(members);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT u.user_id, u.username'),
        [ 3 ]
      );
    });

    it('should handle no members found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const result = await service.getCommunityMembers(99);
      expect(result).toEqual([]);
    });
  });

  describe('removeCommunityMember', () => {
    it('should remove member from community', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({}); // no return value expected
      await service.removeCommunityMember(1, 2);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM community_members'),
        [ 1, 2 ]
      );
    });
    it('should handle error on removal', async () => {
      const err = new Error('DB error');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.removeCommunityMember(1, 2)).rejects.toThrow(err);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("[CommunityService] Failed to remove user 2 from community 1:"),
        err
      );
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

      const result = await service.getCommunityInvites(3);
      expect(result).toEqual(invites);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT u.user_id, u.username'),
        [ 3 ]
      );
    });

    it('should handle no invites found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const result = await service.getCommunityInvites(99);
      expect(result).toEqual([]);
    });
  });

  describe('respondToInvite', () => {
    it('should update invite response', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({}); // no return value expected
      await service.respondToInvite(1, 2, 'accepted');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE community_members'),
        [ 'accepted', 1, 2 ]
      );
    });

    it('should handle error on response update', async () => {
      const err = new Error('DB error');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.respondToInvite(1, 2, 'declined')).rejects.toThrow(err);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("[CommunityService] Failed to update invite response for user ID 2 in community ID 1:"),
        err
      );
    });
  });

  describe('requestCommunityMembership', () => {
    it('should insert membership request', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({}); // no return value expected
      await service.requestCommunityMembership(3, 7);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO community_members'),
        [ 3, 7 ]
      );
    });

    it('should handle error on membership request', async () => {
      const err = new Error('DB error');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.requestCommunityMembership(3, 7)).rejects.toThrow(err);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("[CommunityService] Failed to request membership for user ID 7 in community ID 3:"),
        err
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

      const result = await service.getChallengesByUserCategorized(10);

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

      const result = await service.getAllBanners();
      expect(result).toEqual(banners);
    });

    it('should log failure', async () => {
      const err = new Error('banner fail');
      (pool.query as jest.Mock).mockRejectedValueOnce(err);
      await expect(service.getAllBanners()).rejects.toThrow(err);
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to fetch banners:'),
        err
      );
    });
  });

  describe('Membership & Invites', () => {
    it('getCommunityMembers returns members', async () => {
      const members = [ { user_id: 3, username: 'u' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: members });
      const result = await service.getCommunityMembers(5);
      expect(result).toEqual(members);
    });

    it('removeCommunityMember executes delete', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({}); // no return
      await expect(service.removeCommunityMember(1, 2)).resolves.toBeUndefined();
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM community_members'),
        [ 1, 2 ]
      );
    });

    it('getPendingInvites returns pending', async () => {
      const pending = [ { community_id: 9, membership_status: 'invited' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: pending });
      const result = await service.getPendingInvites(100);
      expect(result).toEqual(pending);
    });

    it('getCommunityInvites returns invites', async () => {
      const invites = [ { user_id: 4, username: 'x' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: invites });
      const result = await service.getCommunityInvites(2);
      expect(result).toEqual(invites);
    });

    it('respondToInvite updates status', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({}); // no return
      await expect(service.respondToInvite(1, 2, 'accepted')).resolves.toBeUndefined();
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE community_members'),
        [ 'accepted', 1, 2 ]
      );
    });

    it('requestCommunityMembership inserts request', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({});
      await expect(service.requestCommunityMembership(3, 7)).resolves.toBeUndefined();
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO community_members'),
        [ 3, 7 ]
      );
    });
  });

  describe('Challenge-related', () => {
    it('getCommunityChallenges returns rows', async () => {
      const rows = [ { challenge_id: 1 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows });
      const result = await service.getCommunityChallenges(8);
      expect(result).toEqual(rows);
    });

    it('getChallenge success path', async () => {
      const challenge = { challenge_id: 10, xp_points: 50, participantsCount: 5 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1, rows: [ challenge ] });
      const result = await service.getChallenge(10);
      expect(result).toEqual(challenge);
    });

    it('getChallenge not found throws', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });
      await expect(service.getChallenge(999)).rejects.toThrow('Challenge ID 999 not found.');
    });

    it('deleteChallengeById deletes', async () => {
      const deleted = { challenge_id: 20 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1, rows: [ deleted ] });
      const result = await service.deleteChallengeById(20);
      expect(result).toEqual(deleted);
    });

    it('deleteChallengeById not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });
      await expect(service.deleteChallengeById(999)).rejects.toThrow(
        'Challenge ID 999 not found.'
      );
    });

    it('getCategoriesWithCustom returns categories', async () => {
      const cats = [ { id: 1, name: 'global' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: cats });
      const result = await service.getCategoriesWithCustom(42);
      expect(result).toEqual(cats);
    });
  });

  describe('Social / Friends', () => {
    it('getUserID success', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1, rows: [ { user_id: 99 } ] });
      const result = await service.getUserID('john');
      expect(result).toBe(99);
    });

    it('getUserID not found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });
      await expect(service.getUserID('nope')).rejects.toThrow('No user found with username "nope"');
    });

    it('getUserFriendsWithAvatars returns data', async () => {
      const friends = [ { user_id: 1 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: friends });
      const result = await service.getUserFriendsWithAvatars(5);
      expect(result).toEqual(friends);
    });

    it('fetchAllUsers returns list', async () => {
      const users = [ { user_id: 2 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: users });
      const result = await service.fetchAllUsers();
      expect(result).toEqual(users);
    });

    it('getFriendRecommendations returns suggestions', async () => {
      const recs = [ { user_id: 7 } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: recs });
      const result = await service.getFriendRecommendations(1, 3);
      expect(result).toEqual(recs);
    });

    describe('friend request flow', () => {
      it('sendFriendRequest succeeds when no existing', async () => {
        (pool.query as jest.Mock)
          .mockResolvedValueOnce({ rowCount: 0, rows: [] }) // existing check
          .mockResolvedValueOnce({ rows: [ { user_id: 1, friend_id: 2 } ] }); // insert
        const result = await service.sendFriendRequest(1, 2);
        expect(result).toEqual({ user_id: 1, friend_id: 2 });
      });

      it('sendFriendRequest fails if same user', async () => {
        await expect(service.sendFriendRequest(3, 3)).rejects.toThrow(
          'You cannot send a friend request to yourself silly.'
        );
      });

      it('sendFriendRequest error on already accepted', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({
          rowCount: 1,
          rows: [ { relationship_status: 'accepted' } ],
        });
        await expect(service.sendFriendRequest(1, 2)).rejects.toThrow(
          'You are already friends with this user.'
        );
      });

      it('respondToFriendRequests updates', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({
          rowCount: 1,
          rows: [ { relationship_status: 'accepted' } ],
        });
        const res = await service.respondToFriendRequests(5, 6, 'accepted');
        expect(res.relationship_status).toBe('accepted');
      });

      it('respondToFriendRequests no such friendship', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });
        await expect(
          service.respondToFriendRequests(5, 6, 'declined')
        ).rejects.toThrow();
      });

      it('getFriendshipStatus returns status', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({
          rows: [ { user_id: 1, friend_id: 2, status: 'pending' } ],
        });
        const status = await service.getFriendshipStatus(1, 2);
        expect(status.status).toBe('pending');
      });

      it('deleteFriend deletes friendship', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1, rows: [ { user_id: 1 } ] });
        const deleted = await service.deleteFriend(1, 2);
        expect(deleted).toEqual({ user_id: 1 });
      });

      it('deleteFriend not found', async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });
        await expect(service.deleteFriend(1, 2)).rejects.toThrow(
          'No friendship found between 1 and 2'
        );
      });
    });
  });

  describe('Leaderboard / Stats', () => {
    it('getGlobalLeaderboard returns rows', async () => {
      const rows = [ { username: 'a' } ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows });
      const result = await service.getGlobalLeaderboard();
      expect(result).toEqual(rows);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Global leaderboard fetched')
      );
    });

    it('getCommunityStats success path', async () => {
      // stub pool.connect to return client with promised queries
      const mockClient: any = {
        query: jest.fn()
          // communities count
          .mockResolvedValueOnce({ rows: [ { count: '2' } ] })
          // challenges count
          .mockResolvedValueOnce({ rows: [ { count: '5' } ] })
          // leaderboard rank
          .mockResolvedValueOnce({ rows: [ { ranking: 3 } ] })
          // games played
          .mockResolvedValueOnce({ rows: [ { count: '7' } ] })
          // friends
          .mockResolvedValueOnce({ rows: [ { count: '4' } ] })
          // social posts count
          .mockResolvedValueOnce({ rows: [ { count: '10' } ] }),  // Mock the socialPosts count query here
        release: jest.fn(),
      };
      (pool.connect as jest.Mock).mockResolvedValueOnce(mockClient);

      const result = await service.getCommunityStats(11);
      
      // Assertions
      expect(result.communities).toBe(2);
      expect(result.challenges).toBe(5);
      expect(result.leaderboard).toBe(3);
      expect(result.gamesPlayed).toBe(7);
      expect(result.friends).toBe(4);
      expect(result.socialPosts).toBe(10);  // Add assertion for socialPosts here
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('getCommunityPerformanceSummary fallback/score computation', async () => {
      // Simplified row for performance summary
      const perfRow: any = {
        avatar_image_path: 'a.png',
        total_points: 5000,
        tier_status: 'Gold',
        challenges: 10,
        leaderboard: 50,
        games_played: 20,
        communities: 3,
        friends: 5,
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({}) // initial insert
        .mockResolvedValueOnce({ rows: [ perfRow ] }); // select stats

      const result = await service.getCommunityPerformanceSummary(9);
      expect(result).toHaveProperty('performance_score');
      expect(result).toHaveProperty('performance_label');
    });
  });

  describe('getCommunityByTitle', () => {
    it('returns community with contributions attached', async () => {
      const communityRow: any = { community_id: 100, community_name: 'Fun' };
      // First call: community select
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [ communityRow ] })
        // Second call: contribution scores query used inside helper
        .mockResolvedValueOnce({
          rows: [
            {
              user_id: 1,
              name: 'u',
              total_user_progress: 50,
              total_target: 100,
            },
          ],
        });

      const result: any = await service.getCommunityByTitle('Fun');

      expect(result.community_id).toBe(100);
      expect(result.contributions).toEqual([
        { userId: 1, name: 'u', score: 50 },
      ]);
    });

    it('throws when no community found', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      await expect(service.getCommunityByTitle('Nope')).rejects.toThrow('No community "Nope"');
    });

    it('propagates error when contribution helper fails', async () => {
      const communityRow: any = { community_id: 101, community_name: 'Broken' };
      // Community fetch succeeds
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [ communityRow ] })
        // Contribution helper fails with rejection
        .mockRejectedValueOnce(new Error('DB bad'));

      await expect(service.getCommunityByTitle('Broken')).rejects.toThrow(
        'Could not fetch contribution scores.'
      );
    });
  });

});