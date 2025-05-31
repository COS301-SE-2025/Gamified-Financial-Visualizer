// src/app.ts
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import { logger } from './config/logger';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(helmet());
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/budget',      budgetRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// error handler (same as before)
interface ErrorHandler {
   (err: Error, req: Request, res: Response, next: NextFunction): void;
}

const errorHandler: ErrorHandler = (err, _req, res, _next) => {
   logger.error('Unhandled error:', err);
   res.status(500).json({ status: 'error', message: 'Internal server error' });
};

app.use(errorHandler);

export default app;