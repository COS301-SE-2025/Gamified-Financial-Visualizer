import { Router, Request, Response } from 'express';
import {
  createTransaction,
  createBudget,
  getUserTransactions,
  getTotalSpentPerCategory
}
  from '../../../../../backend/services/transactions.service';
import { logger } from '../config/logger';
console.log("Alias working:", createTransaction)
const router = Router();

/**
 * @route POST /api/transaction
 * @desc Create a new transaction
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      account_id,
      category_id,
      transaction_amount,
      transaction_type,
      transaction_date,
      description,
      is_recurring
    } = req.body;

    if (!account_id || !transaction_amount || !transaction_type || !description) {
      res.status(400).json({
        status: 'error',
        message: 'Required fields: account_id, transaction_amount, transaction_type, description'
      });
    }

    const transaction = await createTransaction({
      account_id,
      category_id,
      transaction_amount,
      transaction_type,
      transaction_date,
      description,
      is_recurring
    });

    res.status(201).json({
      status: 'success',
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error: any) {
    logger.error('[Transaction] Create failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route POST /api/budget
 * @description Creates a budget period and assigns a target amount to a transaction category
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const {
    user_id,
    budget_name,
    period_start,
    period_end,
    allocations
  } = req.body;

  if (!user_id || !period_start || !period_end || !Array.isArray(allocations)) { // must be an array
    res.status(400).json({
      status: 'error',
      message: 'user_id, period_start, period_end, and target_amount are required.'
    });
  }

  try {
    const result = await createBudget(
      user_id,
      budget_name,
      period_start,
      period_end,
      allocations
    );

    res.status(201).json({
      status: 'success',
      message: 'Budget and category allocation created successfully.',
      data: { budget_id: result }
    });
  } catch (error: any) {
    logger.error('[Routes] Failed to create budget', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route GET /api/transaction/user/:userId
 * @description Get all transactions for a specific user
 */
router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const transactions = await getUserTransactions(Number(userId));
    res.status(200).json({ status: 'success', data: transactions });
  } catch (error) {
    logger.error('[Routes] Failed to fetch user transactions', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/transaction/user/:userId/summary
 * @description Returns total amounts grouped by category for a specific user
 */
router.get('/user/:userId/summary', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const summary = await getTotalSpentPerCategory(Number(userId));
    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    logger.error('[Routes] Failed to fetch transaction summary', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



export default router;
