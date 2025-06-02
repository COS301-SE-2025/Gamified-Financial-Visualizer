import { Router, Request, Response } from 'express';
import { createBudget, getBudgetsSummary, getBudget } from '../services/transaction.service';
import { logger } from '../../../config/logger';

const router = Router();

/**
 * @route POST /api/budget
 * @desc Create a budget period with category allocations
 */
router.post('/', async (req: Request, res: Response) => {
  const { user_id, budget_name, period_start, period_end, allocations } = req.body;

  if (!user_id || !budget_name || !period_start || !period_end || !Array.isArray(allocations)) {
    res.status(400).json({
      status: 'error',
      message: 'Fields missing or allocations is not an array.'
    });
    return;
  }

  try {
    const budgetId = await createBudget(
      user_id,
      budget_name,
      period_start,
      period_end,
      allocations
    );
    res.status(201).json({
      status: 'success',
      message: 'Budget created successfully',
      data: { budget_id: budgetId }
    });
  } catch (error: any) {
    logger.error('[Budget] Create failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});




/**
 * @route GET /api/budget?user_id=123
 * @desc  List all budgets for a user, with current_amount and total target_amount
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.user_id as string, 10);
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

export default router;
