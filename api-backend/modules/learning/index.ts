/**
 * @file index.ts
 * @desc for Exportng routes for learning modules and lessons.
 */

import { Router } from 'express';
import learningRoutes from './routes/learningRoutes';

const router = Router();

router.use('/', learningRoutes);

export default router;

