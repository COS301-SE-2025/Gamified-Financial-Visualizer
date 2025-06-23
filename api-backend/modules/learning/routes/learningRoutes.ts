import { Router , Request, Response} from 'express';
import {
  getAllModules,
  getCompletedModules,
  getUncompletedModules,
  getModuleById,
  getLessonsByModule,
  getLessonById,
  getQuizByModuleId,
  submitQuizAttempt,
  getLearningSummary,
  getLearningPeformance
} from '../services/learning.service';
import { logger } from '../../../config/logger';
const router = Router();

/**
 * @route GET /api/learning
 * @desc Fetch all available learning modules
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const modules = await getAllModules();
    res.status(200).json({
      status: 'success',
      data: modules
    });
  } catch (error) {
    logger.error('[Learning] Fetch all modules failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching modules'
    });

  }
});


/**
 * @route GET /api/learning/:moduleId
 * @desc Fetch a specific module by ID
 */
router.get('/:moduleId', async (req: Request, res: Response)  => {
  const moduleId = Number(req.params.moduleId);
  try {
    const module = await getModuleById(moduleId);
    if (!module) {
      res.status(404).json({
        status: 'error',
        message: `Module with ID ${moduleId} not found`
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: module
    });
  } catch (error) {
    logger.error(`[Learning] Fetch module ${moduleId} failed:`, error);
      res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching lessons'
    });
  }

});

/**
 * @route GET /api/learning/completed/:userId
 * @desc Fetch completed modules for a user
 */
router.get('/completed/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const completedModules = await getCompletedModules(userId);
    res.status(200).json({
      status: 'success',
      data: completedModules
    });
  } catch (error) {
    logger.error(`[Learning] Fetch completed modules for user ${userId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching completed modules'
    });
  }
});

/**
 * @route GET /api/learning/uncompleted/:userId
 * @desc Fetch uncompleted modules for a user
 */
router.get('/uncompleted/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const uncompletedModules = await getUncompletedModules(userId);
    res.status(200).json({
      status: 'success',
      data: uncompletedModules
    });
  } catch (error) {
    logger.error(`[Learning] Fetch uncompleted modules for user ${userId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching uncompleted modules'
    });
  }
})


/**
 * @route GET /api/learning/:moduleId/lessons
 * @desc Fetch all lessons for a specific module
 */
router.get('/:moduleId/lessons', async (req: Request, res: Response) => {
  const moduleId = Number(req.params.moduleId);
  try {
    const lessons = await getLessonsByModule(moduleId);
    res.status(200).json({
      status: 'success',
      data: lessons
    });
  } catch (error) {
    logger.error(`[Learning] Fetch lessons for module ${moduleId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching lessons'
    });
  }

});

/**
 * @route GET /api/learning/lessons/:lessonId
 * @desc Fetch a specific lesson by ID
 */
router.get('/lessons/:lessonId', async (req: Request, res: Response) => {
  const lessonId = Number(req.params.lessonId);
  try {
    const lesson = await getLessonById(lessonId);
    if (!lesson) {
      res.status(404).json({
        status: 'error',
        message: `Lesson with ID ${lessonId} not found`
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: lesson
    });
  } catch (error) {
    logger.error(`[Learning] Fetch lesson ${lessonId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching lesson'
    });
  }
});

router.get('/quizzes/:moduleId', async (req: Request, res: Response) => {
  const moduleId = Number(req.params.moduleId);
  try {
    const quizzes = await getQuizByModuleId(moduleId);
    if (!quizzes || quizzes.length === 0) {
      res.status(404).json({
        status: 'error',
        message: `No quizzes found for module ID ${moduleId}`
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: quizzes
    });
  } catch (error) {
    logger.error(`[Learning] Fetch quizzes for module ${moduleId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching quizzes'
    });
  }
});

router.post('/quizzes/:moduleId/submit', async (req: Request, res: Response) => {
  const moduleId = Number(req.params.moduleId);
  const { userId, answers, passed, attempt_score } = req.body;

  if (!userId || !answers) {
     res.status(400).json({
      status: 'error',
      message: 'User ID and answers are required'
    });

    return;
  }

  try {
    // Here you would typically save the quiz attempt to the database
    // Calculate attempt_score and passed based on answers
    // For demonstration, let's assume answers is an array of { correct: boolean }
    // and passing requires at least 70% correct answers

    await submitQuizAttempt(userId, moduleId, attempt_score, passed);
    res.status(200).json({
      status: 'success',
      message: `Quiz for module ${moduleId} submitted successfully`,
      data: {
        userId,
        answers,
        attempt_score,
        passed
      }
    });
  } catch (error) {
    logger.error(`[Learning] Submit quiz for module ${moduleId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while submitting quiz'
    });
  }
});

/**
 * @route GET /api/learning/summary/:userId
 * @desc Fetch learning summary for a user
 */
router.get('/summary/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const summary = await getLearningSummary(userId);
    if (!summary) {
      res.status(404).json({
        status: 'error',
        message: `No learning summary found for user ID ${userId}`
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    logger.error(`[Learning] Fetch summary for user ${userId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching learning summary'
    });
  }
});

router.get('/score/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  try {
    const performance = await getLearningPeformance(userId);
    if (!performance) {
      res.status(404).json({
        status: 'error',
        message: `No learning performance found for user ID ${userId}`
      });
      return;
    }
    res.status(200).json({
      status: 'success',
      data: performance
    });
  } catch (error) {
    logger.error(`[Learning] Fetch performance for user ${userId} failed:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching learning performance'
    });
  }
});


export default router;
