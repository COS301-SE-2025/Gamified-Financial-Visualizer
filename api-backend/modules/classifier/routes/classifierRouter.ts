import express from 'express';
import multer from 'multer';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import axios from 'axios';
import pool from '../../../config/db';
import { logger } from '../../../config/logger';

const upload = multer({ dest: '/tmp/uploads' });
const router = express.Router();

// Helper to await a child process event once
function once(proc: ChildProcessWithoutNullStreams, event: string): Promise<void> {
  return new Promise((resolve, reject) => {
    proc.once(event, (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    proc.once('error', reject);
  });
}

// 1. User uploads PDF
router.post('/upload-statement', upload.single('statement'), async (req, res) => {
  const pdfPath = req.file?.path;
  const password = req.body.password || '';
  const accountID = req.body.accountId;

  try {
    // 2. Run extract_transactions.py → raw JSON
    const extractor = spawn('python3', [
      './app/services/extract_transactions.py',
      pdfPath,
      '--out', '/tmp/transactions.json',
      '--password', password
    ]);
    await once(extractor, 'exit');

    // 3. Load the extracted JSON
    const transactions = require('/tmp/transactions.json');

    // 4. Call your Python classifier microservice
    const { data } = await axios.post(
      'http://localhost:6000/predict-batch',
      { transactions }
    );
    // results: Array<{ category, source }>
    const results = data as Array<{ category: string; source: string }>;

    // 5. Combine and persist into your DB
    const enriched = transactions.map((t, i) => ({
      account_id: accountID,
      transaction_date: t.date,
      description: t.description,
      transaction_amount: t.amount,
      transaction_type: t.direction,
      balance: t.balance,
      category_id: 4,
      classification_source: results[ i ].source
    }));

    // Bulk insert into transactions table
    const insertText = `
      INSERT INTO transactions
    (account_id, category_id, transaction_amount, transaction_type,
       description, transaction_date, is_recurring)
          VALUES
        ${enriched.map((_, idx) => `($${idx * 7 + 1},$${idx * 7 + 2},$${idx * 7 + 3},$${idx * 7 + 4},$${idx * 7 + 5},$${idx * 7 + 6},$${idx * 7 + 7})`).join(',')}
      RETURNING *
    `;
    const insertVals = enriched.flatMap(t => [
      accountID, t.transaction_date, t.description, t.transaction_amount, t.category_id
    ]);
    const dbRes = await pool.query(insertText, insertVals);

    // 6. Send results back to React for review
    res.json({ transactions: dbRes.rows });

  } catch (err) {
    logger.error('Pipeline error:', err);
    res.status(500).json({ error: 'Failed to process statement' });
  }
});
export default router;