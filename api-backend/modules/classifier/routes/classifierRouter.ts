import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import axios from 'axios';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';
import { getCategoryId, getCategories } from '../../transactions/services/transaction.service';
import { cp } from 'fs';

const upload = multer({ dest: '/tmp/uploads' });
const router = express.Router();

// run an external process and await its exit
function runProcess(cmd: string, args: string[]): Promise<void> {
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
  const file = req.file, password = req.body.password || '', accountId = req.body.accountId;
  if (!file || !accountId) {
    res.status(400).json({ error: 'Missing file or accountId' });
    return;
  }

  try {
    // 1. extract
    await runProcess('python3', [
      path.resolve(__dirname, '../app/services/extract_transactions.py'),
      file.path, '--out', '/tmp/transactions.json', '--password', password
    ]);

    // 2. load raw
    const transactions = JSON.parse(await fs.readFile('/tmp/transactions.json', 'utf8'));

    logger.info(`Extracted ${transactions.length} transactions from ${file.originalname}`);

    // 3. classify
    const { data } = await axios.post('http://localhost:6000/predict-batch', { transactions });
    const results = data as Array<{ category: string; source: string }>;
    if (!Array.isArray(results) || results.length !== transactions.length) {
      logger.error('Classifier mismatch', { expected: transactions.length, got: results.length });
      res.status(500).json({ error: 'Classifier returned wrong length' });
      return;
    }

    const categories = await getCategories();
    logger.info(`Classification results ${ results.length }`);
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
      const id = match ? match.category_id : 4;
      return {
        accountId,
        ...t,
        predicted_category: results[ i ].category,
        classification_source: results[ i ].source,
        category_id: id
      };
    });

    logger.info(`Generated preview for review ${preview.length }`);
    res.json({ preview });
  } catch (err) {
    logger.error('Pipeline error', err);
    res.status(500).json({ error: 'Failed to process statement' });
  }
});

router.post('/feedback', async (req, res) => {
  const { preview, recurringFlags } = req.body as {
    preview: Array<any>;
    recurringFlags?: boolean[];
  };  
})

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
    // build enriched rows
    const enriched = preview.map((t, i) => {
      let transaction_type: string;
      if (t.direction === "out") {
        transaction_type = "expense";
      } else if (t.direction === "in") {
        transaction_type = "income";
      } else {
        logger.error('Invalid transaction direction', { direction: t.direction });
        throw new Error('Invalid transaction direction');
      }

      return {
        account_id: t.accountId,
        category_id: t.category_id,
        transaction_amount: Math.abs(t.amount),
        transaction_type,
        transaction_name : t.description,
        transaction_date: t.date,
        is_recurring: recurringFlags?.[ i ] ?? false
      };
    });


    // bulk‐insert
    const cols = [
      'account_id',
      'category_id',
      'transaction_amount',
      'transaction_type',
      'transaction_name',
      'transaction_date',
      'is_recurring'
    ];
    const placeholders = enriched
      .map((_, row) =>
        `(${cols.map((__, col) => `$${row * cols.length + col + 1}`).join(',')})`
      )
      .join(',');
    const values = enriched.flatMap(row =>
      cols.map(c => (row as any)[ c ])
    );

    const { rows } = await pool.query(
      `INSERT INTO transactions (${cols.join(',')})
         VALUES ${placeholders}
       RETURNING *`,
      values
    );

    res.json({ inserted: rows });
  } catch (err) {
    logger.error('DB insert error', err);
    res.status(500).json({ error: 'Failed to save transactions' });
  }
});

export default router;