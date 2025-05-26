import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './config/logger';
import goalRoutes from './routes/goalRoutes';
import progressRoutes from './routes/progressRoutes';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(helmet());
app.use(express.json());

app.use('/api/goals', goalRoutes); // POST /personal, /community, etc.
app.use('/api/goals', progressRoutes); // e.g. /:goalId/progress

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error('[GoalApp] Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
};

app.use(errorHandler);

export default app;
