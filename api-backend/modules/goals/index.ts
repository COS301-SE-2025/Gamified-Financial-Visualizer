// modules/goal/index.ts
import { Router, Express, Application } from 'express';
import goalRoutes from './routes/goalRoutes';
import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool

/** Wrap auth initialisation so root server can call it */
export function registerGoalModule(app: Application) {
  // Mount routes
  app.use('/api/goal', goalRoutes);

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
