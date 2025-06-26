import { Router, Request, Response } from 'express';
import {
  createBudget,
  getBudgetsSummary,
  createBudgetWithCategoryName,
  getBudgetsByUser,
  deleteBudget,
  getCategories,
  updateBudget,
  updateBudgetName
} from '../services/transaction.service';
import { logger } from '../../../config/logger';
import { eventBus } from "../../../events/event-bus";
const router = Router();

/**
 * @route POST /api/budget
 * @desc Create a new budget (category name used as budget_name)
 */
router.post('/', async (req: Request, res: Response) => {
  const { user_id, category_id, allocations } = req.body;

  if (!user_id || !category_id || !Array.isArray(allocations)) {
    res.status(400).json({
      status: 'error',
      message: 'Missing user_id, category_id, or invalid allocations'
    });
  }

  try {
    const budget_id = await createBudgetWithCategoryName(user_id, category_id, allocations);
    res.status(201).json({
      status: 'success',
      message: 'Budget created',
      data: { budget_id }
    });
  } catch (error: any) {
    logger.error('[Budget] Create failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
});



/**
 * @route GET /api/budget/user/:userId
 * @desc  List all budgets for a user, with current_amount and total target_amount
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10); // ✅ Fix here

  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Missing or invalid user_id' });
    return;
  }

  try {
    const budgets = await getBudgetsSummary(userId);
    res.json({ status: 'success', data: budgets });
  } catch (error: any) {
    logger.error('[Budget] Fetch failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route GET /api/categories
 * @desc Get all available categories
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json({
      status: 'success',
      data: categories
    });
  } catch (error: any) {
    logger.error('[Categories] Fetch failed', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @route GET /api/budget/:userId
 * @desc  List all budget (names only) created by a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', message: 'Missing or invalid user_id' });


    try {
      const budgets = await getBudgetsByUser(userId);
      res.status(200).json({ status: 'success', data: budgets });
    } catch (error: any) {
      logger.error('[Budget] Fetch failed', error);
      res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
    }
  }
});





/**
 * @route DELETE /api/budget/:budgetId
 * @desc Delete a budget
 */
router.delete('/:budgetId', async (req: Request, res: Response) => {
  const budgetId = parseInt(req.params.budgetId, 10);
  const { user_id } = req.body;

  if (isNaN(budgetId) || !user_id) {
    res.status(400).json({
      status: 'error',
      message: 'Missing or invalid budget_id or user_id'
    });
    return;
  }

  try {
    await deleteBudget(budgetId, user_id);
    res.json({
      status: 'success',
      message: 'Budget deleted successfully'
    });
  } catch (error: any) {
    logger.error('[Budget] Delete failed', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/budget/:budgetId
 * @desc Update budget name
 */
router.put('/:budgetId', async (req: Request, res: Response) => {
  const budgetId = parseInt(req.params.budgetId, 10);
  const { budget_name, user_id } = req.body;

  if (isNaN(budgetId) || !budget_name || !user_id) {
    res.status(400).json({
      status: 'error',
      message: 'Missing or invalid budget_id, budget_name, or user_id'
    });
    return;
  }

  try {
    await updateBudgetName(budgetId, budget_name, user_id);
    res.json({
      status: 'success',
      message: 'Budget updated successfully'
    });
  } catch (error: any) {
    logger.error('[Budget] Update failed', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/budget/:budgetId/name
 * @desc Update budget name only
 */
router.put('/:budgetId/name', async (req: Request, res: Response) => {
  const budgetId = parseInt(req.params.budgetId, 10);
  const { budget_name, user_id } = req.body;

  if (isNaN(budgetId) || !budget_name || !user_id) {
    res.status(400).json({
      status: 'error',
      message: 'Missing or invalid budget_id, budget_name, or user_id'
    });
    return;
  }

  try {
    await updateBudgetName(budgetId, budget_name, user_id);
    res.json({
      status: 'success',
      message: 'Budget name updated successfully'
    });
  } catch (error: any) {
    logger.error('[Budget] Update name failed', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
});

export default router;