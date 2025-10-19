// src/components/game/MockGame.jsx
import React, { useState, useEffect, useMemo } from 'react';
import GameHUD from '../ui/HUD/GameHUD';
import HUDPortal from '../ui/HUD/HUDPortal';
import GameBoardViewer from '../viewers/GameBoardViewer';
import GameLobby from '../lobby/GameLobby';
import BoardTileModal from '../ui/BoardTileModal';
import { BOARD_TILES, BOARD_ORDER } from '../data/boardTiles';
const { CURRENCY } = require('../core/rules');
const { calculateNet } = require('../core/selectors');
const { applyTileEffect, applyCardEffect } = require('../core/tileEffects');
const { makeAIDecision } = require('../core/ai');
const { CARD_DECKS } = require('../core/cardDecks');
const Results = require('../ui/Results').default;

// Constants
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to get user data from localStorage
const getLoggedInUser = () => {
  try {
    // Try different possible localStorage keys where user data might be stored
    const userDataKeys = ['user', 'currentUser', 'loggedInUser', 'authUser'];

    for (const key of userDataKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData && userData.id) {
          return userData;
        }
      }
    }

    // Fallback: check for common authentication patterns
    const authToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (authToken) {
      // Try to extract user info from token or other storage
      const userInfoKeys = ['userInfo', 'profile', 'userProfile'];
      for (const key of userInfoKeys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          const userData = JSON.parse(stored);
          if (userData && userData.id) {
            return userData;
          }
        }
      }
    }
  } catch (error) {
    console.warn('Error reading user data from localStorage:', error);
  }

  // Default fallback user
  return {
    id: 'user_' + Date.now(),
    username: 'Player',
    displayName: 'Player',
    characterKey: 'Cowboy'
  };
};

// Generate consistent random colors for each player based on their ID
const generatePlayerColors = (players) => {
  const colors = [
    'bg-rose-500', 'bg-sky-500', 'bg-lime-500', 'bg-amber-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
  ];

  const playerColors = {};
  players.forEach((player, index) => {
    playerColors[player.id] = colors[index % colors.length];
  });

  return playerColors;
};

// Enhanced card deck system from MockGameSimulation
< CARD_DECKS />

// Results Component

// Main MockGame Component
export default function MockGame() {
  const [phase, setPhase] = useState('lobby');
  const [settings, setSettings] = useState({ players: 4, laps: 5 });
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentCard, setCurrentCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [tilePopup, setTilePopup] = useState({ open: false, data: null });
  const [diceResult, setDiceResult] = useState(null);

  // Initialize players with localStorage user data for the "me" player
  const [players, setPlayers] = useState(() => {
    const loggedInUser = getLoggedInUser();

    const initialPlayers = [
      {
        id: 'p1', name: 'lily_rose', characterKey: 'Green_girl', pos: 0, laps: 0,
        cash: 10000, assetsValue: 1500, loanBalance: 500, salary: 2000,
        businesses: [], cards: [], flags: {}, inventory: {}, isBot: true
      },
      {
        id: 'p2',
        name: loggedInUser.displayName || loggedInUser.username || 'Player',
        characterKey: loggedInUser.characterKey || 'Cowboy',
        pos: 0, laps: 0,
        cash: 10000, assetsValue: 2000, loanBalance: 1000, salary: 2200,
        businesses: [], cards: [], flags: {}, inventory: {},
        isBot: false, // This is the human player
        userId: loggedInUser.id // Store the actual user ID
      },
      {
        id: 'p3', name: 'nile_waters', characterKey: 'Mr_suit', pos: 0, laps: 0,
        cash: 10000, assetsValue: 1200, loanBalance: 0, salary: 1800,
        businesses: [], cards: [], flags: {}, inventory: {}, isBot: true
      },
      {
        id: 'p4', name: 'man_person', characterKey: 'Kimono_girl', pos: 0, laps: 0,
        cash: 10000, assetsValue: 1800, loanBalance: 800, salary: 2100,
        businesses: [], cards: [], flags: {}, inventory: {}, isBot: true
      },
    ];

    // Reset business ownership
    Object.values(BOARD_TILES).forEach(tile => {
      if (tile.type === 'business') {
        tile.owner = null;
      }
    });

    return initialPlayers;
  });

  const everyoneDone = players.every(p => p.laps >= settings.laps);
  // Generate player colors
  const playerColors = useMemo(() => generatePlayerColors(players), [players]);


  const playersRef = React.useRef(players);
  const activePlayerIndexRef = React.useRef(activePlayerIndex);
  const phaseRef = React.useRef(phase);
  const everyoneDoneRef = React.useRef(everyoneDone);
  const autoPlayRef = React.useRef(autoPlay);
  const settingsRef = React.useRef(settings);

  // keep refs in sync
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { activePlayerIndexRef.current = activePlayerIndex; }, [activePlayerIndex]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { everyoneDoneRef.current = everyoneDone; }, [everyoneDone]);
  useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const currentPlayer = players[activePlayerIndex];

  // Hide viewer's roll button
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `[title="Roll Dice"]{display:none !important}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Enhanced executeTurn function with bot AI and card system from MockGameSimulation
  
const executeTurn = React.useCallback(() => {
  const phase = phaseRef.current;
  const idx = activePlayerIndexRef.current;
  const settings = settingsRef.current;
  const everyoneDone = everyoneDoneRef.current;

  if (phase !== 'playing' || everyoneDone) return;

  // bot "thinking" pause based on current player from ref (no state capture)
  const currentFromRef = playersRef.current[idx];
  const botDelay = currentFromRef?.isBot ? 1000 : 0;

  setIsMoving(true);

  // Roll dice now (stable) and show it
  const roll = randInt(1, 6);
  setDiceResult(roll);

  // Perform the turn after a short animation/think delay
  setTimeout(() => {
    setPlayers(prev => {
      // clone shallowly to keep React state rules
      const players = prev.map(p => ({
        ...p,
        flags: { ...(p.flags || {}) },
        businesses: [...(p.businesses || [])],
        cards: [...(p.cards || [])]
      }));

      const current = players[idx];
      if (!current) {
        setIsMoving(false);
        return prev; // nothing to do
      }

      // 1) Skip turn
      if (current.flags.skipTurn) {
        current.flags.skipTurn = 0;
        setIsMoving(false);
        setActivePlayerIndex(prevIdx => (prevIdx + 1) % players.length);
        return players;
      }

      // 2) Apply "advance" bonus from cards
      const advanceSpaces = current.flags.advanceSpaces || 0;
      const totalSpaces = roll + advanceSpaces;
      if (advanceSpaces) current.flags.advanceSpaces = 0;

      // 3) Move
      const oldPos = current.pos;
      const newPos = (oldPos + totalSpaces) % BOARD_ORDER.length;
      current.pos = newPos;

      // 4) Lap completion & salary
      if (oldPos + totalSpaces >= BOARD_ORDER.length) {
        current.laps += 1;
        let salary = current.salary || 0;
        if (current.flags.halfSalary) {
          salary = Math.floor(salary / 2);
          current.flags.halfSalary = 0;
        }
        current.cash += salary;

        if ((settings?.laps ?? Infinity) <= current.laps) {
          // mark player as finished if you track this
          current.finished = true;
          // you can update a "everyoneDoneRef" elsewhere if needed
        }
      }

      // 5) Tile effect
      const tile = BOARD_TILES[BOARD_ORDER[newPos]];
      if (tile) {
        applyTileEffect(current, tile, players);
        setTilePopup({ open: true, data: tile });

        // Simple AI purchase decision
        if (current.isBot && tile.action) {
          const decision = makeAIDecision(current, tile, players);
          if (decision === 'buy' && tile.action.type === 'buy') {
            applyTileEffect(current, tile, players);
          }
        }
      }

      // 6) Business income
      if (!current.flags.skipBizPayments && current.businesses.length > 0) {
        let incomePerBusiness = 400;
        if (current.flags.doubleBusiness) {
          incomePerBusiness *= 2;
          current.flags.doubleBusiness = 0;
        }
        let totalIncome = incomePerBusiness * current.businesses.length;
        if (current.flags.reduceBusiness) {
          totalIncome = Math.floor(totalIncome / 2);
          current.flags.reduceBusiness = 0;
        }
        current.cash += totalIncome;
      }
      if (current.flags.skipBizPayments) current.flags.skipBizPayments = 0;

      // 7) Bot uses a card if low on cash
      if (current.isBot && current.cards.length > 0 && current.cash < 3000) {
        const usable = current.cards.find(
          c => c.effect === 'earn' || c.effect === 'double_business'
        );
        if (usable) {
          applyCardEffect(current, usable, players);
          current.cards = current.cards.filter(c => c.id !== usable.id);
        }
      }

      // 8) Extra roll (don’t advance player)
      if (current.flags.extraRoll) {
        current.flags.extraRoll = 0;
        setIsMoving(false);
        return players;
      }

      // 9) Advance to next player
      setActivePlayerIndex(prevIdx => (prevIdx + 1) % players.length);
      setIsMoving(false);
      return players;
    });
  }, 1500 + botDelay); // animation + bot think time
}, []); // stable; reads live state from refs, updates via functional setState

  // Function to handle card usage
  const handleUseCard = (card) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(p => ({
        ...p,
        cards: [...p.cards]
      }));

      const currentPlayer = updatedPlayers[activePlayerIndex];
      applyCardEffect(currentPlayer, card, updatedPlayers);

      // Remove the used card
      currentPlayer.cards = currentPlayer.cards.filter(c => c.id !== card.id);

      setShowCardModal(false);

      return updatedPlayers;
    });
  };

  // Auto-play for demo
  useEffect(() => {
    if (autoPlay && phase === 'playing' && !everyoneDone) {
      const timer = setTimeout(executeTurn, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, phase, activePlayerIndex, everyoneDone, executeTurn]);


  // Game completion
  useEffect(() => {
    if (phase === 'playing' && everyoneDone) {
      setAutoPlay(false);
      setTimeout(() => setPhase('results'), 3000);
    }
  }, [phase, everyoneDone]);

  const startGame = (gameSettings) => {
    // Reset game state
    const resetPlayers = players.map(p => ({
      ...p,
      pos: 0,
      laps: 0,
      cash: 10000,
      businesses: [],
      cards: [],
      flags: {},
      inventory: {}
    }));

    Object.values(BOARD_TILES).forEach(tile => {
      if (tile.type === 'business') {
        tile.owner = null;
      }
    });

    setPlayers(resetPlayers);
    setSettings(gameSettings);
    setActivePlayerIndex(0);
    setPhase('playing');
  };

  const restartGame = () => {
    startGame(settings);
  };

  const returnToLobby = () => {
    setPhase('lobby');
  };

  const endGameImmediately = () => {
    // Force all players to complete their laps
    setPlayers(prevPlayers =>
      prevPlayers.map(p => ({
        ...p,
        laps: settings.laps
      }))
    );
    setAutoPlay(false);
    setPhase('results');
  };

  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <GameLobby
          currentPlayers={players.map(p => ({ ...p, ready: true }))}
          availableGames={[]}
          defaultPlayers={4}
          defaultLaps={5}
          onStart={startGame}
          onRefreshGames={() => Promise.resolve([])}
        />
      </div>
    );
  }

  if (phase === 'results') {
    <Results players={players} onRestart={restartGame} onLobby={returnToLobby} />;
  }

  const netWorth = calculateNet(currentPlayer);
  const playersSummary = players.map(p => ({
    id: p.id,
    name: p.name,
    position: p.pos,
    laps: p.laps,
    cash: p.cash,
    active: p.id === currentPlayer.id,
    color: playerColors[p.id] // Add color to player summary
  }));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="h-[72vh]">
        <GameBoardViewer
          selectedCharacter={currentPlayer.characterKey}
          pawns={players.map(p => ({
            key: p.id,
            character: p.characterKey,
            index: p.pos,
          }))}
        />
      </div>

      <HUDPortal>
        <GameHUD
          playerName={currentPlayer.name}
          playerNumber={activePlayerIndex + 1}
          netWorth={netWorth}
          timePlaying={`Turn ${players.reduce((acc, p) => acc + p.laps, 0)}`}
          goalLaps={currentPlayer.laps}
          totalLaps={settings.laps}
          businessWorth={currentPlayer.assetsValue}
          loanBalance={currentPlayer.loanBalance}
          assetsValue={currentPlayer.assetsValue}
          cardsCount={currentPlayer.cards.length}
          currentBusiness={currentPlayer.businesses.length > 0 ? BOARD_TILES[currentPlayer.businesses[0]]?.label : 'No Business'}
          currentTileLabel={BOARD_TILES[BOARD_ORDER[currentPlayer.pos]]?.label || 'Starting Tile'}
          currency={CURRENCY}
          onRoll={executeTurn}
          isMoving={isMoving}
          playersSummary={playersSummary}
          activePlayerId={currentPlayer.id}
          inventoryCards={currentPlayer.cards}
          diceToast={diceResult}
          playerColors={playerColors} // Pass colors to HUD
        />
      </HUDPortal>

      {/* RIGHT: Side Panel - Moved controls below Current Business */}
      <div className="pointer-events-auto fixed bottom-32 right-4 z-[1000] w-[360px] space-y-4">
        {/* Controls moved below Current Business */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
            <div className="text-sm font-extrabold tracking-wide">Game Controls</div>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-sm text-gray-700">
              <div className="flex justify-between mb-2">
                <span><strong>Active Player:</strong></span>
                <span className="font-bold text-sky-600">{currentPlayer.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span><strong>Lap:</strong></span>
                <span>{currentPlayer.laps}/{settings.laps}</span>
              </div>
              <div className="flex justify-between">
                <span><strong>Cash:</strong></span>
                <span>{CURRENCY}{currentPlayer.cash.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`flex-1 px-3 py-2 rounded-xl ${autoPlay ? 'bg-gray-500' : 'bg-green-500'} text-white font-semibold shadow hover:opacity-90`}
              >
                {autoPlay ? 'Pause Auto' : 'Resume Auto'}
              </button>

              <button
                onClick={endGameImmediately}
                className="flex-1 px-3 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600"
              >
                End Game
              </button>
            </div>

            {currentPlayer.cards.length > 0 && (
              <button
                onClick={() => {
                  setCurrentCard(currentPlayer.cards[0]);
                  setShowCardModal(true);
                }}
                className="w-full px-3 py-2 rounded-xl bg-purple-500 text-white font-semibold shadow hover:bg-purple-600"
              >
                Use Card ({currentPlayer.cards.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Modal */}
      {showCardModal && currentCard && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCardModal(false)} />
          <div className="relative z-10 bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-sky-700 mb-2">{currentCard.title}</h3>
            <p className="text-gray-600 mb-4">{currentCard.desc}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleUseCard(currentCard)}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
              >
                Use Card
              </button>
              <button
                onClick={() => setShowCardModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BoardTileModal
        open={tilePopup.open}
        data={tilePopup.data}
        onClose={() => setTilePopup({ open: false, data: null })}
        onAction={() => setTilePopup({ open: false, data: null })}
      />
    </div>
  );
}