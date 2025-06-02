// modules/auth/index.ts
import { Router, Express, Application } from 'express';
import authRoutes from './routes/authRoutes';
import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool

/** Wrap auth initialisation so root server can call it */
export function registerAuthModule(app: Application) {
  // Mount routes
  app.use('/api/auth', authRoutes);

  // Optional: module-specific health probe
  app.get('/health/auth', async (_req, res) => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      res.status(200).json({ module: 'auth', db: 'connected' });
    } catch (err) {
      logger.error('Auth DB check failed:', err);
      res.status(503).json({ module: 'auth', db: 'disconnected' });
    }
  });

  logger.info('Auth module registered');
}
