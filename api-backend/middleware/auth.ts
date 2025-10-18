import { Request, Response, NextFunction } from 'express';
import { V3 } from 'paseto';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    exp: string;
  };
}

const localKey = Buffer.from(process.env.PASETO_LOCAL_KEY!, 'hex');

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ status: 'error', message: 'Please log in to access this resource' });
    return;
  }

  try {
    const payload = await V3.decrypt(token, localKey);
    
    // Check expiration
    if (new Date(payload.exp as string) < new Date()) {
      res.status(401).json({ status: 'error', message: 'Session expired. Please log in again.' });
      return;
    }

    req.user = payload as AuthRequest['user'];
    next();
  } catch (error) {
    logger.error('[Auth Middleware] Token verification failed:', error);
    res.status(403).json({ status: 'error', message: 'Invalid token. Please log in again.' });
  }
};