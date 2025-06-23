import { Router, Request, Response } from 'express';
import {
  createTransaction,
  getUserTransactions,
  getTotalSpentPerCategory,
  getCategoryNameByID,
  getCategories,
  getTransactionByAccount,
  deleteTransaction,
  updateTransactionDetails
} from '../services/transaction.service';
import { logger } from '../../../config/logger';

const router = Router();

/**
 * @route POST /api/transactions
 * @desc Create a new transaction
 */
router.post('/', async (req: Request, res: Response) => {
  const {
    account_id,
    category_id,
    custom_category_id,
    budget_id,
    transaction_amount,
    transaction_type,
    transaction_date,
    transaction_name,
    is_recurring,
    linked_goal_id,
    linked_challenge_id,
    points_awarded
  } = req.body;

  // Validation: Check required fields
  if (!account_id || !transaction_amount || !transaction_type || !transaction_name) {
     res.status(400).json({
      status: 'error',
      message: 'Missing required fields: account_id, transaction_amount, transaction_type, transaction_name'
    });
  }

  // Validation: Check that transaction_amount is a valid number
  const amount = parseFloat(transaction_amount);
  if (isNaN(amount) || amount <= 0) {
     res.status(400).json({
      status: 'error',
      message: 'transaction_amount must be a valid positive number'
    });
  }

  // Validation: Check category conflict
  if (category_id && custom_category_id) {
     res.status(400).json({
      status: 'error',
      message: 'Only one of category_id or custom_category_id may be provided'
    });
  }

  try {
    const tx = await createTransaction({
      account_id,
      category_id,
      custom_category_id,
      budget_id,
      transaction_amount: amount, // Use the parsed amount
      transaction_type,
      transaction_date,
      transaction_name,
      is_recurring,
      linked_goal_id,
      linked_challenge_id,
      points_awarded
    });

     res.status(201).json({
      status: 'success',
      message: 'Transaction created successfully',
      data: {
        transaction_id: tx.transaction_id,
        updated_balance: tx.updated_balance
      }
    });
  } catch (error: any) {
    logger.error('[Transaction] Create failed', error.message || error);
     res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Internal server error' 
    });
  }
});


/**
 * @route GET /api/transactions/user/:userId
 * @desc Get all transactions for a specific user (across all accounts)
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
     res.status(400).json({ status: 'error', message: 'Invalid user ID' });
  }

  try {
    const transactions = await getUserTransactions(userId);
    res.status(200).json({ status: 'success', data: transactions });
  } catch (error) {
    logger.error('[Transaction] Fetch all for user failed:', error);
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



/**
 * @route   GET /api/transaction/categories
 * @desc    Return all global categories
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json({ status: 'success', data: categories });
  } catch (error: any) {
    logger.error('[Transaction] getCategories failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route   GET /api/transactions/categories/:category_id
 * @desc    Return the name of a single category by its ID
 */
router.get('/categories/:category_id', async (req: Request, res: Response) => {
  const categoryID = parseInt(req.params.category_id, 10);
  if (isNaN(categoryID)) {
    res.status(400).json({ status: 'error', message: 'Invalid category_id parameter' });
  }

  try {
    const categoryName = await getCategoryNameByID(categoryID);
    if (!categoryName) {
      res.status(404).json({ status: 'error', message: 'Category not found' });
    }
     res.json({
      status: 'success',
      data: { category_id: categoryID, category_name: categoryName }
    });
  } catch (error: any) {
    logger.error('[Transaction] getCategoryNameByID failed', error);
    res
      .status(500)
      .json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route GET /api/transaction/accounts/:account_id
 * @desc Fetch all transactions for a specific account
 */
router.get('/accounts/:account_id', async (req: Request, res: Response) => {
  const account_id = parseInt(req.params.account_id, 10);

  if (isNaN(account_id)) {
   res.status(400).json({ status: 'error', message: 'Invalid account ID' });
  }

  try {
    const transactions = await getTransactionByAccount(account_id);
    res.status(200).json({ status: 'success', data: transactions });
  } catch (error: any) {
    logger.error('[Transaction] Fetch by account failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route DELETE /api/transactions/:transaction_id
 * @desc Delete a specific transaction by its ID
 */
router.delete('/:transaction_id', async (req: Request, res: Response) => {
  const transaction_id = parseInt(req.params.transaction_id, 10);

  if (isNaN(transaction_id)) {
     res.status(400).json({ status: 'error', message: 'Invalid transaction ID' });
  }

  try {
    await deleteTransaction(transaction_id);
    res.status(200).json({
      status: 'success',
      message: `Transaction ID ${transaction_id} deleted successfully`,
    });
  } catch (error: any) {
    logger.error('[Transaction] Delete failed:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
});


/**
 * @route PUT /api/transactions/:transaction_id
 * @desc Update a transaction's name, date, category, or amount
 */
router.put('/:transaction_id', async (req: Request, res: Response) => {
  const transaction_id = parseInt(req.params.transaction_id, 10);
  const { transaction_name, transaction_date, category_id, custom_category_id, transaction_amount } = req.body;

  if (isNaN(transaction_id)) {
     res.status(400).json({ status: 'error', message: 'Invalid transaction ID' });
  }

  if (!transaction_name && !transaction_date && !category_id && !custom_category_id && !transaction_amount) {
     res.status(400).json({ status: 'error', message: 'No update fields provided' });
  }

  if (category_id && custom_category_id) {
     res.status(400).json({ status: 'error', message: 'Provide only one category type' });
  }

  try {
    const result = await updateTransactionDetails(transaction_id, {
      transaction_name,
      transaction_date,
      category_id,
      custom_category_id,
      transaction_amount
    });

    res.status(200).json({ status: 'success', message: 'Transaction updated', data: result });
  } catch (error: any) {
    logger.error('[Transaction] Update failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});




export default router;