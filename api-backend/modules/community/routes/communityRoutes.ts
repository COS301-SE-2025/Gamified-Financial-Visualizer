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





















export default router;
