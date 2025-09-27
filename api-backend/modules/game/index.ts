import { Application } from 'express';
import { Server } from 'socket.io';
import { GameLobbyManager } from './lobby/GameLobbyManager';
import { GameEngine } from './engine/GameEngine';
import { registerGameRoutes } from './routes';
import { registerGameSocketHandlers } from './socket-handlers';
import { logger }     from '../../config/logger';     

export function registerGameModule(app: Application, io: Server) {
  // Initialize core game services
  const gameEngine = new GameEngine(io);
  const lobbyManager = new GameLobbyManager(gameEngine);

  // Register REST API routes
  registerGameRoutes(app, lobbyManager);

  logger.info('Game module registered');
  return { gameEngine, lobbyManager }; 
}