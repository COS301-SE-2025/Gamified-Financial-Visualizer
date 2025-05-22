// src/controllers/authController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../config/logger.js';
import * as userService from '../services/userService.js';
import { V4 } from 'paseto';
import * as crypto from 'crypto';
import argon2 from 'argon2';

const pasetoSecretKey = crypto.randomBytes(32);

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('[Auth] Login validation failed', errors.array());
    res.status(400).json({ errors: errors.array() });
    return;
  }

  
}