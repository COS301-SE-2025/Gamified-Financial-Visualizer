/**
 * @file learningController.ts
 * @description Handles incoming requests for learning modules and lessons.
 */

import { Request, Response } from 'express';
import {
  fetchAllModules,
  fetchModuleById,
  fetchLessonsByModule,
  fetchLessonById
} from '../services/learning.service';
import { logger } from '../../../config/logger';

/**
 * @desc Get all available learning modules
 * @route GET /api/modules
 */
export const getAllModules = async (_req: Request, res: Response): Promise<void> => {
  try {
    const modules = await fetchAllModules();
    res.status(200).json({ status: 'success', data: modules });
  } catch (error) {
    logger.error('[LearningController] Failed to fetch modules:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * @desc Get a specific module by ID
 * @route GET /api/modules/:moduleId
 */
export const getModuleById = async (req: Request, res: Response): Promise<void> => {
  const moduleId = parseInt(req.params.moduleId, 10);
  if (isNaN(moduleId)) {
    res.status(400).json({ status: 'error', message: 'Invalid module ID' });
    return;
  }

  try {
    const module = await fetchModuleById(moduleId);
    if (!module) {
      res.status(404).json({ status: 'error', message: 'Module not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: module });
  } catch (error) {
    logger.error(`[LearningController] Failed to fetch module ${moduleId}:`, error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
