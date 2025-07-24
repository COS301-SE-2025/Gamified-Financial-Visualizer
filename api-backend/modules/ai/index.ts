// modules/classifier/index.ts
import { Application } from 'express';
import classifierRoutes from './routes/classifierRouter';
import insightsRoutes from './routes/insightsRouter';
import { logger } from '../../config/logger';

/** Register the classifier module (calls Python service underneath) */
export function registerClassifierModule(app: Application) {
  // Mount route at /api/classifier
  app.use('/api/classifier', classifierRoutes);

  // Optional health check (check if Python service is reachable)
  app.get('/health/classifier', async (_req, res) => {
    try {
      const healthRes = await fetch('http://localhost:6000/health');
      if (!healthRes.ok) throw new Error('Classifier service unavailable');
      res.status(200).json({ module: 'classifier', ai_service: 'online' });
    } catch (err) {
      logger.error('Classifier health check failed:', err);
      res.status(503).json({ module: 'classifier', ai_service: 'offline' });
    }
  });

  logger.info('Classifier module registered');
}

export function registerInsightsModule(app: Application) {
  // This function can be used to register additional insights-related routes or services
  app.use('/api/insights', insightsRoutes);

  
  logger.info('Insights module registered');
}