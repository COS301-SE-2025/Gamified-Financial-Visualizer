import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import crypto from 'crypto';
import { V3 }                from 'paseto';
import { logger } from '../../../config/logger';
import * as userService from '../services/auth.service';

const localKey = Buffer.from(process.env.PASETO_LOCAL_KEY!, 'hex');
const TOKEN_TTL = Number(process.env.TOKEN_TTL_SECONDS || 86400);

const router = Router();

/**
 * @const registerValidation
 * @brief Function used for validating user registration:}.
 */
const registerValidation = [
  body('full_name')
    .trim()
    .custom((value) => {
      const parts = value.split(' ');
      if (parts.length !== 2) {
        throw new Error('Full name must include first and last name separated by a space.');
      }
      const nameRegex = /^[A-Za-z]+$/;
      if (!nameRegex.test(parts[0]) || !nameRegex.test(parts[1])) {
        throw new Error('Full name must contain only letters.');
      }
      return true;
    }),
  body('username')
    .trim()
    .matches(/^[a-z._]+$/)
    .withMessage('Username must contain only lowercase letters, dots, or underscores.')
    .isLength({ min: 3, max: 15 })
    .withMessage('Username must be between 3 and 15 characters.'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/).withMessage('Password must include a lowercase letter.')
    .matches(/[A-Z]/).withMessage('Password must include an uppercase letter.')
    .matches(/\d/).withMessage('Password must include a number.')
    .matches(/[\W_]/).withMessage('Password must include a special character.'),
];

/**
 * @const loginValidation
 * @brief Function is used for validating login.
 */
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * @route POST /api/auth/register
 * @brief Register a new user with validated fields
 */
const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('[Auth] Registration validation failed', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { full_name, username, email, password } = req.body;

  try {
    const hashed_password = await argon2.hash(password, { type: argon2.argon2id });

    const user = await userService.createUser({
      full_name,
      username,
      email,
      hashed_password,
    });

    res.status(201).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'User registered successfully.',
      data: {
        user: {
          id: user.id,
          full_name: user.full_name,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    logger.error('[Auth] Registration failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration',
    });
  }
};

/**
 * @route POST /api/auth/login
 * @brief Authenticates a user and returns a secure PASETO token
 */
const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('[Auth] Login validation failed', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { username, password } = req.body;

  try {
    /* 1. lookup user ------------------------------------------------------ */
     const localKeyHex = process.env.PASETO_LOCAL_KEY;
    if (!localKeyHex || localKeyHex.length !== 64) {
      throw new Error('Invalid PASETO key: Must be 64-character hex string');
    }

    const user = await  userService.getUserByUsername(username);
    if (!user || !(await argon2.verify(user.hashed_password, password))) {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      return
    }

    
    /* 2. sign PASETO (v3.local) ------------------------------------------ */
  const localKey = Buffer.from(process.env.PASETO_LOCAL_KEY!, 'hex');

  const token = await V3.encrypt(
        { 
          user_id: user.user_id, 
          exp: Math.floor(Date.now() / 1000) + TOKEN_TTL 
        },
        localKey
      );

    const expiresAt = new Date(Date.now() + TOKEN_TTL * 1000);

    /* 3. store / update db token ----------------------------------------- */
    await userService.upsertToken(user.user_id, token, expiresAt);
    /* 4. respond ---------------------------------------------------------- */
    logger.info(`[Auth] Login success: ${user.username}`);
    res.json({
      status: 'success',
      data: {
        user:   { id: user.user_id, username: user.username },
        token,  expires_at: expiresAt.toISOString(),
      },
    });
  } catch (err) {
    logger.error('[Auth] Login failed:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * @route GET /api/auth/user-id/:username
 * @brief Retrieves the user ID given a username
 */
router.get('/user-id/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user_id = await userService.getUserID(username);
    res.status(200).json({
      status: 'success',
      message: `User ID retrieved for ${username}`,
      data: { user_id }
    });
  } catch (error) {
    logger.error(`[Auth] Failed to get user ID for ${username}:`, error);
    res.status(404).json({
      status: 'error',
      message: `User ${username} not found`,
    });
  }
});

/**
 * @route DELETE /api/auth/:userId
 * @brief Permanently deletes a user account when they decide to delete their account
 */
router.delete('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await userService.deleteUser(Number(userId));
    logger.info(`[Auth] User with ID ${userId} deleted successfully.`);
    res.status(200).json({
      status: 'success',
      message: `User account with ID ${userId} deleted successfully.`,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to delete user with ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting user account.',
    });
  }
});


/**
 * @route PUT /api/auth/:userId/settings
 * @desc Updates user settings including username, theme, avatar, preferences, 2FA
 */
router.put('/:userId/settings', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!userId || Object.keys(updates).length === 0) {
    res.status(400).json({
      status: 'error',
      message: 'Missing user ID or updates in request body.',
    });
    return;
  }

  try {
    await userService.updateUserSettings(Number(userId), updates);
    logger.info(`[Auth] Settings updated for user ID ${userId}`);
    res.status(200).json({
      status: 'success',
      message: 'User settings updated successfully.',
    });
  } catch (error: any) {
    logger.error(`[Auth] Failed to update settings for user ID ${userId}:`, error);

    if (error.message === 'Username already taken') {
      res.status(409).json({
        status: 'error',
        message: 'That username is already in use.',
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating user settings.',
    });
    return;
  }
});

/**
 * @route PUT /api/auth/:userId/change-password
 * @desc Changes the user's password with validation
 */
router.put(
  '/:userId/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/[a-z]/).withMessage('Include lowercase')
      .matches(/[A-Z]/).withMessage('Include uppercase')
      .matches(/\d/).withMessage('Include a number')
      .matches(/[\W_]/).withMessage('Include a special character'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error('Passwords do not match');
      return true;
    })
  ],
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ status: 'error', errors: errors.array() });
      return;
    }

    try {
      await userService.changeUserPassword(Number(userId), currentPassword, newPassword);
      res.status(200).json({ status: 'success', message: 'Password updated successfully.' });
    } catch (err: any) {
      res.status(400).json({ status: 'error', message: err.message || 'Password change failed.' });
    }
  }
);



// =============== Profile Page Specific Functions ============== //

/**
 * @route GET /api/auth/top-bar/:userId
 * @desc Returns username, avatar, banner, and join date for the profile top bar
 */
router.get('/top-bar/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const data = await userService.getProfileTopBar(userId);
    res.status(200).json({
      status: 'success',
      message: 'Profile top bar data loaded.',
      data,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch top bar for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to load profile top bar data.',
    });
  }
});

/**
 * @route GET /api/auth/sidebar/:userId
 * @desc Returns sidebar stats: goals, achievements, accounts, transactions, communities, lessons
 */
router.get('/sidebar/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const stats = await userService.getUserSidebarStats(userId);
    res.status(200).json({
      status: 'success',
      message: 'Sidebar statistics loaded.',
      data: stats
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch sidebar stats for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to load sidebar stats.'
    });
  }
});

/**
 * @route GET /api/auth/profile/current-goals/:userId
 * @desc Returns current goals for the user
 */
router.get('/profile/current-goals/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const goals = await userService.getCurrentUserGoals(userId);
    res.status(200).json({
      status: 'success',
      message: 'Current goals fetched successfully.',
      data: goals,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch current goals for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not load current goals.',
    });
  }
});

/**
 * @route GET /api/auth/profile/performance-stats/:userId
 * @desc Returns performance stats (accuracy, rank, challenges, goals)
 */
router.get('/profile/performance-stats/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const stats = await userService.getUserPerformanceStats(userId);
    res.status(200).json({
      status: 'success',
      message: 'Performance stats fetched successfully.',
      data: stats,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch performance stats for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not load performance stats.',
    });
  }
});

/**
 * @route GET /api/auth/profile/recent-achievements/:userId
 * @desc Returns top 3 most recent achievements for a user
 */
router.get('/profile/recent-achievements/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const achievements = await userService.getRecentAchievements(userId);
    res.status(200).json({
      status: 'success',
      message: 'Recent achievements fetched successfully.',
      data: achievements,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch recent achievements for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not load recent achievements.',
    });
  }
});

/**
 * @route GET /api/auth/profile/communities/:userId
 * @desc Returns all communities the user is a member of
 */
router.get('/profile/communities/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const communities = await userService.getUserCommunities(userId);
    res.status(200).json({
      status: 'success',
      message: 'User communities fetched successfully.',
      data: communities,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch communities for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not load user communities.',
    });
  }
});

/**
 * @route GET /api/auth/profile/performance-summary/:userId
 * @desc Returns performance score, label, avatar, level, and tier
 */
router.get('/profile/performance-summary/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const summary = await userService.getUserPerformanceSummary(userId);
    res.status(200).json({
      status: 'success',
      message: 'Performance summary retrieved successfully.',
      data: summary,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch performance summary for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not fetch performance summary.',
    });
  }
});

/**
 * @route GET /api/auth/profile/level-progress/:userId
 * @desc Returns level progress including XP, level, tier, and points to next tier
 */
router.get('/profile/level-progress/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    const progress = await userService.getUserLevelProgress(userId);
    res.status(200).json({
      status: 'success',
      message: 'Level progress retrieved successfully.',
      data: progress,
    });
  } catch (error) {
    logger.error(`[Auth] Failed to fetch level progress for user ID ${userId}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Could not load level progress.',
    });
  }
});



/**
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET /api/auth/user-id/:username
 * - DELETE /api/auth/:userId
 */
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

export default router;
