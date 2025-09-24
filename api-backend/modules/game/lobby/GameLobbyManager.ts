import { EventEmitter } from 'events';
import { GameEngine } from '../engine/GameEngine';
import { Player, Character, Asset, Loan , Card} from '../types/GameTypes';
import { logger } from '../../../config/logger';
import { redisClient } from '../../../config/redis';
import { randomBytes } from 'crypto';

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
  availableCharacters: string[];
}

export interface LobbyPlayer {
  id: number;
  username: string;
  socketId: string;
  isHost: boolean;
  isReady: boolean;
  joinedAt: Date;
  character?: Character;
}

export interface LobbySettings {
  gameMode: 'laps' | 'elimination';
  maxLaps?: number;
  targetNetWorth?: number;
  maxPlayers: number;
  isPrivate: boolean
}



export class GameLobbyManager extends EventEmitter {
  private lobbies = new Map<string, Lobby>();
  private playerToLobby = new Map<number, string>(); // Track which lobby each player is in
  private lobbyCodes = new Map<string, string>(); // code -> lobbyId mapping

  private readonly ALL_CHARACTERS = [
    'Cowboy', 'Green_girl', 'Kimono_girl', 'Lilac_girl', 'Mr_suit', 'Ninja.001'
  ];

  constructor(private gameEngine: GameEngine) {
    super();
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
      maxLaps: settings.maxLaps || 5,
      maxPlayers: 6,
      isPrivate: false,
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
      players: new Map([ [ hostId, host ] ]),
      settings: defaultSettings,
      status: 'waiting',
      createdAt: new Date(),
      lastActivity: new Date(),
      availableCharacters: [ ...this.ALL_CHARACTERS ]
    };

    this.lobbies.set(lobbyId, lobby);
    this.lobbyCodes.set(joinCode, lobbyId);
    this.playerToLobby.set(hostId, lobbyId);

    logger.info(`Lobby ${lobbyId} created by user ${hostId} with code ${joinCode}`);
   // this.emit('lobby-created', lobby);

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
      isReady: true,
      joinedAt: new Date()
    };

    lobby.players.set(playerId, player);
    lobby.lastActivity = new Date();
    this.playerToLobby.set(playerId, lobbyId);

    logger.info(`User ${playerId} joined lobby ${lobbyId}`);
  //  this.emit('player-joined-lobby', { lobby, player });

    return lobby;
  }


  /**
   * Select character for player
   */
  selectCharacter(playerId: number, characterId: string): boolean {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return false;

    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.status !== 'waiting') return false;


    const player = lobby.players.get(playerId);
    if (!player) return false;

    // Validate character exists
    const character = this.getCharacterById(characterId);
    if (!character) return false;

    // Check if character is already taken by another player
    const isCharacterTaken = Array.from(lobby.players.values())
      .some(p => p.id !== playerId && p.character?.id === characterId);

    if (isCharacterTaken) {
      throw new Error('Character already selected by another player');
    }

    // Set character for player
    player.character = character;
    lobby.lastActivity = new Date();

    logger.info(`Player ${playerId} selected character ${characterId} in lobby ${lobbyId}`);
  //  this.emit('player-character-selected', { lobby, playerId, character });

    return true;
  }

  /**
   * Get available characters for lobby (not taken by other players)
   */
  getAvailableCharacters(lobbyId: string, excludePlayerId?: number): Character[] {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return [];

    const takenCharacterIds = Array.from(lobby.players.values())
      .filter(p => p.id !== excludePlayerId && p.character)
      .map(p => p.character!.id);

    // Assuming Character type has at least id and name
    return this.ALL_CHARACTERS
      .filter(charId => !takenCharacterIds.includes(charId))
      .map(charId => ({ id: charId, name: charId } as Character));
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
          .sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())[ 0 ];

        newHost.isHost = true;
        newHost.isReady = true;
        lobby.hostId = newHost.id;

        logger.info(`User ${newHost.id} promoted to host of lobby ${lobbyId}`);
   //     this.emit('host-changed', { lobby, newHost });
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

//    this.emit('player-ready-changed', { lobby, playerId, isReady: player.isReady });
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

  private lobbyLocks = new Set<string>();

  startGame(playerId: number): string | null {
    const lobbyId = this.playerToLobby.get(playerId);
    if (!lobbyId) return null;
    if (!lobbyId || this.lobbyLocks.has(lobbyId)) return null;
    this.lobbyLocks.add(lobbyId);
    let gameId: string | null = null;
    try {
      const lobby = this.lobbies.get(lobbyId);
      if (!lobby || lobby.hostId !== playerId || lobby.status !== 'waiting') {
        return null;
      }

      // Check minimum players
      if (lobby.players.size < 1) { // changed to 1 for testing
        throw new Error('Need at least 1 player to start');
      }

      // Check if all players are ready
      const allReady = Array.from(lobby.players.values())
        .every(player => player.isReady);

      if (!allReady) {
        throw new Error('All players must be ready');
      }

      // Create game
      gameId = this.generateGameId();
      const gameState = this.gameEngine.createGame(gameId, playerId, lobby.settings.gameMode, lobby.settings.maxLaps || 5);
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
          character: lobbyPlayer.character, // Include character
          statusEffects: [] // Add default empty statusEffects
        };

        this.gameEngine.addPlayer(gameId, gamePlayer);
      }

      gameState.gamePhase = 'playing'; // Set initial phase to playing

      // Start the actual game
      this.gameEngine.startGame(gameId);

      // Update lobby status
      lobby.status = 'in_game';
      lobby.gameId = gameId;
      lobby.lastActivity = new Date();
      logger.info(`Game ${gameId} started from lobby ${lobbyId}`);
     // this.emit('game-started-from-lobby', { lobby, gameId });

    } finally {
      this.lobbyLocks.delete(lobbyId);
      return gameId;
    }
  }


  startGameFromLobby(lobbyId: string, playerId: number): string | null {
    if (!lobbyId || this.lobbyLocks.has(lobbyId)) return null;
    this.lobbyLocks.add(lobbyId);
    let gameId: string | null = null;
    try {
      const lobby = this.lobbies.get(lobbyId);
      if (!lobby ||  lobby.status !== 'waiting') {
        logger.error(`Lobby not found or not in waiting status: ${lobbyId}`);
        return null;
      }

      // Check minimum players
      if (lobby.players.size < 1) { // changed to 1 for testing
        throw new Error('Need at least 1 player to start');
      }

      // Check if all players are ready
      const allReady = Array.from(lobby.players.values())
        .every(player => player.isReady);

      if (!allReady) {
        throw new Error('All players must be ready');
      }

      // Create game
      gameId = this.generateGameId();
      const gameState = this.gameEngine.createGame(gameId, playerId, lobby.settings.gameMode, lobby.settings.maxLaps || 5);
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
          character: lobbyPlayer.character, // Include character
          statusEffects: [] // Add default empty statusEffects
        };

        this.gameEngine.addPlayer(gameId, gamePlayer);
      }

      // Start the actual game
            gameState.gamePhase = 'playing'; // Set initial phase to playing

      this.gameEngine.startGame(gameId);

      // Update lobby status
      lobby.status = 'in_game';
      lobby.gameId = gameId;
      lobby.lastActivity = new Date();
      logger.info(`Game ${gameId} started from lobby ${lobbyId}`);
    //  this.emit('game-started-from-lobby', { lobby, gameId });

    } finally {
      this.lobbyLocks.delete(lobbyId);
      return gameId;
    }
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
 //   this.emit('lobby-closed', { lobbyId });
  }

  /**
   * Cleanup inactive lobbies
   */
  private startLobbyCleanup(): void {
    setInterval(() => {
      const now = new Date();
      const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes

      for (const [ lobbyId, lobby ] of this.lobbies) {
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
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
    let code = '';
    const bytes = randomBytes(6);
    for (let i = 0; i < 6; i++) code += alphabet[ bytes[ i ] % alphabet.length ];
    if (this.lobbyCodes.has(code)) return this.generateJoinCode();
    return code;
  }

  // Get game engine for other modules
  getGameEngine(): GameEngine {
    return this.gameEngine;
  }

  /**
   * Helper to get character by ID
   */
  private getCharacterById(characterId: string): Character | undefined {
    // Assuming Character type has at least id and name
    if (this.ALL_CHARACTERS.includes(characterId)) {
      return { id: characterId, name: characterId } as Character;
    }
    return undefined;
  }
}