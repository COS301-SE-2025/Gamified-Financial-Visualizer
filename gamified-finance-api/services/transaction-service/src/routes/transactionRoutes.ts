import { Router, Request, Response } from 'express';
import {
  createTransaction,
  getUserTransactions,
  getTotalSpentPerCategory
} from '../services/transaction.service';
import { logger } from '../config/logger';

const router = Router();

/**
 * @route POST /api/transactions
 * @desc Create a new transaction
 */
router.post('/', async (req: Request, res: Response) => {
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
    return;
  }

  try {
    const tx = await createTransaction({
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
      data: tx
    });
  } catch (error: any) {
    logger.error('[Transaction] Create failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route GET /api/transactions/user/:userId
 * @desc Get all transactions for a specific user
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const list = await getUserTransactions(Number(req.params.userId));
    res.status(200).json({ status: 'success', data: list });
  } catch (error) {
    logger.error('[Transaction] Fetch failed', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/transactions/user/:userId/summary
 * @desc Returns total spent by category for a specific user
 */
router.get('/user/:userId/summary', async (req: Request, res: Response) => {
  try {
    const summary = await getTotalSpentPerCategory(Number(req.params.userId));
    res.status(200).json({ status: 'success', data: summary });
  } catch (error) {
    logger.error('[Transaction] Summary failed', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;
