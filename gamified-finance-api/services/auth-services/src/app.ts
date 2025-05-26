// src/app.ts
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import { logger } from './config/logger';

const app = express();

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', async (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

export default app;
