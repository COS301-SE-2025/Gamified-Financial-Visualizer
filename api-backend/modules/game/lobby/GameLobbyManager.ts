import { EventEmitter } from 'events';
import { GameEngine } from '../engine/GameEngine';
import { Player } from '../types/GameTypes';
import { logger } from '../../../config/logger';
import { redisClient } from '../../../config/redis';

export interface Lobby {
  id: string;
  code: string; // 6-digit join code
  hostId: number;
  players: Map<number, LobbyPlayer>;
  settings: LobbySettings;
  status: 'waiting' | 'starting' | 'in_game' | 'finished';
  gameId?: string; // Set when game starts
  createdAt: Date;
  lastActivity: Date;
}

export interface LobbyPlayer {
  id: number;
  username: string;
  socketId: string;
  isHost: boolean;
  isReady: boolean;
  joinedAt: Date;
}

export interface LobbySettings {
  gameMode: 'laps' | 'elimination';
  maxLaps?: number;
  targetNetWorth?: number;
  maxPlayers: number;
  isPrivate: boolean;
  allowSpectators: boolean;
}

export class GameLobbyManager extends EventEmitter {
  private lobbies = new Map<string, Lobby>();
  private playerToLobby = new Map<number, string>(); // Track which lobby each player is in
  private lobbyCodes = new Map<string, string>(); // code -> lobbyId mapping
  private gameEngine: GameEngine;

  constructor() {
    super();
    this.gameEngine = new GameEngine();
    this.startLobbyCleanup();
  }

  /**
   * Create a new lobby
   */
  createLobby(hostId: number, hostUsername: string, hostSocketId: string, settings: Partial<LobbySettings> = {}): Lobby {
    // Check if player is already in a lobby
    if (this.playerToLobby.has(hostId)) {
      throw new Error('Player already in a lobby');
    }

    const lobbyId = this.generateLobbyId();
    const joinCode = this.generateJoinCode();

    const defaultSettings: LobbySettings = {
      gameMode: 'laps',
      maxLaps: 10,
      maxPlayers: 6,
      isPrivate: false,
      allowSpectators: true,
      ...settings
    };

    const host: LobbyPlayer = {
      id: hostId,
      username: hostUsername,
      socketId: hostSocketId,
      isHost: true,
      isReady: true, // Host is always ready
      joinedAt: new Date()
    };

    const lobby: Lobby = {
      id: lobbyId,
      code: joinCode,
      hostId,
      players: new Map([[hostId, host]]),
      settings: defaultSettings,
      status: 'waiting',
      createdAt: new Date(),
      lastActivity: new Date()
    };

    this.lobbies.set(lobbyId, lobby);
    this.lobbyCodes.set(joinCode, lobbyId);
    this.playerToLobby.set(hostId, lobbyId);

    logger.info(`Lobby ${lobbyId} created by user ${hostId} with code ${joinCode}`);
    this.emit('lobby-created', lobby);

    return lobby;
  }

  /**
   * Join lobby by code or ID
   */
  joinLobby(identifier: string, playerId: number, playerUsername: string, socketId: string): Lobby {
    // Check if player is already in a lobby
    if (this.playerToLobby.has(playerId)) {
      throw new Error('Player already in a lobby');
    }

    // Find lobby by code or ID
    let lobbyId = identifier;
    if (identifier.length === 6 && /^[A-Z0-9]{6}$/.test(identifier)) {
      // It's a join code
      lobbyId = this.lobbyCodes.get(identifier) || '';
    }

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) {
      throw new Error('Lobby not found');
    }

    if (lobby.status !== 'waiting') {
      throw new Error('Cannot join lobby - game in progress');
    }

    if (lobby.players.size >= lobby.settings.maxPlayers) {
      throw new Error('Lobby is full');
    }

    const player: LobbyPlayer = {
      id: playerId,
      username: playerUsername,
      socketId,
      isHost: false,
      isReady: false,
      joinedAt: new Date()
    };

    lobby.players.set(playerId, player);
    lobby.lastActivity = new Date();
    this.playerToLobby.set(playerId, lobbyId);

    logger.info(`User ${playerId} joined lobby ${lobbyId}`);
    this.emit('player-joined-lobby', { lobby, player });

    return lobby;
  }

  /**
   * Leave lobby
   */
  leaveLobby(playerId: number): boolean {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return false;

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return false;

    const player = lobby.players.get(playerId);
    if (!player) return false;

    lobby.players.delete(playerId);
    this.playerToLobby.delete(playerId);

    // If host left, promote someone else or close lobby
    if (player.isHost) {
      if (lobby.players.size > 0) {
        // Promote oldest member to host
        const newHost = Array.from(lobby.players.values())
          .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())[0];
        
        newHost.isHost = true;
        newHost.isReady = true;
        lobby.hostId = newHost.id;
        
        logger.info(`User ${newHost.id} promoted to host of lobby ${lobbyId}`);
        this.emit('host-changed', { lobby, newHost });
      } else {
        // Close empty lobby
        this.closeLobby(lobbyId);
        return true;
      }
    }

    lobby.lastActivity = new Date();
    logger.info(`User ${playerId} left lobby ${lobbyId}`);
    this.emit('player-left-lobby', { lobby, playerId });

    return true;
  }

  /**
   * Toggle player ready status
   */
  toggleReady(playerId: number): boolean {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return false;

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.status !== 'waiting') return false;

    const player = lobby.players.get(playerId);
    if (!player || player.isHost) return false; // Host is always ready

    player.isReady = !player.isReady;
    lobby.lastActivity = new Date();

    this.emit('player-ready-changed', { lobby, playerId, isReady: player.isReady });
    return true;
  }

  /**
   * Update lobby settings (host only)
   */
  updateSettings(playerId: number, newSettings: Partial<LobbySettings>): boolean {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return false;

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.hostId !== playerId || lobby.status !== 'waiting') {
      return false;
    }

    lobby.settings = { ...lobby.settings, ...newSettings };
    lobby.lastActivity = new Date();

    this.emit('lobby-settings-updated', { lobby, newSettings });
    return true;
  }

  /**
   * Start the game (host only)
   */
  startGame(playerId: number): string | null {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return null;

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.hostId !== playerId || lobby.status !== 'waiting') {
      return null;
    }

    // Check minimum players
    if (lobby.players.size < 2) {
      throw new Error('Need at least 2 players to start');
    }

    // Check if all players are ready
    const allReady = Array.from(lobby.players.values())
      .every(player => player.isReady);
    
    if (!allReady) {
      throw new Error('All players must be ready');
    }

    // Create game
    const gameId = this.generateGameId();
    const gameState = this.gameEngine.createGame(gameId, playerId, lobby.settings.gameMode);

    // Add all players to the game
    for (const lobbyPlayer of lobby.players.values()) {
      const gamePlayer: Player = {
        id: lobbyPlayer.id,
        username: lobbyPlayer.username,
        socketId: lobbyPlayer.socketId,
        position: 0,
        cash: 5000,
        assets: [],
        loans: [],
        cards: [],
        lapsCompleted: 0,
        salary: 2000,
        isActive: true,
        isBankrupt: false,
        xp: 0
      };
      
      this.gameEngine.addPlayer(gameId, gamePlayer);
    }

    // Start the actual game
    this.gameEngine.startGame(gameId);

    // Update lobby status
    lobby.status = 'in_game';
    lobby.gameId = gameId;
    lobby.lastActivity = new Date();

    logger.info(`Game ${gameId} started from lobby ${lobbyId}`);
    this.emit('game-started-from-lobby', { lobby, gameId });

    return gameId;
  }

  /**
   * Get lobby by player ID
   */
  getLobbyByPlayer(playerId: number): Lobby | undefined {
    const lobbyId = this.playerToLobby.get(playerId);
    return lobbyId ? this.lobbies.get(lobbyId) : undefined;
  }

  /**
   * Get lobby by ID
   */
  getLobby(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }

  /**
   * Get all public lobbies (for matchmaking)
   */
  getPublicLobbies(): Lobby[] {
    return Array.from(this.lobbies.values())
      .filter(lobby => 
        !lobby.settings.isPrivate && 
        lobby.status === 'waiting' &&
        lobby.players.size < lobby.settings.maxPlayers
      )
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  /**
   * Update player socket ID (when they reconnect)
   */
  updatePlayerSocket(playerId: number, newSocketId: string): boolean {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return false;

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return false;

    const player = lobby.players.get(playerId);
    if (!player) return false;

    player.socketId = newSocketId;
    lobby.lastActivity = new Date();
    
    logger.info(`Updated socket for user ${playerId} in lobby ${lobbyId}`);
    return true;
  }

  /**
   * Close lobby and clean up
   */
  private closeLobby(lobbyId: string): void {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return;

    // Remove all player mappings
    for (const playerId of lobby.players.keys()) {
      this.playerToLobby.delete(playerId);
    }

    // Remove lobby code mapping
    this.lobbyCodes.delete(lobby.code);
    
    // Remove lobby
    this.lobbies.delete(lobbyId);

    logger.info(`Lobby ${lobbyId} closed`);
    this.emit('lobby-closed', { lobbyId });
  }

  /**
   * Cleanup inactive lobbies
   */
  private startLobbyCleanup(): void {
    setInterval(() => {
      const now = new Date();
      const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes

      for (const [lobbyId, lobby] of this.lobbies) {
        const inactive = now.getTime() - lobby.lastActivity.getTime() > INACTIVE_THRESHOLD;
        
        if (inactive && lobby.status === 'waiting') {
          logger.info(`Cleaning up inactive lobby ${lobbyId}`);
          this.closeLobby(lobbyId);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private generateLobbyId(): string {
    return `lobby_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateJoinCode(): string {
    let code: string;
    do {
      code = Math.random().toString(36).substr(2, 6).toUpperCase();
    } while (this.lobbyCodes.has(code));
    
    return code;
  }

  // Get game engine for other modules
  getGameEngine(): GameEngine {
    return this.gameEngine;
  }
}

// 📁 /modules/game/lobby/MatchmakingService.ts
export class MatchmakingService {
  constructor(private lobbyManager: GameLobbyManager) {}

  /**
   * Find or create a suitable lobby for quick match
   */
  findMatch(playerId: number, playerUsername: string, socketId: string, preferredSettings?: Partial<LobbySettings>): Lobby {
    // Look for existing public lobbies that match preferences
    const publicLobbies = this.lobbyManager.getPublicLobbies();
    
    const suitableLobby = publicLobbies.find(lobby => {
      if (!preferredSettings) return true;
      
      return (
        (!preferredSettings.gameMode || lobby.settings.gameMode === preferredSettings.gameMode) &&
        (!preferredSettings.maxLaps || lobby.settings.maxLaps === preferredSettings.maxLaps) &&
        lobby.players.size < lobby.settings.maxPlayers
      );
    });

    if (suitableLobby) {
      // Join existing lobby
      return this.lobbyManager.joinLobby(suitableLobby.id, playerId, playerUsername, socketId);
    } else {
      // Create new lobby
      const settings: Partial<LobbySettings> = {
        isPrivate: false,
        ...preferredSettings
      };
      
      return this.lobbyManager.createLobby(playerId, playerUsername, socketId, settings);
    }
  }
}