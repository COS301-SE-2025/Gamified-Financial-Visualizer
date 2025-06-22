/**
 * @file index.ts
 * @desc for Exportng routes for learning modules and lessons.
 */
import { logger } from '../../config/logger';     // re-use shared logger
import pool from '../../config/db';         // re-use shared DB pool
import { Router, Express, Application } from 'express';
import learningRoutes from './routes/learningRoutes';
import { log } from 'console';


export function registerLearningModule(app: Application) {
   app.use('/api/learning', learningRoutes);

   app.get('/health/learning', async (_req, res) => {
      try {
         const client = await pool.connect();
         await client.query('SELECT 1');
         client.release();
         res.status(200).json({ module: 'learning', db: 'connected' });
      } catch (err) {
         logger.error('Learning DB check failed:', err);
         res.status(503).json({ module: 'learning', db: 'disconnected' });
      }
   });

   logger.info('Learning module registered');
}

