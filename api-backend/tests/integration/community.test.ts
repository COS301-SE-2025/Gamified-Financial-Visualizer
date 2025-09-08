// api-backend/tests/integration/communityRoutes.test.ts
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import communityRouter from '../../modules/community/routes/communityRoutes';
import * as communityService from '../../modules/community/services/community.service';
import * as authService from '../../modules/auth/services/auth.service';
import { notifyUser } from '../../modules/notifications/services/notifications.services';
import { logger } from '../../config/logger';
import { Server } from 'http';

// Mock or import the pool used for DB connections
const pool = {
   connect: jest.fn(),
   end: jest.fn().mockResolvedValue(undefined), // Ensure end() returns a promise
   query: jest.fn() // Add query mock if needed
};


// Stub Redis so importing the router won't error
jest.mock('../../config/redis', () => ({
   redisClient: { on: jest.fn(), connect: jest.fn() },
   redisSubscriber: { on: jest.fn(), connect: jest.fn() },
}));

// Mock all communityService functions we’ll call
jest.mock('../../modules/community/services/community.service');
// Mock authService for any calls to getUserById
jest.mock('../../modules/auth/services/auth.service');
// Mock notifications
jest.mock('../../modules/notifications/services/notifications.services');
// Mock logger
jest.mock('../../config/logger', () => ({
   logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/community', communityRouter);

describe('Community API Integration', () => {
   let server: Server;

   beforeAll((done) => {
      server = app.listen(0, done); // Start the server on a random available port
   });

   beforeEach(() => {
      jest.clearAllMocks();
   });

   afterAll(async () => {

      await new Promise<void>((resolve) => {
         server.close(() => resolve());
      });

      // Then clean up other resources
      await pool.end();

      // Clear any remaining timers
      jest.clearAllTimers();
      jest.useRealTimers();

      // Add a small delay to allow any pending operations to complete
      await new Promise(resolve => setTimeout(resolve, 100));
   });
   describe('GET /api/community/stats/:userId', () => {
      it('should return 400 on invalid userId', async () => {
         await request(app).get('/api/community/stats/notanumber').expect(400, {
            status: 'error',
            message: 'Invalid user ID.',
         });
      });

      it('should return stats on success', async () => {
         const fakeStats = { communitiesJoined: 3, challenges: 5 };
         (communityService.getCommunityStats as jest.Mock).mockResolvedValue(fakeStats);

         const res = await request(app).get('/api/community/stats/42').expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Community statistics fetched successfully.',
            data: fakeStats,
         });
         expect(communityService.getCommunityStats).toHaveBeenCalledWith(42);
      });

      it('should return 500 on service error', async () => {
         (communityService.getCommunityStats as jest.Mock).mockRejectedValue(new Error('boom'));

         const res = await request(app).get('/api/community/stats/7').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not load community statistics.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch stats for user ID 7:',
            expect.any(Error)
         );
      });
   });

   describe('GET /api/community/performance-summary/:userId', () => {
      it('should return 400 on invalid userId', async () => {
         await request(app).get('/api/community/performance-summary/abc').expect(400, {
            status: 'error',
            message: 'Invalid user ID.',
         });
      });

      it('should return summary on success', async () => {
         const fakeSummary = { score: 80, label: 'Good' };
         (communityService.getCommunityPerformanceSummary as jest.Mock).mockResolvedValue(fakeSummary);

         const res = await request(app)
            .get('/api/community/performance-summary/5')
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Community performance summary retrieved successfully.',
            data: fakeSummary,
         });
         expect(communityService.getCommunityPerformanceSummary).toHaveBeenCalledWith(5);
      });

      it('should return 500 on service error', async () => {
         (communityService.getCommunityPerformanceSummary as jest.Mock).mockRejectedValue(new Error());

         const res = await request(app)
            .get('/api/community/performance-summary/10')
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch community performance summary.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch performance summary for user ID 10:',
            expect.any(Error)
         );
      });
   });

   describe('GET /api/community/leaderboard', () => {
      it('should return leaderboard on success', async () => {
         const board = [ { user_id: 1, xp: 200 }, { user_id: 2, xp: 150 } ];
         (communityService.getGlobalLeaderboard as jest.Mock).mockResolvedValue(board);

         const res = await request(app).get('/api/community/leaderboard').expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Leaderboard data retrieved successfully.',
            data: board,
         });
         expect(communityService.getGlobalLeaderboard).toHaveBeenCalled();
      });

      it('should 500 on error', async () => {
         (communityService.getGlobalLeaderboard as jest.Mock).mockRejectedValue(new Error());

         const res = await request(app).get('/api/community/leaderboard').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch leaderboard data.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch global leaderboard:',
            expect.any(Error)
         );
      });
   });

   describe('GET /api/community/userID/:username', () => {
      it('should 400 if username missing', async () => {
         // trailing slash but no param
         await request(app).get('/api/community/userID/').expect(404);
      });

      it('should 404 if service returns null', async () => {
         (communityService.getUserID as jest.Mock).mockResolvedValue(null);

         const res = await request(app).get('/api/community/userID/ghost').expect(404);
         expect(res.body).toEqual({ status: 'error', message: 'User not found.' });
      });

      it('should return user ID on success', async () => {
         const user = { user_id: 99 };
         (communityService.getUserID as jest.Mock).mockResolvedValue(user);

         const res = await request(app).get('/api/community/userID/alice').expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'User ID retrieved successfully.',
            data: user,
         });
         expect(communityService.getUserID).toHaveBeenCalledWith('alice');
      });

      it('should 500 on service error', async () => {
         (communityService.getUserID as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/userID/bob').expect(500);
         expect(res.body).toEqual({ status: 'error', message: 'Could not fetch user ID.' });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch user ID for username bob:',
            expect.any(Error)
         );
      });
   });

   describe('DELETE /api/community/friends', () => {
      it('should 400 on missing body fields', async () => {
         await request(app).delete('/api/community/friends').send({}).expect(400, {
            status: 'error',
            message: 'Missing user ID or friend ID.',
         });
      });

      it('should delete friendship on success', async () => {
         const deleted = { user_id: 1, friend_id: 2 };
         (communityService.deleteFriend as jest.Mock).mockResolvedValue(deleted);

         const res = await request(app)
            .delete('/api/community/friends')
            .send({ user_id: 1, friend_id: 2 })
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            message: 'Friend deleted.',
            data: deleted,
         });
         expect(communityService.deleteFriend).toHaveBeenCalledWith(1, 2);
      });

      it('should 500 on error', async () => {
         (communityService.deleteFriend as jest.Mock).mockRejectedValue(new Error());

         const res = await request(app)
            .delete('/api/community/friends')
            .send({ user_id: 5, friend_id: 6 })
            .expect(500);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not delete friend.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to delete friendship:',
            expect.any(Error)
         );
      });
   });

   // ── You can continue in this file for:
   //    DELETE    /api/community/:communityId
   describe('DELETE /api/community/:communityId', () => {
      it('should 400 on missing communityId', async () => {
         await request(app).delete('/api/community/').expect(404);
      });

      it('should delete community on success', async () => {
         const communityId = 123;
         // Mock the service to return an object with a community_name
         (communityService.deleteCommunityById as jest.Mock).mockResolvedValue({
            community_name: 'Test Community',
         });

         const res = await request(app)
            .delete(`/api/community/${communityId}`)
            .expect(200);

         expect(communityService.deleteCommunityById).toHaveBeenCalledWith(communityId);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Community "Test Community" deleted successfully.',
         });
      });

      it('should 500 on service error', async () => {
         (communityService.deleteCommunityById as jest.Mock).mockRejectedValue(new Error('boom'));

         const res = await request(app).delete('/api/community/456').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not delete community.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to delete community ID 456:',
            expect.any(Error)
         );
      });
   });
   //    POST      /api/community/:communityId/members/:friendId
   describe('POST /api/community/:communityId/members/:friendId', () => {
      it('should 400 on missing communityId or friendId', async () => {
         await request(app).post('/api/community/123/members/').expect(404);
         await request(app).post('/api/community//members/456').expect(404);
      });
      it('should add member on success', async () => {
         const communityId = 123;
         const friendId = 456;
         const status = 'accepted';
         (communityService.addCommunityMember as jest.Mock).mockResolvedValue({
            community_id: communityId,
            user_id: friendId,
            status,
         });

         const res = await request(app)
            .post(`/api/community/${communityId}/members/${friendId}`)
            .send({ status })
            .expect(201);

         expect(res.body).toEqual({
            status: 'success',
            message: "Member added to community successfully.",
            data: { community_id: communityId, user_id: friendId, status },
         });
         expect(communityService.addCommunityMember).toHaveBeenCalledWith(
            communityId,
            friendId,
            status
         );
      });

      it('should 500 on service error', async () => {
         (communityService.addCommunityMember as jest.Mock).mockRejectedValue(new Error('fail'));

         const res = await request(app)
            .post('/api/community/789/members/101')
            .send({ status: 'requested' })
            .expect(500);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not add member to community.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to add member to community ID 789:',
            expect.any(Error)
         );
      });
   });

   //    GET       /api/community/:title
   describe('GET /api/community/:title', () => {
      it('should 400 on missing title', async () => {
         await request(app).get('/api/community/').expect(404);
      });

      it('should return community by title', async () => {
         const title = 'Test Community';
         const community = { community_id: 1, community_name: title };
         (communityService.getCommunityByTitle as jest.Mock).mockResolvedValue(community);

         const res = await request(app).get(`/api/community/${title}`).expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Community details retrieved successfully.',
            data: community,
         });
         expect(communityService.getCommunityByTitle).toHaveBeenCalledWith(title);
      });

      it('should 404 if not found', async () => {
         (communityService.getCommunityByTitle as jest.Mock).mockResolvedValue(null);

         const res = await request(app).get('/api/community/NonExistent').expect(404);
         expect(res.body).toEqual({ status: 'error', message: 'Community not found.' });
      });
      it('should 500 on service error', async () => {
         (communityService.getCommunityByTitle as jest.Mock).mockRejectedValue(new Error('fail'));

         const res = await request(app).get('/api/community/ErrorCommunity').expect(500);
         expect(res.body).toEqual({ status: 'error', message: 'Could not fetch community details.' });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Failed to fetch community ID ErrorCommunity:",
            expect.any(Error)
         );
      });
   });

   describe('POST /api/community', () => {
      const newCommunity = {
         owner_id: 1,
         community_name: 'Test Community',
         description: 'Test Description',
         banner_id: 1
      };

      beforeEach(() => {
         jest.clearAllMocks();

         // Mock the database pool
         (pool.connect as jest.Mock).mockImplementation(() => ({
            query: jest.fn().mockResolvedValue({ rows: [] }),
            release: jest.fn()
         }));
      });

      it('should create community on success', async () => {
         const mockCommunity = {
            community_id: 1,
            ...newCommunity
         };

         // Mock service responses
         (communityService.createCommunity as jest.Mock).mockResolvedValue(mockCommunity);
         (communityService.addCommunityMember as jest.Mock).mockResolvedValue(true);

         const res = await request(app)
            .post('/api/community')
            .send(newCommunity)
            .expect(201);

         expect(res.body).toEqual({
            status: 'success',
            message: 'Community created successfully.',
            data: mockCommunity
         });
      });

      // test fails on GitHub Actions 
      
      it('should handle invited users', async () => {
         const mockCommunity = {
            community_id: 1,
            ...newCommunity
         };
         const mockUser = { user_id: 2 };

         // Mock responses
         (communityService.createCommunity as jest.Mock).mockResolvedValue(mockCommunity);
         (communityService.addCommunityMember as jest.Mock).mockResolvedValue(true);
         (pool.connect as jest.Mock).mockImplementation(() => ({
            query: jest.fn().mockResolvedValue({ rows: [ mockUser ] }),
            release: jest.fn()
         }));

         const res = await request(app)
            .post('/api/community')
            .send({
               ...newCommunity,
               invited_usernames: [ 'testuser' ]
            })
            .expect(201);

         expect(communityService.addCommunityMember).toHaveBeenCalledWith(
            1, // community_id
            1, // user_id
            'accepted'
         );
      });

      it('should 500 on service error', async () => {
         (communityService.createCommunity as jest.Mock).mockRejectedValue(new Error('DB error'));

         const res = await request(app)
            .post('/api/community')
            .send(newCommunity)
            .expect(500);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Failed to create community.'
         });
      });
   });

   //    GET       /api/community/banners
   describe('GET /api/community/banners/banners', () => {
      it('should return banners on success', async () => {
         const banners = [ { banner_id: 1, banner_image_path: 'banner1.png' } ];
         (communityService.getAllBanners as jest.Mock).mockResolvedValue(banners);

         const res = await request(app).get('/api/community/banners/banners').expect(200);
         expect(res.body).toEqual({
            status: 'success',
            data: banners,
         });
         expect(communityService.getAllBanners).toHaveBeenCalled();
      });

      it('should 500 on service error', async () => {
         (communityService.getAllBanners as jest.Mock).mockRejectedValue(new Error('fail'));

         const res = await request(app).get('/api/community/banners/banners').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: "Could not fetch banners.",
         });

      });
   });
   //    GET       /api/community/friends/:userId
   describe('GET /api/community/friends/:userId', () => {
      it('should 400 on invalid userId', async () => {
         await request(app).get('/api/community/friends/notanumber').expect(400, {
            status: 'error',
            message: 'Invalid user ID.',
         });
      });

      it('should return friends with avatars', async () => {
         const userId = 42;
         const friends = [
            { user_id: 1, username: 'alice', avatar: 'alice.png' },
            { user_id: 2, username: 'bob', avatar: 'bob.png' },
         ];
         (communityService.getUserFriendsWithAvatars as jest.Mock).mockResolvedValue(friends);
         const res = await request(app).get(`/api/community/friends/${userId}`).expect(200);
         expect(res.body).toEqual({
            status: 'success',
            data: friends,
         });
         expect(communityService.getUserFriendsWithAvatars).toHaveBeenCalledWith(userId);
      });

      it('should 500 on service error', async () => {
         (communityService.getUserFriendsWithAvatars as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/friends/99').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch friends.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch friends for user ID 99:',
            expect.any(Error)
         );
      }
      );
      it('should 500 on service error', async () => {
         (communityService.getUserFriendsWithAvatars as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/friends/99').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch friends.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch friends for user ID 99:',
            expect.any(Error)
         );
      });
   });
   //    PUT       /api/community/:communityId
   describe('PUT /api/community/:communityId', () => {
      it('should 400 on missing communityId or data', async () => {
         await request(app).put('/api/community/').expect(404);
         await request(app).put('/api/community/123').send({}).expect(400, {
            status: 'error',
            message: 'Missing required fields.',
         });
      });

      it('should update community on success', async () => {
         const communityId = 123;
         const updateData = { community_name: 'Updated Community', description: 'New desc' };
         (communityService.updateCommunity as jest.Mock).mockResolvedValue({
            community_id: communityId,
            ...updateData,
         });

         const res = await request(app)
            .put(`/api/community/${communityId}`)
            .send(updateData)
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            message: 'Community updated successfully.',
            data: { community_id: communityId, ...updateData },
         });
         expect(communityService.updateCommunity).toHaveBeenCalledWith(communityId, updateData);
      });

      it('should 400 on service error', async () => {
         (communityService.updateCommunity as jest.Mock).mockRejectedValue(new Error('fail'));

         const res = await request(app)
            .put('/api/community/456')
            .send({ community_name: 'Error Community' })
            .expect(400);

         expect(res.body).toEqual({
            status: 'error',
            message: "Missing required fields.",
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Missing required fields for community update',
         );
      });
   });

   //    GET       /api/community/recommended/:userId
   describe('GET /api/community/recommended/:userId', () => {
      it('should 400 on invalid userId', async () => {
         await request(app).get('/api/community/recommended/notanumber').expect(400, {
            status: 'error',
            message: 'Invalid user ID.',
         });
      });

      it('should return recommended communities', async () => {
         const userId = 42;
         const recommendations = [
            { community_id: 1, community_name: 'Fitness Enthusiasts' },
            { community_id: 2, community_name: 'Tech Innovators' },
         ];
         (communityService.getRecommendedCommunities as jest.Mock).mockResolvedValue(recommendations);

         const res = await request(app).get(`/api/community/recommended/${userId}`).expect(200);
         expect(res.body).toEqual({
            status: 'success',
            data: recommendations,
         });
         expect(communityService.getRecommendedCommunities).toHaveBeenCalledWith(userId);
      });

      it('should 500 on service error', async () => {
         (communityService.getRecommendedCommunities as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/recommended/99').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch recommended communities.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to get recommended communities for user ID 99:',
            expect.any(Error)
         );
      });
   });

   //    DELETE    /api/community/:communityId/members/:userId
   describe('DELETE /api/community/:communityId/members/:userId', () => {
      it('should 400 on missing communityId or userId', async () => {
         await request(app).delete('/api/community/123/members/').expect(404);
         await request(app).delete('/api/community//members/456').expect(404);
      });

      it('should remove member on success', async () => {
         const communityId = 123;
         const userId = 456;
         (communityService.removeCommunityMember as jest.Mock).mockResolvedValue(undefined);

         const res = await request(app)
            .delete(`/api/community/${communityId}/members/${userId}`)
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Member removed successfully.',
         });
         expect(communityService.removeCommunityMember).toHaveBeenCalledWith(communityId, userId);
      });

      it('should 500 on service error', async () => {
         (communityService.removeCommunityMember as jest.Mock).mockRejectedValue(new Error('fail'));

         const res = await request(app)
            .delete('/api/community/789/members/101')
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not remove member from community.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to remove member from community ID 789:',
            expect.any(Error)
         );
      }
      );
   });


   //    DELETE    /api/community/:communityId/members/:userId
   describe('DELETE /api/community/:communityId/members/:userId', () => {
      it('should 400 on missing communityId or userId', async () => {
         await request(app).delete('/api/community/123/members/').expect(404);
         await request(app).delete('/api/community//members/456').expect(404);
      }
      );
      it('should remove member on success', async () => {
         const communityId = 123;
         const userId = 456;
         (communityService.removeCommunityMember as jest.Mock).mockResolvedValue(undefined);

         const res = await request(app)
            .delete(`/api/community/${communityId}/members/${userId}`)
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Member removed successfully.',
         });
         expect(communityService.removeCommunityMember).toHaveBeenCalledWith(communityId, userId);
      });

      it('should 500 on service error', async () => {
         (communityService.removeCommunityMember as jest.Mock).mockRejectedValue(new Error('fail'));

         const res = await request(app)
            .delete('/api/community/789/members/101')
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: "Could not remove member from community.",
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to remove member from community ID 789:',
            expect.any(Error)
         );
      });
   });
   //    GET       /api/community/friends/all/members
   describe('GET /api/community/friends/all/members', () => {
      beforeEach(() => {
         jest.clearAllMocks();
      });

      it('should return all members', async () => {
         const mockMembers = [
            { user_id: 1, username: 'alice', avatar: 'alice.png' },
            { user_id: 2, username: 'bob', avatar: 'bob.png' }
         ];

         (communityService.fetchAllUsers as jest.Mock).mockResolvedValue(mockMembers);

         const res = await request(app)
            .get('/api/community/friends/all/members')
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            data: mockMembers
         });
      });

      it('should 500 on service error', async () => {
         const testError = new Error('Database error');
         (communityService.fetchAllUsers as jest.Mock).mockRejectedValue(testError);

         const res = await request(app)
            .get('/api/community/friends/all/members')
            .expect(500);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch members.'
         });

         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch all members:',
            testError
         );
      });
   });

   //    GET       /api/community/friends/status/:userId/:friendId
   describe('GET /api/community/friends/status/:userId/:friendId', () => {
      const userId = 123;
      const friendId = 456;

      beforeEach(() => {
         jest.clearAllMocks();
      });

      it('should return friendship status with initiator flag', async () => {
         const mockResult = {
            user_id: userId, // indicates this user initiated the request
            friend_id: friendId,
            status: 'accepted'
         };

         (communityService.getFriendshipStatus as jest.Mock).mockResolvedValue(mockResult);

         const res = await request(app)
            .get(`/api/community/friends/status/${userId}/${friendId}`)
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            data: {
               status: 'accepted',
               isInitiator: true // because user_id matches userId
            }
         });
      });

      it('should return false for isInitiator when friend initiated', async () => {
         const mockResult = {
            user_id: friendId, // friend initiated
            friend_id: userId,
            status: 'pending'
         };

         (communityService.getFriendshipStatus as jest.Mock).mockResolvedValue(mockResult);

         const res = await request(app)
            .get(`/api/community/friends/status/${userId}/${friendId}`)
            .expect(200);

         expect(res.body.data.isInitiator).toBe(false);
      });

      it('should return 400 for invalid user IDs', async () => {
         const res = await request(app)
            .get('/api/community/friends/status/abc/def')
            .expect(400);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Invalid user ID'
         });
      });

      it('should 500 on service error', async () => {
         const testError = new Error('Database error');
         (communityService.getFriendshipStatus as jest.Mock).mockRejectedValue(testError);

         const res = await request(app)
            .get(`/api/community/friends/status/${userId}/${friendId}`)
            .expect(500);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch friendship status'
         });

         expect(logger.error).toHaveBeenCalledWith(
            `[Community] Failed to get friendship status for ${userId}:`,
            testError
         );
      });
   });
   //    POST      /api/community/friends/request/:sender_id/:receiver_id
   describe('POST /api/community/friends/request/:sender_id/:receiver_id', () => {
      it('should 400 on missing sender_id or receiver_id', async () => {
         await request(app).post('/api/community/friends/request/123/').expect(404);
         await request(app).post('/api/community/friends/request//456').expect(404);
      });

      it('should send friend request on success', async () => {
         const senderId = 123;
         const receiverId = 456;
         (communityService.sendFriendRequest as jest.Mock).mockResolvedValue({
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'requested',
         });

         const res = await request(app)
            .post(`/api/community/friends/request/${senderId}/${receiverId}`)
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            message: 'Friend request sent.',
            data: { sender_id: senderId, receiver_id: receiverId, status: 'requested' },
         });
         expect(communityService.sendFriendRequest).toHaveBeenCalledWith(senderId, receiverId);
      });

      it('should 500 on service error', async () => {
         (communityService.sendFriendRequest as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .post('/api/community/friends/request/789/101')
            .expect(500);

         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not send friend request.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Failed to send friend request:",
            expect.any(Error)
         );
      });
   });

   //    POST      /api/community/membership/request
   describe('POST /api/community/membership/request', () => {
      it('should 400 on missing communityId or userId', async () => {
         await request(app).post('/api/community/membership/request').send({}).expect(400, {
            status: 'error',
            message: 'Missing community ID or user ID.',
         });
      });

      it('should request membership on success', async () => {
         const requestData = { community_id: 123, user_id: 456 };
         (communityService.requestCommunityMembership as jest.Mock).mockResolvedValue({
            community_id: requestData.community_id,
            user_id: requestData.user_id,
            status: 'requested',
         });

         const res = await request(app)
            .post('/api/community/membership/request')
            .send(requestData)
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: "Membership requested.",
         });
         expect(communityService.requestCommunityMembership).toHaveBeenCalledWith(
            requestData.community_id,
            requestData.user_id
         );
      });

      it('should 500 on service error', async () => {
         (communityService.requestCommunityMembership as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .post('/api/community/membership/request')
            .send({ community_id: 789, user_id: 101 })
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not request membership.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Failed to request membership for user ID 101 in community ID 789:",
            expect.any(Error)
         );
      });
   });

   describe('GET /api/community/membership/requests/:communityId', () => {
      it('should 400 on missing communityId', async () => {
         await request(app).get('/api/community/membership/requests/').expect(404);
      });
      it('should return membership requests for community', async () => {
         const communityId = 123;
         const requests = [
            { user_id: 1, username: 'alice', status: 'requested' },
            { user_id: 2, username: 'bob', status: 'requested' },
         ];
         (communityService.getCommunityInvites as jest.Mock).mockResolvedValue(requests);
      });
   });

   describe('GET /api/community/membership/requests/:communityId', () => {
      it('should 400 on missing communityId', async () => {
         await request(app).get('/api/community/membership/requests/').expect(404);
      });
      it('should return membership requests for community', async () => {
         const communityId = 123;
         const requests = [
            { user_id: 1, username: 'alice', status: 'requested' },
            { user_id: 2, username: 'bob', status: 'requested' },
         ];
         (communityService.getCommunityInvites as jest.Mock).mockResolvedValue(requests);

         const res = await request(app)
            .get(`/api/community/membership/requests/${communityId}`)
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            data: requests,
         });
         expect(communityService.getCommunityInvites).toHaveBeenCalledWith(communityId);
      });
      it('should 500 on service error', async () => {
         (communityService.getCommunityInvites as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .get('/api/community/membership/requests/456')
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch membership requests.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Failed to fetch membership requests for community ID 456:",
            expect.any(Error)
         );
      });
   });

   //    POST      /api/community/membership/respond
   describe('POST /api/community/membership/respond', () => {
      it('should 400 on missing data', async () => {
         await request(app).post('/api/community/membership/respond').send({}).expect(400, {
            status: 'error',
            message: 'Missing required fields.',
         });
      });
      it('should respond to membership request on success', async () => {
         const responseData = { community_id: 123, user_id: 456, action: 'accepted' };
         (communityService.respondToInvite as jest.Mock).mockResolvedValue({
            ...responseData,
            message: 'Membership request responded successfully.',
         });

         const res = await request(app)
            .post('/api/community/membership/respond')
            .send(responseData)
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: "Membership request accepted.",
            data: {
               ...responseData,
               message: "Membership request responded successfully.",
            },
         });
         expect(communityService.respondToInvite).toHaveBeenCalledWith(
            responseData.community_id,
            responseData.user_id,
            responseData.action
         );
      }
      );
      it('should 400 on service error', async () => {
         (communityService.respondToInvite as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .post('/api/community/membership/respond')
            .send({ community_id: 789, user_id: 101, status: 'declined' })
            .expect(400);
         expect(res.body).toEqual({
            status: 'error',
            message: "Missing required fields.",
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Missing required fields for membership response.",
         );
      }
      );
   }
   );

   //    DELETE    /api/community/friends/remove/:sender/:receiver
   describe('DELETE /api/community/friends/remove/:sender/:receiver', () => {
      it('should 400 on missing sender or receiver', async () => {
         await request(app).delete('/api/community/friends/remove/123/').expect(404);
         await request(app).delete('/api/community/friends/remove//456').expect(404);
      });

   });

   //    GET   /api/community/membership/requests/:communityId
   describe('GET /api/community/membership/requests/:communityId', () => {
      it('should 400 on missing communityId', async () => {
         await request(app).get('/api/community/membership/requests/').expect(404);
      });

      it('should return membership requests for community', async () => {
         const communityId = 123;
         const requests = [
            { user_id: 1, username: 'alice', status: 'requested' },
            { user_id: 2, username: 'bob', status: 'requested' },
         ];
         (communityService.getCommunityInvites as jest.Mock).mockResolvedValue(requests);

         const res = await request(app)
            .get(`/api/community/membership/requests/${communityId}`)
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            data: requests,
         });
         expect(communityService.getCommunityInvites).toHaveBeenCalledWith(communityId);
      });

   });


   //    DELETE    /api/community/friends/remove/:sender/:receiver
   describe('DELETE /api/community/friends/remove/:sender/:receiver', () => {
      it('should 400 on missing sender or receiver', async () => {
         await request(app).delete('/api/community/friends/remove/123/').expect(404);
         await request(app).delete('/api/community/friends/remove//456').expect(404);
      });

      it('should remove friendship on success', async () => {
         const senderId = 123;
         const receiverId = 456;
         (communityService.deleteFriend as jest.Mock).mockResolvedValue(undefined);

         const res = await request(app)
            .delete(`/api/community/friends/remove/${senderId}/${receiverId}`)
            .expect(200);

         expect(res.body).toEqual({
            status: 'success',
            message: "Friend deleted sent.",
         });
         expect(communityService.deleteFriend).toHaveBeenCalledWith(senderId, receiverId);
      });
      it('should 500 on service error', async () => {
         (communityService.deleteFriend as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .delete('/api/community/friends/remove/789/101')
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not remove friend.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Failed to remove friend:",
            expect.any(Error)
         );
      }
      );
   });

   //    GET       /api/community/challenges/user/:userId
   describe('GET /api/community/challenges/user/:userId', () => {
      it('should 400 on invalid userId', async () => {
         await request(app).get('/api/community/challenges/user/notanumber').expect(400, {
            status: 'error',
            message: 'Invalid user ID.',
         });
      });

      it('should return challenges for user', async () => {
         const userId = 42;
         const challenges = [
            { challenge_id: 1, title: '30 Day Fitness Challenge', status: 'active' },
            { challenge_id: 2, title: 'Mindfulness Month', status: 'completed' },
         ];
         (communityService.getChallengesByUserCategorized as jest.Mock).mockResolvedValue(challenges);

         const res = await request(app).get(`/api/community/challenges/user/${userId}`).expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: "Challenges fetched and categorized successfully.",
            data: challenges,
         });
         expect(communityService.getChallengesByUserCategorized).toHaveBeenCalledWith(userId);
      });

      it('should 500 on service error', async () => {
         (communityService.getChallengesByUserCategorized as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/challenges/user/99').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: "Could not fetch categorized challenges.",
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Route] Failed to fetch categorized challenges for user ID 99:",
            expect.any(Error)
         );
      });
   });

   //    GET       /api/community/challenges/:challengeId
   describe('GET /api/community/challenges/:challengeId', () => {
      it('should 400 on invalid challengeId', async () => {
         await request(app).get('/api/community/challenges/notanumber').expect(400, {
            status: 'error',
            message: 'Invalid challenge ID.',
         });
      });
      it('should return challenge details', async () => {
         const challengeId = 1;
         const challenge = { challenge_id: challengeId, title: '30 Day Fitness Challenge', description: 'Get fit in 30 days!' };
         (communityService.getChallenge as jest.Mock).mockResolvedValue(challenge);
         const res = await request(app).get(`/api/community/challenges/${challengeId}`).expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Challenge details retrieved successfully.',
            data: challenge,
         });
         expect(communityService.getChallenge).toHaveBeenCalledWith(challengeId);
      }
      );

      it('should 500 on service error', async () => {
         (communityService.getChallenge as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/challenges/99').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not fetch challenge details.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Route] Failed to fetch challenge ID 99:',
            expect.any(Error)
         );
      }
      );
   }
   );
   //    PATCH     /api/community/friends/update
   describe('PATCH /api/community/friends/update', () => {
      it('should 400 on missing userId or friendId', async () => {
         await request(app).patch('/api/community/friends/update').send({}).expect(400, {
            status: 'error',
            message: 'Missing sender or receiver ID.',
         });
      });

      it('should update friendship status on success', async () => {
         const updateData = { user_id: 123, friend_id: 456, action: 'accepted' };
         (communityService.respondToFriendRequests as jest.Mock).mockResolvedValue({
            ...updateData,
            message: 'Friendship status updated successfully.',
         });

         const res = await request(app)
            .patch('/api/community/friends/update')
            .send(updateData)
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Friendship status updated successfully.',
            data: {
               ...updateData,
               message: 'Friendship status updated successfully.' // Include the expected message
            }
         });

         expect(communityService.respondToFriendRequests).toHaveBeenCalledWith(
            updateData.friend_id,
            updateData.user_id,
            updateData.action
         );
      });

      it('should 400 on service error', async () => {
         (communityService.respondToFriendRequests as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .patch('/api/community/friends/update')
            .send({ user_id: 789, friend_id: 101, status: 'declined' })
            .expect(400);
         expect(res.body).toEqual({
            status: 'error',
            message: "Incorrect action",
         });
      });
   });


   //  POST      /api/community/challenges
   describe('POST /api/community/challenges', () => {
      it('should 400 on missing data', async () => {
         await request(app).post('/api/community/challenges').send({}).expect(400, {
            status: 'error',
            message: 'Missing required challenge fields: creator_id, community_id, challenge_title, challenge_type, measurement_type, target_amount, start_date, target_date',
         });
      });

      it('should create challenge on success', async () => {
         const challengeData = {
            challenge_title: 'Title',
            challenge_type: 'type',
            measurement_type: 'count',
            target_amount: 100,
            start_date: '2025-01-01',
            target_date: '2025-02-01',
            creator_id: 1,
            community_id: 2,
            category_id: 1,           // if your service expects these
            custom_category_id: null, // include optional fields as null/undefined
            banner_id: 3,
            difficulty: 'medium',
         };
         (communityService.createChallenge as jest.Mock).mockResolvedValue({
            ...challengeData,
            challenge_id: 1,
            status: 'active',
         });

         const res = await request(app)
            .post('/api/community/challenges')
            .send(challengeData)
            .expect(201);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Challenge created successfully.',
            data: { ...challengeData, challenge_id: 1, status: 'active' },
         });
         expect(communityService.createChallenge).toHaveBeenCalledWith(challengeData);
      });

      it('should 400 on service error', async () => {
         (communityService.createChallenge as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .post('/api/community/challenges')
            .send({ title: '30 Day Fitness Challenge', description: 'Get fit in 30 days!' })
            .expect(400);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Missing required challenge fields: creator_id, community_id, challenge_title, challenge_type, measurement_type, target_amount, start_date, target_date',
         });
         expect(logger.error).toHaveBeenCalledWith(
            "[Community] Missing required challenge fields: creator_id, community_id, challenge_title, challenge_type, measurement_type, target_amount, start_date, target_date",

         );
      });
   });

   //    DELETE    /api/community/challenges/:challengeId
   describe('DELETE /api/community/challenges/:challengeId', () => {
      it('should 400 on missing challengeId', async () => {
         await request(app).delete('/api/community/challenges/').expect(400);
      });

      it('should delete challenge on success', async () => {
         const challengeId = 1;
         (communityService.deleteChallengeById as jest.Mock).mockResolvedValue({
            challenge_title: 'Test Challenge',
         });
         const res = await request(app)
            .delete(`/api/community/challenges/${challengeId}`)
            .expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Challenge "Test Challenge" deleted successfully.',
         });
         expect(communityService.deleteChallengeById).toHaveBeenCalledWith(challengeId);
      });

      it('should 500 on service error', async () => {
         (communityService.deleteChallengeById as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app)
            .delete('/api/community/challenges/99')
            .expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not delete challenge.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to delete challenge ID 99:',
            expect.any(Error)
         );
      });
   });

   //    GET       /api/community/categories/:userId
   describe('GET /api/community/categories/:userId', () => {
      it('should 400 on invalid userId', async () => {
         await request(app).get('/api/community/categories/notanumber').expect(400, {
            status: 'error',
            message: 'Invalid user ID.',
         });
      });

      it('should return categories for user', async () => {
         const userId = 42;
         const categories = [
            { category_id: 1, name: 'Fitness' },
            { category_id: 2, name: 'Wellness' },
         ];
         (communityService.getCategoriesWithCustom as jest.Mock).mockResolvedValue(categories);

         const res = await request(app).get(`/api/community/categories/${userId}`).expect(200);
         expect(res.body).toEqual({
            status: 'success',
            message: 'Fetched all categories.',
            data: categories,
         });
         expect(communityService.getCategoriesWithCustom).toHaveBeenCalledWith(userId);
      });

      it('should 500 on service error', async () => {
         (communityService.getCategoriesWithCustom as jest.Mock).mockRejectedValue(new Error('fail'));
         const res = await request(app).get('/api/community/categories/99').expect(500);
         expect(res.body).toEqual({
            status: 'error',
            message: 'Could not load categories.',
         });
         expect(logger.error).toHaveBeenCalledWith(
            '[Community] Failed to fetch categories:',
            expect.any(Error)
         );
      });
   });
});
