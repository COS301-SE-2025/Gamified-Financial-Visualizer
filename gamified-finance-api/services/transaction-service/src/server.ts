import * as dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import { logger } from './config/logger';

const app = express();
const PORT =  5001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// Start
app.listen(PORT,'0.0.0.0', () => {
  logger.info(`Transaction service running on port ${PORT}`);
});

export default app;