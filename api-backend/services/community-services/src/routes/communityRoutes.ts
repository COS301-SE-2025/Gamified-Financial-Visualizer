import { Router, Request, Response } from 'express';
import { getUserCommunitiesWithMembers } from '../services/communityService';
import { getCommunitiesByUserId } from '../services/communityService';
import { updateCommunityName } from '../services/communityService';
import { deleteCommunityById } from '../services/communityService';
import { createCommunity } from '../services/communityService';
import { logger } from '../config/logger';

const router = Router();

/**
 * @route GET /api/community/:userId
 * @description Returns all communities the user is a member of, including community members.
 * @param {string} userId - ID of the user
 * @returns {Object[]} List of communities with member details
 */
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const data = await getUserCommunitiesWithMembers(userId);
    return res.status(200).json({ status: 'success', data });
  } catch (error) {
    logger.error('[Routes] Failed to retrieve community data', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/community/user/:userId
 * @description Returns a summary list of communities the user belongs to.
 * @param {string} userId - ID of the user
 * @returns {Object[]} List of communities (without members)
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const communities = await getCommunitiesByUserId(userId);
    return res.status(200).json({ status: 'success', data: communities });
  } catch (error) {
    logger.error('[Routes] Failed to get user community list', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route PUT /api/community/:communityId
 * @description Updates the name of a specific community.
 * @param {string} communityId - ID of the community to update
 * @body {string} community_name - New name for the community
 * @returns {Object} The updated community object
 */
router.put('/:communityId', async (req: Request, res: Response) => {
  const { communityId } = req.params;
  const { community_name } = req.body;

  if (!community_name || community_name.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'Community name is required.' });
  }

  try {
    const updated = await updateCommunityName(communityId, community_name.trim());

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Community not found or update failed.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Community name updated.',
      data: updated
    });
  } catch (error) {
    logger.error('[Routes] Failed to update community name', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/community/:communityId
 * @description Deletes a specific community by ID.
 * @param {string} communityId - ID of the community to delete
 * @returns {string} Success message or error if not found
 */
router.delete('/:communityId', async (req: Request, res: Response) => {
  const { communityId } = req.params;

  try {
    const success = await deleteCommunityById(communityId);

    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'Community not found or already deleted.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Community ${communityId} deleted successfully.`
    });
  } catch (error) {
    logger.error('[Routes] Failed to delete community', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/community
 * @description Creates a new community and links the creator as a member.
 * @body {string} user_id
 * @body {string} community_name
 * @body {string} description
 * @body {string} [banner]
 */
router.post('/', async (req: Request, res: Response) => {
  const { user_id, community_name, description, banner } = req.body;

  if (!user_id || !community_name || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'user_id, community_name, and description are required.'
    });
  }

  try {
    const newCommunity = await createCommunity({
      user_id,
      community_name,
      description,
      banner
    });

    return res.status(201).json({
      status: 'success',
      message: 'Community created successfully.',
      data: newCommunity
    });
  } catch (error) {
    logger.error('[Routes] Failed to create community', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


export default router;
