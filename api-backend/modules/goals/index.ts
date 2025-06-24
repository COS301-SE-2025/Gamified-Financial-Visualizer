// modules/goal/index.ts
import { Router, Express, Application } from 'express';
import goalRoutes from './routes/goalRoutes';
import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool
import { eventBus } from "../../events/event-bus"
import {addGoalProgress} from './services/goals.service';
import { add } from 'winston';

/** Wrap auth initialisation so root server can call it */
export function registerGoalModule(app: Application) {
  // Mount routes
  app.use('/api/goal', goalRoutes);

    // Listen for transaction events
  eventBus.on('transaction.created', async (tx) => {
    try {
      // await addGoalProgress(tx.id, tx.account_id, tx.amount); // tx needs link to goal ID
      // console.log('[Goal] Progress updated for user:', tx.user_id);
    } catch (err) {
      console.error('[Goal] Failed to update progress:', err);
    }
  });

  // Optional: module-specific health probe
  app.get('/health/goal', async (_req, res) => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      res.status(200).json({ module: 'foal', db: 'connected' });
    } catch (err) {
      logger.error('Auth DB check failed:', err);
      res.status(503).json({ module: 'goal', db: 'disconnected' });
    }
  });

  logger.info('Goal module registered');
}
