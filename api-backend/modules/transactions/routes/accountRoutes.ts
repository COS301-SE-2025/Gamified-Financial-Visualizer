import { Router, Request, Response } from 'express';
import {
  createAccount,
  getAccounts,
  getAccountById, 
  deleteAccount,
  updateAccountName
} from '../services/transaction.service';
import { logger } from '../../../config/logger';

const router = Router();

/** 
 * @route POST /api/accounts
 * @desc Create a new account
*/
router.post('/', async (req: Request, res: Response) => {
  const { user_id, bank_name, account_name, account_type, currency, account_balance } = req.body;

  if (!user_id || !account_type || !account_name || !bank_name || !currency) {
     res.status(400).json({
      status: 'error',
      message: 'Missing required fields: user_id, account_name, account_type'
    });
  }

  try {
    // Logic to create the account here
    const accountId = await createAccount(user_id, bank_name, account_name, account_type, currency, account_balance);
    
    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      data: { account_id : accountId}
    });
  } catch (error: any) {
    logger.error('[Account] Create failed', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route GET /api/accounts/user/:user_id
 * @desc Fetch all accounts for a specific user
 */
router.get('/user/:user_id', async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  if (isNaN(user_id)) {
     res.status(400).json({ status: 'error', message: 'Invalid user ID' });
  }

  try {
    const accounts = await getAccounts(user_id);
    res.status(200).json({ status: 'success', data: accounts });
  } catch (error: any) {
    logger.error('[Account] Fetch all failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});


/**
 * @route GET /api/accounts/:account_id
 * @desc Fetch a specific account by account ID
 */
router.get('/:account_id', async (req: Request, res: Response) => {
  const account_id = parseInt(req.params.account_id, 10);
  if (isNaN(account_id)) {
     res.status(400).json({ status: 'error', message: 'Invalid account ID' });
  }

  try {
    const account = await getAccountById(account_id);

    if (!account) {
       res.status(404).json({ status: 'error', message: 'Account not found' });
    }

    res.status(200).json({ status: 'success', data: account });
  } catch (error: any) {
    logger.error('[Account] Fetch single failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route DELETE /api/accounts/:account_id.. make sure to pass user_id in the request body only
 * @desc Delete a specific account by account ID and user ID
 */
router.delete('/:account_id', async (req: Request, res: Response) => {
  const account_id = parseInt(req.params.account_id, 10);
  const user_id = req.body.user_id; // or consider using req.query.user_id

  if (isNaN(account_id) || !user_id) {
     res.status(400).json({
      status: 'error',
      message: 'Invalid or missing account_id or user_id'
    });
  }

  try {
    await deleteAccount(account_id, user_id);
    res.status(200).json({ status: 'success', message: 'Account deleted successfully' });
  } catch (error: any) {
    logger.error('[Account] Delete failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});

/**
 * @route PUT /api/accounts/:account_id
 * @desc Update a specific account by account ID (only account name can be changed)
 */
router.put('/:account_id', async (req: Request, res: Response) => {
  const account_id = parseInt(req.params.account_id, 10);
  const { account_name } = req.body;

  if (isNaN(account_id)) {
     res.status(400).json({ status: 'error', message: 'Invalid account ID' });
  }

  if (!account_name || typeof account_name !== 'string') {
     res.status(400).json({ status: 'error', message: 'account_name is required and must be a string' });
  }

  try {
    await updateAccountName(account_id, account_name);
    res.status(200).json({ status: 'success', message: 'Account name updated successfully' });
  } catch (error: any) {
    logger.error('[Account] Update name failed:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});



export default router;