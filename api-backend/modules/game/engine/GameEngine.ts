import { GameState, Player, Card, Block, Board, Asset } from '../types/GameTypes';
import * as BoardData from '../data/BoardData';
import { EventEmitter } from 'events';
import pool from "../../../config/db";
import { logger } from "../../../config/logger";


export class GameEngine extends EventEmitter {
  private games = new Map<string, GameState>();

  private chanceCards = BoardData.CHANCE_CARDS;
  private communityCards = BoardData.COMMUNITY_CARDS;

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
      createdAt: new Date(),
      turnCounter: 0,
      turnOrder: [],
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
      isBankrupt: false
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
    game.currentPlayerId = randomizedIds[ 0 ];

    this.emit('game-started', { gameId, turnOrder: randomizedIds });
    return true;
  }

  rollDice(): number {
    return Math.floor(Math.random() * 6) + 1;
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
      // check business credit
      const state = this.games.get(gameId)!;
      creditBusinessIncome(state, player);
      player.cash += player.salary;
      this.emit('player-passed-start', { gameId, playerId, salary: player.salary });
    }

    player.position = newPosition;
    const landedBlock = game.board.blocks[ newPosition ];

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
      case 'special':
        // add to user's hand
        switch (card.title) {
          case 'Swap Positions': {
            // Swap Positions with player in front
            const order = game.turnOrder;
            const idx = order.indexOf(playerId);
            if (idx > 0) {
              const frontPlayerId = order[ idx - 1 ];
              const frontPlayer = game.players.get(frontPlayerId);
              if (frontPlayer) {
                const tempPos = player.position;
                player.position = frontPlayer.position;
                frontPlayer.position = tempPos;
                this.emit('card-swap-positions', { gameId, playerId, frontPlayerId });
              }
            }
            break;
          }
          case 'Swap Wallets': { // Swap Wallets with player in front
            const order = game.turnOrder;
            const idx = order.indexOf(playerId);
            if (idx > 0) {
              const frontPlayerId = order[ idx - 1 ];
              const frontPlayer = game.players.get(frontPlayerId);
              if (frontPlayer) {
                const tempCash = player.cash;
                player.cash = frontPlayer.cash;
                frontPlayer.cash = tempCash;
                this.emit('card-swap-wallets', { gameId, playerId, frontPlayerId });
              }
            }
            break;
          }
          case 'Teleport to Bank': { // Teleport to Bank
            const dest = this.findNextBlockOfType(game, player.position, 'bank');
            if (dest !== null) {
              this.teleportTo(game, player, dest);
              const block = game.board.blocks[ dest ];
              this.emit('card-teleport', { gameId, playerId, to: 'bank', index: dest });
              // Resolve the bank block immediately
              this.handleBankBlock(gameId, playerId);
            }
            break;
          }
          case 'Teleport to Business': { // Teleport to Business
            const dest = this.findNextBlockOfType(game, player.position, 'business');
            if (dest !== null) {
              this.teleportTo(game, player, dest);
              const block = game.board.blocks[ dest ];
              this.emit('card-teleport', { gameId, playerId, to: 'business', index: dest });
              // Resolve business landing (toll/opportunity)
              this.handleBusinessBlock(gameId, playerId, block);
            }
            break;
          }
          case 'Skip Turn': { // Skip Turn (one round)
            const expiresTurn = game.turnCounter + 1;
            player.statusEffects = player.statusEffects ?? [];
            player.statusEffects.push({ type: 'skip_turn', expiresTurn });
            this.emit('card-skip-turn', { gameId, playerId, expiresTurn });
            break;
          }
          case 'Play Again': { // Play Again (extra immediate turn)
            // call player to roll again

            this.emit('card-play-again', { gameId, playerId });
            player.cards.push(card);

            break;
          }
          default:
            // No effect or unhandled type
            break;
        }

        this.emit('card-effect-applied', { gameId, playerId, card, newPlayerState: player });
    }
  };


  private findNextBlockOfType(game: GameState, fromPos: number, type: Block[ 'type' ]): number | null {
    const n = game.board.blocks.length;
    for (let i = 1; i <= n; i++) {
      const idx = (fromPos + i) % n;
      if (game.board.blocks[ idx ].type === type) return idx;
    }
    return null;
  }

  // Teleport without awarding salary for crossing start (teleport ≠ movement)
  private teleportTo(game: GameState, player: Player, destIndex: number) {
    player.position = destIndex;
  }

  nextTurn(gameId: string): void {
    const game = this.games.get(gameId)!;
    const currentId = game.currentPlayerId;
    const current = game.players.get(currentId)!;

    // If an extra turn is queued for current player, consume it and keep turn
    if (game.extraTurnForPlayerId === currentId) {
      game.extraTurnForPlayerId = undefined;
      this.emit('turn-retained', { gameId, playerId: currentId, reason: 'play_again' });
      return; // same current player keeps playing
    }

    // Advance pointer to next active (non-bankrupt) player
    const order = game.turnOrder; // e.g., array of playerIds
    const startIdx = order.indexOf(currentId);
    let nextIdx = (startIdx + 1) % order.length;

    // Find next active player
    let nextId = order[ nextIdx ];
    while (game.players.get(nextId)?.isBankrupt) {
      nextIdx = (nextIdx + 1) % order.length;
      nextId = order[ nextIdx ];
      if (nextId === currentId) break; // all bankrupt? edge case
    }

    // Check if next player must skip
    const nextPlayer = game.players.get(nextId)!;
    const now = game.turnCounter;

    const effects = nextPlayer.statusEffects ?? [];
    const skipIdx = effects.findIndex(e => e.type === 'skip_turn' && now <= e.expiresTurn);
    if (skipIdx >= 0) {
      // Consume skip and jump again
      effects.splice(skipIdx, 1);
      this.emit('turn-skipped', { gameId, playerId: nextId, reason: 'skip_turn' });

      // Move to the following player
      let altIdx = (nextIdx + 1) % order.length;
      let altId = order[ altIdx ];
      while (game.players.get(altId)?.isBankrupt) {
        altIdx = (altIdx + 1) % order.length;
        altId = order[ altIdx ];
        if (altId === currentId) break;
      }
      game.currentPlayerId = altId;
    } else {
      game.currentPlayerId = nextId;
    }

    // Increment global turn counter after assigning next player (or at your preferred spot)
    game.turnCounter += 1;

    this.emit('game:turn-changed', { gameId, playerId: game.currentPlayerId, turnCounter: game.turnCounter });
  }

  private handleBankruptcy(gameId: string, playerId: number): void {
    const game = this.games.get(gameId)!;
    const player = game.players.get(playerId)!;

    // check if they have insurance card
    const insuranceCardIndex = player.cards.findIndex(card => card.effect.type === 'special' && card.title === 'insurance');
    if (insuranceCardIndex !== -1) {
      // use insurance card to avoid bankruptcy
      const usedCard = player.cards.splice(insuranceCardIndex, 1)[ 0 ];
      this.emit('insurance-used', { gameId, playerId, card: usedCard });
      return;
    }
    player.isBankrupt = true;
    player.isActive = false;

    // Liquidate all assets
    player.assets.forEach(asset => {
      player.cash += Math.floor(asset.purchasePrice * asset.sellbackMultiplier);
    });

    player.cash = 0;
    player.assets = [];

    // skip a third of laps left if in laps mode
    if (game.gameMode === 'laps' && game.maxLaps) {
      const lapsLeft = game.maxLaps - player.lapsCompleted;
      const lapsToSkip = Math.ceil(lapsLeft / 3);
      player.lapsCompleted += lapsToSkip;
    }
    this.emit('player-bankrupt', { gameId, playerId });
  }


  private async endGame(gameId: string, reason: 'laps' | 'elimination'): Promise<void> {
    const game = this.games.get(gameId)!;
    game.gamePhase = 'finished';
    game.finishedAt = new Date();

    const winners = await this.calculateWinners(game);

    try {
      await awardXpForGame(gameId, winners.map(w => ({ userId: w.userId, rank: w.rank })));
    } catch (e) {
      logger.error(`endGame: XP awarding failed for ${gameId}`, e);
    }

    const xpRewards = [ 100, 75, 50, 25, 10, 5 ];
    this.emit('game-ended', { gameId, winners, reason, xpRewards });
  }

  private async calculateWinners(game: GameState): Promise<RankedWinner[]> {
    const activePlayers = Array.from(game.players.values()).filter(p => !p.isBankrupt);

    // 1) Compute net worths first so we can sort deterministically
    const withWorth = activePlayers.map(p => ({
      player: p,
      username: p.username,
      netWorth: this.calculateNetWorth(p), // your existing function
    }));

    // 2) Sort: netWorth DESC, lapsCompleted DESC, cash DESC, username ASC
    withWorth.sort((a, b) => {
      if (b.netWorth !== a.netWorth) return b.netWorth - a.netWorth;
      if (b.player.lapsCompleted !== a.player.lapsCompleted) return b.player.lapsCompleted - a.player.lapsCompleted;
      if (b.player.cash !== a.player.cash) return b.player.cash - a.player.cash;
      return a.username.localeCompare(b.username);
    });

    // 3) Resolve user_ids for all usernames in one DB call
    const usernames = Array.from(new Set(withWorth.map(w => w.username)));
    const client = await pool.connect();
    try {
      const res = await client.query<{ user_id: number; username: string }>(
        `select user_id, username
       from public.users
       where username = any($1)`,
        [ usernames ]
      );

      const nameToId = new Map(res.rows.map(r => [ r.username, r.user_id ] as const));

      // 4) Build ranked winners list; if a username is missing, skip with a warn
      const ranked: RankedWinner[] = [];
      let currentRank = 0;
      let lastWorth: number | null = null;

      for (let i = 0; i < withWorth.length; i++) {
        const w = withWorth[ i ];
        const userId = nameToId.get(w.username);
        if (!userId) {
          logger.warn(`calculateWinners: no user_id for username="${w.username}", skipping for XP award.`);
          continue;
        }

        // Dense ranking (1,2,2,4) or competition style? We'll use competition style:
        if (lastWorth === null || w.netWorth !== lastWorth) {
          currentRank = i + 1; // position index +1
          lastWorth = w.netWorth;
        }

        ranked.push({
          userId,
          username: w.username,
          rank: currentRank,
          netWorth: w.netWorth,
          player: w.player,
        });
      }

      return ranked;
    } finally {
      client.release();
    }
  }

  private calculateNetWorth(player: Player): number {
    const assetValue = player.assets.reduce((sum, asset) =>
      sum + (asset.purchasePrice * asset.sellbackMultiplier), 0
    );
    const debtValue = player.loans.reduce((sum, loan) => sum + loan.amount, 0);
    return player.cash + assetValue - debtValue;
  }

  private createBoard(): Board {
    // This would be populated with your actual board data
    return {
      startSalary: BoardData.GAME_BOARD.startSalary,
      blocks: BoardData.GAME_BOARD.blocks
    };
  }

  private createCommunityDeck(): Card[] {
    // 50 community cards
    return this.communityCards;
  }

  private createChanceDeck(): Card[] {
    // 50 chance cards
    return this.chanceCards;
  }

  private shuffleDeck(deck: Card[]): Card[] {
    return [ ...deck ].sort(() => Math.random() - 0.5);
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [ ...array ].sort(() => Math.random() - 0.5);
  }

  getGameState(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  private handleBusinessBlock(gameId: string, playerId: number, block: Block): void {
    // Handle buying/selling business assets
    // if not owner, pay business income to owner
    const game = this.games.get(gameId)!;
    const player = game.players.get(playerId)!;

    player.statusEffects = player.statusEffects ?? [];
    const skipBusiness = player.statusEffects.find(se => se.type === 'vacation' && se.skipBusinessPayments && se.expiresTurn === game.turnCounter);
    if (skipBusiness) {
      this.emit('business-income-skipped', { gameId, playerId, block });
      return;
    }

    if (block.asset && block.asset.ownerId !== undefined && block.asset.ownerId !== playerId) {
      const owner = game.players.get(block.asset.ownerId);
      if (owner) {
        const income = block.asset.incomePerLap || 0;
        if (player.cash >= income) {
          player.cash -= income;
          owner.cash += income;
          this.emit('business-income-paid', { gameId, fromPlayerId: playerId, toPlayerId: owner.id, amount: income });
        } else {
          // Player can't afford to pay business income
          this.emit('business-income-cannot-afford', { gameId, fromPlayerId: playerId, toPlayerId: owner.id, amount: income });
        }
      }
    }
    this.emit('business-opportunity', { gameId, playerId, block });
  }

  private handleActionBlock(gameId: string, playerId: number, block: Block): void {
    // Handle lifestyle costs, investments, etc.
    if (block.type !== 'action') return;

    switch (block.action) {
      case 'pay_rent':
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'roll_dice':
        // Player gets to roll again
        this.emit('action-roll-dice', { gameId, playerId });
        break;
      case 'pay_transport':
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'give_to_charity':
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'big_recession':
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'freelance_gig':
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'demoted':
        // lose half salary
        const game = this.games.get(gameId)!;
        const player = game.players.get(playerId)!;
        player.salary = Math.floor(player.salary / 2);
        this.emit('action-demoted', { gameId, playerId, newSalary: player.salary });
        break;
      case 'gamble':
        const game1 = this.games.get(gameId)!;
        const player1 = game1.players.get(playerId)!;
        player1.cash += block.cost || 0; // cost can be negative or positive
        this.emit('action-gamble', { gameId, playerId, amount: block.cost || 0 });
        break;
      case 'business_upgrade':
        // upgrade owned business
        const game2 = this.games.get(gameId)!;
        const player2 = game2.players.get(playerId)!;
        const owned = getOwnedBusinesses(player2);
        if (owned.length === 0) {
          this.emit('game:action-error', { gameId, playerId, message: 'You do not own any businesses to upgrade.' });
          break;
        }

        for (const biz of owned) {
          biz.incomePerLap = (biz.incomePerLap || 0) + 500; // increase income by 500 per lap
        }
        break;
      case 'allowance':
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'investment':
        this.handleInvestmentBlock(gameId, playerId);
        break;
      case 'tax_collector':
        // pay percentage of salary
        const game3 = this.games.get(gameId)!;
        const player3 = game3.players.get(playerId)!;
        const tax = calculateTax(player3.salary);
        if (player3.cash >= tax) {
          player3.cash -= tax;
          this.emit('action-tax-collected', { gameId, playerId, amount: tax });
        } else {
          this.emit('action-tax-cannot-afford', { gameId, playerId, amount: tax });
        }
        break;
      case 'slow_paced':
        // recent business losses
        const state = this.getGameState(gameId);
        if (!state) break;
        const player4 = state.players.get(playerId);
        if (!player4) break;

        // Effect: halve business income for next lap only
        const expiresTurn = state.turnCounter + 1;

        const effect: StatusEffect = {
          type: 'slow_paced',
          expiresTurn,
          multiplier: 0.5
        };

        player4.statusEffects = player4.statusEffects ?? [];
        player4.statusEffects.push(effect);

        this.emit('game:status-effect', {
          gameId,
          playerId,
          effect: 'slow_paced',
          expiresTurn,
          multiplier: 0.5
        });
        break;
      case 'the_scammer':
        // lose cash
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'take_vacation':
        // don't pay lifestyle or business costs next lap
        const state1 = this.getGameState(gameId);
        if (!state1) break;
        const player5 = state1.players.get(playerId);
        if (!player5) break;

        // Effect: skip lifestyle and business costs for next lap
        const expiresTurn1 = state1.turnCounter + 1;

        const effect1: StatusEffect = {
          type: 'vacation',
          expiresTurn: expiresTurn1,
          skipLifestyle: true,
          skipBusinessPayments: true
        };

        player5.statusEffects = player5.statusEffects ?? [];
        player5.statusEffects.push(effect1);

        this.emit('game:status-effect', {
          gameId,
          playerId,
          effect: 'vacation',
          expiresTurn: expiresTurn1,
          skipLifestyle: true,
          skipBusinessPayments: true
        });
        break;
      case 'tax_refunds':
        // get cash
        this.handleLifestyleBlock(gameId, playerId, block);
        break;
      case 'upsurance':
        // get insurance card
        // pick up community card
        this.drawCard(gameId, playerId, 'community');
        this.emit('action-upsurance', { gameId, playerId });
        break;
      case 'volunteer_day':
        // skip a turn
        const game4 = this.games.get(gameId)!;
        const player6 = game4.players.get(playerId)!;
        player6.skipNextTurn = true;
        this.emit('action-volunteer-day', { gameId, playerId });
        break;

      default:
        break;
    }
    this.emit('action-required', { gameId, playerId, block });
  }

  // HUD updates and other utility methods would go here
  public updateHUD(gameId: string): void {
    const game = this.games.get(gameId)!;
    this.emit('hud-update', { gameId, players: Array.from(game.players.values()) });
  }


  public handleBankBlock(gameId: string, playerId: number): void {
    // Handle bank-related actions
    // take out loans, pay loans


    // user can take out loan or pay existing loan

    this.emit('bank-action', { gameId, playerId });
  }

  public handleInvestmentBlock(gameId: string, playerId: number): void {
    // Handle investment opportunities

    // check that user has investment card
    const game = this.games.get(gameId)!;
    const player = game.players.get(playerId)!;
    const hasInvestmentCard = player.cards.some(card => card.effect.type === 'asset');

    if (!hasInvestmentCard) {
      this.emit('investment-no-card', { gameId, playerId });
      return;
    } else {
      // fetch investment block details
      const investmentBlock = game.board.blocks.find(b => b.type === 'action' && b.name === 'Investment');
      if (!investmentBlock) {
        this.emit('investment-no-block', { gameId, playerId });
        return;
      } else {
        // add amount to player
        const investmentReturn = investmentBlock.cost || 2500; // default return if not specified
        player.cash += investmentReturn;
        this.emit('investment-return', { gameId, playerId, amount: investmentReturn });
      }
    }
    this.emit('investment-opportunity', { gameId, playerId });
  }

  public handleLifestyleBlock(gameId: string, playerId: number, block: Block): void {
    // Handle lifestyle expenses
    const player = this.games.get(gameId)!.players.get(playerId)!;
    const cost = block.cost || 500; // Default cost if not specified

    if (!player || player.isBankrupt) return;

    if (player.statusEffects?.some(e => e.type === 'vacation')) {
      // Player is on vacation, skip lifestyle expense
      this.emit('lifestyle-skipped', { gameId, playerId });
      return;
    }

    if (player.cash >= cost) {
      player.cash -= cost;
      this.emit('lifestyle-expense', { gameId, playerId, amount: cost });
    } else {
      // Player can't afford lifestyle expense
      this.emit('lifestyle-cannot-afford', { gameId, playerId, amount: cost });
    }
  }

  // Player actions
  takeLoan(gameId: string, playerId: number, amount: number): boolean {
    const game = this.games.get(gameId);
    const player = game?.players.get(playerId);

    if (!game || !player || player.isBankrupt) return false;

    player.cash += amount;
    player.loans.push({
      id: `loan_${Date.now()}`,
      amount,
      interestRate: 0.1, // 10% interest
      source: 'bank',
      lapsRemaining: 5 // 5 turns to repay
    });

    this.emit('loan-taken', { gameId, playerId, amount });
    return true;
  }

  repayLoan(gameId: string, playerId: number, loanId: string): boolean {
    const game = this.games.get(gameId);
    const player = game?.players.get(playerId);

    if (!game || !player || player.isBankrupt) return false;

    const loanIndex = player.loans.findIndex(loan => loan.id === loanId);
    if (loanIndex === -1) return false;

    const loan = player.loans[ loanIndex ];
    const repaymentAmount = loan.amount * (1 + loan.interestRate);

    if (player.cash >= repaymentAmount) {
      player.cash -= repaymentAmount;
      player.loans.splice(loanIndex, 1);
      this.emit('loan-repaid', { gameId, playerId, amount: repaymentAmount });
      return true;
    }

    return false;
  }

  buyAsset(gameId: string, playerId: number, assetId: string): boolean {
    const game = this.games.get(gameId);
    const player = game?.players.get(playerId);
    const asset = game?.board.blocks.find(b => b.id.toString() === assetId && b.type === 'business');

    if (!game || !player || !asset || player.isBankrupt) return false;

    if (player.cash >= asset.cost!) {
      player.cash -= asset.cost!;
      player.assets.push({
        id: asset.id.toString(),
        name: asset.name!,
        type: 'business',
        purchasePrice: asset.cost!,
        sellbackMultiplier: 0.7, // 70% sellback value
        blockPosition: asset.asset?.blockPosition || 0,
        incomePerLap: asset.asset?.incomePerLap || 0
      });

      this.emit('asset-purchased', { gameId, playerId, asset });
      return true;
    }

    return false;
  }

  sellAsset(gameId: string, playerId: number, assetId: string): boolean {
    const game = this.games.get(gameId);
    const player = game?.players.get(playerId);

    if (!game || !player || player.isBankrupt) return false;

    const assetIndex = player.assets.findIndex(a => a.id === assetId);
    if (assetIndex === -1) return false;

    const asset = player.assets[ assetIndex ];
    const sellbackValue = Math.floor(asset.purchasePrice * asset.sellbackMultiplier);

    player.cash += sellbackValue;
    player.assets.splice(assetIndex, 1);

    this.emit('asset-sold', { gameId, playerId, asset, amount: sellbackValue });
    return true;
  }

  // Get player balance sheet
  public getPlayerBalanceSheet(gameId: string, playerId: number) {
    const game = this.games.get(gameId);
    const player = game?.players.get(playerId);

    if (!game || !player) return null;

    const assetValue = player.assets.reduce((sum, asset) =>
      sum + (asset.purchasePrice * asset.sellbackMultiplier), 0
    );
    const debtValue = player.loans.reduce((sum, loan) => sum + loan.amount, 0);
    const netWorth = player.cash + assetValue - debtValue;

    return {
      cash: player.cash,
      assetValue,
      debtValue,
      netWorth,
      lapsCompleted: player.lapsCompleted,
      salary: player.salary
    };
  }

  // Get board overview
  public getBoardOverview(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) return null;

    return {
      blocks: game.board.blocks.map((block, index) => ({
        id: block.id,
        name: block.name,
        type: block.type,
        position: index
      })),
      players: Array.from(game.players.values()).map(player => ({
        id: player.id,
        name: player.username,
        position: player.position,
        isBankrupt: player.isBankrupt
      }))
    };
  }

  // Get player stats
  public getPlayerStats(gameId: string, playerId: number) {
    const game = this.games.get(gameId);
    const player = game?.players.get(playerId);

    if (!game || !player) return null;

    return {
      id: player.id,
      name: player.username,
      position: player.position,
      cash: player.cash,
      assets: player.assets,
      loans: player.loans,
      cards: player.cards,
      lapsCompleted: player.lapsCompleted,
      salary: player.salary,
      isActive: player.isActive,
      isBankrupt: player.isBankrupt
    };
  }


}

type StatusEffect =
  | { type: 'slow_paced'; expiresTurn: number; multiplier: number }
  | { type: 'vacation'; expiresTurn: number; skipLifestyle: boolean; skipBusinessPayments: boolean }
  | { type: 'skip_turn'; expiresTurn: number };

// Type alias must be outside the class
type Winner = { userId: number; rank: number }; // rank: 1-based
type RankedWinner = {
  userId: number;
  username: string;
  rank: number;       // 1-based
  netWorth: number;
  player: Player;     // original player object (if you need more later)
};

const XP_REWARDS = [ 100, 75, 50, 25, 10, 5 ]; // index 0 = 1st place

async function awardXpForGame(gameId: string, winners: Winner[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');


    // Upsert/Increment points for each winner
    for (const w of winners) {
      const idx = Math.max(1, Math.min(w.rank, XP_REWARDS.length)) - 1;
      const points = XP_REWARDS[ idx ];

      await client.query(
        `
        insert into user_points (user_id, total_points, tier_status)
        values ($1, $2, 'Wood')  -- tier will be recalculated by trigger
        on conflict (user_id) do update
          set total_points = user_points.total_points + EXCLUDED.total_points,
              last_updated = now()
        `,
        [ w.userId, points ]
      );
    }

    await client.query('COMMIT');
    logger.info(`Awarded XP for game ${gameId} to ${winners.length} players.`);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Failed to award XP:', err);
    throw err;
  } finally {
    client.release();
  }
}

function getOwnedBusinesses(player: Player): Asset[] {
  return (player.assets ?? []).filter(a => a.type === 'business' && a.ownerId === player.id);
}

function calculateTax(income: number): number {
  const brackets = [
    { threshold: 1817000, base: 644489, rate: 0.45 },
    { threshold: 857900, base: 251258, rate: 0.41 },
    { threshold: 673000, base: 179147, rate: 0.39 },
    { threshold: 512800, base: 121475, rate: 0.36 },
    { threshold: 370500, base: 77362, rate: 0.31 },
    { threshold: 237100, base: 42678, rate: 0.26 },
    { threshold: 0, base: 0, rate: 0.18 }
  ];

  for (const bracket of brackets) {
    if (income > bracket.threshold) {
      return Math.floor(bracket.base + (income - bracket.threshold) * bracket.rate);
    }
  }

  return 0;
}

function creditBusinessIncome(state: GameState, player: Player) {
  const businesses = player.assets.filter(a => a.type === 'business');
  let total = 0;

  for (const b of businesses) {
    let income = b.incomePerLap;

    // check if slow_paced is active
    const effects = player.statusEffects ?? [];
    for (const eff of effects) {
      if (eff.type === 'slow_paced' && state.turnCounter <= eff.expiresTurn) {
        income = Math.floor(income * (eff.multiplier ?? 1));
      }
    }
    total += income;
  }

  player.cash += total;
  pruneExpiredEffects(state, player);
}



function pruneExpiredEffects(state: GameState, player: Player) {
  const now = state.turnCounter;
  player.statusEffects = (player.statusEffects ?? []).filter(e => now <= e.expiresTurn);
}