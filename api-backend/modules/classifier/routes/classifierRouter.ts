import express from 'express';
import axios from 'axios';
import { logger } from '../../../config/logger';
const router = express.Router();

// POST /api/classify
router.post('/', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    res.status(400).json({ error: 'Missing description' });
  }

  try {
    const response = await axios.post('http://localhost:6000/predict', { description });
    const data = response.data as { category: string };
    res.status(200).json({ category: data.category });
  } catch (err) {
    console.error('Classifier error:', err);
     res.status(500).json({ error: 'Failed to classify transaction' });
  }
});

export default router;
