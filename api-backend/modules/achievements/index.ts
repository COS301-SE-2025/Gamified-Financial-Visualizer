import { Router, Express, Application } from 'express';
import achievementRoute from './routes/achievementRoute';import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool
import { eventBus } from "../../events/event-bus"

export function registerAchievementModule(app: Application) {
  // Mount routes
  app.use('/api/achievements', achievementRoute);

  // Listen for transaction events
  eventBus.on('transaction.created', async (tx) => {
    try {
      // Handle transaction-related achievement logic here
      // e.g. await updateAchievementsForTransaction(tx);
      logger.info('[Achievement] Transaction processed:', tx.id);
    } catch (err) {
      logger.error('[Achievement] Failed to process transaction:', err);
    }
  });

  // Optional: module-specific health probe
  app.get('/health/achievements', async (_req, res) => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      res.status(200).json({ module: 'achievement', db: 'connected' });
    } catch (err) {
      logger.error('Achievement DB check failed:', err);
      res.status(503).json({ module: 'achievement', db: 'disconnected' });
    }
  });

  logger.info('Achievement module registered');
}