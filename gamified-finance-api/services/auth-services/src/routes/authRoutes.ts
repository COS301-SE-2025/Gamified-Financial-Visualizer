import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import argon2 from 'argon2';
import { logger } from '../config/logger.js';
import * as userService from '../services/userService.js'; //backend function here so we can add the user

const router = Router();

// Validation middleware for registration
const registerValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
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

    const password_hash = await argon2.hash(password, { type: argon2.argon2id });

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
          username: user.username,
          email: user.email,
          full_name: user.full_name,
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