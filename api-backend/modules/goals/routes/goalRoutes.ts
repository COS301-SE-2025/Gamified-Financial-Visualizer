import { Router, Request, Response } from 'express';
import {
  createGoal,
  getGoal,
  getUserGoals,
  deleteGoal,
  addGoalProgress,
  completeGoal,
  reduceGoalProgress,
  getAllGoals,
  getUserGoalStats,
  getGoalsSummary,
  getGoalCategorySummary,
  getUpcomingGoals,
  getTotalGoalValue ,
  getWeeklyGoalCompletions,
  calculateGoalPerformance
} from '../services/goals.service';
import { logger } from '../../../config/logger';
import pool  from '../../../config/db';
const router = Router();

/**
 * @route POST /api/goal
 * @description Creates a financial goal (personal or community, depending on fields).
 */
router.post('/', async (req: Request, res: Response) => {
  const {
    user_id,
    goal_name,
    goal_type,
    target_amount,
    start_date,
    target_date,
    banner_id,
    category_id,
    custom_category_name
  } = req.body;

  const resolvedCategoryId = category_id;
  let resolvedCustomCategoryId: number | undefined = undefined;

  try {
    // If user provides a custom category
    if (!category_id && custom_category_name ) {
      // Check if it already exists or create it
      const result = await pool.query(
        'INSERT INTO custom_categories (user_id, name) VALUES ($1, $2) ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name RETURNING custom_category_id',
        [user_id, custom_category_name]
      );
      resolvedCustomCategoryId = result.rows[0].custom_category_id;
    }

    // Enforce the category constraint
    if ((resolvedCategoryId && resolvedCustomCategoryId) || (!resolvedCategoryId && !resolvedCustomCategoryId) || target_amount < 0) {
       res.status(400).json({
        status: 'error',
        message: 'Exactly one of category_id or custom_category_name must be provided.  or target_amount must be a positive number.',
      });
      return;
    }

    const goal_id = await createGoal({
      user_id,
      goal_name,
      goal_type,
      target_amount,
      start_date,
      target_date,
      banner_id,
      category_id: resolvedCategoryId,
      custom_category_id: resolvedCustomCategoryId,
      goal_status: 'in-progress'
    });

    res.status(201).json({ status: 'success', data: { goal_id } });
  } catch (error: any) {
    logger.error('[GoalRoutes] Failed to create goal', error);
    res.status(500).json({ status: 'error', message: error.message });
  }});

/**
 * @route GET /api/goal/:goalId
 * @description Fetch a single goal by ID.
 */
router.get('/:goalId', async (req: Request, res: Response) => {
  const { goalId } = req.params;

  try {
    const goal = await getGoal(Number(goalId));

    if (!goal) {
      res.status(404).json({ status: 'error', message: 'Goal not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: goal });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/:userId/summary
 * @description Fetch a summary of all goals.
 */
router.get('/:userId/summary', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const summary = await getGoalsSummary(Number(userId));

    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching user goals summary', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }

});


router.get('/:userId/category-summary', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const summary = await getGoalCategorySummary(Number(userId));

    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch category summary'
    });
  }
});
/**
 * @route GET /api/goal/user/:userId
 * @description Fetch all personal goals for a user.
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const goals = await getUserGoals(Number(userId));
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching user goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route PUT /api/goal/:goalId
 * @description Update a goal's details.
 */
router.put('/:goalId', async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const updates = req.body;

  try {
  //  await updateGoal(Number(goalId), updates);
    res.status(200).json({ status: 'success', message: 'Goal updated successfully' });
  } catch (error) {
    logger.error('[GoalRoutes] Error updating goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/:userId/performance', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const performance = await calculateGoalPerformance(Number(userId));
    res.status(200).json({ status: 'success', data: performance });
  } catch (error) {
    logger.error('[GoalRoutes] Error calculating goal performance', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/goal/:goalId
 * @description Delete a goal by ID.
 */
router.delete('/:goalId', async (req: Request, res: Response) => {
  const { goalId } = req.params;

  try {
    await deleteGoal(Number(goalId));
    res.status(200).json({ status: 'success', message: 'Goal deleted successfully' });
  } catch (error) {
    logger.error('[GoalRoutes] Error deleting goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/goal/:goalId/progress
 * @description Add progress to a goal.
 */
router.post('/:goalId/progress', async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const { contributor_id, amount_added } = req.body;

  if (!contributor_id || !amount_added) {
    res.status(400).json({ status: 'error', message: 'contributor_id and amount_added are required' });
    return;
  }

  try {
    const progressId = await addGoalProgress(Number(goalId), contributor_id, amount_added);
    res.status(201).json({ status: 'success', data: { progress_id: progressId } });
  } catch (error) {
    logger.error('[GoalRoutes] Error adding progress', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/user/:userId/upcoming', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const goals = await getUpcomingGoals(Number(userId));
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching upcoming goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
})


router.get('/user/:userId/total-value', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (!userId) {
    res.status(400).json({ status: 'error', message: 'User ID is required' });
    return;
  }

  try {
    const total = await getTotalGoalValue(userId);
    res.status(200).json({ status: 'success', data: { total_goal_value: total } });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
})


router.get('/:userId/progress-frequency', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    res.status(400).json({ status: 'error', message: 'Invalid user ID' });
    return;
  }

  try {
    const frequency = await getWeeklyGoalCompletions(userId);
    res.status(200).json({ status: 'success', data: frequency });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to get progress frequency' });
  }
});

/**
 * @route POST /api/goal/:goalId/complete
 * @description Mark a goal as completed.
 */
router.post('/:goalId/complete', async (req: Request, res: Response) => {
  const { goalId } = req.params;

  try {
    await completeGoal(Number(goalId));
    res.status(200).json({ status: 'success', message: 'Goal marked as completed' });
  } catch (error) {
    logger.error('[GoalRoutes] Error completing goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/goal/:goalId/reduce
 * @description Reduce goal progress and deduct points.
 */
router.post('/:goalId/reduce', async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const { amount } = req.body;

  if (!amount) {
    res.status(400).json({ status: 'error', message: 'amount is required' });
    return;
  }

  try {
    await reduceGoalProgress(Number(goalId), amount);
    res.status(200).json({ status: 'success', message: 'Progress reduced' });
  } catch (error) {
    logger.error('[GoalRoutes] Error reducing progress', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal
 * @description Fetch all goals.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const goals = await getAllGoals();
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching all goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


router.get('/user/:user_id/stats', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.user_id, 10);
  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Invalid user_id' });
  }

  try {
    const stats = await getUserGoalStats(userId);
    res.json({ status: 'success', data: stats });
  } catch (error: any) {
    logger.error('[Goals] Stats fetch failed', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


export default router;