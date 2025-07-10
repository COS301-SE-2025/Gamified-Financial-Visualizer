import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './config/logger';
import pool from './config/db';
import { redisSubscriber } from './config/redis';
import { Server } from 'socket.io';
import http from 'http';
import './jobs/resetBudgets'; // This will auto-schedule the job

// 🔌 module registrars
import { registerAuthModule } from './modules/auth';
import { registerTransactionModule } from './modules/transactions';
import { registerGoalModule } from './modules/goals';
import { registerLearningModule } from './modules/learning'; // Learning module
import { registerClassifierModule } from './modules/classifier';
import { registerCommunityModule } from './modules/community'; // Community module
import { registerAchievementModule } from './modules/achievements'; // Achievement module     
import { registerNotificationsModule } from './modules/notifications'; // Notifications module

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5000;

/** ─────────── Global middleware ─────────── */
app.use(cors({
  origin: [ 'http://localhost:3000' ],
  credentials: true,
  methods: [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS' ],
  allowedHeaders: [ 'Content-Type', 'Authorization' ]
}));
app.use(helmet());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: [ 'GET', 'POST'],
    credentials: true
  }
});

io.on('connection', async socket => {
  const userId = socket.handshake.auth.userId
  const channel = `notifications:${userId}`
  if (!userId) return;

  // 1) ask Redis to subscribe to that channel
  await redisSubscriber.subscribe(channel, () => { })

  // 2) listen for *all* messages
  redisSubscriber.on('message', (chan, msg) => {
    if (chan === channel) {
      let notification: Notification;
      try {
        notification = JSON.parse(msg);
      } catch (e) {
        console.error('invalid JSON from Redis', msg);
        return;
      }
      socket.emit('notification', notification);
    }
  });

  // clean up on disconnect
  socket.on('disconnect', () => {
    redisSubscriber.unsubscribe(channel).catch(console.error);
  });
})

/** ─────────── Register feature modules ─────────── */
registerAuthModule(app);
registerTransactionModule(app);
registerGoalModule(app);
registerLearningModule(app);
registerClassifierModule(app);
registerCommunityModule(app);
registerAchievementModule(app);
registerNotificationsModule(app);

/** ─────────── Universal health route ─────────── */
app.get('/health', async (_req, res) => {
  try {
    const db = await pool.connect();
    await db.query('SELECT 1');
    db.release();
    res.status(200).json({ status: 'OK', db: 'connected' });
  } catch (err) {
    logger.error('DB check failed:', err);
    res.status(503).json({ status: 'unavailable', db: 'disconnected' });
  }
});

/** ─────────── Error handler ─────────── */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
});
/** ─────────── Start HTTP listener ─────────── */
httpServer.listen(PORT, () => logger.info(`Monolith listening on port ${PORT}`));
/** ─────────── Start HTTP listener ─────────── */
// app.listen(PORT, () => logger.info(`Monolith listening on port ${PORT}`));