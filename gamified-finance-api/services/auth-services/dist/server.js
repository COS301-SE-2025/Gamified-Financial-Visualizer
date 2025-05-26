import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { logger } from './config/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
});
