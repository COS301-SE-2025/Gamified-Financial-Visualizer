import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import axios from 'axios';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import { getCategories, createTransaction, getTransaction } from '../../transactions/services/transaction.service';
import { cp } from 'fs';
import { ExtractorContext } from '../strategies/strategy_context';

const AI_URL = process.env.AI_SERVICE_URL || 'https://gamified-finance-ai-avf0gsfrf5a4b9cj.southafricanorth-01.azurewebsites.net';
//const AI_URL = 'http://localhost:6000'; 


interface HealthCheckResponse {
  status: string;
  ready: boolean;
}

async function checkAIServiceHealth(maxRetries: number = 3, retryDelay: number = 5000): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(`[AI Health Check] Attempt ${attempt}/${maxRetries}`);

      const response = await axios.get<HealthCheckResponse>(`${AI_URL}/health`, {
        timeout: 5000,
        headers: { 'Accept': 'application/json' }
      });

      if (response.status === 200 && response.data.ready) {
        logger.info('[AI Health Check] Service is ready');
        return true;
      }

      logger.warn(`[AI Health Check] Service not ready: ${response.data.status}`);

    } catch (error: any) {
      logger.error(`[AI Health Check] Attempt ${attempt} failed: ${error.message}`);
    }

    if (attempt < maxRetries) {
      logger.info(`[AI Health Check] Waiting ${retryDelay / 1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  logger.error('[AI Health Check] Service not ready after all attempts');
  return false;
}

const upload = multer({ dest: '/tmp/uploads' });
const router = express.Router();

// run an external process and await its exit
export function runProcess(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    proc.stdout.on('data', d => console.log(`[extractor stdout]`, d.toString()));
    proc.stderr.on('data', d => console.error(`[extractor stderr]`, d.toString()));
    proc.once('error', reject);
    proc.once('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`Extractor exited with code ${code}`));
    });
  });
}

// STEP 1: upload → extract → classify → preview
router.post('/upload-statement', upload.single('statement'), async (req, res) => {
  const file = req.file, password = req.body.password || '', accountId = req.body.accountId, bankName = req.body.bankName;
  if (!file || !accountId) {
    res.status(400).json({ error: 'Missing file or accountId' });
    return;
  }

  try {

    console.log('[Upload] Checking AI service health...');
    const isAIReady = await checkAIServiceHealth(5, 5000);

    if (!isAIReady) {
      res.status(503).json({
        error: 'AI service is initializing. Please try again in a few minutes.',
        code: 'AI_SERVICE_UNAVAILABLE',
        retryAfter: 240 
      });
      return;
    }
    // 1. extract
    const extractor = new ExtractorContext(bankName);
    const outPath = '/tmp/transactions.json';
    await extractor.extract(file.path, outPath, password);

    // 2. load raw
    const transactions = JSON.parse(await fs.readFile('/tmp/transactions.json', 'utf8'));
    logger.info(`Extracted ${transactions.length} transactions from ${file.originalname}`);

    // 3. classify with retry logic
    let classificationResults;
    try {
      const { data } = await axios.post(`${AI_URL}/classifier/predict-batch`,
        { transactions },
        {
          timeout: 300000, // 1 minute timeout
          headers: { 'Content-Type': 'application/json' }
        }
      );
      classificationResults = data;
    } catch (classificationError: any) {
      if (classificationError.code === 'ECONNABORTED') {
        res.status(504).json({
          error: 'AI classification timed out. The service may be busy. Please try again.',
          code: 'AI_TIMEOUT'
        });
        return;
      }
      throw classificationError; // Re-throw other errors
    }

    const results = classificationResults as Array<{ category: string; source: string }>;

    const categories = await getCategories();

    logger.info(`Classification results ${results.length}`);
    if (results.length === 0) {
      logger.warn('No transactions classified, returning empty preview');
      res.status(400).json({ error: 'No transactions identified' });
      return;
    }

    // 4. preview for UI
    const preview = transactions.map((t: any, i: number) => {
      interface Transaction {
        direction: string;
        amount: number;
        description: string;
        date: string;
        [key: string]: any;

      }

      interface ClassificationResult {
        category: string;
        source: string;
      }

      interface Category {
        category_id: number;
        category_name: string;
        [key: string]: any;
      }

      const match: Category | undefined = categories.find(
        (c: Category) => c.category_name === (results[i] as ClassificationResult).category.toLowerCase()
      );
      // add custom category ID if it exists, otherwise default to 4
      const id = match ? match.category_id : 4;
      let transaction_type: Transaction['transaction_type'];
      if (t.direction === 'out') transaction_type = 'expense';
      else if (t.direction === 'in') transaction_type = 'income';
      else if (t.direction === 'transfer') transaction_type = 'transfer';
      else throw new Error(`Invalid direction ${t.direction}`);

      return {
        accountId,
        ...t,
        transaction_type,
        predicted_category: results[i].category,
        classification_source: results[i].source,
        category_id: id
      };
    });

    logger.info(`Generated preview for review ${preview.length}`);
    res.json({ preview });
  } catch (err: any) {
    logger.error('Pipeline error', err);
    // More specific error responses
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'AI service is unavailable. Please try again later.',
        code: 'AI_SERVICE_DOWN'
      });
    } else {
      res.status(500).json({ error: 'Failed to process statement' });
    }
  }
});

// classifierRouter.ts (or wherever you handle POST /feedback)
const db2model: Record<string, string> = {
  'groceries': 'Groceries',
  'transport': 'Transport',
  'fuel': 'Transport',
  'utilities': 'Utilities',
  'rent': 'Rent & Mortgage',
  'mortgage': 'Rent & Mortgage',
  'internet': 'Utilities',
  'phone': 'Utilities',
  'insurance': 'Insurance',
  'medical': 'Medical & Health',
  'health': 'Medical & Health',
  'fitness': 'Fitness',
  'subscriptions': 'Subscriptions',
  'entertainment': 'Entertainment',
  'restaurants': 'Restaurants',
  'clothing': 'Clothing',
  'personal care': 'Personal Care',
  'gifts': 'Gifts & Charity',
  'charity': 'Gifts & Charity',
  'taxes': 'Taxes',
  'savings': 'Savings & Investments',
  'investments': 'Savings & Investments',
  'loan repayment': 'Loan Repayment & Debt',
  'debt': 'Loan Repayment & Debt',
  'travel': 'Travel & Accommodation',
  'accommodation': 'Travel & Accommodation',
  'salary': 'Salary',
  'freelance': 'Business Income & Expenses',
  'bonus': 'Business Income & Expenses',
  'refund': 'Business Income & Expenses',
  'business income': 'Business Income & Expenses',
  'business expense': 'Business Income & Expenses',
  'transfer in': 'Wallet Transactions',
  'transfer out': 'Wallet Transactions',
  'cash withdrawal': 'Wallet Transactions',
  'cash deposit': 'Wallet Transactions',
  'wallet top-up': 'Wallet Transactions',
  'wallet withdrawal': 'Wallet Transactions',
  'maintenance': 'Home Improvement & Repairs',
  'repairs': 'Home Improvement & Repairs',
  'home improvement': 'Home Improvement & Repairs',
  'childcare': 'Childcare & Pets',
  'pets': 'Childcare & Pets',
  'crypto purchase': 'Crypto & Forex',
  'crypto sale': 'Crypto & Forex',
  'forex': 'Crypto & Forex',
  'fees': 'Fees',
  'commissions': 'Fees',
  'interest income': 'Fees',
  'dividends': 'Fees'
};

router.post('/feedback', async (req, res) => {
  const { feedback } = req.body as { feedback: Array<{ desc: string; corrected_category: string }> };
  if (!Array.isArray(feedback)) {
    res.status(400).json({ error: 'Missing feedback array' });
    return;
  }

  const payload = feedback.map(f => {
    const dbCat = f.corrected_category.toLowerCase();
    const modelCat = db2model[dbCat] || 'Miscellaneous';        // fallback if you like
    return {
      desc: f.desc,                            // make sure you also ship the txn description
      corrected_category: modelCat
    };
  });

  try {
    const { data } = await axios.post(`${AI_URL}/classifier/feedback-train`, { feedback: payload });
    const feedbackResponse = data as { status: string };
    res.json({ status: feedbackResponse.status });
    logger.info(`Feedback processed, retraining started: ${feedbackResponse.status}`);
  } catch (err) {
    logger.error('Feedback processing error', err);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
})

export interface Transaction {
  transaction_id?: number;  // Optional, auto-generated by DB
  account_id: number;
  category_id?: number;  // Optional if using custom_category_id
  custom_category_id?: number;  // Optional if using category_id
  transaction_amount: number;
  transaction_type: 'expense' | 'income' | 'transfer' | 'fee' | 'withdrawal' | 'deposit';
  transaction_name: string;  // Name or description of the transaction
  transaction_date: string;  // ISO date string format (YYYY-MM-DD)
  is_recurring?: boolean;
  linked_goal_id?: number;
  linked_challenge_id?: number;
  budget_id?: number;
  points_awarded?: number;
}

// STEP 2: confirm → persist
router.post('/confirm-statement', async (req, res) => {
  const { preview, recurringFlags } = req.body as {
    preview: Array<any>;
    recurringFlags?: boolean[];
  };

  if (!Array.isArray(preview)) {
    res.status(400).json({ error: 'Missing preview array' });
    return;
  }

  try {
    // 1) turn each "preview" item into your Transaction DTO
    const txns: Transaction[] = preview.map((t, i) => {
      let transaction_type: Transaction['transaction_type'];
      if (t.direction === 'out') transaction_type = 'expense';
      else if (t.direction === 'in') transaction_type = 'income';
      else if (t.direction === 'transfer') transaction_type = 'transfer';
      else throw new Error(`Invalid direction ${t.direction}`);

      // add goal, budget and challenge IDs if they exist

      return {
        account_id: t.accountId,
        category_id: t.category_id,
        transaction_amount: Math.abs(t.amount) ? Math.abs(t.amount) : 0,
        transaction_type,
        transaction_name: t.description,
        transaction_date: t.date,
        is_recurring: recurringFlags?.[i] ?? false,
        points_awarded: 0,
      };
    });

    // 2) call your service for each, in parallel
    const results = await Promise.all(
      txns.map(txn => createTransaction(txn))
    );

    // 3) send back the array of inserted rows (each has transaction_id & updated_balance)
    res.json({ transactions: results });
  } catch (err) {
    logger.error('DB insert error', err);
    res.status(500).json({ error: 'Failed to save transactions' });
  }
});

export default router;