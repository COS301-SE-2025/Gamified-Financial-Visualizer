import { Router } from 'express';
import {
  getAllModules,
  getModuleById,
  getLessonsByModule,
  getLessonById
} from '../controllers/learningController';

const router = Router();

/**
 * @route GET /api/modules
 * @desc Fetch all available learning modules
 */
router.get('/modules', getAllModules);

/**
 * @route GET /api/modules/:moduleId
 * @desc Fetch a specific module by ID
 */
router.get('/modules/:moduleId', getModuleById);

/**
 * @route GET /api/modules/:moduleId/lessons
 * @desc Fetch all lessons for a specific module
 */
router.get('/modules/:moduleId/lessons', getLessonsByModule);

/**
 * @route GET /api/lessons/:lessonId
 * @desc Fetch a specific lesson by ID
 */
router.get('/lessons/:lessonId', getLessonById);

export default router;
