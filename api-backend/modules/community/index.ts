import { Application } from 'express';
import communityRoutes from './routes/communityRoutes';
import { logger } from '../../config/logger';
import pool from '../../config/db';

/**
 * @function registerCommunityModule
 * @desc Initializes the Community module by mounting routes and registering health checks.
 */
export function registerCommunityModule(app: Application) {
  // Mount community-related API routes
  app.use('/api/community', communityRoutes);

  // Optional: module-specific health probe
  app.get('/health/community', async (_req, res) => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      res.status(200).json({ module: 'community', db: 'connected' });
    } catch (err) {
      logger.error('[Community] DB health check failed:', err);
      res.status(503).json({ module: 'community', db: 'disconnected' });
    }
  });

  logger.info('Community module registered');
}
