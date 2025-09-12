import React from "react"
import {
  FaUsers, FaDice, FaBuilding, FaGasPump, FaCoins, FaArrowRight,
  FaBolt, FaChartLine, FaHandsHelping, FaBan, FaPlane,
  FaHandHoldingUsd, FaRegSmileBeam, FaTools, FaExclamationTriangle,
  FaShieldAlt,
  FaDollarSign,
} from 'react-icons/fa'

import businessTile from '../../../assets/hud/Business Card.png';
import chanceTile from '../../../assets/hud/Chance Card.png';
import communityTile from '../../../assets/hud/Community Card.png';
import charityTile from '../../../assets/hud/Random Charity Card.png';
import FreelanceTile from '../../../assets/hud/Random Freelance Card.png';
import FuelTile from '../../../assets/hud/Random Fuel Card.png';
import inhertanceTile from '../../../assets/hud/Random Inheritance Card.png';
import moneyTile from '../../../assets/hud/Random Money Card.png';
import recessionTile from '../../../assets/hud/Random Recession Card.png';
import rentTile from '../../../assets/hud/Random Rent Card.png';
import retrenchedTile from '../../../assets/hud/Random Retrenched Card.png';
import royaltyTile from '../../../assets/hud/Random Royalty Card.png';
import savingsTile from '../../../assets/hud/Random Savings Card.png';
import scamTile from '../../../assets/hud/Random Scam Card.png';
import stockTile from '../../../assets/hud/Random Stock Card.png';
import taxRefundTile from '../../../assets/hud/Random Tax Refund Card.png';
import taxSpotTile from '../../../assets/hud/Random Tax Spot Card.png';
import technologyTile from '../../../assets/hud/Random Technology Card.png';
import upsuranceTile from '../../../assets/hud/Random Upsurance Card.png';
import vacationTile from '../../../assets/hud/Random Vacation Card.png';
import volutaryTile from '../../../assets/hud/Random Voluntary Card.png';

// optional: point to your Canva exports (place images in /public/tiles)
// You can keep null and the modal will render the icon instead.
const img = (file) => (file ? `/tiles/${file}` : null)

/* ──────────────────────────────────────────────────────────────────────────────
  Helpers
────────────────────────────────────────────────────────────────────────────── */
const business = (id, label, cost, imageFile) => ({
  id,
  type: 'business',
  label,
  description: `Buy ${label} and start earning returns each lap.`,
  icon: <FaBuilding className="text-sky-600" />,
  image: businessTile,
  cost,
  action: { label: `Buy for ${cost.toLocaleString()} Bucks`, type: 'buy', cost },
})

/* ──────────────────────────────────────────────────────────────────────────────
  Tiles (dictionary) + ordered layout (array)
  - id must be unique
  - action.type is how your game engine switches logic
────────────────────────────────────────────────────────────────────────────── */
export const BOARD_TILES = {
  /* Draw decks */
  community: {
    id: 'community',
    type: 'community',
    label: 'Community Card',
    description: 'Pick a random community card from the deck.',
    icon: <FaUsers className="text-purple-500" />,
    image: communityTile,
    action: { label: 'Pick Card', type: 'draw_community' },
  },
  chance: {
    id: 'chance',
    type: 'chance',
    label: 'Chance Card',
    description: 'Draw a random chance card from the deck.',
    icon: <FaDice className="text-amber-500" />,
    image: chanceTile,
    action: { label: 'Pick Card', type: 'draw_chance' },
  },

  /* Businesses (from your Canva set) */
  wellsPharma: business('wellsPharma', 'WellSpring Pharmacy', 4000, businessTile),
  auraBeauty: business('auraBeauty', 'Aura & Co. Beauty', 3000, businessTile),
  quantumCircuit: business('quantumCircuit', 'Quantum Circuit (Software)', 3000, businessTile),
  forkFlame: business('forkFlame', 'Fork & Flame (Catering)', 1500, businessTile),
  promotionGear: business('promotionGear', 'ProMotion Gear (Sports)', 2500, businessTile),
  modernKindDecor: business('modernKindDecor', 'ModernKind Decor', 2500, businessTile),
  nextQuestGames: business('nextQuestGames', 'NextQuest Games', 2500, businessTile),
  loomLabel: business('loomLabel', 'Loom & Label (Clothes)', 3500, businessTile),
  roboSociety: business('roboSociety', 'The Robo Society (Robotics)', 3000, businessTile),
  roastBean: business('roastBean', 'Roast & Bean (Cafe)', 2500, businessTile),

  /* Movement / fuel / crypto */
  cryptoBoom: {
    id: 'cryptoBoom',
    type: 'event',
    label: 'Crypto Boom',
    description: 'Roll again and advance on the board.',
    icon: <FaArrowRight className="text-emerald-600" />,
    image: img('crypto_boom.png'),
    action: { label: 'Roll to Advance', type: 'advance_roll' },
  },
  transportFuel: {
    id: 'transportFuel',
    type: 'fee',
    label: 'Transport — Fill Your Gas Tank',
    description: 'Pay for fuel before you continue.',
    icon: <FaGasPump className="text-lime-600" />,
    image: img(FuelTile),
    cost: 1500,
    action: { label: 'Pay Fuel (1 500)', type: 'pay', cost: 1500 },
  },

  /* Money in/out events */
  giveToCharity: {
    id: 'giveToCharity',
    type: 'fee',
    label: 'Give to Charity',
    description: 'Always give back.',
    icon: <FaHandsHelping className="text-rose-500" />,
    image: img(charityTile),
    cost: 500,
    action: { label: 'Donate 500', type: 'pay', cost: 500 },
  },
  bigRecession: {
    id: 'bigRecession',
    type: 'fee',
    label: 'Big Recession',
    description: 'Salary payout reduced this round.',
    icon: <FaExclamationTriangle className="text-orange-500" />,
    image: img(recessionTile),
    cost: 3000,
    action: { label: 'Absorb Loss (3 000)', type: 'pay', cost: 3000 },
  },
  freelanceGig: {
    id: 'freelanceGig',
    type: 'income',
    label: 'Freelance Gig',
    description: 'Latest job is a success.',
    icon: <FaDollarSign className="text-emerald-600" />,
    image: img(FreelanceTile),
    amount: 2000,
    action: { label: 'Collect 2 000', type: 'earn', amount: 2000 },
  },
  payYourRent: {
    id: 'payYourRent',
    type: 'fee',
    label: 'Pay Your Rent',
    description: 'Monthly fees due.',
    icon: <FaHandHoldingUsd className="text-red-500" />,
    image: img(rentTile),
    cost: 3000,
    action: { label: 'Pay Rent (3 000)', type: 'pay', cost: 3000 },
  },
  demoted: {
    id: 'demoted',
    type: 'status',
    label: 'Demoted',
    description: 'Lose half of this round’s salary.',
    icon: <FaBan className="text-gray-700" />,
    image: img('demoted.png'),
    action: { label: 'Apply Demotion', type: 'halve_salary' },
  },
  gambler: {
    id: 'gambler',
    type: 'random',
    label: 'Gambler',
    description: 'Big gambling payout — claim a random amount of Bucks.',
    icon: <FaRegSmileBeam className="text-yellow-500" />,
    image: img('gambler.png'),
    action: { label: 'Spin Payout', type: 'random_payout', min: 200, max: 3000 },
  },
  newUpgrade: {
    id: 'newUpgrade',
    type: 'buff',
    label: 'New Upgrade',
    description: 'Upgrade owned business — earn from all owned businesses for one round.',
    icon: <FaTools className="text-indigo-600" />,
    image: technologyTile,
    action: { label: 'Apply Upgrade', type: 'upgrade_owned_business' },
  },

  /* Income & investments */
  allowance: {
    id: 'allowance',
    type: 'income',
    label: 'Allowance',
    description: 'Claim your allowance.',
    icon: <FaCoins className="text-amber-500" />,
    image: inhertanceTile ,
    amount: 1000,
    action: { label: 'Collect 1 000', type: 'earn', amount: 1000 },
  },
  investment: {
    id: 'investment',
    type: 'income',
    label: 'Investment',
    description: 'Collect if you invested.',
    icon: <FaChartLine className="text-emerald-600" />,
    image: stockTile,
    amount: 2500,
    action: { label: 'Collect 2 500', type: 'earn', amount: 2500 },
  },
  taxCollector: {
    id: 'taxCollector',
    type: 'fee',
    label: 'Tax Collector',
    description: 'Tax season means you pay a percentage of your salary.',
    icon: <FaHandHoldingUsd className="text-red-600" />,
    image: img('tax_collector.png'),
    percent: 0.15, // 15% default — tune in rules
    action: { label: 'Pay % of Salary', type: 'pay_percent_salary', percent: 0.15 },
  },
  slowPaced: {
    id: 'slowPaced',
    type: 'fee',
    label: 'Slow Paced',
    description: 'Recent business losses — take less from all owned businesses for one round.',
    icon: <FaBolt className="text-gray-500" />,
    image: img('slow_paced.png'),
    action: { label: 'Apply Penalty', type: 'reduce_business_income_one_round', factor: 0.5 },
  },
  theScammer: {
    id: 'theScammer',
    type: 'fee',
    label: 'The Scammer',
    description: 'Lose some money.',
    icon: <FaExclamationTriangle className="text-rose-500" />,
    image: scamTile,
    cost: 300,
    action: { label: 'Lose 300', type: 'pay', cost: 300 },
  },
  takeVacation: {
    id: 'takeVacation',
    type: 'status',
    label: 'Take a Vacation',
    description: 'Big spender goes abroad — sponsored vacation; skip business payments.',
    icon: <FaPlane className="text-sky-600" />,
    image: vacationTile,
    action: { label: 'Skip Payments (1 round)', type: 'skip_business_payments_one_round' },
  },
  taxRefunds: {
    id: 'taxRefunds',
    type: 'income',
    label: 'Tax Refunds',
    description: 'Tax season is over — collect a refund.',
    icon: <FaCoins className="text-emerald-600" />,
    image: taxRefundTile,
    amount: 1000,
    action: { label: 'Collect 1 000', type: 'earn', amount: 1000 },
  },
  upsurance: {
    id: 'upsurance',
    type: 'mix',
    label: 'Upsurance',
    description: 'Invest in your insurance. Then pick up a community card.',
    icon: <FaShieldAlt className="text-indigo-600" />,
    image: upsuranceTile,
    action: { label: 'Invest + Draw', type: 'insurance_then_draw_community', invest: 500 },
  },
  volunteerDay: {
    id: 'volunteerDay',
    type: 'status',
    label: 'Volunteer Day',
    description: 'Take the day off and help — skip a full turn.',
    icon: <FaHandsHelping className="text-amber-600" />,
    image: volutaryTile,
    action: { label: 'Skip Turn', type: 'skip_turn' },
  },

  /* Random draw variants you listed (for completeness) */
  randomSavings: {
    id: 'randomSavings',
    type: 'draw',
    label: 'Random Savings',
    description: 'Roll dice and advance on the board (savings variant).',
    icon: <FaArrowRight />,
    image: savingsTile,
    action: { label: 'Roll & Advance', type: 'advance_roll' },
  },
  randomFuel: {
    id: 'randomFuel',
    type: 'draw',
    label: 'Random Fuel',
    description: 'Fuel variant — could pay or get a voucher.',
    icon: <FaGasPump />,
    image: FuelTile,
    action: { label: 'Resolve Fuel Card', type: 'resolve_random_fuel' },
  },
  randomInheritance: {
    id: 'randomInheritance',
    type: 'income',
    label: 'Random Inheritance',
    description: 'Receive a small inheritance.',
    icon: <FaCoins />,
    image: inhertanceTile,
    amount: 1000,
    action: { label: 'Collect 1 000', type: 'earn', amount: 1000 },
  },
  randomStock: {
    id: 'randomStock',
    type: 'random',
    label: 'Random Stock',
    description: 'Market swings your way (or not).',
    icon: <FaChartLine />,
    image: stockTile,
    action: { label: 'Resolve Stock Move', type: 'stock_random', min: -1500, max: 3000 },
  },
  randomTaxSpot: {
    id: 'randomTaxSpot',
    type: 'fee',
    label: 'Random Tax Spot',
    description: 'Unexpected tax compliance cost.',
    icon: <FaHandHoldingUsd />,
    image: taxSpotTile,
    cost: 1200,
    action: { label: 'Pay 1 200', type: 'pay', cost: 1200 },
  },
  randomRoyalty: {
    id: 'randomRoyalty',
    type: 'income',
    label: 'Random Royalty',
    description: 'A patent pays out.',
    icon: <FaDollarSign />,
    image: royaltyTile,
    amount: 1800,
    action: { label: 'Collect 1 800', type: 'earn', amount: 1800 },
  },
  randomRetrenched: {
    id: 'randomRetrenched',
    type: 'fee',
    label: 'Random Retrenched',
    description: 'Loose half salary next round.',
    icon: <FaBan />,
    image: retrenchedTile,
    action: { label: 'Mark Retrenched', type: 'halve_salary' },
  },
  randomMoney: {
    id: 'randomMoney',
    type: 'random',
    label: 'Random Money',
    description: 'Claim a random amount of Bucks.',
    icon: <FaRegSmileBeam />,
    image: moneyTile,
    action: { label: 'Spin Payout', type: 'random_payout', min: 100, max: 2500 },
  },
  randomVacation: {
    id: 'randomVacation',
    type: 'status',
    label: 'Random Vacation',
    description: 'Sponsored vacation — skip business payments.',
    icon: <FaPlane />,
    image: vacationTile,
    action: { label: 'Skip Payments (1 round)', type: 'skip_business_payments_one_round' },
  },
  randomTaxRefund: {
    id: 'randomTaxRefund',
    type: 'income',
    label: 'Random Tax Refund',
    description: 'Collect a modest refund.',
    icon: <FaCoins />,
    image: taxSpotTile,
    amount: 1000,
    action: { label: 'Collect 1 000', type: 'earn', amount: 1000 },
  },
}

/* The board order if you want to iterate around the loop */
export const BOARD_ORDER = [
  'community',
  'chance',
  'wellsPharma',
  'auraBeauty',
  'quantumCircuit',
  'forkFlame',
  'promotionGear',
  'modernKindDecor',
  'nextQuestGames',
  'loomLabel',
  'roboSociety',
  'roastBean',
  'cryptoBoom',
  'transportFuel',
  'giveToCharity',
  'bigRecession',
  'freelanceGig',
  'payYourRent',
  'demoted',
  'gambler',
  'newUpgrade',
  'allowance',
  'investment',
  'taxCollector',
  'slowPaced',
  'theScammer',
  'takeVacation',
  'taxRefunds',
  'upsurance',
  'volunteerDay',

  // optional random variants (use wherever appropriate)
  'randomSavings',
  'randomFuel',
  'randomInheritance',
  'randomStock',
  'randomTaxSpot',
  'randomRoyalty',
  'randomRetrenched',
  'randomMoney',
  'randomVacation',
  'randomTaxRefund',
]
