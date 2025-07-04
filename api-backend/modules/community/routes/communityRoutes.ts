import { Router, Request, Response } from 'express';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import * as communityService from '../services/community.service';

const router = Router();

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


/**
 * @route POST /api/community
 * @desc Creates a new community and optionally sends invites
 */
router.post('/', async (req: Request, res: Response) => {
  const { owner_id, community_name, description, banner_id, invited_usernames } = req.body;

  if (!owner_id || !community_name) {
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
        const userRes = await client.query(`SELECT user_id FROM users WHERE username = $1`, [username]);
        if (userRes.rows[0]) {
          await communityService.addCommunityMember(newCommunity.community_id, userRes.rows[0].user_id, 'invited');
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
router.get('/banners', async (_req, res) => {
  try {
    const banners = await communityService.getAllBanners();
    res.status(200).json({ status: 'success', data: banners });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Could not fetch banners.' });
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
    res.status(500).json({ status: 'error', message: 'Could not fetch friends.' });
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
    res.status(500).json({ status: 'error', message: 'Could not fetch recommendations' });
  }
});


/**
 * @route POST /api/community/friends/request
 * @desc Sends a friend request from one user to another
 * @body { sender_id, receiver_id }
 */
router.post('/friends/request', async (req: Request, res: Response) => {
  const { sender_id, receiver_id } = req.body;

  if (!sender_id || !receiver_id) {
    res.status(400).json({ status: 'error', message: 'Missing sender or receiver ID.' });
    return;
  }

  try {
    const request = await communityService.sendFriendRequest(sender_id, receiver_id);
    res.status(200).json({ status: 'success', message: 'Friend request sent.', data: request });
  } catch (err) {
    logger.error(`[Community] Failed to send friend request:`, err);
    res.status(500).json({ status: 'error', message: 'Could not send friend request.' });
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
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    logger.debug(`[Community] Missing required challenge fields: ${missingFields.join(', ')}`);
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

export default router;