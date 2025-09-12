
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import 'dotenv/config'; // ensures env is loaded before all imports
dotenv.config();

import { logger } from './config/logger';
import pool from './config/db';
import { redisClient } from './config/redis';
import { Server } from 'socket.io';
import http from 'http';
import { V3 } from 'paseto';
import './jobs/resetBudgets'; // auto-schedules your budget reset job
// (Optional but recommended for horizontal scale)
import { createAdapter } from '@socket.io/redis-adapter';

// 🔌 module registrars
import { registerAuthModule } from './modules/auth';
import { registerTransactionModule } from './modules/transactions';
import { registerGoalModule } from './modules/goals';
import { registerLearningModule } from './modules/learning';
import { registerClassifierModule } from './modules/ai';
import { registerInsightsModule } from './modules/ai';
import { registerCommunityModule } from './modules/community';
import { registerAchievementModule } from './modules/achievements';
import { registerNotificationsModule } from './modules/notifications';
import { registerCityModule } from './modules/city';
import { registerGameModule } from './modules/game';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(helmet());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET','POST'],
    credentials: true
  }
});

// Track which socket ID belongs to which userId
const connectedUsers = new Map<number,string>();

// Socket auth using PASETO v3.local
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token as string;
    if (!token) throw new Error('No token provided');

    const localKeyHex = process.env.PASETO_LOCAL_KEY!;
    const localKey = Buffer.from(localKeyHex, 'hex');
    const payload = await V3.decrypt(token, localKey) as { user_id: number };

    socket.data.userId = payload.user_id;
    next();
  } catch (err) {
    logger.error('Socket.IO auth error:', err);
    next(new Error('Authentication error'));
  }
});

// When a client connects, remember their socket.id
io.on('connection', socket => {
  const userId = socket.data.userId as number;
  if (!userId) {
    socket.disconnect();
    return;
  }

  connectedUsers.set(userId, socket.id);
  logger.info(`User ${userId} connected on socket ${socket.id}`);
  socket.emit('connected', { message: 'Real-time notifications enabled' });

  socket.on('disconnect', reason => {
    logger.info(`User ${userId} disconnected: ${reason}`);
    connectedUsers.delete(userId);
  });
});

// Bootstrap async work (no top‐level await!)
async function bootstrap() {
  // Duplicate client for pub/sub
  const sub = redisClient.duplicate();
  await sub.connect();

  // Subscribe to all notification channels
  await sub.pSubscribe('notifications:*', (message, channel) => {
    let note: Notification;
    try {
      note = JSON.parse(message);
    } catch {
      return;
    }

    // extract userId from "notifications:123"
    const userId = Number(channel.split(':')[1]);
    const sockId = connectedUsers.get(userId);
    if (!sockId) return;
    
    // emit on that socket
    io.to(sockId).emit('notification', note);
    logger.info(`Sent notification to user ${userId} via socket ${sockId}`);
  });
  logger.info('Redis ping:', await redisClient.ping());

  // Dispatch incoming Redis messages to the right socket
  sub.on('pmessage', (_pattern, channel, message) => {
    try {
      const note = JSON.parse(message);
      const [, id] = channel.split(':');
      const userId = Number(id);
      const socketId = connectedUsers.get(userId);
      if (socketId) {
        io.to(socketId).emit('notification', note);
        logger.info(`Pushed notification to user ${userId} (socket ${socketId})`);
      }
    } catch (err) {
      logger.error('Error handling Redis pub/sub message:', err);
    }
  });
}

bootstrap().catch(err => {
  logger.error('Fatal error during bootstrap:', err);
  process.exit(1);
});

// Register all your feature modules
registerAuthModule(app);
registerTransactionModule(app);
registerGoalModule(app);
registerLearningModule(app);
registerClassifierModule(app);
registerInsightsModule(app);
registerCommunityModule(app);
registerAchievementModule(app);
registerNotificationsModule(app);
registerCityModule(app);
registerGameModule(app, io);

// Health check
app.get('/health', async (_req, res) => {
  try {
    const db = await pool.connect();
    await db.query('SELECT 1');
    db.release();
    res.status(200).json({ status: 'OK', db: 'connected' });
  } catch (err) {
    logger.error('DB health check failed:', err);
    res.status(503).json({ status: 'unavailable', db: 'disconnected' });
  }
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});

// Start HTTP + WebSocket server
httpServer.listen(PORT, () => {
  logger.info(`Monolith listening on port ${PORT} (with Socket.IO)`);
});
