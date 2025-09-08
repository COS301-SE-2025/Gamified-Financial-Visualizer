import { GameState, Player, Card, Block, Board } from '../types/GameTypes';
import * as BoardData from '../data/BoardData';
import { EventEmitter } from 'events';

export class GameEngine extends EventEmitter {
  private games = new Map<string, GameState>();

  private chanceCards: Card[] = [
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

  private communityCards: Card[] = [
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

    let currentIndex = playerIds.indexOf(game.currentPlayerId);
    let nextPlayerId: number;
    let attempts = 0;
    
    do {
      currentIndex = (currentIndex + 1) % playerIds.length;
      nextPlayerId = playerIds[currentIndex];
      attempts++;
      
      // Prevent infinite loop
      if (attempts > playerIds.length) {
        break;
      }
    } while (game.players.get(nextPlayerId)?.skipNextTurn);
    
    // Reset skip flag for the player who had it set
    const currentPlayer = game.players.get(game.currentPlayerId);
    if (currentPlayer?.skipNextTurn) {
      currentPlayer.skipNextTurn = false;
    }
    
    game.currentPlayerId = nextPlayerId;

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
    this.emit('business-opportunity', { gameId, playerId, block });
  }

  private handleActionBlock(gameId: string, playerId: number, block: Block): void {
    // Handle lifestyle costs, investments, etc.
    this.emit('action-required', { gameId, playerId, block });
  }

  // HUD updates and other utility methods would go here
  private updateHUD(gameId: string): void {
    const game = this.games.get(gameId)!;
    this.emit('hud-update', { gameId, players: Array.from(game.players.values()) });
  }


  private handleBankBlock(gameId: string, playerId: number): void {
    // Handle bank-related actions (loans, etc.)
    this.emit('bank-action', { gameId, playerId });
  }

  private handleInvestmentBlock(gameId: string, playerId: number): void {
    // Handle investment opportunities
    this.emit('investment-opportunity', { gameId, playerId });
  }

  private handleLifestyleBlock(gameId: string, playerId: number, block: Block): void {
    // Handle lifestyle expenses
    const player = this.games.get(gameId)!.players.get(playerId)!;
    const cost = block.cost || 500; // Default cost if not specified
    
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
    
    const loan = player.loans[loanIndex];
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
    
    const asset = player.assets[assetIndex];
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