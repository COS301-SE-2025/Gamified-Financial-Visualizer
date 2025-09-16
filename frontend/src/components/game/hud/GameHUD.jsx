// GameHUD.jsx - Updated with better layout and additional props
import React, { useState } from 'react';
import {
  FaDollarSign, FaBuilding, FaClock, FaChevronLeft, FaChevronRight, FaSignOutAlt,
  FaMoneyBillWave, FaCreditCard, FaHandHoldingUsd, FaPiggyBank, FaTruck, FaDice, FaBox,
  FaUsers, FaCrown, FaCoins
} from 'react-icons/fa';

/* ----------------------------- Image imports ----------------------------- */
import playerIcon from '../../../assets/Images/avatars/Skull.png';
import playerIcon2 from '../../../assets/Images/avatars/CityBuilding.png';
import playerIcon3 from '../../../assets/Images/avatars/koiFish.png';
import playerIcon4 from '../../../assets/Images/avatars/Ramen.png';

// --- Card art ---
import artBusiness from '../../../assets/hud/Business Card.png';
import artChance from '../../../assets/hud/Chance Card.png';
import artCommunity from '../../../assets/hud/Community Card.png';

/* Small helper for consistent icon images */
function IconImg({ src, alt = '', className = 'w-5 h-5' }) {
  return <img src={src} alt={alt} className={`inline-block object-contain ${className}`} aria-hidden="true" />;
}

export default function GameHUD({
  /* existing props */
  playerName = "kevin_park",
  playerNumber = 2,
  netWorth = 5000,
  businesses = 4,
  totalBusinesses = 10,
  timePlaying = "10 min",
  goalLaps = 10,
  totalLaps = 15,
  salary = 2000,
  cardsCount = 4,
  businessWorth = 6000,
  loanBalance = 3000,
  assetsValue = 3500,
  currentBusiness = "ProMotion Gear",
  currency = 'R',

  /* NEW props from GameBoardViewer (fixes ESLint errors) */
  currentTileLabel = '—',   // label of the tile the piece is on
  onRoll = () => { },        // function to roll dice
  isMoving = false,         // whether the piece is currently animating
  showInventory = false,
  setShowInventory = () => {},
  showCard = false,
  setShowCard = () => {}
}) {
  const [activeTab, setActiveTab] = useState('net-worth');

  const computedNetWorth = netWorth;
  const availableCash = netWorth - assetsValue + loanBalance;

  // Map avatar imports to player IDs
  const playerAvatars = {
    'p1': playerIcon2,
    'p2': playerIcon,
    'p3': playerIcon3,
    'p4': playerIcon4
  };

  // player position information at the bottom of the HUD
  const players = [
    { id: 'p1', name: 'lily_rose', position: 5, cash: 6500, assetValue: 1500, loanBalance: 500, active: false },
    { id: 'p2', name: playerName, position: 10, cash: 5000, assetValue: 2000, loanBalance: 1000, active: true },
    { id: 'p3', name: 'nile_waters', position: 15, cash: 7000, assetValue: 1200, loanBalance: 0, active: false },
    { id: 'p4', name: 'man_person', position: 20, cash: 5500, assetValue: 1800, loanBalance: 800, active: false },
  ];

  // Mock inventory data
  const inventorySummary = {
    insurance: true,
    getOutOfBankruptcy: false,
    cards: cardsCount
  };

  // Mock card data
  const card = {
    type: 'deck',
    deck: 'Chance',
    title: 'Big Recession',
    body: 'Salary payout reduced this round.',
    delta: -3000,
  };

  return (
    <>
      {/* ===== Top Strip ===== */}
      <div className="pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-6 px-5 py-3 rounded-2xl bg-white/95 border shadow-lg">
          {/* Player Icon */}
          <div className="flex items-center gap-2">
            <img src={playerIcon} alt="Player" className="w-10 h-10 rounded-full border-2 border-sky-400" />
            <span className="font-semibold text-sky-700">{playerName}</span>
          </div>

          {/* Net Worth */}
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-lg text-lime-500" />
            <span>Net Worth: <span className="font-bold">{currency}{computedNetWorth.toLocaleString()}</span></span>
          </div>

          {/* Businesses */}
          <div className="flex items-center gap-2">
            <FaBuilding className="text-lg text-sky-500" />
            <span>{businesses} Businesses</span>
          </div>

          {/* Time Played */}
          <div className="flex items-center gap-2">
            <FaClock className="text-lg text-amber-500" />
            <span>{timePlaying} min</span>
          </div>

          {/* Goal Laps */}
          <div className="flex items-center gap-2 bg-sky-100 px-3 py-1 rounded-full">
            <FaCrown className="text-amber-500" />
            <span className="text-sm font-semibold">Laps: {goalLaps}/{totalLaps}</span>
          </div>

          {/* Roll Button */}
          <button
            onClick={onRoll}
            disabled={isMoving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaDice className="text-lg" />
            Roll Dice
          </button>
        </div>
      </div>

      {/* ===== Left action rail ===== */}
      <div className="pointer-events-auto fixed top-24 left-6 z-[1000]">
        {/* Balance Sheet */}
        <div className="w-72 rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Balance Sheet</div>
          </div>
          <div className="p-4 bg-[#f6f7f8] space-y-2">
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-base text-sky-600" />
                <span className="text-gray-600">Net Worth</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {netWorth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-base text-sky-600" />
                <span className="text-gray-600">Salary</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaCreditCard className="text-base text-sky-600" />
                <span className="text-gray-600">Cards</span>
              </div>
              <span className="font-semibold text-gray-800">{cardsCount} Cards</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaBuilding className="text-base text-sky-600" />
                <span className="text-gray-600">Business Worth</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {businessWorth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaHandHoldingUsd className="text-base text-sky-600" />
                <span className="text-gray-600">Loan Balance</span>
              </div>
              <span className="font-semibold text-red-600">{currency} {loanBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaPiggyBank className="text-base text-sky-600" />
                <span className="text-gray-600">Assets Value</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {assetsValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Top Right: Leave Game Button ===== */}
      <div className="absolute top-4 right-6 pointer-events-auto">
        <button className="flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-colors">
          <FaSignOutAlt className="text-lg" />
          Leave Game
        </button>
      </div>

      {/* ===== Right stack: Current Business ===== */}
      <div className="pointer-events-auto fixed top-24 right-6 z-[1000] w-[360px] space-y-4">
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Current Business</div>
          </div>
          <div className="p-4 bg-sky-50 text-sm space-y-3">
            <div className="text-center py-2 bg-white rounded-xl font-semibold text-sky-700 border border-sky-200">
              {currentBusiness}
            </div>
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-gray-600">Business Worth</span>
              <span className="font-semibold text-gray-800">{currency}{businessWorth.toLocaleString()}</span>
            </div>
            <div className="flex justify-center">
              <img src={artBusiness} alt="Business" className="w-24 h-24 object-contain" />
            </div>
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border shadow-sm bg-lime-500 text-white hover:bg-lime-600 transition-colors"
            >
              <FaTruck className="text-lg text-white" />
              Manage Business
            </button>
          </div>
        </div>

        {/* Current Tile */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Current Tile</div>
          </div>
          <div className="p-4 bg-amber-50 text-sm">
            <div className="text-center py-2 bg-white rounded-xl font-semibold text-amber-700 border border-amber-200">
              {currentTileLabel}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom player ribbon ===== */}
      <div className="pointer-events-auto fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-end gap-4">
          {players.map((p) => {
            const pNet = (p.cash ?? 0) + (p.assetValue ?? 0) - (p.loanBalance ?? 0);
            return (
              <div
                key={p.id}
                className={`px-4 py-3 rounded-2xl border shadow bg-white/95 transition-all duration-300 ${
                  p.active 
                    ? 'ring-4 ring-sky-400 border-sky-300 transform scale-105' 
                    : 'border-gray-200 hover:border-sky-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={playerAvatars[p.id]}
                    alt={p.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <FaCoins className="text-amber-500" />
                      {currency} {pNet.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}