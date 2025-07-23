import { Application } from 'express';
import notificationsRoutes from './routes/notificationsRoutes';
import { logger } from '../../config/logger';
import pool from '../../config/db';

/**
 * @function registerNotificationsModule
 * @desc Initializes the Notifications module by mounting routes and registering health checks.
 */
export function registerNotificationsModule(app: Application) {
  // Mount notifications-related API routes
  app.use('/api/notifications', notificationsRoutes);

  // Optional: module-specific health probe
  app.get('/health/notifications', async (_req, res) => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      res.status(200).json({ module: 'notifications', db: 'connected' });
    } catch (err) {
      logger.error('[Notifications] DB health check failed:', err);
      res.status(503).json({ module: 'notifications', db: 'disconnected' });
    }
  });

  logger.info('Notifications module registered');
}