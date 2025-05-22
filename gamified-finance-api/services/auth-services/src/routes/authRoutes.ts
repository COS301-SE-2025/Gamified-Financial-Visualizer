import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { logger } from '../config/logger.js';
import * as userService from '../services/userService.js'; //backend connection goes here

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

// Register route handler
const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('[Auth] Validation failed', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { full_name, username, email, password } = req.body;

  try {
    // Hash password using Argon2
    const password_hash = await argon2.hash(password, { type: argon2.argon2id });

    // Create user in backend DB
    const user = await userService.createUser({
      full_name,
      username,
      email,
      password_hash,
    });

    logger.info(`[Auth] Successfully registered user: ${username}`);

    res.status(201).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'User registered successfully.',
      data: {
        user: {
          full_name: user.full_name,
          username: user.username,
          email: user.email
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

router.post('/register', registerValidation, register);

export default router;
