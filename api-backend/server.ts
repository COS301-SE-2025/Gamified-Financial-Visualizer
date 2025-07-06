import express, { Application, NextFunction, Request, Response } from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import dotenv  from 'dotenv';
import { logger } from './config/logger';
import pool       from './config/db';

import './jobs/resetBudgets'; // This will auto-schedule the job

// 🔌 module registrars
import { registerAuthModule }        from './modules/auth';
import { registerTransactionModule } from './modules/transactions';
import { registerGoalModule }        from './modules/goals';
import { registerLearningModule }    from './modules/learning'; // Learning module
import { registerClassifierModule } from './modules/classifier';
import { registerCommunityModule }   from './modules/community'; // Community module
import { registerAchievementModule } from './modules/achievements'; // Achievement module     

// …add others as they migrate

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

/** ─────────── Global middleware ─────────── */
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(helmet());
app.use(express.json());

/** ─────────── Register feature modules ─────────── */
registerAuthModule(app);
registerTransactionModule(app);
registerGoalModule(app);
registerLearningModule(app);
registerClassifierModule(app);
registerCommunityModule(app); 
registerAchievementModule(app); // Register the achievement module


// ...

/** ─────────── Universal health route ─────────── */
app.get('/health', async (_req, res) => {
  try {
    const db = await pool.connect();
    await db.query('SELECT 1');
    db.release();
    res.status(200).json({ status: 'OK', db: 'connected' });
  } catch (err) {
    logger.error('DB check failed:', err);
    res.status(503).json({ status: 'unavailable', db: 'disconnected' });
  }
});

/** ─────────── Error handler ─────────── */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

/** ─────────── Start HTTP listener ─────────── */
app.listen(PORT, () => logger.info(`Monolith listening on port ${PORT}`));
