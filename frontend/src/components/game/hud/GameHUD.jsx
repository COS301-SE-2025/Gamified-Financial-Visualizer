// src/pages/game/hud/GameHUD.jsx
import React, { useState, useEffect } from 'react';
import {
  FaDollarSign, FaBuilding, FaClock, FaChevronLeft, FaChevronRight, FaSignOutAlt,
  FaMoneyBillWave, FaCreditCard, FaHandHoldingUsd, FaPiggyBank, FaTruck, FaDice, FaBox,
  FaCrown
} from 'react-icons/fa';
import { getSocket } from '../socket';
import { useHudData } from '../hooks/HudData';



/* ----------------------------- Image imports ----------------------------- */
import playerIcon from '../../../assets/Images/avatars/Skull.png';
import playerIcon2 from '../../../assets/Images/avatars/CityBuilding.png';
import playerIcon3 from '../../../assets/Images/avatars/koiFish.png';
import playerIcon4 from '../../../assets/Images/avatars/Ramen.png';



import artBusiness from '../../../assets/hud/Business Card.png';
import artChance from '../../../assets/hud/Chance Card.png';
import artCommunity from '../../../assets/hud/Community Card.png';

function IconImg({ src, alt = '', className = 'w-5 h-5' }) {
  return <img src={src} alt={alt} className={`inline-block object-contain ${className}`} aria-hidden="true" />;
}

export default function GameHUD({
  /* existing props */
  playerName = "kevin_park",
  playerNumber = 2,
  netWorth = 5000,
  totalBusinesses = 10,
  goalLaps = 10,
  totalLaps = 15,
  salary = 2000,
  cardsCount = 4,
  businessWorth = 6000,
  loanBalance = 3000,
  assetsValue = 3500,
  currentBusiness = "ProMotion Gear",
  currency = 'R',

  /* NEW props */
  currentTileLabel = '—',
  onRoll = () => { },
  isMoving = false,

  /* NEW NEW: live footer data */
  playersSummary = [],        // [{id,name,position,laps,cash,active}]
  activePlayerId = null,      // 'p1' | 'p2' | ...

  // drawer carousel
  inventoryCards = [],

  // dice toast (number or null)
  diceToast = null,
}) {
  const [showInventory, setShowInventory] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [activeTab, setActiveTab] = useState('net-worth');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  const [balanceSheet, setBalanceSheet] = useState(null);
  const [positions, setPositions] = useState([]);
  const [businessesList, setBusinessesList] = useState([]);


  const computedNetWorth = netWorth;
  const availableCash = netWorth - assetsValue + loanBalance;

  const playerAvatars = { p1: playerIcon2, p2: playerIcon, p3: playerIcon3, p4: playerIcon4 };

   const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null;
  const [socket, setSocket] = useState(null);
  const error = (err) => console.error('Socket error:', err);
  const userId = user ? JSON.parse(user).id : null;
  const gameId = localStorage.getItem('gameId');


const avatarBank = [playerIcon, playerIcon2, playerIcon3, playerIcon4];
   useEffect(() => {
    const socket = getSocket(token, user?.id);
    setSocket(socket);
    socket.on('connect_error', (err) => {
      console.error('Socket connection failed:', err.message);
    });

    return () => socket.off("connect_error", error);
  }, [token, user]);

    useEffect(() => {
    if (socket && gameId && userId) {
      // fetchGameState(gameId);
      // fetchBalanceSheet(gameId, userId);
      // fetchPlayerPositions(gameId);
      // fetchPlayerCards(gameId, userId);
      // fetchPlayerBusinesses(gameId, userId);
    }
  }, [socket, gameId, userId]);


  const leaveGame = async () => {
    try {
      if (socket && gameId && userId) {
        const res = await fetch(`http://localhost:5000/api/game/leave`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ gameId, userId })
        });

        if (!res.ok) {
          throw new Error('Failed to leave game');
        }
        console.log('Leave game response:', res);
        socket.emit('leaveGame', { gameId, userId });
        localStorage.removeItem('gameId');
        window.location.href = '/lobby'; 
      }
    } catch (error) {
      console.error('Error leaving game:', error);
    }

  };

   const { hud, rollDice, endTurn, refresh, loading , businesses} = useHudData(gameId, socket);
  const cards = inventoryCards?.length ? inventoryCards : [
    { deck: 'Chance', title: 'Big Recession', desc: 'Salary payout reduced this round.' },
    { deck: 'Community', title: 'Local Grant', desc: '+R500 stipend.' },
  ];

  const currentCard = cards[Math.max(0, Math.min(cardIndex, cards.length - 1))];


  // Fallback footer if no playersSummary passed
  const footerPlayers = (hud?.playersSummary && hud?.playersSummary.length)
    ? hud?.playersSummary
    : [ ];

  return (
    <>
      {/* TOP BAR */}
      <div className="pointer-events-auto fixed top-18 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex items-center gap-6 px-5 py-3 rounded-2xl bg-white/95 border shadow-lg">
          {/* Player Icon */}
          <div className="flex items-center gap-2">
            <img src={playerIcon} alt="Player" className="w-10 h-10 rounded-full border-2 border-sky-400" />
            <span className="font-semibold text-sky-700">{hud?.playerName}</span>
          </div>

          {/* Net Worth */}
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-lg text-lime-500" />
            <span>Net Worth: <span className="font-bold">{currency}{(hud?.netWorth ?? 0).toLocaleString()}</span></span>
          </div>

          {/* Businesses */}
          <div className="flex items-center gap-2">
            <FaBuilding className="text-lg text-sky-500" />
            <span>{businesses} Businesses</span>
          </div>

          {/* Goal Laps */}
          <div className="flex items-center gap-2 bg-sky-100 px-3 py-1 rounded-full">
            <FaCrown className="text-amber-500" />
            <span className="text-sm font-semibold">Laps: {hud?.goalLaps ?? 0}/{hud?.totalLaps ?? 0}</span>
          </div>

          {/* Roll Button */}
          {/* <button
            onClick={onRoll}
            disabled={isMoving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaDice className="text-lg" />
            Dice
          </button> */}

          {/* Inventory Button */}
          <button
            onClick={() => {
              setShowInventory(true);
              setDrawerOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow"
          >
            <FaBox /> Inventory
          </button>
        </div>
      </div>

      {/* ===== Top Right: Leave Game Button ===== */}
      <div className="absolute top-4 right-6 pointer-events-auto">
        <button  onClick={async () => {
            await leaveGame();
          }}
        className="flex items-center gap-2 bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-colors">
          <FaSignOutAlt className="text-lg" />
          Leave Game
        </button>
      </div>

      {/* SIDE PANELS */}
      {/* LEFT: Side Panel */}
      <div className="pointer-events-auto fixed top-36 left-4 z-[1000]">
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
              <span className="font-semibold text-gray-800">{currency} {(hud?.netWorth ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-base text-sky-600" />
                <span className="text-gray-600">Salary</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {(hud?.salary ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaCreditCard className="text-base text-sky-600" />
                <span className="text-gray-600">Cards</span>
              </div>
              <span className="font-semibold text-gray-800">{hud?.cardsCount} Cards</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaBuilding className="text-base text-sky-600" />
                <span className="text-gray-600">Business Worth</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {hud?.businessWorth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaHandHoldingUsd className="text-base text-sky-600" />
                <span className="text-gray-600">Loan Balance</span>
              </div>
              <span className="font-semibold text-red-600">{currency} {hud?.loanBalance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 text-sm items-center">
              <div className="flex items-center gap-2">
                <FaPiggyBank className="text-base text-sky-600" />
                <span className="text-gray-600">Assets Value</span>
              </div>
              <span className="font-semibold text-gray-800">{currency} {hud?.assetsValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Side Panel */}
      <div className="pointer-events-auto fixed top-36 right-4 z-[1000] w-[360px] space-y-4">
        {/* Manage Business Tile */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Current Business</div>
          </div>
          <div className="p-4 bg-sky-50 text-sm space-y-3">
            <div className="text-center py-2 bg-white rounded-xl font-semibold text-sky-700 border border-sky-200">
              {businesses?.length > 0 ? businesses[0].name : currentBusiness}
            </div>
            <div className="flex justify-between py-1.5 items-center">
              <span className="text-gray-600">Business Worth</span>
              <span className="font-semibold text-gray-800">{currency}{businesses?.length > 0 ? businesses[0].purchasePrice.toLocaleString() : 0}</span>
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
      </div>

      {/* BOTTOM FOOTER: players & active highlight */}
      <div className="fixed bottom-0 inset-x-0 z-[950]">
        <div className="mx-auto max-w-6xl px-3 py-3 bg-white/90 backdrop-blur border-t rounded-t-2xl shadow">
          <div className="flex items-stretch gap-3 overflow-x-auto">
            {footerPlayers.map(p => {
              const active = activePlayerId ? (p.id === activePlayerId) : !!p.active;
              return (
                <div
                  key={p.id}
                  className={`min-w-[100px] flex-1 rounded-2xl border p-3 bg-white shadow-sm ${active ? 'ring-4 ring-sky-400' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={playerAvatars[p.id] || playerIcon} alt={p.name} className="w-10 h-10 rounded-full border object-cover" />
                    <div className="leading-tight">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-500">Lap {p.laps ?? 0} / {totalLaps}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700 flex justify-between">
                    <span>Tile: {p.position ?? 0}</span>
                    <span>Cash: {currency}{(p.cash ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === Right Drawer: Inventory with Carousel === */}
      {drawerOpen && showInventory && (
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