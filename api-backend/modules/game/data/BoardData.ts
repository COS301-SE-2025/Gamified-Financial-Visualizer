import { Board, Block, Asset } from '../types/GameTypes';

// Business Assets (10 total across the board)
const BUSINESS_ASSETS: Asset[] = [
  {
    id: 'pharmacy',
    name: 'WellSpring Pharmacy',
    type: 'business',
    purchasePrice: 4000,
    incomePerLap: 40,
    sellbackMultiplier: 0.8,
    blockPosition: 6
  },
  {
    id: 'beauty_salon',
    name: 'Aura & Co. Beauty',
    type: 'business',
    purchasePrice: 3000,
    incomePerLap: 300,
    sellbackMultiplier: 0.75,
    blockPosition: 8
  },
  {
    id: 'software',
    name: 'Quantum Circuit',
    type: 'business',
    purchasePrice: 3000,
    incomePerLap: 300,
    sellbackMultiplier: 0.8,
    blockPosition: 9
  },
  {
    id: 'fork_flame',
    name: 'Fork & Flame',
    type: 'business',
    purchasePrice: 1500,
    incomePerLap: 150,
    sellbackMultiplier: 0.85,
    blockPosition: 16
  },
  {
    id: 'promotion_gear',
    name: 'ProMotion Gear',
    type: 'business',
    purchasePrice: 2500,
    incomePerLap: 250,
    sellbackMultiplier: 0.7,
    blockPosition: 18
  },
  {
    id: 'modern_king_decor',
    name: 'ModernKing Decor',
    type: 'business',
    purchasePrice: 2500,
    incomePerLap: 250,
    sellbackMultiplier: 0.6,
    blockPosition: 26
  },
  {
    id: 'nextquest_games',
    name: 'NextQuest Games',
    type: 'business',
    purchasePrice: 2500,
    incomePerLap: 250,
    sellbackMultiplier: 0.75,
    blockPosition: 27
  },
  {
    id: 'loom_label',
    name: 'Loom & Label',
    type: 'business',
    purchasePrice: 3500,
    incomePerLap: 350,
    sellbackMultiplier: 0.8,
    blockPosition: 29
  },
  {
    id: 'robo_society',
    name: 'The Robo Society',
    type: 'business',
    purchasePrice: 3000,
    incomePerLap: 300,
    sellbackMultiplier: 0.85,
    blockPosition: 37
  },
  {
    id: 'coffee_shop',
    name: 'Roast & Bean',
    type: 'business',
    purchasePrice: 2500,
    incomePerLap: 250,
    sellbackMultiplier: 0.9,
    blockPosition: 39
  }
];

// Create the complete 40-block board
export const GAME_BOARD: Board = {
  startSalary: 2000,
  blocks: [
    // Block 0 - Start/Salary Corner
    {
      id: 0,
      type: 'start',
      name: 'Start/Salary',
      description: 'Collect R2,000 salary each time you pass'
    },

    // Block 1 - Action Block
    {
      id: 1,
      type: 'action',
      name: 'Pay Your Rent',
      description: 'Pay monthly rent',
      cost: 3000,
      action: 'pay_rent'
    },

    // Block 2 - Community Chest
    {
      id: 2,
      type: 'community',
      name: 'Community',
      description: 'Pick up a card from the deck'
    },

    // Block 3 - Action Block
    {
      id: 3,
      type: 'action',
      name: 'Crypto Boom',
      description: 'Roll dice to advance',
      action: 'roll_dice'
    },

    // Block 4 - Action Block
    {
      id: 4,
      type: 'action',
      name: 'Transport',
      description: 'Fill up your gas tank',
      cost: 1500,
      action: 'pay_transport'
    },

    // Block 5 - Chance
    {
      id: 5,
      type: 'chance',
      name: 'Chance',
      description: 'Pick up a card from the deck'
    },

    // Block 6 - Business Asset
    {
      id: 6,
      type: 'business',
      name: 'Roast & Bean',
      description: 'A cozy neighborhood coffee shop',
      cost: 8000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'coffee_shop')
    },

    // Block 7 - Action Block
    {
      id: 7,
      type: 'action',
      name: 'Give to Charity',
      description: 'Always give back',
      cost: 500,
      action: 'give_to_charity'
    },

    // Block 8 - Business Asset
    {
      id: 8,
      type: 'business',
      name: 'Fork & Flame',
      description: 'Mobile food business',
      cost: 12000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'fork_flame')
    },

    // Block 9 - Business Asset
    {
      id: 9,
      type: 'business',
      name: 'Loom & Label',
      description: 'Steady income from laundry services',
      cost: 15000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'loom_label')
    },

    // Block 10 - Bankruptcy Corner
    {
      id: 10,
      type: 'bankruptcy',
      name: 'Bankruptcy - "I Blew It"',
      description: 'Game over - lose all assets and exit game'
    },

    // Block 11 - Action Block
    {
      id: 11,
      type: 'action',
      name: 'Big Recession',
      description: 'Salary payout reduced',
      cost: 3000,
      action: 'big_recession'
    },

    // Block 12 - Action Block
    {
      id: 12,
      type: 'action',
      name: 'Freelance Gig',
      description: 'Latest job a success',
      cost:2000,
      action: 'freelance_gig'
    },

    // Block 13 - Community Chest
    {
      id: 13,
      type: 'community',
      name: 'Community',
      description: 'Draw a Community card'
    },

    // Block 14 - Action Block
    {
      id: 14,
      type: 'action',
      name: 'Demoted',
      description: 'Loose half salary',
      action: 'demoted'
    },

    // Block 15 - Chance
    {
      id: 15,
      type: 'chance',
      name: 'Chance',
      description: 'Draw a Chance card'
    },

    // Block 16 - Business Asset
    {
      id: 16,
      type: 'business',
      name: 'ProMotion Gear',
      description: 'Personal training and fitness classes',
      cost: 18000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'promotion_gear')
    },

    // Block 17 - Action Block
    {
      id: 17,
      type: 'action',
      name: 'Gambler',
      description: 'Big gambling payout',
      cost: Math.floor(Math.random() * 10000) + 1000,
      action: 'gamble'
    },

    // Block 18 - Business Asset
    {
      id: 18,
      type: 'business',
      name: 'ModernKing Decor',
      description: 'Home decor and furnishings',
      cost: 10000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'modern_king_decor')
    },

    // Block 19 - Action Block
    {
      id: 19,
      type: 'action',
      name: 'New Upgrade',
      description: 'Upgrade owned business',
      action: 'business_upgrade'
    },

    // Block 20 - Visit Bank Corner
    {
      id: 20,
      type: 'bank',
      name: 'Visit Bank',
      description: 'Take loans, repay debts, or sell assets back to bank'
    },

    // Block 21 - Action Block
    {
      id: 21,
      type: 'action',
      name: 'Allowance',
      description: 'Claim your allowance',
      cost: 1000,
      action: 'allowance'
    },

    // Block 22 - Community Chest
    {
      id: 22,
      type: 'community',
      name: 'Community',
      description: 'Draw a Community card'
    },

    // Block 23 - Action Block
    {
      id: 23,
      type: 'action',
      name: 'Investment',
      description: 'Collect if you invested',
      cost: 2500,
      action: 'investment'
    },

    // Block 24 - Action Block
    {
      id: 24,
      type: 'action',
      name: 'Tax Collector',
      description: 'Tax season means you pay',
      action: 'tax_collector'
    },

    // Block 25 - Chance
    {
      id: 25,
      type: 'chance',
      name: 'Chance',
      description: 'Draw a Chance card'
    },

    // Block 26 - Business Asset
    {
      id: 26,
      type: 'business',
      name: 'Quantum Circuit',
      description: 'High-growth technology company',
      cost: 25000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'quantum_circuit')
    },

    // Block 27 - Business Asset
    {
      id: 27,
      type: 'business',
      name: 'Restaurant',
      description: 'Full-service restaurant',
      cost: 30000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'restaurant')
    },

    // Block 28 - Action Block
    {
      id: 28,
      type: 'action',
      name: 'Slow Paced',
      description: 'Recent business losses',
      action: 'slow_paced'
    },

    // Block 29 - Business Asset
    {
      id: 29,
      type: 'business',
      name: 'Aura & Co. Beauty',
      description: 'Beauty and wellness services',
      cost: 22000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'aura_co_beauty')
    },

    // Block 30 - Go to Bankruptcy Corner
    {
      id: 30,
      type: 'go_to_bankruptcy',
      name: 'Go to Bankruptcy',
      description: 'Move directly to Bankruptcy - do not collect salary'
    },

    // Block 31 - Action Block
    {
      id: 31,
      type: 'action',
      name: 'The scammer',
      description: 'Loose some money',
      cost: 300,
      action: 'the_scammer'
    },

    // Block 32 - Action Block
    {
      id: 32,
      type: 'action',
      name: 'Take a vacation',
      description: 'Sponsored vacation skip business payments',
      action: 'take_vacation'
    },

    // Block 33 - Community Chest
    {
      id: 33,
      type: 'community',
      name: 'Community',
      description: 'Draw a Community card'
    },

    // Block 34 - Action Block
    {
      id: 34,
      type: 'action',
      name: 'Tax Refunds',
      description: 'Tax season is over',
      cost: 1000,
      action: 'tax_refunds'
    },

    // Block 35 - Chance
    {
      id: 35,
      type: 'chance',
      name: 'Chance',
      description: 'Draw a Chance card'
    },

    // Block 36 - Action Block
    {
      id: 36,
      type: 'action',
      name: 'Upsurance',
      description: 'Invest in your insurance',
      action: 'upsurance'
    },

    // Block 37 - Business Asset
    {
      id: 37,
      type: 'business',
      name: 'NextQuest Games',
      description: 'Indie game development studio',
      cost: 35000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'nextquest_games')
    },

    // Block 38 - Action Block
    {
      id: 38,
      type: 'action',
      name: 'Volunteer Day',
      description: 'Take the day off and help, skip a full turn',
      action: 'volunteer_day'
    },

    // Block 39 - Business Asset
    {
      id: 39,
      type: 'business',
      name: 'The Robo Society',
      description: 'Robotics and AI solutions ',
      cost: 40000,
      asset: BUSINESS_ASSETS.find(a => a.id === 'the_robo_society')
    }
  ]
};

// Helper function to get a block by ID
export function getBlockById(id: number): Block | undefined {
  return GAME_BOARD.blocks.find(block => block.id === id);
}

// Helper function to get all business blocks
export function getBusinessBlocks(): Block[] {
  return GAME_BOARD.blocks.filter(block => block.type === 'business');
}

// Helper function to get all action blocks
export function getActionBlocks(): Block[] {
  return GAME_BOARD.blocks.filter(block => block.type === 'action');
}

// Helper function to get corner blocks
export function getCornerBlocks(): Block[] {
  return GAME_BOARD.blocks.filter(block => 
    ['start', 'bankruptcy', 'go_to_bankruptcy', 'bank'].includes(block.type)
  );
}