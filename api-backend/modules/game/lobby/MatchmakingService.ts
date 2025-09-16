// 📁 /modules/game/lobby/MatchmakingService.ts
import { GameLobbyManager, Lobby, LobbySettings } from './GameLobbyManager';
import { EventEmitter } from 'events';
import { logger } from '../../../config/logger';

export interface MatchmakingPreferences {
  gameMode?: 'laps' | 'elimination';
  maxLaps?: number;
}

export interface MatchmakingQueue {
  playerId: number;
  username: string;
  socketId: string;
  preferences: MatchmakingPreferences;
  queuedAt: Date;
}

export class MatchmakingService extends EventEmitter {
  private matchmakingQueue = new Map<number, MatchmakingQueue>();
  private matchmakingTimer: NodeJS.Timeout | null = null;

  constructor(private lobbyManager: GameLobbyManager) {
    super();
    this.startMatchmakingLoop();
  }

  /**
   * Find or create a suitable lobby for quick match
   */
  findMatch(playerId: number, playerUsername: string, socketId: string, preferredSettings?: Partial<LobbySettings>): Lobby {
    // Look for existing public lobbies that match basic preferences
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

  getAllMatches(): Lobby[] {
    return this.lobbyManager.getPublicLobbies();
  }
  /**
   * Add player to matchmaking queue
   */
  queueForMatch(
    playerId: number, 
    username: string, 
    socketId: string, 
    preferences: MatchmakingPreferences = {}
  ): { queued: boolean; position: number } {
    
    // Check if player is already in a lobby or queue
    if (this.lobbyManager.getLobbyByPlayer(playerId)) {
      throw new Error('Player already in lobby');
    }

    if (this.matchmakingQueue.has(playerId)) {
      throw new Error('Player already in matchmaking queue');
    }

    const queueEntry: MatchmakingQueue = {
      playerId,
      username,
      socketId,
      preferences: {
        gameMode: preferences.gameMode || 'laps',
        maxLaps: preferences.maxLaps || 10
      },
      queuedAt: new Date()
    };

    this.matchmakingQueue.set(playerId, queueEntry);
    
    logger.info(`Player ${playerId} queued for matchmaking`);
    this.emit('player-queued', { playerId, queueSize: this.matchmakingQueue.size });

    return { 
      queued: true, 
      position: this.getQueuePosition(playerId)
    };
  }

  /**
   * Remove player from matchmaking queue
   */
  cancelMatchmaking(playerId: number): boolean {
    const removed = this.matchmakingQueue.delete(playerId);
    
    if (removed) {
      logger.info(`Player ${playerId} cancelled matchmaking`);
      this.emit('player-cancelled', { playerId });
    }

    return removed;
  }

  /**
   * Get player's position in queue
   */
  getQueuePosition(playerId: number): number {
    const queuedPlayers = Array.from(this.matchmakingQueue.values())
      .sort((a, b) => a.queuedAt.getTime() - b.queuedAt.getTime());
    
    return queuedPlayers.findIndex(entry => entry.playerId === playerId) + 1;
  }

  /**
   * Get queue status for player
   */
  getQueueStatus(playerId: number): MatchmakingQueue | null {
    return this.matchmakingQueue.get(playerId) || null;
  }

  /**
   * Main matchmaking loop - runs every 5 seconds
   */
  private startMatchmakingLoop(): void {
    this.matchmakingTimer = setInterval(() => {
      this.processMatchmakingQueue();
    }, 5000);
  }

  /**
   * Process the queue and try to create matches
   */
  private processMatchmakingQueue(): void {
    if (this.matchmakingQueue.size < 2) return;

    const queuedPlayers = Array.from(this.matchmakingQueue.values())
      .sort((a, b) => a.queuedAt.getTime() - b.queuedAt.getTime());

    // Group players by game mode preference
    const lapsModeQueue = queuedPlayers.filter(p => p.preferences.gameMode === 'laps');
    const eliminationModeQueue = queuedPlayers.filter(p => p.preferences.gameMode === 'elimination');

    // Try to create matches for each mode
    this.createMatchesFromQueue(lapsModeQueue, 'laps');
    this.createMatchesFromQueue(eliminationModeQueue, 'elimination');

    // If we have players waiting too long (> 30 seconds), mix game modes
    const longWaitingPlayers = queuedPlayers.filter(p => 
      Date.now() - p.queuedAt.getTime() > 30000
    );

    if (longWaitingPlayers.length >= 2) {
      this.createMatchesFromQueue(longWaitingPlayers, 'laps'); // Default to laps mode
    }
  }

  /**
   * Create matches from a queue of players
   */
  private createMatchesFromQueue(queue: MatchmakingQueue[], gameMode: 'laps' | 'elimination'): void {
    while (queue.length >= 2) {
      // Take 2-6 players for a match (prefer 4-6)
      const groupSize = Math.min(6, Math.max(2, queue.length >= 4 ? 4 : queue.length));
      const group = queue.splice(0, groupSize);

      this.createLobbyFromGroup(group, gameMode);
    }
  }

  /**
   * Create a lobby from a group of players
   */
  private createLobbyFromGroup(group: MatchmakingQueue[], gameMode: 'laps' | 'elimination'): void {
    try {
      const host = group[0];

      // Calculate average preferred laps
      const avgLaps = Math.round(
        group.reduce((sum, p) => sum + (p.preferences.maxLaps || 10), 0) / group.length
      );

      const settings: Partial<LobbySettings> = {
        gameMode,
        maxLaps: avgLaps,
        maxPlayers: 6,
        isPrivate: false
      };
      
      const lobby = this.lobbyManager.createLobby(
        host.playerId,
        host.username,
        host.socketId,
        settings
      );

      // Add other players to the lobby
      for (let i = 1; i < group.length; i++) {
        const player = group[i];
        try {
          this.lobbyManager.joinLobby(lobby.id, player.playerId, player.username, player.socketId);
        } catch (error) {
          logger.warn(`Failed to add player ${player.playerId} to matched lobby:`, error);
        }
      }

      // Remove all players from queue
      group.forEach(player => {
        this.matchmakingQueue.delete(player.playerId);
      });

      const matchmakingTime = Date.now() - Math.min(...group.map(p => p.queuedAt.getTime()));
      
      logger.info(`Created matched lobby ${lobby.id} with ${group.length} players (${matchmakingTime}ms wait)`);
      this.emit('match-created', { 
        lobby, 
        playerIds: group.map(p => p.playerId),
        matchmakingTime
      });

    } catch (error) {
      logger.error('Error creating match from group:', error);
      
      // Put players back in queue on error
      group.forEach(player => {
        this.matchmakingQueue.set(player.playerId, player);
      });
    }
  }

  /**
   * Clean up when service is destroyed
   */
  destroy(): void {
    if (this.matchmakingTimer) {
      clearInterval(this.matchmakingTimer);
      this.matchmakingTimer = null;
    }
  }

  // Public getters for monitoring
  getQueueSize(): number {
    return this.matchmakingQueue.size;
  }

  getQueuedPlayers(): MatchmakingQueue[] {
    return Array.from(this.matchmakingQueue.values());
  }
}