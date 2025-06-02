// modules/transactions/index.ts
import { Router, Express, Application } from 'express';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes'; // Assuming you have budget routes
import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool

/** Wrap auth initialisation so root server can call it */
export function registerTransactionModule(app: Application) {
  // Mount routes
   app.use('/api/transaction', transactionRoutes);
   app.use('/api/budget', budgetRoutes); // Mount budget routes
  // Optional: module-specific health probe
  app.get('/health/budget', async (_req, res) => {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      res.status(200).json({ module: 'budget', db: 'connected' });
    } catch (err) {
      logger.error('Auth DB check failed:', err);
      res.status(503).json({ module: 'budget', db: 'disconnected' });
    }
  });

  logger.info('Budget module registered');
}
