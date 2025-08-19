import { Router, Express, Application } from 'express';
import cityRoutes from './routes/cityRoute';
import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool


export function registerCityModule(app: Application) {
   app.use('/api/city', cityRoutes);

   app.get('/health/city', async (_req, res) => {
      try {
         const client = await pool.connect();
         await client.query('SELECT 1');
         client.release();
         res.status(200).json({ status: 'healthy', db: 'connected' });
      } catch (error) {
         logger.error('Health check failed', error);
         res.status(500).json({ status: 'unhealthy', db: 'disconnected' });
      }
   });

   logger.info('City module registered');
}

