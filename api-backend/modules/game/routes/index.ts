//  /modules/game/routes/index.ts
import { Router, Application, Request, Response } from 'express';
import { GameLobbyManager } from '../lobby/GameLobbyManager';
import { GameEngine } from '../engine/GameEngine';
import { MatchmakingService } from '../lobby/MatchmakingService';
import { logger } from '../../../config/logger';
import { log } from 'console';

export function registerGameRoutes(app: Application, lobbyManager: GameLobbyManager) {
  const router = Router();
  const matchmakingService = new MatchmakingService(lobbyManager);


  // 🏠 LOBBY MANAGEMENT ROUTES

  /**
   * POST /api/game/lobby/create
   * Create a new game lobby
   */
  router.post('/lobby/create', async (req: Request, res: Response) => {
    try {
      const { user_id, username, gameMode, maxLaps, maxPlayers, isPrivate } = req.body;

      // Validate input
      if (gameMode && ![ 'laps', 'elimination' ].includes(gameMode)) {
        res.status(400).json({ error: 'Invalid game mode' });
        return;
      }

      const settings = {
        gameMode: gameMode || 'laps',
        maxLaps: maxLaps || 10,
        maxPlayers: Math.min(maxPlayers || 6, 6),
        isPrivate: Boolean(isPrivate)
      };

      // Note: socketId will be empty here, updated when player connects via Socket.IO
      const lobby = lobbyManager.createLobby(Number(user_id), username, '', settings);

      res.json({
        success: true,
        lobby: {
          id: lobby.id,
          code: lobby.code,
          settings: lobby.settings,
          players: Array.from(lobby.players.values()).map(p => {
            const player = p as {
              id: number | string;
              username: string;
              isHost: boolean;
              isReady: boolean;
            };
            return {
              id: player.id,
              username: player.username,
              isHost: player.isHost,
              isReady: player.isReady
            };
          }),
          status: lobby.status
        }
      });

      logger.info(`Lobby ${lobby.code} created by user ${username}`);
    } catch (error: any) {
      logger.error('Error creating lobby:', error);
      res.status(400).json({ error: error.message });
    }
  });

  /**
   * POST /api/game/lobby/join
   * Join a lobby by code or ID
   */
  router.post('/lobby/join', async (req: Request, res: Response) => {
    try {

      const { user_id, username, code } = req.body;
      if (!user_id || !username) {
        logger.warn('Missing user info in join lobby request');
        res.status(400).json({ error: 'Missing user info' });
        return;
      }

      if (!code) {
        res.status(400).json({ error: 'Lobby code required' });
        return;
      }

      const lobby = lobbyManager.joinLobby(code, Number(user_id), username, '');

      res.json({
        success: true,
        lobby: {
          id: lobby.id,
          code: lobby.code,
          settings: lobby.settings,
          players: Array.from(lobby.players.values()).map(p => {
            const player = p as {
              id: number | string;
              username: string;
              isHost: boolean;
              isReady: boolean;
            };
            return {
              id: player.id,
              username: player.username,
              isHost: player.isHost,
              isReady: player.isReady
            };
          }),
          status: lobby.status
        }
      });

    } catch (error: any) {
      logger.error('Error joining lobby:', error);
      res.status(400).json({ error: error.message });
    }
  });

  /**
   * GET /api/game/lobby/my-lobby
   * Get current lobby for authenticated user
   */
  router.post('/lobby/my-lobby', async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;
      const lobby = lobbyManager.getLobbyByPlayer(Number(user_id));

      if (!lobby) {
        res.json({ success: true, lobby: null });
        return;
      }

      res.json({
        success: true,
        lobby: {
          id: lobby.id,
          code: lobby.code,
          settings: lobby.settings,
          players: Array.from(lobby.players.values()).map(p => ({
            id: p.id,
            username: p.username,
            isHost: p.isHost,
            isReady: p.isReady,
            joinedAt: p.joinedAt,
            character: p.character
          })),
          status: lobby.status,
          gameId: lobby.gameId
        }
      });

    } catch (error: any) {
      logger.error('Error getting user lobby:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/game/lobby/leave
   * Leave current lobby
   */
  router.post('/lobby/leave', async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;
      const success = lobbyManager.leaveLobby(Number(user_id));

      if (!success) {
        res.status(404).json({ error: 'Not in any lobby' });
        return;
      }

      res.json({ success: true, message: 'Left lobby successfully' });

    } catch (error: any) {
      logger.error('Error leaving lobby:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/lobby/character', async (req: Request, res: Response) => {
    try {
      const { user_id, character } = req.body;
      if (!character) {
        res.status(400).json({ error: 'Character data required' });
        return;
      }

      const success = lobbyManager.selectCharacter(Number(user_id), character);
      if (!success) {
        res.status(404).json({ error: 'Not in any lobby' });
        return;
      }

      res.json({ success: true, message: 'Character set successfully' });

    } catch (error: any) {
      logger.error('Error setting player character:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * PUT /api/game/lobby/settings
   * Update lobby settings (host only)
   */
  router.put('/lobby/settings', async (req: Request, res: Response) => {
    try {
      const { user_id } = req.user as any;
      const { gameMode, maxLaps, maxPlayers, isPrivate } = req.body;

      const settings: any = {};
      if (gameMode) settings.gameMode = gameMode;
      if (maxLaps) settings.maxLaps = maxLaps;
      if (maxPlayers) settings.maxPlayers = Math.min(maxPlayers, 6);
      if (typeof isPrivate === 'boolean') settings.isPrivate = isPrivate;

      const success = lobbyManager.updateSettings(Number(user_id), settings);

      if (!success) {
        res.status(403).json({ error: 'Only host can update settings or lobby not found' });
        return;
      }

      res.json({ success: true, message: 'Settings updated' });

    } catch (error: any) {
      logger.error('Error updating lobby settings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 🎮 MATCHMAKING ROUTES

  /**
   * POST /api/game/matchmaking/quick-match
   * Find or create a lobby for quick match
   */
  router.post('/matchmaking/quick-match', async (req: Request, res: Response) => {
    try {
      const { gameMode, maxLaps, user_id, username } = req.body;

      const preferences = {
        gameMode: gameMode || 'laps',
        maxLaps: maxLaps || 10
      };

      const lobby = matchmakingService.findMatch(Number(user_id), username, '', preferences);

      res.json({
        success: true,
        lobby: {
          id: lobby.id,
          code: lobby.code,
          settings: lobby.settings,
          players: Array.from(lobby.players.values()).map(p => ({
            id: p.id,
            username: p.username,
            isHost: p.isHost,
            isReady: p.isReady
          })),
          status: lobby.status
        }
      });

    } catch (error: any) {
      logger.error('Error in quick match:', error);
      res.status(400).json({ error: error.message });
    }
  });


  router.post('/lobby/start', async (req, res) => {
    try {
      const { user_id } = req.body;
      const gameId = lobbyManager.startGame(user_id);
      if (!gameId) {
        res.status(409).json({ error: 'Cannot start game (not host / not ready / too few players)' });
        return;
      }
      res.json({ success: true, gameId });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  /**
   * GET /api/game/state/:gameId
   * Get current game state (for reconnection, spectating)
   */
  router.get('/state/:gameId', async (req: Request, res: Response) => {
    try {
      const { gameId } = req.params;
      const { user_id } = req.body;

      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      // Check if user is part of this game
      const isPlayer = gameState.players.has(Number(user_id));
      const lobby = Array.from(lobbyManager[ 'lobbies' ].values())
        .find(l => l.gameId === gameId);


      // Return sanitized game state
      const publicGameState = {
        id: gameState.id,
        gamePhase: gameState.gamePhase,
        currentPlayerId: gameState.currentPlayerId,
        gameMode: gameState.gameMode,
        maxLaps: gameState.maxLaps,
        players: Array.from(gameState.players.values()).map(player => ({
          id: player.id,
          username: player.username,
          position: player.position,
          cash: player.cash,
          assets: player.assets,
          loans: player.loans.map(loan => ({ ...loan, amount: Math.round(loan.amount) })),
          lapsCompleted: player.lapsCompleted,
          salary: player.salary,
          isActive: player.isActive,
          isBankrupt: player.isBankrupt,
          netWorth: player.cash +
            player.assets.reduce((sum, asset) => sum + (asset.purchasePrice * asset.sellbackMultiplier), 0) -
            player.loans.reduce((sum, loan) => sum + loan.amount, 0)
        })),
        board: gameState.board,
        startedAt: gameState.startedAt,
        finishedAt: gameState.finishedAt
      };

      res.json({
        success: true,
        gameState: publicGameState,
        isPlayer,
        isSpectator: !isPlayer
      });

    } catch (error: any) {
      logger.error('Error getting game state:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  /*
    GET player state
    Networth, number of assets, position, laps completed/total laps
  */
  router.get('/player/state', async (req: Request, res: Response) => {
    try {
      const { user_id, gameId } = req.body;
      if (!user_id || !gameId) {
        res.status(400).json({ error: 'Missing user_id or gameId' });
        return;
      }

      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const player = gameState.players.get(Number(user_id));
      if (!player) {
        res.status(404).json({ error: 'Player not found in game' });
        return;
      }

      res.json({
        success: true,
        player: {
          id: player.id,
          username: player.username,
          position: player.position,
          cash: player.cash,
          assets: player.assets,
          loans: player.loans.map(loan => ({ ...loan, amount: Math.round(loan.amount) })),
          lapsCompleted: player.lapsCompleted,
          salary: player.salary,
          isActive: player.isActive,
          isBankrupt: player.isBankrupt,
          netWorth: player.cash +
            player.assets.reduce((sum, asset) => sum + (asset.purchasePrice * asset.sellbackMultiplier), 0) -
            player.loans.reduce((sum, loan) => sum + loan.amount, 0)
        }
      });
    } catch (error: any) {
      logger.error('Error getting player state:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  /**
   * Get balance sheet of player
   * net worth, cash, business worth, loans, number of cards in inventory, asset value
   */
  router.get('/game/balance-sheet/', async (req: Request, res: Response) => {
    try {
      // get game engine
      const { user_id, gameId } = req.body;
      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId)

      const balanceSheet = gameEngine.getPlayerBalanceSheet(gameId, user_id);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      if (!balanceSheet) {
        res.status(404).json({ error: 'Player not found in game' });
        return;
      }

      res.json({
        success: true,
        balanceSheet
      });

    } catch (error: any) {
      logger.error('Error getting player balance sheet:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  /**
   * Get all player positions
   * Player usernames, positions, laps completed
   */
  router.get('/game/positions', async (req: Request, res: Response) => {
    try {
      const { gameId } = req.body;
      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const playerStats = gameEngine.getAllPlayersStats(gameId);
      if (!playerStats) {
        res.status(404).json({ error: 'No players found in game' });
        return;
      }

      res.json({
        success: true,
        playerStats
      });
    } catch (error: any) {
      logger.error('Error getting player positions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Get player card inventory
   * 
   */
  router.get('/game/cards', async (req: Request, res: Response) => {
    try {
      const { user_id, gameId } = req.body;
      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const inventory = gameEngine.getPlayerCardInventory(gameId, user_id);
      if (!inventory) {
        res.status(404).json({ error: 'Player not found in game' });
        return;
      }

      res.json({
        success: true,
        inventory
      });
    } catch (error: any) {
      logger.error('Error getting player card inventory:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Get player businesses
   * Business name, business worth, business image
   */
  router.get('/game/businesses', async (req: Request, res: Response) => {
    try {
      const { user_id, gameId } = req.body;
      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const businesses = gameEngine.getPlayerAssets(gameId, user_id);
      if (!businesses) {
        res.status(404).json({ error: 'Player not found in game' });
        return;
      }
      res.json({
        success: true,
        businesses
      });
    } catch (error: any) {
      logger.error('Error getting player businesses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  router.get('/quick-match', async (req: Request, res: Response) => {
    try {
      const lobbies = matchmakingService.getAllMatches();
      res.json({ success: true, lobbies });
    } catch (error: any) {
      logger.error('Error getting matchmaking queues:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
 * POST /api/game/turn
 * Processes the current player's action and transitions to the next turn
 */
  router.post('/turn', async (req: Request, res: Response) => {
    try {
      const { gameId, user_id } = req.body; // Get the game ID from request body

      // Fetch the game state
      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const currentPlayer = gameState.players.get(gameState.currentPlayerId);

      if (!currentPlayer || currentPlayer.id !== Number(user_id)) {
        res.status(400).json({ error: 'Not your turn' });
        return;
      }

      // Handle the player's action (e.g., moving on the board, interacting with a business)
      gameEngine.nextTurn(gameId);

      // Respond with the updated game state
      const updatedGameState = gameEngine.getGameState(gameId);
      res.json({
        success: true,
        gameState: updatedGameState,
      });

    } catch (error: any) {
      logger.error('Error processing turn:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  /**
   * POST /api/game/roll-dice
   * Rolls the dice for the current player and updates their position
   */
  router.post('/roll-dice', async (req: Request, res: Response) => {
    try {
      const { gameId, user_id } = req.body; // Get the game ID from request body

      const gameEngine = lobbyManager.getGameEngine();
      const gameState = gameEngine.getGameState(gameId);


      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const currentPlayer = gameState.players.get(gameState.currentPlayerId);

      if (!currentPlayer || currentPlayer.id !== Number(user_id)) {
        res.status(400).json({ error: 'Not your turn' });
        return;
      }

      // Roll the dice
      const diceRoll = gameEngine.rollDice();
      const moveSuccess = gameEngine.movePlayer(gameId, Number(user_id), diceRoll);

      if (!moveSuccess) {
        res.status(400).json({ error: 'Unable to move player' });
        return;
      }

      const updatedGameState = gameEngine.getGameState(gameId);

      res.json({
        success: true,
        diceRoll,
        gameState: updatedGameState,
      });

    } catch (error: any) {
      logger.error('Error rolling dice:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/game/purchase-asset
   * Allows the player to purchase an asset (e.g., business or investment)
   */
  router.post('/purchase-asset', async (req: Request, res: Response) => {
    try {
      const { gameId, assetId, user_id } = req.body; // Get the game ID and asset ID from request body

      const gameEngine = lobbyManager.getGameEngine();

      // Fetch the game state
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const player = gameState.players.get(user_id);
      if (!player) {
        res.status(404).json({ error: 'Player not found in game' });
        return;
      }

      // Check if the player can afford the asset
      const asset = gameState.board.blocks.find(b => b.id.toString() === assetId && b.type === 'business')?.asset;

      if (!asset) {
        res.status(400).json({ error: 'Asset not found' });
        return;
      }

      if (player.cash < asset.purchasePrice) {
        res.status(400).json({ error: 'Not enough cash to purchase asset' });
        return;
      }

      // Purchase the asset
      const success = gameEngine.buyAsset(gameId, user_id, assetId);

      if (!success) {
        res.status(400).json({ error: 'Unable to purchase asset' });
        return;
      }

      const updatedGameState = gameEngine.getGameState(gameId);

      res.json({
        success: true,
        gameState: updatedGameState,
      });

    } catch (error: any) {
      logger.error('Error purchasing asset:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/game/end-turn
   * Signals the end of the current turn and prepares for the next turn
   */
  router.post('/end-turn', async (req: Request, res: Response) => {
    try {
      const { gameId, user_id } = req.body; // Get the game ID from request body

      const gameEngine = lobbyManager.getGameEngine();
      // Fetch the game state
      const gameState = gameEngine.getGameState(gameId);

      if (!gameState) {
        res.status(404).json({ error: 'Game not found' });
        return;
      }

      const currentPlayer = gameState.players.get(gameState.currentPlayerId);

      if (!currentPlayer || currentPlayer.id !== user_id) {
        res.status(400).json({ error: 'Not your turn' });
        return;
      }

      // End the current turn and move to the next player
      gameEngine.nextTurn(gameId);

      const updatedGameState = gameEngine.getGameState(gameId);

      res.json({
        success: true,
        gameState: updatedGameState,
      });

    } catch (error: any) {
      logger.error('Error ending turn:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // 📊 GAME STATS ROUTES

  // Mount all routes under /api/game
  app.use('/api/game', router);
}
