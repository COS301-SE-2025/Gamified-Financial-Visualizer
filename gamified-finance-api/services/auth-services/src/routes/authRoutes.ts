import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { logger } from '../config/logger';
import * as userService from '../services/auth.service';
import { V4 } from 'paseto';
import crypto from 'crypto';

const router = Router();


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
        throw new Error('Full name must contain only letters (no digits or symbols).');
      }
      return true;
    }),

  body('username')
    .trim()
    .matches(/^[a-z._]+$/)
    .withMessage('Username must contain only lowercase letters, dots, or underscores.')
    .isLength({ min: 3, max: 15 })
    .withMessage('Username must be between 3 and 15 characters long.'),

  body('email')
    .isEmail()
    .withMessage('Invalid email address.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[a-z]/)
    .withMessage('Password must include at least one lowercase letter.')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter.')
    .matches(/\d/)
    .withMessage('Password must include at least one number.')
    .matches(/[\W_]/)
    .withMessage('Password must include at least one special character (e.g. @, #, $, %).'),
];

const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('[Auth] Registration validation failed', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const {full_name, username, email, password } = req.body;

  try {
    const hashed_password = await argon2.hash(password, { type: argon2.argon2id });

    const user = await userService.createUser({
      full_name,
      username,
      email,
      hashed_password,
      password_salt: crypto.randomBytes(16).toString('hex'), // Generate a random salt
    });

    logger.info(`[Auth] Successfully registered user: ${username}`);

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

const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('[Auth] Login validation failed', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { username, password } = req.body;

  try {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      res.status(401).json({ status: 'error', message: 'Invalid username' });
      return;
    }

    const valid = await argon2.verify(user.hashed_password, password);
    if (!valid) {
      res.status(401).json({ status: 'error', message: 'Invalid password' });
      return;
    }

    logger.info(`[Auth] User logged in: ${user.username}`);

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'User authenticated successfully.',
      data: {
        user: {
          id: user.id,
          username: user.username,
        },
      },
    });
  } catch (error) {
    logger.error('[Auth] Login failed', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
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

export default router;
