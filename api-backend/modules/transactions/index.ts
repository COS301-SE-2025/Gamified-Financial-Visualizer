// modules/transactions/index.ts
import { Router, Express, Application } from 'express';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes'; // Assuming you have budget routes
import accountRoutes from './routes/accountRoutes'; // Assuming you have account routes
import { logger }     from '../../config/logger';     // re-use shared logger
import pool           from '../../config/db';         // re-use shared DB pool
import { eventBus } from "../../events/event-bus"
import { makeBudgetProgress } from './services/transaction.service'; // Import budget service

/** Wrap auth initialisation so root server can call it */
export function registerTransactionModule(app: Application) {
  // Mount routes
   app.use('/api/transactions', transactionRoutes);
   app.use('/api/budget', budgetRoutes); // Mount budget routes
   app.use('/api/accounts', accountRoutes); // Mount account routes

  // Listen for transaction events
  eventBus.on('transaction.created', async (tx) => {
    try {
      // Here you can handle any logic related to transaction creation
      // await makeBudgetProgress(tx.id, tx.amount); // check that budget is linked to transaction id
     // logger.info('[Transaction] Created:', tx);
    } catch (err) {
      logger.error('[Transaction] Event handling failed:', err);
    }
  });
  
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
