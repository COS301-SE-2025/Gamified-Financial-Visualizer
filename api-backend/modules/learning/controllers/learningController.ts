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

