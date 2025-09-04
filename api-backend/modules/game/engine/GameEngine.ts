import { GameState, Player, Card, Block, Board } from '../types/GameTypes';
import { EventEmitter } from 'events';

export class GameEngine extends EventEmitter {
  private games = new Map<string, GameState>();

  createGame(gameId: string, hostPlayerId: number, gameMode: 'laps' | 'elimination'): GameState {
    const gameState: GameState = {
      id: gameId,
      players: new Map(),
      currentPlayerId: hostPlayerId,
      gamePhase: 'waiting',
      board: this.createBoard(),
      communityDeck: this.shuffleDeck(this.createCommunityDeck()),
      chanceDeck: this.shuffleDeck(this.createChanceDeck()),
      communityDiscard: [],
      chanceDiscard: [],
      gameMode,
      maxLaps: gameMode === 'laps' ? 10 : undefined,
      createdAt: new Date()
    };

    this.games.set(gameId, gameState);
    return gameState;
  }

  addPlayer(gameId: string, player: Player): boolean {
    const game = this.games.get(gameId);
    if (!game || game.gamePhase !== 'waiting' || game.players.size >= 6) {
      return false;
    }

    // Initialize player with starting resources
    const newPlayer: Player = {
      ...player,
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

    game.players.set(player.id, newPlayer);
    this.emit('player-joined', { gameId, player: newPlayer });
    return true;
  }

  startGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.gamePhase !== 'waiting' || game.players.size < 2) {
      return false;
    }

    game.gamePhase = 'playing';
    game.startedAt = new Date();
    
    // Randomize turn order
    const playerIds = Array.from(game.players.keys());
    const randomizedIds = this.shuffleArray(playerIds);
    game.currentPlayerId = randomizedIds[0];

    this.emit('game-started', { gameId, turnOrder: randomizedIds });
    return true;
  }

  rollDice(): number {
    return Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
  }

  movePlayer(gameId: string, playerId: number, spaces: number): boolean {
    const game = this.games.get(gameId);
    if (!game || game.currentPlayerId !== playerId) return false;

    const player = game.players.get(playerId);
    if (!player || player.isBankrupt) return false;

    const oldPosition = player.position;
    const newPosition = (player.position + spaces) % game.board.blocks.length;
    
    // Check if player passed START
    if (newPosition < oldPosition || (oldPosition + spaces >= game.board.blocks.length)) {
      player.lapsCompleted++;
      player.cash += player.salary;
      this.emit('player-passed-start', { gameId, playerId, salary: player.salary });
    }

    player.position = newPosition;
    const landedBlock = game.board.blocks[newPosition];
    
    this.emit('player-moved', { gameId, playerId, oldPosition, newPosition, landedBlock });
    this.handleBlockLanding(gameId, playerId, landedBlock);

    return true;
  }

  private handleBlockLanding(gameId: string, playerId: number, block: Block): void {
    const game = this.games.get(gameId)!;
    const player = game.players.get(playerId)!;

    switch (block.type) {
      case 'community':
        this.drawCard(gameId, playerId, 'community');
        break;
      case 'chance':
        this.drawCard(gameId, playerId, 'chance');
        break;
      case 'business':
        this.handleBusinessBlock(gameId, playerId, block);
        break;
      case 'action':
        this.handleActionBlock(gameId, playerId, block);
        break;
      case 'bankruptcy':
        this.handleBankruptcy(gameId, playerId);
        break;
    }
  }

  private drawCard(gameId: string, playerId: number, deckType: 'community' | 'chance'): void {
    const game = this.games.get(gameId)!;
    const deck = deckType === 'community' ? game.communityDeck : game.chanceDeck;
    const discard = deckType === 'community' ? game.communityDiscard : game.chanceDiscard;

    if (deck.length === 0) {
      // Reshuffle discard pile
      deck.push(...this.shuffleDeck(discard));
      discard.length = 0;
    }

    const card = deck.pop()!;
    this.emit('card-drawn', { gameId, playerId, card });
    this.applyCardEffect(gameId, playerId, card);
    discard.push(card);
  }

  private applyCardEffect(gameId: string, playerId: number, card: Card): void {
    const game = this.games.get(gameId)!;
    const player = game.players.get(playerId)!;

    switch (card.effect.type) {
      case 'cash':
        player.cash += card.effect.amount || 0;
        break;
      case 'move':
        if (card.effect.targetPosition !== undefined) {
          player.position = card.effect.targetPosition;
        } else if (card.effect.relativeMoves) {
          this.movePlayer(gameId, playerId, card.effect.relativeMoves);
        }
        break;
      case 'salary':
        player.salary += card.effect.salaryChange || 0;
        break;
    }

    this.emit('card-effect-applied', { gameId, playerId, card, newPlayerState: player });
  }

  nextTurn(gameId: string): void {
    const game = this.games.get(gameId)!;
    const playerIds = Array.from(game.players.keys()).filter(id => 
      !game.players.get(id)!.isBankrupt
    );
    
    if (playerIds.length <= 1) {
      this.endGame(gameId, 'elimination');
      return;
    }

    const currentIndex = playerIds.indexOf(game.currentPlayerId);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    game.currentPlayerId = playerIds[nextIndex];

    this.emit('turn-changed', { gameId, currentPlayerId: game.currentPlayerId });
  }

  private handleBankruptcy(gameId: string, playerId: number): void {
    const game = this.games.get(gameId)!;
    const player = game.players.get(playerId)!;
    
    player.isBankrupt = true;
    player.isActive = false;
    
    // Liquidate all assets
    player.assets.forEach(asset => {
      player.cash += Math.floor(asset.purchasePrice * asset.sellbackMultiplier);
    });
    
    player.assets = [];
    player.cards = [];
    
    this.emit('player-bankrupt', { gameId, playerId });
  }

  private endGame(gameId: string, reason: 'laps' | 'elimination'): void {
    const game = this.games.get(gameId)!;
    game.gamePhase = 'finished';
    game.finishedAt = new Date();

    const winners = this.calculateWinners(game);
    this.emit('game-ended', { gameId, winners, reason });
  }

  private calculateWinners(game: GameState): Player[] {
    const activePlayers = Array.from(game.players.values()).filter(p => !p.isBankrupt);
    
    return activePlayers.sort((a, b) => {
      const netWorthA = this.calculateNetWorth(a);
      const netWorthB = this.calculateNetWorth(b);
      return netWorthB - netWorthA;
    });
  }

  private calculateNetWorth(player: Player): number {
    const assetValue = player.assets.reduce((sum, asset) => 
      sum + (asset.purchasePrice * asset.sellbackMultiplier), 0
    );
    const debtValue = player.loans.reduce((sum, loan) => sum + loan.amount, 0);
    return player.cash + assetValue - debtValue + (player.xp * 100);
  }

  private createBoard(): Board {
    // This would be populated with your actual board data
    return {
      startSalary: 2000,
      blocks: [] // Your 40 blocks from the game design
    };
  }

  private createCommunityDeck(): Card[] {
    // Your 50 community cards
    return [];
  }

  private createChanceDeck(): Card[] {
    // Your 50 chance cards  
    return [];
  }

  private shuffleDeck(deck: Card[]): Card[] {
    return [...deck].sort(() => Math.random() - 0.5);
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  getGameState(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  private handleBusinessBlock(gameId: string, playerId: number, block: Block): void {
    // Handle buying/selling business assets
    this.emit('business-opportunity', { gameId, playerId, block });
  }

  private handleActionBlock(gameId: string, playerId: number, block: Block): void {
    // Handle lifestyle costs, investments, etc.
    this.emit('action-required', { gameId, playerId, block });
  }
}