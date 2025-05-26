import { Router, Request, Response } from 'express';
import { 
  createPersonalGoal, 
  createCommunityGoal,
  getPersonalGoalsByUserId,
  getCommunityGoalsForUser,
  updateGoalNameByUser,
  deleteGoalByUser,
  updateCommunityGoalNameByUser,
  deleteCommunityGoalByUser,
  getAchievedPersonalGoals,
  getInProgressPersonalGoals,
  getAchievedCommunityGoals,
  getInProgressCommunityGoals,
  getPersonalGoalById,
  getCommunityGoalById
} from '../services/goalService';
import { logger } from '../config/logger';

const router = Router();

/**
 * @route POST /api/goal
 * @description Creates a personal financial goal for a user.
 * @body user_id, goal_name, goal_type, target_amount, target_date, goal_status
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { user_id, goal_name, goal_type, target_amount, target_date, goal_status } = req.body;

  if (!user_id || !goal_name || !goal_type || !target_amount || !target_date || !goal_status) {
    res.status(400).json({
      status: 'error',
      message: 'All fields are required.'
    });
    return;
  }

  try {
    const goal = await createPersonalGoal({
      user_id,
      goal_name,
      goal_type,
      target_amount,
      target_date,
      goal_status
    });

    res.status(201).json({
      status: 'success',
      message: 'Goal created successfully.',
      data: goal
    });
  } catch (error) {
    logger.error('[Routes] Failed to create goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/goal/community
 * @description Creates a community goal tied to a community.
 * @body user_id, community_id, goal_name, goal_type, target_amount, target_date, goal_status
 */
router.post('/community', async (req: Request, res: Response): Promise<void> => {
  const {
    user_id,
    community_id,
    goal_name,
    goal_type,
    target_amount,
    target_date,
    goal_status
  } = req.body;

  if (
    !user_id || !community_id || !goal_name || !goal_type ||
    !target_amount || !target_date || !goal_status
  ) {
    res.status(400).json({
      status: 'error',
      message: 'All fields are required for a community goal.'
    });
    return;
  }

  try {
    const goal = await createCommunityGoal({
      user_id,
      community_id,
      goal_name,
      goal_type,
      target_amount,
      target_date,
      goal_status
    });

    res.status(201).json({
      status: 'success',
      message: 'Community goal created successfully.',
      data: goal
    });
  } catch (error) {
    logger.error('[Routes] Failed to create community goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId
 * @description Retrieves all personal (non-community) goals for a specific user.
 * @param userId Path param — ID of the user
 * @returns {Object[]} List of personal goals
 */
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const goals = await getPersonalGoalsByUserId(userId);
    res.status(200).json({
      status: 'success',
      data: goals
    });
  } catch (error) {
    logger.error('[Routes] Failed to fetch personal goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId/community
 * @description Retrieves all community goals where the user is a member of the community.
 * @param userId - the user's ID
 * @returns List of community goals (excluding progress_percent)
 */
router.get('/user/:userId/community', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const goals = await getCommunityGoalsForUser(userId);
    res.status(200).json({
      status: 'success',
      data: goals
    });
  } catch (error) {
    logger.error('[Routes] Failed to fetch community goals for user', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route PUT /api/goal/:goalId
 * @description Allows a user to update the name of a goal they created.
 * @body user_id
 * @body {string} goal_name
 */
router.put('/:goalId', async (req: Request, res: Response): Promise<void> => {
  const { goalId } = req.params;
  const { user_id, goal_name } = req.body;

  if (!user_id || !goal_name || goal_name.trim() === '') {
    res.status(400).json({
      status: 'error',
      message: 'Both user_id and a valid new goal_name are required.'
    });
    return;
  }

  try {
    const updated = await updateGoalNameByUser(goalId, user_id, goal_name.trim());

    if (!updated) {
      res.status(404).json({
        status: 'error',
        message: 'Goal not found or user not authorized.'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Goal name updated successfully.',
      data: updated
    });
  } catch (error) {
    logger.error('[Routes] Failed to update goal name', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/goal/:goalId
 * @description Allows a user to delete a goal they created.
 * @body {string} user_id - The ID of the user requesting deletion
 */
router.delete('/:goalId', async (req: Request, res: Response): Promise<void> => {
  const { goalId } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({
      status: 'error',
      message: 'user_id is required to delete a goal.'
    });
    return;
  }

  try {
    const deleted = await deleteGoalByUser(goalId, user_id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Goal not found or user not authorized to delete.'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: `Goal ${goalId} deleted successfully.`
    });
  } catch (error) {
    logger.error('[Routes] Failed to delete goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route PUT /api/goal/community/:goalId
 * @description Allows a user to update the name of a community goal they created.
 * @body {string} user_id - the creator of the goal
 * @body {string} goal_name - new name
 */
router.put('/community/:goalId', async (req: Request, res: Response): Promise<void> => {
  const { goalId } = req.params;
  const { user_id, goal_name } = req.body;

  if (!user_id || !goal_name || goal_name.trim() === '') {
    res.status(400).json({
      status: 'error',
      message: 'Both user_id and a valid new goal_name are required.'
    });
    return;
  }

  try {
    const updated = await updateCommunityGoalNameByUser(goalId, user_id, goal_name.trim());

    if (!updated) {
      res.status(404).json({
        status: 'error',
        message: 'Community goal not found or user not authorized.'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Community goal name updated successfully.',
      data: updated
    });
  } catch (error) {
    logger.error('[Routes] Failed to update community goal name', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/goal/community/:goalId
 * @description Allows a user to delete a community goal they created.
 * @body {string} user_id - The ID of the user requesting deletion
 */
router.delete('/community/:goalId', async (req: Request, res: Response): Promise<void> => {
  const { goalId } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400).json({
      status: 'error',
      message: 'user_id is required to delete a community goal.'
    });
    return;
  }

  try {
    const deleted = await deleteCommunityGoalByUser(goalId, user_id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Community goal not found or user not authorized.'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: `Community goal ${goalId} deleted successfully.`
    });
  } catch (error) {
    logger.error('[Routes] Failed to delete community goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId/in-progress
 * @description Get all personal goals still in progress for a user
 */
router.get('/user/:userId/in-progress', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const goals = await getInProgressPersonalGoals(userId);
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[Routes] Failed to fetch in-progress goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId/achieved
 * @description Get all personal goals that have been achieved by a user
 */
router.get('/user/:userId/achieved', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const goals = await getAchievedPersonalGoals(userId);
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[Routes] Failed to fetch achieved goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId/community/achieved
 * @description Get all community goals marked as achieved for communities the user belongs to
 */
router.get('/user/:userId/community/achieved', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const goals = await getAchievedCommunityGoals(userId);
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[Routes] Failed to fetch achieved community goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId/community/in-progress
 * @description Get all in-progress community goals for communities the user belongs to
 */
router.get('/user/:userId/community/in-progress', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const goals = await getInProgressCommunityGoals(userId);
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[Routes] Failed to fetch in-progress community goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/community/:goalId
 * @description Returns a specific community goal
 */
router.get('/community/:goalId', async (req: Request, res: Response): Promise<void> => {
  const { goalId } = req.params;

  try {
    const goal = await getCommunityGoalById(goalId);

    if (!goal) {
      res.status(404).json({
        status: 'error',
        message: 'Community goal not found.'
      });
    }

    res.status(200).json({ status: 'success', data: goal });
  } catch (error) {
    logger.error('[Routes] Failed to fetch community goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/personal/:goalId
 * @description Returns a specific personal goal (not linked to a community)
 */
router.get('/personal/:goalId', async (req: Request, res: Response): Promise<void> => {
  const { goalId } = req.params;

  try {
    const goal = await getPersonalGoalById(goalId);

    if (!goal) {
      res.status(404).json({
        status: 'error',
        message: 'Personal goal not found.'
      });
    }

    res.status(200).json({ status: 'success', data: goal });
  } catch (error) {
    logger.error('[Routes] Failed to fetch personal goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



export default router;