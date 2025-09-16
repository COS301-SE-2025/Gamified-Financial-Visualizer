// src/pages/game/hud/GameHUD.jsx
import React, { useMemo, useState } from 'react';
import {
  FaDollarSign, FaBuilding, FaClock, FaDice, FaBox, FaCrown,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

import playerIcon from '../../../assets/Images/avatars/Skull.png';
import playerIcon2 from '../../../assets/Images/avatars/CityBuilding.png';
import playerIcon3 from '../../../assets/Images/avatars/koiFish.png';
import playerIcon4 from '../../../assets/Images/avatars/Ramen.png';

import artBusiness from '../../../assets/hud/Business Card.png';
import artChance from '../../../assets/hud/Chance Card.png';
import artCommunity from '../../../assets/hud/Community Card.png';

export default function GameHUD({
  // top strip
  playerName = "kevin_park",
  currency = 'R',
  netWorth = 7000,
  businesses = 0,
  timePlaying = "demo",
  goalLaps = 0,
  totalLaps = 5,
  currentTileLabel = '—',

  // control
  onRoll = () => {},
  canRoll = false,

  // balance sheet
  salary = 2000,
  cardsCount = 0,
  businessWorth = 0,
  loanBalance = 0,
  assetsValue = 0,

  // footer
  playersSummary = [],
  activePlayerId = null,

  // drawer carousel
  inventoryCards = [],

  // dice toast (number or null)
  diceToast = null,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const avatar = useMemo(() => ({
    p1: playerIcon2, p2: playerIcon, p3: playerIcon3, p4: playerIcon4
  }), []);

  const cards = inventoryCards?.length ? inventoryCards : [
    { deck: 'Chance', title: 'Big Recession', desc: 'Salary payout reduced this round.' },
    { deck: 'Community', title: 'Local Grant', desc: '+R500 stipend.' },
  ];

  const currentCard = cards[Math.max(0, Math.min(cardIndex, cards.length - 1))];

  return (
    <>
      {/* === Top Center Strip (roll + inventory) === */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[900] pointer-events-auto">
        <div className="flex items-center gap-6 px-5 py-3 rounded-2xl bg-white/95 border shadow-lg">
          <div className="flex items-center gap-2">
            <img src={playerIcon} alt="you" className="w-10 h-10 rounded-full border-2 border-sky-400" />
            <span className="font-semibold text-sky-700">{playerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-lg text-lime-500" />
            <span>Net Worth: <b>{currency}{netWorth.toLocaleString()}</b></span>
          </div>
          <div className="flex items-center gap-2">
            <FaBuilding className="text-lg text-sky-500" />
            <span>{businesses} Businesses</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-lg text-amber-500" />
            <span>{timePlaying} min</span>
          </div>
          <div className="flex items-center gap-2 bg-sky-100 px-3 py-1 rounded-full">
            <FaCrown className="text-amber-500" />
            <span className="text-sm font-semibold">Laps: {goalLaps}/{totalLaps}</span>
          </div>
          <button
            onClick={onRoll}
            disabled={!canRoll}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${!canRoll ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-500'} text-white font-semibold shadow`}
            title="Roll Dice"
          >
            <FaDice /> Roll
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow"
          >
            <FaBox /> Inventory
          </button>
        </div>
      </div>

      {/* === Top Left: Current tile chip === */}
      <div className="fixed top-22 left-6 z-[850] pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border shadow pointer-events-auto">
          <span className="text-gray-600 text-sm">Tile:</span>
          <span className="font-semibold">{currentTileLabel}</span>
        </div>
      </div>

      {/* === Left rail: BALANCE SHEET (restored) === */}
      <div className="fixed left-6 top-36 z-[800] w-72">
        <div className="rounded-2xl overflow-hidden border bg-white shadow">
          <div className="px-4 py-2 bg-sky-300 border-b text-white font-extrabold">Balance Sheet</div>
          <div className="p-4 bg-[#f6f7f8] text-sm">
            <div className="flex justify-between py-1.5"><span>Net Worth</span><span className="font-semibold">{currency}{netWorth.toLocaleString()}</span></div>
            <div className="flex justify-between py-1.5"><span>Salary</span><span className="font-semibold">{currency}{salary.toLocaleString()}</span></div>
            <div className="flex justify-between py-1.5"><span>Cards</span><span className="font-semibold">{cardsCount} Cards</span></div>
            <div className="flex justify-between py-1.5"><span>Business Worth</span><span className="font-semibold">{currency}{businessWorth.toLocaleString()}</span></div>
            <div className="flex justify-between py-1.5"><span className="text-rose-600">Loan Balance</span><span className="font-semibold text-rose-600">{currency}{loanBalance.toLocaleString()}</span></div>
            <div className="flex justify-between py-1.5"><span>Assets Value</span><span className="font-semibold">{currency}{assetsValue.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Mini “Cards” preview (static art) */}
        <div className="mt-4 rounded-2xl overflow-hidden border bg-white shadow">
          <div className="px-4 py-2 bg-indigo-300 border-b text-white font-extrabold">Cards</div>
          <div className="p-4 grid grid-cols-3 gap-2">
            <img src={artBusiness} alt="Business" className="rounded-xl border" />
            <img src={artChance} alt="Chance" className="rounded-xl border" />
            <img src={artCommunity} alt="Community" className="rounded-xl border" />
          </div>
        </div>
      </div>

      {/* === Bottom Footer: players with active highlight === */}
      <div className="fixed bottom-0 inset-x-0 z-[850]">
        <div className="mx-auto max-w-7xl px-4 py-3 bg-white/90 backdrop-blur border-t rounded-t-2xl shadow">
          <div className="flex items-stretch gap-3 overflow-x-auto">
            {playersSummary.map(p => {
              const active = p.id === activePlayerId;
              return (
                <div key={p.id} className={`min-w-[200px] flex-1 rounded-2xl border p-3 bg-white shadow-sm ${active ? 'ring-4 ring-sky-400' : ''}`}>
                  <div className="flex items-center gap-3">
                    <img src={avatar[p.id] || playerIcon} alt={p.name} className="w-10 h-10 rounded-full border object-cover" />
                    <div className="leading-tight">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-500">Lap {p.laps}/{totalLaps}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700 flex justify-between">
                    <span>Tile: {p.position}</span>
                    <span>Cash: {currency}{(p.cash ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === Right Drawer: Inventory with Carousel === */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[420px] bg-white border-l shadow-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-extrabold text-sky-700">Your Deck</div>
              <button onClick={() => setDrawerOpen(false)} className="px-3 py-1 rounded-lg bg-sky-50 border">Close</button>
            </div>

            {cards.length === 0 ? (
              <div className="text-sm text-gray-500">No cards yet.</div>
            ) : (
              <>
                <div className="relative rounded-2xl border bg-[#f7f9fb] p-3">
                  <div className="absolute inset-y-0 left-0 grid place-items-center w-10">
                    <button className="p-2 rounded-lg bg-white border shadow" onClick={() => setCardIndex(i => Math.max(0, i - 1))}><FaChevronLeft /></button>
                  </div>
                  <div className="absolute inset-y-0 right-0 grid place-items-center w-10">
                    <button className="p-2 rounded-lg bg-white border shadow" onClick={() => setCardIndex(i => Math.min(cards.length - 1, i + 1))}><FaChevronRight /></button>
                  </div>

                  <div className="h-56 rounded-xl overflow-hidden bg-white border flex items-center justify-center">
                    {/* placeholder art per deck */}
                    <img
                      src={currentCard.deck === 'Chance' ? artChance : (currentCard.deck === 'Community' ? artCommunity : artBusiness)}
                      alt={currentCard.title}
                      className="h-full w-full object-cover select-none"
                      draggable="false"
                    />
                  </div>

                  <div className="mt-3 text-sm">
                    <div className="font-semibold">{currentCard.deck} — {currentCard.title}</div>
                    <div className="text-gray-600">{currentCard.desc}</div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">Card {cardIndex + 1} / {cards.length}</div>
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2">
                  {cards.map((c, i) => (
                    <button
                      key={i}
                      className={`h-20 rounded-xl overflow-hidden border ${i === cardIndex ? 'ring-2 ring-sky-400' : ''}`}
                      onClick={() => setCardIndex(i)}
                      title={`${c.deck}: ${c.title}`}
                    >
                      <img
                        src={c.deck === 'Chance' ? artChance : (c.deck === 'Community' ? artCommunity : artBusiness)}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* === Big Dice Toast (human rolls only) === */}
      {diceToast != null && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1001]">
          <div className="px-6 py-4 rounded-2xl bg-white border shadow-2xl text-center">
            <div className="text-sky-700 font-extrabold">Dice Roll</div>
            <div className="text-5xl font-black mt-2">{diceToast}</div>
          </div>
        </div>
      )}
    </>
  );
}
