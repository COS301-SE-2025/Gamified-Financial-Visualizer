import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './config/logger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // For profile, preferences, password, etc.

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('[AuthApp] Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
};

app.use(errorHandler);

export default app;
