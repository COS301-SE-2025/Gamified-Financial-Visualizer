import { Board, Block, Asset, Card } from '../types/GameTypes';

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
      cost: Math.floor(Math.random() * 4001) - 2000,
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

export const CHANCE_CARDS: Card[] =  [
    // Gains (20 cards)
    {
      id: 'chance_gain_1',
      type: 'chance',
      title: 'Found Wallet',
      description: 'You found a lost wallet with cash inside.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Found wallet! Gain R1,000'
      }
    },
    {
      id: 'chance_gain_2',
      type: 'chance',
      title: 'Won Lucky Draw',
      description: 'You won a lucky draw prize!',
      effect: {
        type: 'cash',
        amount: 2500,
        message: 'Won lucky draw! Gain R2,500'
      }
    },
    {
      id: 'chance_gain_3',
      type: 'chance',
      title: 'Scratch Card Win',
      description: 'Your scratch card turned out to be a winner!',
      effect: {
        type: 'cash',
        amount: 500,
        message: 'Scratch card win! Gain R500'
      }
    },
    {
      id: 'chance_gain_4',
      type: 'chance',
      title: 'Gambling Payout',
      description: 'Your bet paid off handsomely!',
      effect: {
        type: 'cash',
        amount: 2000,
        message: 'Gambling payout! Gain R2,000'
      }
    },
    {
      id: 'chance_gain_5',
      type: 'chance',
      title: 'Investment Return',
      description: 'One of your investments yielded great returns.',
      effect: {
        type: 'cash',
        amount: 1500,
        message: 'Investment return! Gain R1,500'
      }
    },
    {
      id: 'chance_gain_6',
      type: 'chance',
      title: 'Bonus Commission',
      description: 'You earned an unexpected commission bonus.',
      effect: {
        type: 'cash',
        amount: 1800,
        message: 'Bonus commission! Gain R1,800'
      }
    },
    {
      id: 'chance_gain_7',
      type: 'chance',
      title: 'Sold Crypto at Peak',
      description: 'Perfect timing! You sold your crypto at its peak value.',
      effect: {
        type: 'cash',
        amount: 4000,
        message: 'Sold crypto at peak! Gain R4,000'
      }
    },
    {
      id: 'chance_gain_8',
      type: 'chance',
      title: 'Lucky Stock Spike',
      description: 'Your stocks suddenly spiked in value.',
      effect: {
        type: 'cash',
        amount: 3500,
        message: 'Lucky stock spike! Gain R3,500'
      }
    },
    {
      id: 'chance_gain_9',
      type: 'chance',
      title: 'Business Cash Influx',
      description: 'Your business received an unexpected cash injection.',
      effect: {
        type: 'cash',
        amount: 2500,
        message: 'Business cash influx! Gain R2,500'
      }
    },
    {
      id: 'chance_gain_10',
      type: 'chance',
      title: 'Inheritance',
      description: 'You received a small inheritance from a distant relative.',
      effect: {
        type: 'cash',
        amount: 3000,
        message: 'Inheritance received! Gain R3,000'
      }
    },
    {
      id: 'chance_gain_11',
      type: 'chance',
      title: 'Lottery Jackpot',
      description: 'You won a small lottery jackpot!',
      effect: {
        type: 'cash',
        amount: 5000,
        message: 'Lottery jackpot! Gain R5,000'
      }
    },
    {
      id: 'chance_gain_12',
      type: 'chance',
      title: 'Royalty Payment',
      description: 'You received royalty payments for your creative work.',
      effect: {
        type: 'cash',
        amount: 1200,
        message: 'Royalty payment! Gain R1,200'
      }
    },
    {
      id: 'chance_gain_13',
      type: 'chance',
      title: 'Freelance Project',
      description: 'A freelance project paid better than expected.',
      effect: {
        type: 'cash',
        amount: 2200,
        message: 'Freelance project bonus! Gain R2,200'
      }
    },
    {
      id: 'chance_gain_14',
      type: 'chance',
      title: 'Rare Collectible Sale',
      description: 'You sold a rare collectible for a great price.',
      effect: {
        type: 'cash',
        amount: 2500,
        message: 'Rare collectible sale! Gain R2,500'
      }
    },
    {
      id: 'chance_gain_15',
      type: 'chance',
      title: 'Consulting Fee',
      description: 'You earned a consulting fee for your expertise.',
      effect: {
        type: 'cash',
        amount: 1700,
        message: 'Consulting fee! Gain R1,700'
      }
    },
    {
      id: 'chance_gain_16',
      type: 'chance',
      title: 'Found Gold Chain',
      description: 'You found a gold chain on the street.',
      effect: {
        type: 'cash',
        amount: 750,
        message: 'Found gold chain! Gain R750'
      }
    },
    {
      id: 'chance_gain_17',
      type: 'chance',
      title: 'Crowdfunding Success',
      description: 'Your crowdfunding campaign was a success!',
      effect: {
        type: 'cash',
        amount: 1250,
        message: 'Crowdfunding success! Gain R1,250'
      }
    },
    {
      id: 'chance_gain_18',
      type: 'chance',
      title: 'Gift from a Stranger',
      description: 'A stranger gave you an unexpected gift of cash.',
      effect: {
        type: 'cash',
        amount: 500,
        message: 'Gift from a stranger! Gain R500'
      }
    },
    {
      id: 'chance_gain_19',
      type: 'chance',
      title: 'Venture Capital Injection',
      description: 'Your startup received venture capital funding.',
      effect: {
        type: 'cash',
        amount: 3500,
        message: 'Venture capital injection! Gain R3,500'
      }
    },
    {
      id: 'chance_gain_20',
      type: 'chance',
      title: 'Unexpected Bonus at Work',
      description: 'You received an unexpected bonus from your employer.',
      effect: {
        type: 'cash',
        amount: 2000,
        message: 'Unexpected bonus! Gain R2,000'
      }
    },

    // Losses (20 cards)
    {
      id: 'chance_loss_1',
      type: 'chance',
      title: 'Car Accident',
      description: 'You were in a car accident. Insurance may help.',
      effect: {
        type: 'cash',
        amount: -2500,
        message: 'Car accident! Pay R2,500 (insurance may reduce this)'
      }
    },
    {
      id: 'chance_loss_2',
      type: 'chance',
      title: 'House Fire',
      description: 'Your house caught fire. Insurance may help.',
      effect: {
        type: 'cash',
        amount: -3000,
        message: 'House fire! Pay R3,000 (insurance may reduce this)'
      }
    },
    {
      id: 'chance_loss_3',
      type: 'chance',
      title: 'Medical Emergency',
      description: 'Unexpected medical bills arrived.',
      effect: {
        type: 'cash',
        amount: -1500,
        message: 'Medical emergency! Pay R1,500'
      }
    },
    {
      id: 'chance_loss_4',
      type: 'chance',
      title: 'Mugged in an Alley',
      description: 'You were mugged and lost some cash.',
      effect: {
        type: 'cash',
        amount: -200,
        message: 'Mugged! Lose R200'
      }
    },
    {
      id: 'chance_loss_5',
      type: 'chance',
      title: 'Lost Your Wallet',
      description: 'You lost your wallet with all your cash.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Lost wallet! Lose R1,000'
      }
    },
    {
      id: 'chance_loss_6',
      type: 'chance',
      title: 'Bad Stock Crash',
      description: 'Your stocks crashed dramatically.',
      effect: {
        type: 'cash',
        amount: -2500,
        message: 'Bad stock crash! Lose R2,500'
      }
    },
    {
      id: 'chance_loss_7',
      type: 'chance',
      title: 'Crypto Rug Pull',
      description: 'Your cryptocurrency investment was a scam.',
      effect: {
        type: 'cash',
        amount: -4000,
        message: 'Crypto rug pull! Lose R4,000'
      }
    },
    {
      id: 'chance_loss_8',
      type: 'chance',
      title: 'Loan Shark Demands Payment',
      description: 'Big Mike wants his money back... with interest.',
      effect: {
        type: 'cash',
        amount: -5500,
        message: 'Loan shark demands payment! Pay R5,500'
      }
    },
    {
      id: 'chance_loss_9',
      type: 'chance',
      title: 'Identity Theft',
      description: 'Someone stole your identity and drained your accounts.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Identity theft! Lose R1,000'
      }
    },
    {
      id: 'chance_loss_10',
      type: 'chance',
      title: 'Gambling Addiction',
      description: 'Your gambling habit cost you dearly.',
      effect: {
        type: 'cash',
        amount: -2500,
        message: 'Gambling addiction! Pay R2,500'
      }
    },
    {
      id: 'chance_loss_11',
      type: 'chance',
      title: 'Natural Disaster',
      description: 'A natural disaster damaged your property.',
      effect: {
        type: 'cash',
        amount: -3000,
        message: 'Natural disaster! Pay R3,000'
      }
    },
    {
      id: 'chance_loss_12',
      type: 'chance',
      title: 'Legal Fees',
      description: 'Unexpected legal fees have arisen.',
      effect: {
        type: 'cash',
        amount: -2000,
        message: 'Legal fees! Pay R2,000'
      }
    },
    {
      id: 'chance_loss_13',
      type: 'chance',
      title: 'Bank Fraud',
      description: 'Your bank account was compromised.',
      effect: {
        type: 'cash',
        amount: -1500,
        message: 'Bank fraud! Lose R1,500'
      }
    },
    {
      id: 'chance_loss_14',
      type: 'chance',
      title: 'Credit Card Fraud',
      description: 'Someone made unauthorized purchases on your card.',
      effect: {
        type: 'cash',
        amount: -1250,
        message: 'Credit card fraud! Lose R1,250'
      }
    },
    {
      id: 'chance_loss_15',
      type: 'chance',
      title: 'Bad Business Deal',
      description: 'A business deal went sour and cost you money.',
      effect: {
        type: 'cash',
        amount: -2500,
        message: 'Bad business deal! Lose R2,500'
      }
    },
    {
      id: 'chance_loss_16',
      type: 'chance',
      title: 'Failed Startup',
      description: 'Your startup venture failed.',
      effect: {
        type: 'cash',
        amount: -3000,
        message: 'Failed startup! Lose R3,000'
      }
    },
    {
      id: 'chance_loss_17',
      type: 'chance',
      title: 'Unpaid Taxes Discovered',
      description: 'The tax authorities found unpaid taxes from previous years.',
      effect: {
        type: 'cash',
        amount: -2000,
        message: 'Unpaid taxes discovered! Pay R2,000'
      }
    },
    {
      id: 'chance_loss_18',
      type: 'chance',
      title: 'Family Emergency',
      description: 'A family emergency requires financial assistance.',
      effect: {
        type: 'cash',
        amount: -1800,
        message: 'Family emergency! Pay R1,800'
      }
    },
    {
      id: 'chance_loss_19',
      type: 'chance',
      title: 'Car Impounded',
      description: 'Your car was impounded and you need to pay fines.',
      effect: {
        type: 'cash',
        amount: -1500,
        message: 'Car impounded! Pay R1,500'
      }
    },
    {
      id: 'chance_loss_20',
      type: 'chance',
      title: 'Unexpected Repair Bill',
      description: 'Major unexpected repairs needed on your property.',
      effect: {
        type: 'cash',
        amount: -2200,
        message: 'Unexpected repair bill! Pay R2,200'
      }
    },

    // Movement / Player Interaction (10 cards)
    {
      id: 'chance_move_1',
      type: 'chance',
      title: 'Advance to Start',
      description: 'Go directly to Start and collect your salary.',
      effect: {
        type: 'move',
        targetPosition: 0, // Assuming position 0 is Start
        message: 'Advance to Start and collect salary!'
      }
    },
    {
      id: 'chance_move_2',
      type: 'chance',
      title: 'Go to Bankruptcy',
      description: 'Go directly to Bankruptcy. Do not collect salary.',
      effect: {
        type: 'move',
        targetPosition: -1, // You'll need to set the actual bankruptcy position
        message: 'Go directly to Bankruptcy! Do not collect salary.'
      }
    },
    {
      id: 'chance_move_3',
      type: 'chance',
      title: 'Swap Positions',
      description: 'Swap positions with the player in front of you.',
      effect: {
        type: 'special',
        message: 'Swap positions with the player in front of you!'
      }
    },
    {
      id: 'chance_move_4',
      type: 'chance',
      title: 'Swap Wallets',
      description: 'Swap cash with the player in front of you.',
      effect: {
        type: 'special',
        message: 'Swap wallets (cash only) with the player in front of you!'
      }
    },
    {
      id: 'chance_move_5',
      type: 'chance',
      title: 'Move Forward',
      description: 'Move 3 steps forward.',
      effect: {
        type: 'move',
        relativeMoves: 3,
        message: 'Move 3 steps forward!'
      }
    },
    {
      id: 'chance_move_6',
      type: 'chance',
      title: 'Move Backward',
      description: 'Move 2 steps back.',
      effect: {
        type: 'move',
        relativeMoves: -2,
        message: 'Move 2 steps back!'
      }
    },
    {
      id: 'chance_move_7',
      type: 'chance',
      title: 'Teleport to Bank',
      description: 'Teleport to the nearest Bank tile.',
      effect: {
        type: 'special',
        message: 'Teleport to the nearest Bank tile!'
      }
    },
    {
      id: 'chance_move_8',
      type: 'chance',
      title: 'Teleport to Business',
      description: 'Teleport to the nearest Business tile.',
      effect: {
        type: 'special',
        message: 'Teleport to the nearest Business tile!'
      }
    },
    {
      id: 'chance_move_9',
      type: 'chance',
      title: 'Skip Turn',
      description: 'Skip your next turn.',
      effect: {
        type: 'special',
        message: 'Skip your next turn!'
      }
    },
    {
      id: 'chance_move_10',
      type: 'chance',
      title: 'Play Again',
      description: 'Play again immediately.',
      effect: {
        type: 'special',
        message: 'Play again immediately!'
      }
    }
  ];

export const COMMUNITY_CARDS: Card[] =  [
    // Income & Positive Events (25 cards)
    {
      id: 'community_income_1',
      type: 'community',
      title: 'Insurance Payout',
      description: 'Your insurance policy pays out.',
      effect: {
        type: 'cash',
        amount: 2000,
        message: 'Insurance payout! Collect R2,000'
      }
    },
    {
      id: 'community_income_2',
      type: 'community',
      title: 'Salary Increase',
      description: 'You got a permanent salary raise!',
      effect: {
        type: 'salary',
        salaryChange: 500,
        message: 'Salary increase! +R500 to your base salary each lap'
      }
    },
    {
      id: 'community_income_3',
      type: 'community',
      title: 'Bonus Payout',
      description: 'You received a performance bonus.',
      effect: {
        type: 'cash',
        amount: 1500,
        message: 'Bonus payout! Collect R1,500'
      }
    },
    {
      id: 'community_income_4',
      type: 'community',
      title: 'Dividend Payment',
      description: 'Your investments paid dividends.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Dividend! Collect R1,000'
      }
    },
    {
      id: 'community_income_5',
      type: 'community',
      title: 'Tax Rebate',
      description: 'You received a tax refund.',
      effect: {
        type: 'cash',
        amount: 2500,
        message: 'Tax rebate! Collect R2,500'
      }
    },
    {
      id: 'community_income_6',
      type: 'community',
      title: 'Sold Old Furniture',
      description: 'You made money selling unused items.',
      effect: {
        type: 'cash',
        amount: 750,
        message: 'Sold old furniture! Collect R750'
      }
    },
    {
      id: 'community_income_7',
      type: 'community',
      title: 'Parents Helped Out',
      description: 'Your parents gave you some financial help.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Parents helped out! Collect R1,000'
      }
    },
    {
      id: 'community_income_8',
      type: 'community',
      title: 'Won Small Lottery',
      description: 'You won a small lottery prize.',
      effect: {
        type: 'cash',
        amount: 1250,
        message: 'Won small lottery! Collect R1,250'
      }
    },
    {
      id: 'community_income_9',
      type: 'community',
      title: 'Side Hustle Profit',
      description: 'Your side business made a profit.',
      effect: {
        type: 'cash',
        amount: 500,
        message: 'Side hustle profit! Collect R500'
      }
    },
    {
      id: 'community_income_10',
      type: 'community',
      title: 'Loan Repayment',
      description: 'A friend repaid their loan to you.',
      effect: {
        type: 'cash',
        amount: 700,
        message: 'Loan repayment from friend! Collect R700'
      }
    },
    {
      id: 'community_income_11',
      type: 'community',
      title: 'Salary Increase',
      description: 'Another permanent salary raise!',
      effect: {
        type: 'salary',
        salaryChange: 500,
        message: 'Salary increase! +R500 to your base salary each lap'
      }
    },
    {
      id: 'community_income_12',
      type: 'community',
      title: 'Parents Support',
      description: 'Your parents helped you out again.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Parents helped out! Collect R1,000'
      }
    },
    {
      id: 'community_income_13',
      type: 'community',
      title: 'Received Bursary',
      description: 'You were awarded a bursary.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Received bursary! Collect R1,000'
      }
    },
    {
      id: 'community_income_14',
      type: 'community',
      title: 'Side Hustle Success',
      description: 'Your side business did well this month.',
      effect: {
        type: 'cash',
        amount: 500,
        message: 'Side hustle profit! Collect R500'
      }
    },
    {
      id: 'community_income_15',
      type: 'community',
      title: 'Freelance Work',
      description: 'You completed a freelance project.',
      effect: {
        type: 'cash',
        amount: 1200,
        message: 'Freelance work completed! Collect R1,200'
      }
    },
    {
      id: 'community_income_16',
      type: 'community',
      title: 'Annual Bonus',
      description: 'You received your annual performance bonus.',
      effect: {
        type: 'special',
        message: 'Annual bonus! Collect R2,000 after certain number of laps'
      }
    },
    {
      id: 'community_income_17',
      type: 'community',
      title: 'Consulting Fee',
      description: 'You earned a consulting fee.',
      effect: {
        type: 'cash',
        amount: 1500,
        message: 'Consulting fee! Collect R1,500'
      }
    },
    {
      id: 'community_income_18',
      type: 'community',
      title: 'Savings Interest',
      description: 'Your savings account earned interest.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Savings interest payout! Collect R1,000'
      }
    },
    {
      id: 'community_income_19',
      type: 'community',
      title: 'Hackathon Prize',
      description: 'You won a hackathon competition.',
      effect: {
        type: 'cash',
        amount: 1500,
        message: 'Won hackathon prize! Collect R1,500'
      }
    },
    {
      id: 'community_income_20',
      type: 'community',
      title: 'Family Inheritance',
      description: 'You received a family inheritance.',
      effect: {
        type: 'cash',
        amount: 2500,
        message: 'Family inheritance! Collect R2,500'
      }
    },
    {
      id: 'community_income_21',
      type: 'community',
      title: 'Scholarship Refund',
      description: 'Your scholarship paid out a refund.',
      effect: {
        type: 'cash',
        amount: 1000,
        message: 'Scholarship refund! Collect R1,000'
      }
    },
    {
      id: 'community_income_22',
      type: 'community',
      title: 'Investment Matured',
      description: 'Your long-term investment matured.',
      effect: {
        type: 'asset',
        message: 'Investment matured! Collect R2,500 if you have investments'
      }
    },
    {
      id: 'community_income_23',
      type: 'community',
      title: 'Rental Income',
      description: 'You received rental income from property.',
      effect: {
        type: 'cash',
        amount: 1800,
        message: 'Rental income! Collect R1,800'
      }
    },
    {
      id: 'community_income_24',
      type: 'community',
      title: 'Commission Payment',
      description: 'You earned a sales commission.',
      effect: {
        type: 'cash',
        amount: 900,
        message: 'Commission payment! Collect R900'
      }
    },
    {
      id: 'community_income_25',
      type: 'community',
      title: 'Tax Return',
      description: 'You received an unexpected tax return.',
      effect: {
        type: 'cash',
        amount: 1300,
        message: 'Tax return! Collect R1,300'
      }
    },

    // Expenses & Negative Events (25 cards)
    {
      id: 'community_expense_1',
      type: 'community',
      title: 'Insurance Premium',
      description: 'Your insurance premium is due.',
      effect: {
        type: 'cash',
        amount: -500,
        message: 'Insurance premium due! Pay R500'
      }
    },
    {
      id: 'community_expense_2',
      type: 'community',
      title: 'Medical Bill',
      description: 'Unexpected medical expenses.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Medical bill! Pay R1,000'
      }
    },
    {
      id: 'community_expense_3',
      type: 'community',
      title: 'Car Repairs',
      description: 'Your car needs urgent repairs.',
      effect: {
        type: 'cash',
        amount: -1500,
        message: 'Car repairs! Pay R1,500'
      }
    },
    {
      id: 'community_expense_4',
      type: 'community',
      title: 'Business Income Reduction',
      description: 'Your business income has decreased.',
      effect: {
        type: 'salary',
        salaryChange: -750,
        message: 'Business income reduces! Pay R750 less per lap'
      }
    },
    {
      id: 'community_expense_5',
      type: 'community',
      title: 'Business Maintenance',
      description: 'Business maintenance costs are due.',
      effect: {
        type: 'cash',
        amount: -1250,
        message: 'Business maintenance! Pay R1,250'
      }
    },
    {
      id: 'community_expense_6',
      type: 'community',
      title: 'School Fees',
      description: 'School fees are due for payment.',
      effect: {
        type: 'cash',
        amount: -1500,
        message: 'School fees! Pay R1,500'
      }
    },
    {
      id: 'community_expense_7',
      type: 'community',
      title: 'Home Repairs',
      description: 'Unexpected home maintenance costs.',
      effect: {
        type: 'cash',
        amount: -1200,
        message: 'Home repairs! Pay R1,200'
      }
    },
    {
      id: 'community_expense_8',
      type: 'community',
      title: 'Tax Filing Cost',
      description: 'Professional tax filing services cost.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Tax filing cost! Pay R1,000'
      }
    },
    {
      id: 'community_expense_9',
      type: 'community',
      title: 'Grocery Overspend',
      description: 'You overspent on groceries this month.',
      effect: {
        type: 'cash',
        amount: -500,
        message: 'Grocery overspend! Pay R500'
      }
    },
    {
      id: 'community_expense_10',
      type: 'community',
      title: 'Phone Upgrade',
      description: 'You upgraded your phone plan.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Phone upgrade! Pay R1,000'
      }
    },
    {
      id: 'community_expense_11',
      type: 'community',
      title: 'Clothing Purchase',
      description: 'You bought new clothes.',
      effect: {
        type: 'cash',
        amount: -800,
        message: 'Clothing purchase! Pay R800'
      }
    },
    {
      id: 'community_expense_12',
      type: 'community',
      title: 'Electricity Bill',
      description: 'Your electricity bill is higher than expected.',
      effect: {
        type: 'cash',
        amount: -600,
        message: 'Electricity bill! Pay R600'
      }
    },
    {
      id: 'community_expense_13',
      type: 'community',
      title: 'Water Bill',
      description: 'Unexpected high water bill.',
      effect: {
        type: 'cash',
        amount: -450,
        message: 'Water bill! Pay R450'
      }
    },
    {
      id: 'community_expense_14',
      type: 'community',
      title: 'Rent Increase',
      description: 'Your rent has been increased.',
      effect: {
        type: 'cash',
        amount: -700,
        message: 'Rent increase! Pay R700'
      }
    },
    {
      id: 'community_expense_15',
      type: 'community',
      title: 'Holiday Trip',
      description: 'You took a holiday trip.',
      effect: {
        type: 'cash',
        amount: -1200,
        message: 'Holiday trip! Pay R1,200'
      }
    },
    {
      id: 'community_expense_16',
      type: 'community',
      title: 'Gym Membership',
      description: 'Your gym membership renewed.',
      effect: {
        type: 'cash',
        amount: -600,
        message: 'Gym membership renewal! Pay R600'
      }
    },
    {
      id: 'community_expense_17',
      type: 'community',
      title: 'Car Service',
      description: 'Regular car service required.',
      effect: {
        type: 'cash',
        amount: -800,
        message: 'Car service! Pay R800'
      }
    },
    {
      id: 'community_expense_18',
      type: 'community',
      title: 'Parking Fine',
      description: 'You received a parking ticket.',
      effect: {
        type: 'cash',
        amount: -500,
        message: 'Parking fine! Pay R500'
      }
    },
    {
      id: 'community_expense_19',
      type: 'community',
      title: 'Dentist Bill',
      description: 'Dental work needed.',
      effect: {
        type: 'cash',
        amount: -850,
        message: 'Dentist bill! Pay R850'
      }
    },
    {
      id: 'community_expense_20',
      type: 'community',
      title: 'Car License Renewal',
      description: 'Your car license needs renewal.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Car license renewal! Pay R1,000'
      }
    },
    {
      id: 'community_expense_21',
      type: 'community',
      title: 'Medical Aid Increase',
      description: 'Your medical aid premiums increased.',
      effect: {
        type: 'cash',
        amount: -750,
        message: 'Medical aid increase! Pay R750'
      }
    },
    {
      id: 'community_expense_22',
      type: 'community',
      title: 'Pet Expenses',
      description: 'Unexpected pet medical expenses.',
      effect: {
        type: 'cash',
        amount: -600,
        message: 'Pet expenses! Pay R600'
      }
    },
    {
      id: 'community_expense_23',
      type: 'community',
      title: 'Internet Subscription',
      description: 'Your internet subscription is due.',
      effect: {
        type: 'cash',
        amount: -500,
        message: 'Internet subscription! Pay R500'
      }
    },
    {
      id: 'community_expense_24',
      type: 'community',
      title: 'Online Scam',
      description: 'You fell victim to an online scam.',
      effect: {
        type: 'cash',
        amount: -1000,
        message: 'Scammed online! Lose R1,000'
      }
    },
    {
      id: 'community_expense_25',
      type: 'community',
      title: 'Credit Card Bill',
      description: 'Your credit card bill is due.',
      effect: {
        type: 'cash',
        amount: -1250,
        message: 'Credit card bill! Pay R1,250'
      }
    }
  ];
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