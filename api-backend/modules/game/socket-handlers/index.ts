// socket handlers for game module
import { Server, Socket } from 'socket.io';
import { GameLobbyManager } from '../lobby/GameLobbyManager';
import { GameEngine } from '../engine/GameEngine';
import { MatchmakingService } from '../lobby/MatchmakingService';
import { logger } from '../../../config/logger';

export function registerGameSocketHandlers(
  io: Server, 
  socket: Socket,
  lobbyManager: GameLobbyManager, 
  gameEngine: GameEngine
) {
  const matchmakingService = new MatchmakingService(lobbyManager);
    const userId = socket.data.userId as number;
    if (!userId) return;

    logger.info(`Game socket connected for user ${userId}`);

    // 🏠 LOBBY HANDLERS
    
    /**
     * Join a specific lobby by code
     */
    socket.on('lobby:join', async (data: { code: string; username: string }) => {
      try {
        const { code, username } = data;
        
        const lobby = lobbyManager.joinLobby(code, userId, username, socket.id);
        
        // Join socket room for this lobby
        await socket.join(`lobby:${lobby.id}`);
        
        // Notify all players in lobby
        socket.to(`lobby:${lobby.id}`).emit('lobby:player-joined', {
          player: {
            id: userId,
            username,
            isHost: false,
            isReady: false
          }
        });
        
        // Send lobby state to joining player
        socket.emit('lobby:joined', {
          lobby: {
            id: lobby.id,
            code: lobby.code,
            settings: lobby.settings,
            players: Array.from(lobby.players.values()),
            status: lobby.status
          }
        });
        
      } catch (error: any) {
        socket.emit('lobby:join-error', { message: error.message });
      }
    });

    /**
     * Leave current lobby
     */
    socket.on('lobby:leave', async () => {
      try {
        const lobby = lobbyManager.getLobbyByPlayer(userId);
        if (!lobby) {
          socket.emit('lobby:leave-error', { message: 'Not in any lobby' });
          return;
        }

        const wasHost = lobby.players.get(userId)?.isHost || false;
        const success = lobbyManager.leaveLobby(userId);
        
        if (success) {
          // Leave socket room
          await socket.leave(`lobby:${lobby.id}`);
          
          // Notify remaining players
          socket.to(`lobby:${lobby.id}`).emit('lobby:player-left', { 
            playerId: userId,
            wasHost 
          });
          
          socket.emit('lobby:left', { success: true });
        }
        
      } catch (error: any) {
        socket.emit('lobby:leave-error', { message: error.message });
      }
    });

    /**
     * Toggle ready status
     */
    socket.on('lobby:toggle-ready', async () => {
      try {
        const success = lobbyManager.toggleReady(userId);
        if (!success) {
          socket.emit('lobby:ready-error', { message: 'Cannot change ready status' });
          return;
        }

        const lobby = lobbyManager.getLobbyByPlayer(userId);
        if (lobby) {
          const player = lobby.players.get(userId);
          
          // Notify all players in lobby
          io.to(`lobby:${lobby.id}`).emit('lobby:player-ready-changed', {
            playerId: userId,
            isReady: player?.isReady || false
          });
        }
        
      } catch (error: any) {
        socket.emit('lobby:ready-error', { message: error.message });
      }
    });

    /**
     * Update lobby settings (host only)
     */
    socket.on('lobby:update-settings', async (data: { gameMode?: 'laps' | 'elimination'; maxLaps?: number; maxPlayers?: number }) => {
      try {
        const success = lobbyManager.updateSettings(userId, data);
        if (!success) {
          socket.emit('lobby:settings-error', { message: 'Only host can update settings' });
          return;
        }

        const lobby = lobbyManager.getLobbyByPlayer(userId);
        if (lobby) {
          // Notify all players of settings change
          io.to(`lobby:${lobby.id}`).emit('lobby:settings-updated', {
            settings: lobby.settings
          });
        }
        
      } catch (error: any) {
        socket.emit('lobby:settings-error', { message: error.message });
      }
    });

    /**
     * Start game (host only)
     */
    socket.on('lobby:start-game', async () => {
      try {
        const gameId = lobbyManager.startGame(userId);
        if (!gameId) {
          socket.emit('lobby:start-error', { message: 'Cannot start game' });
          return;
        }

        const lobby = lobbyManager.getLobbyByPlayer(userId);
        if (lobby) {
          // Move all players to game room
          const playerSockets = Array.from(lobby.players.values()).map(p => p.socketId);
          
          for (const socketId of playerSockets) {
            const playerSocket = io.sockets.sockets.get(socketId);
            if (playerSocket) {
              await playerSocket.leave(`lobby:${lobby.id}`);
              await playerSocket.join(`game:${gameId}`);
            }
          }
          
          // Notify all players that game started
          io.to(`game:${gameId}`).emit('game:started', {
            gameId,
            gameState: gameEngine.getGameState(gameId)
          });
        }
        
      } catch (error: any) {
        socket.emit('lobby:start-error', { message: error.message });
      }
    });

    // 🎮 MATCHMAKING HANDLERS

    /**
     * Quick match
     */
    socket.on('matchmaking:quick-match', async (data: { gameMode?: 'laps' | 'elimination'; maxLaps?: number; username: string }) => {
      try {
        const { gameMode, maxLaps, username } = data;
        
        const lobby = matchmakingService.findMatch(userId, username, socket.id, {
          gameMode,
          maxLaps
        });
        
        // Join socket room for this lobby
        await socket.join(`lobby:${lobby.id}`);
        
        socket.emit('matchmaking:match-found', {
          lobby: {
            id: lobby.id,
            code: lobby.code,
            settings: lobby.settings,
            players: Array.from(lobby.players.values()),
            status: lobby.status
          }
        });
        
      } catch (error: any) {
        socket.emit('matchmaking:error', { message: error.message });
      }
    });

    /**
     * Queue for matchmaking
     */
    socket.on('matchmaking:queue', async (data: { gameMode?: 'laps' | 'elimination'; maxLaps?: number; username: string }) => {
      try {
        const { gameMode, maxLaps, username } = data;
        
        const result = matchmakingService.queueForMatch(userId, username, socket.id, {
          gameMode,
          maxLaps
        });
        
        socket.emit('matchmaking:queued', result);
        
      } catch (error: any) {
        socket.emit('matchmaking:error', { message: error.message });
      }
    });

    /**
     * Cancel matchmaking
     */
    socket.on('matchmaking:cancel', async () => {
      const success = matchmakingService.cancelMatchmaking(userId);
      socket.emit('matchmaking:cancelled', { success });
    });

    // 🎲 GAME PLAY HANDLERS

    /**
     * Roll dice
     */
    socket.on('game:roll-dice', async (data: { gameId: string }) => {
      try {
        const { gameId } = data;
        const gameState = gameEngine.getGameState(gameId);
        
        if (!gameState || gameState.currentPlayerId !== userId) {
          socket.emit('game:action-error', { message: 'Not your turn' });
          return;
        }

        const diceRoll = gameEngine.rollDice();
        const moveSuccess = gameEngine.movePlayer(gameId, userId, diceRoll);
        
        if (moveSuccess) {
          const updatedGameState = gameEngine.getGameState(gameId);
          
          // Notify all players
          io.to(`game:${gameId}`).emit('game:dice-rolled', {
            playerId: userId,
            diceRoll,
            gameState: updatedGameState
          });
          
          // Auto-advance turn after 10 seconds if no actions needed
          setTimeout(() => {
            const currentState = gameEngine.getGameState(gameId);
            if (currentState?.currentPlayerId === userId) {
              gameEngine.nextTurn(gameId);
              io.to(`game:${gameId}`).emit('game:turn-changed', {
                gameState: gameEngine.getGameState(gameId)
              });
            }
          }, 10000);
        }
        
      } catch (error: any) {
        socket.emit('game:action-error', { message: error.message });
      }
    });

    /**
     * Buy asset
     */
    socket.on('game:buy-asset', async (data: { gameId: string; assetId: string }) => {
      try {
        const { gameId, assetId } = data;
        // TODO: Implement asset buying logic in GameEngine
        
        socket.emit('game:asset-bought', { assetId });
        
      } catch (error: any) {
        socket.emit('game:action-error', { message: error.message });
      }
    });

    /**
     * Sell asset
     */
    socket.on('game:sell-asset', async (data: { gameId: string; assetId: string }) => {
      try {
        const { gameId, assetId } = data;
        // TODO: Implement asset selling logic in GameEngine
        
        socket.emit('game:asset-sold', { assetId });
        
      } catch (error: any) {
        socket.emit('game:action-error', { message: error.message });
      }
    });

    /**
     * Take loan
     */
    socket.on('game:take-loan', async (data: { gameId: string; amount: number; source: 'bank' | 'loan_shark' }) => {
      try {
        const { gameId, amount, source } = data;
        // TODO: Implement loan logic in GameEngine
        
        socket.emit('game:loan-taken', { amount, source });
        
      } catch (error: any) {
        socket.emit('game:action-error', { message: error.message });
      }
    });

    /**
     * End turn manually
     */
    socket.on('game:end-turn', async (data: { gameId: string }) => {
      try {
        const { gameId } = data;
        const gameState = gameEngine.getGameState(gameId);
        
        if (!gameState || gameState.currentPlayerId !== userId) {
          socket.emit('game:action-error', { message: 'Not your turn' });
          return;
        }

        gameEngine.nextTurn(gameId);
        
        // Notify all players
        io.to(`game:${gameId}`).emit('game:turn-changed', {
          gameState: gameEngine.getGameState(gameId)
        });
        
      } catch (error: any) {
        socket.emit('game:action-error', { message: error.message });
      }
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Game socket disconnected for user ${userId}: ${reason}`);
      
      // Cancel any pending matchmaking
      matchmakingService.cancelMatchmaking(userId);
      
      // Handle lobby disconnection
      const lobby = lobbyManager.getLobbyByPlayer(userId);
      if (lobby) {
        // TODO: Implement reconnection grace period
        // For now, just remove from lobby after 30 seconds
        setTimeout(() => {
          if (!socket.connected) {
            lobbyManager.leaveLobby(userId);
            socket.to(`lobby:${lobby.id}`).emit('lobby:player-disconnected', { playerId: userId });
          }
        }, 30000);
      }
    });


  // LISTEN TO GAME ENGINE EVENTS
  
  gameEngine.on('player-moved', (data) => {
    io.to(`game:${data.gameId}`).emit('game:player-moved', data);
  });

  gameEngine.on('card-drawn', (data) => {
    io.to(`game:${data.gameId}`).emit('game:card-drawn', data);
  });

  gameEngine.on('player-bankrupt', (data) => {
    io.to(`game:${data.gameId}`).emit('game:player-bankrupt', data);
  });

  gameEngine.on('game-ended', (data) => {
    io.to(`game:${data.gameId}`).emit('game:ended', data);
  });

  // 🎧 LISTEN TO LOBBY EVENTS
  
  lobbyManager.on('lobby-created', (lobby) => {
    logger.info(`Lobby created: ${lobby.id}`);
  });

  lobbyManager.on('player-joined-lobby', (data) => {
    io.to(`lobby:${data.lobby.id}`).emit('lobby:player-joined', {
      player: data.player
    });
  });

  // 🎧 LISTEN TO MATCHMAKING EVENTS
  
  matchmakingService.on('match-created', async (data) => {
    const { lobby, playerIds } = data;
    
    // Move all matched players to the lobby room
    for (const playerId of playerIds) {
      const playerSocket = Array.from(io.sockets.sockets.values())
        .find(s => s.data.userId === playerId);
      
      if (playerSocket) {
        await playerSocket.join(`lobby:${lobby.id}`);
        playerSocket.emit('matchmaking:match-created', {
          lobby: {
            id: lobby.id,
            code: lobby.code,
            settings: lobby.settings,
            players: Array.from(lobby.players.values()),
            status: lobby.status
          }
        });
      }
    }
  });
}