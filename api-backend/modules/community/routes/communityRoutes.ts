import { Router, Request, Response } from 'express';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import * as communityService from '../services/community.service';
import * as au from '../../auth/services/auth.service';
import { notifyUser } from '../../notifications/services/notifications.services';
import { redisClient } from '../../../config/redis';
import { error } from 'console';

const router = Router();

// Post Feature Routes

// POST community/api/social/posts
router.post('/social/posts', async (req: Request, res: Response) => {
  try {
    const { userId, achievementId, caption, communityTagIds = [] } = req.body;

    if (!userId || !achievementId) {
      res.status(400).json({ status: 'error', message: 'userId and achievementId are required' });
      return;
    }

    const post = await communityService.createSocialPost({
      userId,
      achievementId,
      caption,
      communityTagIds,
    });

    res.status(201).json({ status: 'success', data: post });
    return;
  } catch (err: any) {
    console.error('Error creating social post:', err);
    res.status(500).json({ status: 'error', message: err?.message ?? 'Failed to create post' });
    return;
  }
});

// GET completed umbrella achievements for user
router.get('/social/achievements/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const banners = await communityService.getCompletedUmbrellaAchievements(userId);

    const formatted = banners.map((row: any) => ({
      achievementId: row.achievement_id,
      title: row.achievement_title,
      bannerPath: row.banner_image_path,
    }));

    res.status(200).json({ status: 'success', data: formatted });
    return;
  } catch (err) {
    console.error('Error loading achievements:', err);
    res.status(500).json({ status: 'error', message: 'Failed to load achievements' });
    return;
  }
});

// GET user communities
router.get('/social/communities/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const communities = await communityService.getUserCommunities(userId);

    res.status(200).json({ status: 'success', data: communities });
    return;
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to load communities' });
    return;
  }
});

// GET friend feed
router.get('/social/feed/:userId', async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = parseInt(req.params.userId);
    const posts = await communityService.getFriendFeed(userId);

    return res.status(200).json({ status: 'success', data: posts });
  } catch (err) {
    console.error('Error fetching feed:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch feed' });
  }
});

// POST like a post
router.post('/social/posts/:postId/like', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const postId = parseInt(req.params.postId);

    const result = await communityService.likePost(userId, postId);

    res.status(200).json({ status: 'success', message: 'Post liked successfully', likeCount: result.like_count });
    return;
  } catch (err: any) {
    console.error('Error liking post:', err.message);
    res.status(500).json({ status: 'error', message: err.message || 'Failed to like post' });
    return;
  }
});

// DELETE unlike a post
router.delete('/social/posts/:postId/unlike', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const postId = parseInt(req.params.postId);

    const result = await communityService.unlikePost(userId, postId);

    res.status(200).json({ status: 'success', message: 'Post unliked successfully', likeCount: result.like_count });
    return;
  } catch (err: any) {
    console.error('Error unliking post:', err.message);
    res.status(500).json({ status: 'error', message: 'Failed to unlike post' });
    return;
  }
});

// POST add comment
router.post('/social/posts/:postId/comment', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const postId = parseInt(req.params.postId);
    const { comment } = req.body;

    const newComment = await communityService.addPostComment(userId, postId, comment);

    res.status(201).json({ status: 'success', message: 'Comment added successfully', comment: newComment });
    return;
  } catch (err: any) {
    console.error('Error commenting on post:', err.message);
    res.status(500).json({ status: 'error', message: err.message || 'Failed to comment on post' });
    return;
  }
});

// GET post comments
router.get('/social/posts/:postId/comments', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await communityService.getPostComments(postId);

    res.status(200).json({ status: 'success', data: comments });
    return;
  } catch (err: any) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ status: 'error', message: err.message || 'Failed to fetch comments' });
    return;
  }
});

// DELETE a post
router.delete('/social/posts/:postId', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const userId = Number(req.body.userId); // (from auth in future)

    if (Number.isNaN(postId) || Number.isNaN(userId)) {
      res.status(400).json({ status: 'error', message: 'Invalid postId or userId' });
      return;
    }

    const result = await communityService.deleteSocialPost(userId, postId);

    res.status(200).json({ status: 'success', message: result.message });
    return;
  } catch (err: any) {
    const msg = String(err?.message || '');

    if (msg.includes('Post not found')) {
      res.status(404).json({ status: 'error', message: 'Post not found' });
      return;
    }
    if (msg.includes('Unauthorized')) {
      res.status(403).json({ status: 'error', message: 'Not allowed to delete this post' });
      return;
    }

    console.error('Error deleting post:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete post' });
    return;
  }
});

// DELETE a single comment on a post
router.delete('/social/posts/:postId/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const commentId = parseInt(req.params.commentId, 10);
    const userId = Number(req.body.userId); // (from auth in future)

    if ([postId, commentId, userId].some(n => Number.isNaN(n))) {
      res.status(400).json({ status: 'error', message: 'Invalid postId, commentId, or userId' });
      return;
    }

    const result = await communityService.deletePostComment(userId, postId, commentId);

    res.status(200).json({ status: 'success', message: result.message });
    return;
  } catch (err: any) {
    const msg = String(err?.message || '');

    if (msg.includes('Comment not found')) {
      res.status(404).json({ status: 'error', message: 'Comment not found' });
      return;
    }
    if (msg.includes('Unauthorized')) {
      res.status(403).json({ status: 'error', message: 'Not allowed to delete this comment' });
      return;
    }

    console.error('Error deleting comment:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete comment' });
    return;
  }
});




/**
 * @route GET /api/community/stats/:userId
 * @desc Returns statistics related to community interactions (e.g. communities joined, challenges, games played, leaderboard rank, friends)
 */
router.get('/stats/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid user ID.',
    });
    return;
  }

  try {
    const stats = await communityService.getCommunityStats(userId);
    res.status(200).json({
      status: 'success',
      message: 'Community statistics fetched successfully.',
      data: stats,
    });
  } catch (error) {
    logger.error(`[Community] Failed to fetch stats for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not load community statistics.',
    });
  }
});


/**
 * @route GET /api/community/performance-summary/:userId
 * @desc Returns community-specific performance score, label, avatar, level, and tier
 */
router.get('/performance-summary/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid user ID.',
    });
    return;
  }

  try {
    const summary = await communityService.getCommunityPerformanceSummary(userId);
    res.status(200).json({
      status: 'success',
      message: 'Community performance summary retrieved successfully.',
      data: summary,
    });
  } catch (error) {
    logger.error(`[Community] Failed to fetch performance summary for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch community performance summary.',
    });
  }
});


/**
 * @route GET /api/community/leaderboard
 * @desc Returns global leaderboard of users ranked by XP
 */
router.get('/leaderboard', async (_req: Request, res: Response) => {
  try {
    const leaderboard = await communityService.getGlobalLeaderboard();
    res.status(200).json({
      status: 'success',
      message: 'Leaderboard data retrieved successfully.',
      data: leaderboard,
    });
  } catch (error) {
    logger.error('[Community] Failed to fetch global leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch leaderboard data.',
    });
  }
});

router.get('/userID/:username', async (req: Request, res: Response) => {
  const username = req.params.username;

  if (!username) {
    res.status(400).json({ status: 'error', message: 'Username is required.' });
    return;
  }

  try {
    const user = await communityService.getUserID(username);
    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found.' });
      return;
    }
    res.status(200).json({
      status: 'success',
      message: 'User ID retrieved successfully.',
      data: user,
    });
  } catch (err) {
    logger.error(`[Community] Failed to fetch user ID for username ${username}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not fetch user ID.' });
  }
})

/**
 * @route DELETE /api/community/friends
 * @desc Deletes a friendship between two users
 * @body { user_id, friend_id }
 */
router.delete('/friends', async (req: Request, res: Response) => {
  const { user_id, friend_id } = req.body;

  if (!user_id || !friend_id) {
    res.status(400).json({ status: 'error', message: 'Missing user ID or friend ID.' });
    return;
  }

  try {
    const deleted = await communityService.deleteFriend(user_id, friend_id);
    res.status(200).json({ status: 'success', message: 'Friend deleted.', data: deleted });
  } catch (err) {
    logger.error(`[Community] Failed to delete friendship:`, err);
    res.status(500).json({ status: 'error', message: 'Could not delete friend.' });
  }
});



/**
 * @route DELETE /api/community/:communityId
 * @desc Deletes a community and cascades its related data
 */
router.delete('/:communityId', async (req: Request, res: Response) => {
  const communityId = Number(req.params.communityId);

  if (isNaN(communityId)) {
    res.status(400).json({ status: 'error', message: 'Invalid community ID' });
    return;
  }

  try {
    const deleted = await communityService.deleteCommunityById(communityId);
    res.status(200).json({
      status: 'success',
      message: `Community "${deleted.community_name}" deleted successfully.`,
    });
  } catch (error) {
    logger.error(`[Community] Failed to delete community ID ${communityId}:`, error);
    res.status(500).json({ status: 'error', message: 'Could not delete community.' });
    return;
  }
});

router.post('/:communityId/members/:friendId', async (req: Request, res: Response) => {
  const communityId = Number(req.params.communityId);
  const friendId = Number(req.params.friendId);

  try {
    if (isNaN(communityId) || isNaN(friendId)) {
      res.status(400).json({ status: 'error', message: 'Invalid community or friend ID.' });
      return;
    }

    // Add the member to the community
    const newMember = await communityService.addCommunityMember(communityId, friendId, 'accepted');
    res.status(201).json({
      status: 'success',
      message: 'Member added to community successfully.',
      data: newMember,
    });

    // Notify the user about the new membership
    await notifyUser(friendId, 'community_joined', {
      community_id: communityId,
      community_name: newMember.community_name,
    });

  } catch (err) {
    logger.error(`[Community] Failed to add member to community ID ${communityId}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not add member to community.' });
  }

});


/**
 * @route POST /api/community
 * @desc Creates a new community and optionally sends invites
 */
router.post('/', async (req: Request, res: Response) => {
  const { owner_id, community_name, description, banner_id, invited_usernames } = req.body;

  if (!owner_id || !community_name) {
    logger.error('[Community] Missing required fields for community creation');
    res.status(400).json({ status: 'error', message: 'Missing required fields.' });
    return;
  }

  try {
    const newCommunity = await communityService.createCommunity({
      owner_id,
      community_name,
      description,
      banner_id,
    });

    // Add creator as a member
    await communityService.addCommunityMember(newCommunity.community_id, owner_id, 'accepted');

    // Optional: Add invited users
    if (Array.isArray(invited_usernames)) {
      const client = await pool.connect();
      for (const username of invited_usernames) {
        const userRes = await client.query(`SELECT user_id FROM users WHERE username = $1`, [ username ]);
        if (userRes.rows[ 0 ]) {
          await communityService.addCommunityMember(newCommunity.community_id, userRes.rows[ 0 ].user_id, 'invited');
        }
      }
      client.release();
    }

    res.status(201).json({
      status: 'success',
      message: 'Community created successfully.',
      data: newCommunity,
    });
    return;
  } catch (err) {
    logger.error('[Community] Failed to create community:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create community.' });
    return;
  }
});



/**
 * @route GET /api/community/banners
 * @desc Fetch all available banner options
 */
router.get('/banners/banners', async (_req: Request, res: Response) => {
  try {
    const banners = await communityService.getAllBanners();
    res.status(200).json({ status: 'success', data: banners });
    return;
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Could not fetch banners.' });
    return;
  }
});

/**
 * @route GET /api/community/friends/:userId
 * @desc Fetch all friends for a user with avatars
 */
router.get('/friends/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Invalid user ID.' });
    return;
  }

  try {
    const friends = await communityService.getUserFriendsWithAvatars(userId);
    res.status(200).json({ status: 'success', data: friends });
  } catch (err) {
      logger.error(
      `[Community] Failed to fetch friends for user ID ${userId}:`,
      err
    );
    res.status(500).json({ status: 'error', message: 'Could not fetch friends.' });
  }
});

router.put('/:communityId', async (req, res) => {
  const communityId = Number(req.params.communityId);
  const { community_name, description } = req.body;
  if (isNaN(communityId)) {
    res.status(400).json({ status: 'error', message: 'Invalid community ID.' });
    return;
  }

  if (!community_name || !description) {
    logger.error('[Community] Missing required fields for community update');
    res.status(400).json({ status: 'error', message: 'Missing required fields.' });
    return;
  }
  try {
    const updatedCommunity = await communityService.updateCommunity(communityId, {
      community_name,
      description
    });

    res.status(200).json({
      status: 'success',
      message: 'Community updated successfully.',
      data: updatedCommunity,
    });
  } catch (err) {
    logger.error(`[Community] Failed to update community ID ${communityId}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not update community.' });
  }
});

router.get('/recommended/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Invalid user ID.' });
    return;
  }

  try {
    const recommendations = await communityService.getRecommendedCommunities(userId);
    res.status(200).json({ status: 'success', data: recommendations });
  } catch (err) {
    logger.error(`[Community] Failed to get recommended communities for user ID ${userId}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not fetch recommended communities.' });
  }
});

router.delete('/:communityId/members/:userId', async (req, res) => {
  const communityId = Number(req.params.communityId);
  const userId = Number(req.params.userId);

  if (isNaN(communityId) || isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Invalid community or user ID.' });
    return;
  }

  try {
    await communityService.removeCommunityMember(communityId, userId);
    res.status(200).json({ status: 'success', message: 'Member removed successfully.' });
  } catch (err) {
    logger.error(`[Community] Failed to remove member from community ID ${communityId}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not remove member from community.' });
  }
});

router.get('/friends/all/members', async (req, res) => {
  try {
    const members = await communityService.fetchAllUsers();
    res.status(200).json({ status: 'success', data: members });
  } catch (err) {
    logger.error('[Community] Failed to fetch all members:', err);
    res.status(500).json({ status: 'error', message: 'Could not fetch members.' });
  }
});

/**
 * @route GET /api/community/friends/recommendations/:userId
 * @desc Get recommended friends based on mutuals and tier
 */
router.get('/friends/recommendations/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    return;
  }

  try {
    const recommendations = await communityService.getFriendRecommendations(userId);
    res.status(200).json({ status: 'success', data: recommendations });
  } catch (err) {
    logger.error(`[Community] Failed to get friend recommendations:`, err);
    res.status(500).json({ status: 'error', message: 'Could not fetch recommendations' });
  }
});

router.get('/friends/status/:userId/:friendId', async (req, res) => {
  const userID = Number(req.params.userId);
  const friendID = Number(req.params.friendId);

  if (!userID || !friendID) {
    res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    return;
  }

  try {
    const result = await communityService.getFriendshipStatus(userID, friendID);
    const isInitiator = result.user_id === userID;
    res.status(200).json({ status: 'success', data: { status: result.status, isInitiator } });
  } catch (err) {
    logger.error(`[Community] Failed to get friendship status for ${userID}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not fetch friendship status' });
  }
});

/**
 * @route POST /api/community/friends/request
 * @desc Sends a friend request from one user to another
 * @body { sender_id, receiver_id }
 */
router.post('/friends/request/:sender_id/:receiver_id', async (req: Request, res: Response) => {
  const sender_id = Number(req.params.sender_id);
  const receiver_id = Number(req.params.receiver_id);

  if (!sender_id || !receiver_id) {
    res.status(400).json({ status: 'error', message: 'Missing sender or receiver ID.' });
    return;
  }

  try {
    const request = await communityService.sendFriendRequest(sender_id, receiver_id);
    res.status(200).json({ status: 'success', message: 'Friend request sent.', data: request });

    // Notify the receiver about the friend request
    await notifyUser(receiver_id, 'friend_request', {
      user_id: sender_id,
      sender_id: sender_id
    });
  } catch (err) {
    logger.error(`[Community] Failed to send friend request:`, err);
    res.status(500).json({ status: 'error', message: 'Could not send friend request.' });
  }
});

router.post('/membership/request', async (req: Request, res: Response) => {
  const { community_id, user_id } = req.body;

  if (!community_id || !user_id) {
    res.status(400).json({ status: 'error', message: 'Missing community ID or user ID.' });
    return;
  }

  try {
    const request = await communityService.requestCommunityMembership(community_id, user_id);
    res.status(200).json({ status: 'success', message: 'Membership requested.' });
  } catch (err) {
    logger.error(`[Community] Failed to request membership for user ID ${user_id} in community ID ${community_id}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not request membership.' });
  }
});

router.get('/membership/requests/:communityId', async (req: Request, res: Response) => {
  const communityId = Number(req.params.communityId);

  if (isNaN(communityId)) {
    res.status(400).json({ status: 'error', message: 'Invalid community ID.' });
    return;
  }

  try {
    const requests = await communityService.getCommunityInvites(communityId);
    res.status(200).json({ status: 'success', data: requests });
  } catch (err) {
    logger.error(`[Community] Failed to fetch membership requests for community ID ${communityId}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not fetch membership requests.' });
  }
});

router.post('/membership/respond', async (req: Request, res: Response) => {
  const { community_id, user_id, action } = req.body;
  
  if (!community_id || !user_id || !action) {
    logger.error('[Community] Missing required fields for membership response.');
    res.status(400).json({ status: 'error', message: 'Missing required fields.' });
    return;
  }

  // c

  if (action !== 'accepted' && action !== 'declined') {
    logger.error('[Community] Invalid action for membership response');
    res.status(400).json({ status: 'error', message: 'Invalid action.' });
    return;
  }

  try {
    const response = await communityService.respondToInvite(community_id, user_id, action);
    res.status(200).json({ status: 'success', message: `Membership request ${action}.`, data: response });

    // Notify the user about the membership response
    await notifyUser(user_id, `membership_request_${action}`, {
      community_id,
      action,
    });
  } catch (err) {
    logger.error(`[Community] Failed to respond to membership request for user ID ${user_id} in community ID ${community_id}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not respond to membership request.' });
  }
});

/**
 * @route PUT /api/community/friends/remove
 * @desc removes friend status
 * @body { sender_id, receiver_id}
 */
router.delete('/friends/remove/:sender/:receiver', async (req: Request, res: Response) => {
  const sender_id = Number(req.params.sender);
  const receiver_id = Number(req.params.receiver);

  if (!sender_id || !receiver_id) {
    res.status(400).json({ status: 'error', message: 'Missing sender or receiver ID.' });
    return;
  }

  try {
    const request = await communityService.deleteFriend(sender_id, receiver_id);
    res.status(200).json({ status: 'success', message: 'Friend deleted sent.', data: request });
  } catch (error) {
    logger.error(`[Community] Failed to remove friend:`, error);
    res.status(500).json({ status: 'error', message: 'Could not remove friend.' });
  }
});

router.patch('/friends/update', async (req: Request, res: Response) => {
  const { user_id, friend_id, action } = req.body;
  if (!user_id || !friend_id) {
    logger.error('[Community] Missing user_id or friend_id in request body');
    res.status(400).json({ status: 'error', message: 'Missing sender or receiver ID.' });
    return;
  }

  if (action !== 'accepted' && action !== 'declined') {
    res.status(400).json({ status: 'error', message: 'Incorrect action' });
    return;
  }

  try {
    const request = await communityService.respondToFriendRequests( Number(friend_id), Number(user_id), action);
    res.status(200).json({ status: 'success', message: 'Friendship status updated successfully.', data: request });

    // get username
    const user = await au.getUserById(user_id);
    // Notify the user about the friendship status update
    if (action === 'accepted') {
      await notifyUser(friend_id, 'friend_request_accepted', {
        user_id: user_id,
        username: user.username,
      });
    } else if (action === 'declined') {
      await notifyUser(friend_id, 'friend_request_declined', {
        user_id: user_id,
      });
    }
  } catch (err) {
    logger.error(`[Community] Failed to remove friend:`, err);
    res.status(500).json({ status: 'error', message: 'Could not update friendship status.' });
  }

});

/**
 * @route GET /api/community/challenges/user/:userId
 * @desc Fetch challenges joined by a specific user, categorized into active, upcoming, and completed
 */
router.get('/challenges/user/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid user ID.',
    });
    return;
  }

  try {
    const data = await communityService.getChallengesByUserCategorized(userId);
    res.status(200).json({
      status: 'success',
      message: 'Challenges fetched and categorized successfully.',
      data,
    });
  } catch (err) {
    logger.error(`[Route] Failed to fetch categorized challenges for user ID ${userId}:`, err);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch categorized challenges.',
    });
  }
});

router.get('/challenges/:challengeId', async (req, res) => {
  const challengeId = Number(req.params.challengeId);

  if (isNaN(challengeId)) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid challenge ID.',
    });
    return;
  }

  try {
    const challenge = await communityService.getChallenge(challengeId);
    if (!challenge) {
      res.status(404).json({
        status: 'error',
        message: 'Challenge not found.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Challenge details retrieved successfully.',
      data: challenge,
    });
  } catch (err) {
    logger.error(`[Route] Failed to fetch challenge ID ${challengeId}:`, err);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch challenge details.',
    });
  }
});


/**
 * @route POST /api/community/challenges
 * @desc Creates a new community challenge
 */
router.post('/challenges', async (req: Request, res: Response) => {
  const {
    creator_id,
    community_id,
    challenge_title,
    challenge_type,
    measurement_type,
    target_amount,
    start_date,
    target_date,
    category_id,
    custom_category_id,
    banner_id,
    difficulty,
  } = req.body;

  const requiredFields = {
    creator_id,
    community_id,
    challenge_title,
    challenge_type,
    measurement_type,
    target_amount,
    start_date,
    target_date,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([ _, value ]) => !value)
    .map(([ key ]) => key);

  if (missingFields.length > 0) {
    logger.error(`[Community] Missing required challenge fields: ${missingFields.join(', ')}`);
    res.status(400).json({
      status: 'error',
      message: `Missing required challenge fields: ${missingFields.join(', ')}`,
    });
    return;
  }

  try {
    const createdChallenge = await communityService.createChallenge({
      creator_id,
      community_id,
      challenge_title,
      challenge_type,
      measurement_type,
      target_amount,
      start_date,
      target_date,
      category_id,
      custom_category_id,
      banner_id,
      difficulty,
    });

    res.status(201).json({
      status: 'success',
      message: 'Challenge created successfully.',
      data: createdChallenge,
    });
    logger.info(`[Community] Challenge created successfully: ${createdChallenge.challenge_id}`);
    return;
  } catch (err) {
    logger.error('[Community] Failed to create challenge:', err);

    res.status(500).json({
      status: 'error',
      message: 'Could not create challenge.',
    });
    return;
  }
});


router.delete('/challenges/:challengeId', async (req: Request, res: Response) => {
  const challengeId = Number(req.params.challengeId);

  if (isNaN(challengeId)) {
    res.status(400).json({ status: 'error', message: 'Invalid challenge ID.' });
    return;
  }

  try {
    const deletedChallenge = await communityService.deleteChallengeById(challengeId);
    res.status(200).json({
      status: 'success',
      message: `Challenge "${deletedChallenge.challenge_title}" deleted successfully.`,
    });
    return;
  } catch (error) {
    logger.error(`[Community] Failed to delete challenge ID ${challengeId}:`, error);
    res.status(500).json({ status: 'error', message: 'Could not delete challenge.' });
    return;
  }
});

/**
 * @route GET /api/community/categories/:userId
 * @desc Returns global and user-specific custom categories
 */
router.get('/categories/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Invalid user ID.' });
    return;
  }

  try {
    const categories = await communityService.getCategoriesWithCustom(userId);

    res.status(200).json({
      status: 'success',
      message: 'Fetched all categories.',
      data: categories,
    });
    return;
  } catch (err) {
    logger.error('[Community] Failed to fetch categories:', err);

    res.status(500).json({
      status: 'error',
      message: 'Could not load categories.',
    });
    return;
  }
});

router.get('/:title', async (req: Request, res: Response) => {
  const communityId = req.params.title;
  if (!communityId) {
    res.status(400).json({ status: 'error', message: 'Community ID is required.' });
    return;
  }

  try {
    const community = await communityService.getCommunityByTitle(communityId);
    if (!community) {
      res.status(404).json({ status: 'error', message: 'Community not found.' });
      return;
    }
    res.status(200).json({
      status: 'success',
      message: 'Community details retrieved successfully.',
      data: community,
    });
  } catch (err) {
    logger.error(`[Community] Failed to fetch community ID ${communityId}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not fetch community details.' });
  }
})

export default router;