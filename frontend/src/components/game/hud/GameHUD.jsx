import React, { useState } from 'react';
import { FaDollarSign, FaBuilding, FaClock, FaTrophy, FaMoneyBill, FaIdCard, FaBusinessTime, FaBalanceScale, FaGlasses, FaMoneyBillWave, FaCreditCard, FaHandHoldingUsd, FaPiggyBank, FaTruck, FaSignOutAlt, FaDice } from 'react-icons/fa';

/* ----------------------------- Image imports ----------------------------- */
import imgBusiness from '../../../assets/hud/Business Card.png';
import imgBuy from '../../../assets/hud/Business Card.png';
import imgLoan from '../../../assets/hud/Business Card.png';
import imgRepay from '../../../assets/hud/Business Card.png';
import imgDraw from '../../../assets/hud/Business Card.png';
import imgBank from '../../../assets/hud/Business Card.png';
import imgOverview from '../../../assets/hud/Business Card.png';
import imgExplore from '../../../assets/hud/Business Card.png';

import imgCash from '../../../assets/hud/Business Card.png';
import imgFlag from '../../../assets/hud/Business Card.png';
import imgAssets from '../../../assets/hud/Business Card.png';
import imgLoans from '../../../assets/hud/Business Card.png';
import imgClock from '../../../assets/hud/Business Card.png';

import imgInventory from '../../../assets/hud/Business Card.png';
import playerIcon from '../../../assets/Images/avatars/panda.png';
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
  currency = 'R'
}) {
  const [showInventory, setShowInventory] = useState(false);
  const [showCard, setShowCard] = useState(false);
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

  // side bar action that sjould pop-up when on specific tiles 
  const actions = [
    { id: 'roll', label: 'Roll Dice', img: imgBusiness, accent: 'bg-red-600 text-white' },
    { id: 'buy', label: 'Buy Asset', img: imgBuy, accent: 'bg-emerald-600 text-white' },
    { id: 'loan', label: 'Take Loan', img: imgLoan },
    { id: 'repay', label: 'Repay Loan', img: imgRepay },
    { id: 'draw', label: 'Draw Card', img: imgDraw },
    { id: 'bank', label: 'Visit Bank', img: imgBank },
  ];

  // player postion information at the bottom of the HUD
  const players = [
    { id: 'p1', name: 'lily_rose', position: 5 },
    { id: 'p2', name: playerName, position: 10, active: true },
    { id: 'p3', name: 'nile_waters', position: 15 },
    { id: 'p4', name: 'man_person', position: 20 },
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
      <div className="pointer-events-auto fixed top-22 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-6 px-5 py-2 rounded-2xl bg-white/95 border shadow">
          {/* Net Worth */}
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-lg text-lime-500" />
            <span>Net Worth: {currency}{computedNetWorth.toLocaleString()}</span>
          </div>

          {/* Businesses */}
          <div className="flex items-center gap-2">
            <FaBuilding className="text-lg text-sky-500" />
            <span>{businesses} Businesses Left</span>
          </div>

          {/* Time Played */}
          <div className="flex items-center gap-2">
            <FaClock className="text-lg text-yellow-500" />
            <span>{timePlaying} min</span>
          </div>

          {/* Player Icon */}
          <div className="flex items-center gap-2">
            <img src={playerIcon} alt="Player" className="w-8 h-8 rounded-full" />
            <span>Playing: {playerName}</span>
          </div>

          {/* Goal Laps */}
          <div className="ml-2 text-xs text-gray-600">
            Goal Laps: {goalLaps}/{totalLaps} Laps
          </div>
        </div>
      </div>

      {/* Player Info */}
      <div className="top-8 right-12 rounded-xl ">
        <div className="flex items-center gap-3">
          {/* Player Icon */}
          <div className="rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
            <img src={playerIcon} alt="Player" className="w-10 h-10 rounded-full" />
          </div>

          {/* Player Name Section */}
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-500">Playing:</span>
            <div className="font-bold text-xl">{playerName}</div>
            <div className="text-sm text-gray-500">No. 2</div>
          </div>
        </div>

        {/* Top Right: Role Dice Button */}
        <div className="absolute top-20 left-6 pointer-events-auto">
          <button className="flex items-center gap-2 bg-amber-300 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-xl shadow-md">
            <FaDice className="text-lg" />
            Roll Dice
          </button>
        </div>
      </div>

      {/* ===== Left action rail ===== */}
      <div className="pointer-events-auto fixed bottom-32 left-6 z-[1000]">
        {/* Balance Sheet */}
        <div className="w-72 rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-sky-300 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide just">Balance Sheet</div>
          </div>
          <div className="p-4 bg-[#f6f7f8]">
            <div className="flex justify-between py-1.5 text-sm">
              <FaDollarSign className="text-base text-gray-600" />
              <span className="text-gray-600">Net Worth</span>
              <span className="font-semibold text-gray-800">R {netWorth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <FaMoneyBillWave className="text-base text-gray-600" />
              <span className="text-gray-600">Salary</span>
              <span className="font-semibold text-gray-800">R {salary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <FaCreditCard className="text-base text-gray-600" />
              <span className="text-gray-600">Cards</span>
              <span className="font-semibold text-gray-800">{cardsCount} Cards</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <FaBuilding className="text-base text-gray-600" />
              <span className="text-gray-600">Business Worth</span>
              <span className="font-semibold text-gray-800">R {businessWorth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <FaHandHoldingUsd className="text-base text-gray-600" />
              <span className="text-gray-600">Loan Balance</span>
              <span className="font-semibold text-red-600">R {loanBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm">
              <FaPiggyBank className="text-base text-gray-600" />
              <span className="text-gray-600">Assets Value</span>
              <span className="font-semibold text-gray-800">R {assetsValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Right: Leave Game Button */}
      <div className="absolute top-2 right-12 pointer-events-auto">
        <button className="flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl shadow-md">
          <FaSignOutAlt className="text-lg" />
          Leave Game
        </button>
      </div>

      {/* ===== Right stack: Balance Sheet + Context ===== */}
      <div className="pointer-events-auto fixed bottom-42 right-6 z-[1000] w-[360px] space-y-3">

        {/* Current Business Panel */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-sky-300 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Current Business</div>
          </div>
          <div className="p-4 bg-sky-50 text-sm space-y-2">
            <div className="text-center py-2 bg-white rounded font-semibold">
              {currentBusiness}
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-gray-600">Business Worth</span>
              <span className="font-semibold text-gray-800">{currency}{businessWorth.toLocaleString()}</span>
            </div>
            <img src={artBusiness} alt="Player" className="w-16 h-18 left-12" />
            <button
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border shadow-sm bg-lime-600 text-white"
            >
              <FaTruck className="text-lg text-white" />
              Manage Business
            </button>
          </div>
        </div>
      </div>

      {/* ===== Bottom player ribbon ===== */}
      <div className="pointer-events-auto fixed bottom-3 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-end gap-4">
          {players.map((p) => {
            const pNet = (p.cash ?? 0) + (p.assetValue ?? 0) - (p.loanBalance ?? 0);
            return (
              <div
                key={p.id}
                className={`px-4 py-2 rounded-2xl border shadow bg-white/95 ${p.active ? 'ring-4 ring-indigo-400' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={playerAvatars[p.id]}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <div className="text-lg font-bold">{p.name}</div>
                    <div className="text-[13px] text-gray-600">
                      Pos: {p.position} · Net {currency}{Number(pNet).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Inventory pill ===== */}
      <div className="pointer-events-auto fixed bottom-4 right-16 z-[1000]">
        <button className="px-3 py-2 rounded-xl border bg-white/95 shadow text-sm hover:bg-black/5"
          onClick={() => setShowInventory(!showInventory)}
          title="Open inventory">
          <span className="inline-flex items-center gap-2">
            📦 Inventory
          </span>
          <span className="ml-2 text-xs text-gray-600">
            {inventorySummary.insurance ? '• Insurance' : ''}
            {inventorySummary.getOutOfBankruptcy ? ' • G.O.O.B' : ''}
            {inventorySummary.cards ? ` • ${inventorySummary.cards} card${inventorySummary.cards > 1 ? 's' : ''}` : ''}
          </span>
        </button>
      </div>

      {/* ===== Inventory Popup ===== */}
      {showInventory && (
        <div className="pointer-events-auto fixed bottom-10 right-16 z-[1100] w-72">
          <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
            <div className="px-4 py-2 bg-purple-50 border-b text-gray-800">
              <div className="text-sm font-extrabold tracking-wide">Inventory</div>
            </div>
            <div className="p-4 bg-[#f6f7f8]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-3 rounded text-center border">Card 1</div>
                <div className="bg-gray-100 p-3 rounded text-center border">Card 2</div>
                <div className="bg-gray-100 p-3 rounded text-center border">Card 3</div>
                <div className="bg-gray-100 p-3 rounded text-center border">Card 4</div>
              </div>
              <button
                className="w-full mt-3 px-3 py-2 rounded-lg border hover:bg-black/5"
                onClick={() => setShowInventory(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Card Popup ===== */}
      {showCard && (
        <div className="fixed inset-0 z-[1100] grid place-items-center bg-black/50">
          <div className="w-[420px] rounded-2xl overflow-hidden shadow-2xl border bg-white">
            {/* header */}
            <div className={`px-4 py-2 ${card.type === 'deck'
              ? (card.deck === 'Chance' ? 'bg-amber-50' : 'bg-rose-50')
              : 'bg-sky-50'} border-b`}>
              <div className="text-sm font-extrabold tracking-wide">
                {card.type === 'deck' ? `${card.deck} Card` : 'Tile'}
              </div>
            </div>

            {/* body */}
            <div className="p-4 bg-[#f7f7f7] space-y-3 text-sm">
              {card.type === 'deck' ? (
                <>
                  <div className="font-bold text-gray-800">{card.title}</div>
                  {card.body && <p className="text-gray-700">{card.body}</p>}
                  {typeof card.delta === 'number' && (
                    <div className={`mt-1 text-sm font-semibold ${card.delta >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {card.delta >= 0 ? '+' : ''}{currency}{Math.abs(card.delta).toLocaleString()}
                    </div>
                  )}
                </>
              ) : (
                <div>Tile information would appear here.</div>
              )}
            </div>

            {/* footer buttons */}
            <div className="p-3 bg-white border-t flex gap-2 justify-end">
              {card.type === 'deck' ? (
                <button
                  className="px-3 py-2 rounded-lg border hover:bg-black/5"
                  onClick={() => setShowCard(false)}
                >
                  OK
                </button>
              ) : (
                <>
                  <button className="px-3 py-2 rounded-lg border bg-emerald-600 text-white">
                    Buy
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg border hover:bg-black/5"
                    onClick={() => setShowCard(false)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  );
}