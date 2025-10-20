
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import 'dotenv/config'; // ensures env is loaded before all imports
dotenv.config();

import { logger } from './config/logger';
import pool from './config/db';
import { redisClient } from './config/redis';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import http from 'http';
import { V3 } from 'paseto';
import './jobs/resetBudgets'; // auto-schedules your budget reset job
// (Optional but recommended for horizontal scale)

//import { createAdapter } from '@socket.io/redis-adapter';
// please consider this as well - const { createAdapter } = require('@socket.io/redis-adapter');


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
import { registerGameSocketHandlers } from './modules/game/socket-handlers';
const app: Application = express();
const PORT = process.env.PORT || 5000;

const corsOrigins = [
  'https://gamified-finance-visualizer-c5djg3fhcnhqfyfj.canadacentral-01.azurewebsites.net',  // Frontend URL (Azure)
  'http://localhost:3000', // for local dev
  'http://localhost:8080', // for local dev alternative port
  'http://localhost:80',
  process.env.CORS_ORIGIN     // Use environment variable from docker-compose
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(helmet());
app.use(express.json());
// app.get('/ping', (req, res) => res.send('pong'));



const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigins,
    methods: ['GET','POST'],
    credentials: true
  },
  transports:  ['websocket'], 
  pingInterval: 30000,  // default 25s
  pingTimeout: 60000,   // default 20s
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

const { gameEngine, lobbyManager } = registerGameModule(app, io);

// When a client connects, remember their socket.id
const userToSocket = new Map<number, string>();
const disconnectTimers = new Map<number, NodeJS.Timeout>();
io.on('connection', async (socket) =>  {
  const { userId, token } = socket.handshake.auth;
  if (!userId) {
    socket.disconnect(true);
    return;
  }

  // 1) Enforce one-live-socket-per-user
  const prevId = userToSocket.get(userId);
  if (prevId && prevId !== socket.id) {
    io.sockets.sockets.get(prevId)?.disconnect(true);
  }
  userToSocket.set(userId, socket.id);

  // 2) Cancel any pending grace timer for this user
  const t = disconnectTimers.get(userId);
  if (t) { clearTimeout(t); disconnectTimers.delete(userId); }

  // 3) Re-wire lobby room membership on reconnect
  const existingLobby = lobbyManager.getLobbyByPlayer(userId);
  if (existingLobby) {
    lobbyManager.updatePlayerSocket(userId, socket.id);
    await socket.join(`lobby:${existingLobby.id}`);
  }

  logger.info(`User ${userId} connected on socket ${socket.id}`);
  socket.emit('connected', { message: 'Real-time notifications enabled' });

  socket.data.userId = userId;
  socket.data.token = token;
  // 4) Register per-socket handlers (NOTE: no io.on('connection') inside)
  registerGameSocketHandlers(io, socket, lobbyManager, gameEngine);

  // 5) Clean disconnect with grace period
  socket.on('disconnect', (reason) => {
    logger.info(`User ${userId} disconnected: ${reason}`);

    // only delete if this is still the active socket
    if (userToSocket.get(userId) === socket.id) {
      userToSocket.delete(userId);
    }

    const lobby = lobbyManager.getLobbyByPlayer(userId);
    if (!lobby) return;

    // start a 30s grace timer; cancel if they reconnect
    const timer = setTimeout(() => {
      // still offline? (no socket carries this userId)
      const stillGone = !Array.from(io.sockets.sockets.values())
        .some(s => s.data.userId === userId);
      if (stillGone) {
        lobbyManager.leaveLobby(userId);
        io.to(`lobby:${lobby.id}`).emit('lobby:player-disconnected', { playerId: userId });
      }
      disconnectTimers.delete(userId);
    }, 30000);

    disconnectTimers.set(userId, timer);
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
const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
httpServer.listen(portNumber, '0.0.0.0', () => {
  logger.info(`Monolith listening on port ${PORT} (with Socket.IO)`);
});
