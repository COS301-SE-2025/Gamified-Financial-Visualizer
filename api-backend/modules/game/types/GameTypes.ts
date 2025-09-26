export interface Player {
  id: number;
  username: string;
  socketId?: string;
  position: number;
  cash: number;
  assets: Asset[];
  loans: Loan[];
  cards: Card[];
  lapsCompleted: number;
  salary: number;
  isActive: boolean;
  isBankrupt: boolean;
  skipNextTurn?: boolean;
  character?: Character;
  characterKey?: string; // key to identify character model
  statusEffects: StatusEffect[];
  isBot?: boolean;
}

export interface StatusEffect {
  type: 'slow_paced' | 'vacation' |'skip_turn';
  expiresTurn: number; // absolute turn index when it ends
  multiplier?: number;  // income multiplier
  skipLifestyle?: boolean;
  skipBusinessPayments?: boolean;
}
export interface GameState {
  id: string;
  players: Map<number, Player>;
  currentPlayerId: number;
  gamePhase: 'waiting' | 'playing' | 'finished';
  board: Board;
  communityDeck: Card[];
  chanceDeck: Card[];
  communityDiscard: Card[];
  chanceDiscard: Card[];
  gameMode: 'laps' | 'elimination';
  maxLaps?: number;
  targetNetWorth?: number;
  turnOrder: number[]; // playerIds in turn order
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
  turnCounter: number;
  extraTurnForPlayerId?: number; // if a player earns an extra turn
  turnTimeout?: NodeJS.Timeout;
}

export interface Asset {
  id: string;
  name: string;
  type: 'business' | 'investment' ;
  purchasePrice: number;
  incomePerLap: number;
  sellbackMultiplier: number;
  blockPosition: number;
  ownerId?: number; // playerId
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  source: 'bank' | 'loan_shark';
  lapsRemaining?: number;
}

export interface Card {
  id: string;// primary  key
  type: 'community' | 'chance';
  title: string;
  description: string;
  imagePath?: string;
  effect: CardEffect;
}

export interface CardEffect {
  type: 'cash' | 'move' | 'salary' | 'asset' | 'special';
  amount?: number;
  targetPosition?: number;
  relativeMoves?: number;
  salaryChange?: number;
  message?: string;
}

// Add new Character interface
export interface Character {
  id: string;
  name: string;
  modelName: string; // matches the GLTF model name
  description: string;
  color: string; // hex color for UI
}

export interface Board {
  blocks: Block[];
  startSalary: number;
}

export interface Block {
  id: number;
  type: 'start' | 'bankruptcy' | 'go_to_bankruptcy' | 'bank' | 'community' | 'chance' | 'business' | 'action';
  name: string;
  description?: string;
  imagePath?: string;
  cost?: number;
  asset?: Asset;
  action?: string;
}
