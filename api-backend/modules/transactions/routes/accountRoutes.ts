import { Router, Request, Response } from 'express';
import {
  createAccount,
  getAccounts
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


export default router;