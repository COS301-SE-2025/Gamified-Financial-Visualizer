// src/components/game/MockGame.jsx
import React, { useState, useEffect, useMemo } from 'react';
import GameHUD from './hud/GameHUD';
import HUDPortal from './hud/HUDPortal';
import GameBoardViewer from './GameBoardViewer';
import GameLobby from './lobby/GameLobby';
import BoardTileModal from './BoardTileModal';
import { BOARD_TILES, BOARD_ORDER } from './data/boardTiles';
import { FaTrophy } from 'react-icons/fa';

// Constants
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const currency = 'R';

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
const CARD_DECKS = {
  chance: [
    { id: 'chance1', title: 'Business Boom', desc: 'All your businesses earn double this round.', effect: 'double_business' },
    { id: 'chance2', title: 'Stock Windfall', desc: 'Your investments pay off. Collect R2,000.', effect: 'earn', amount: 2000 },
    { id: 'chance3', title: 'Tax Audit', desc: 'Pay R1,500 in unexpected taxes.', effect: 'pay', amount: 1500 },
    { id: 'chance4', title: 'Lucky Break', desc: 'Advance 3 spaces.', effect: 'advance', spaces: 3 },
    { id: 'chance5', title: 'Market Crash', desc: 'Lose R1,000 from your assets.', effect: 'pay', amount: 1000 },
  ],
  community: [
    { id: 'comm1', title: 'Birthday Gift', desc: 'Collect R500 from each player.', effect: 'collect_from_players', amount: 500 },
    { id: 'comm2', title: 'Charity Event', desc: 'Donate R300 to charity.', effect: 'pay', amount: 300 },
    { id: 'comm3', title: 'Lottery Win', desc: 'You win R1,500!', effect: 'earn', amount: 1500 },
    { id: 'comm4', title: 'Car Repair', desc: 'Pay R800 for unexpected repairs.', effect: 'pay', amount: 800 },
    { id: 'comm5', title: 'Salary Bonus', desc: 'Receive a R1,000 bonus.', effect: 'earn', amount: 1000 },
  ]
};

// Enhanced Tile Effects System from MockGameSimulation
function applyTileEffect(player, tile, allPlayers = []) {
  if (!tile || !tile.action) return { text: `Landed on ${tile?.label || 'unknown tile'}`, delta: 0 };

  const a = tile.action;

  // Handle business ownership and rent
  if (tile.type === 'business' && tile.owner && tile.owner !== player.id) {
    const owner = allPlayers.find(p => p.id === tile.owner);
    if (owner && !owner.bankrupt) {
      const rent = tile.cost ? Math.floor(tile.cost * 0.1) : 500;
      if (player.cash >= rent) {
        player.cash -= rent;
        owner.cash += rent;
        return {
          text: `Paid ${currency}${rent.toLocaleString()} rent to ${owner.name} for ${tile.label}`,
          delta: -rent
        };
      } else {
        return {
          text: `Cannot afford rent for ${tile.label}`,
          delta: 0
        };
      }
    }
  }

  switch (a.type) {
    case 'earn': {
      const amount = a.amount ?? 0;
      player.cash += amount;
      return { text: `Earned ${currency}${amount.toLocaleString()} from ${tile.label}`, delta: +amount };
    }
    case 'pay': {
      const cost = a.cost ?? 0;
      player.cash -= cost;
      return { text: `Paid ${currency}${cost.toLocaleString()} for ${tile.label}`, delta: -cost };
    }
    case 'buy': {
      const cost = a.cost ?? 0;
      if (player.cash >= cost && !tile.owner) {
        player.cash -= cost;
        player.assetsValue += Math.round(cost * 0.8);
        player.businesses.push(tile.id);
        tile.owner = player.id;
        return { text: `Bought ${tile.label} for ${currency}${cost.toLocaleString()}`, delta: -cost };
      } else if (tile.owner) {
        return { text: `${tile.label} is already owned`, delta: 0 };
      }
      return { text: `Couldn't afford ${tile.label}`, delta: 0 };
    }
    case 'pay_percent_salary': {
      const salary = player.salary ?? 2000;
      const cost = Math.round((a.percent ?? 0.15) * salary);
      player.cash -= cost;
      return { text: `Paid ${currency}${cost.toLocaleString()} tax`, delta: -cost };
    }
    case 'advance_roll': {
      player.flags.extraRoll = true;
      return { text: `Advance roll from ${tile.label}!`, delta: 0 };
    }
    case 'random_payout': {
      const min = a.min ?? 100;
      const max = a.max ?? 2500;
      const amt = randInt(min, max);
      player.cash += amt;
      return { text: `Random payout ${currency}${amt.toLocaleString()} on ${tile.label}`, delta: +amt };
    }
    case 'stock_random': {
      const min = a.min ?? -1500;
      const max = a.max ?? 3000;
      const amt = randInt(min, max);
      player.cash += amt;
      return { text: `Stock swing ${amt >= 0 ? 'up' : 'down'} ${currency}${Math.abs(amt).toLocaleString()}`, delta: amt };
    }
    case 'halve_salary': {
      player.flags.halfSalary = 1;
      return { text: `Salary halved next payout (${tile.label})`, delta: 0 };
    }
    case 'reduce_business_income_one_round': {
      player.flags.reduceBusiness = 1;
      return { text: `Business income reduced this round`, delta: 0 };
    }
    case 'skip_business_payments_one_round': {
      player.flags.skipBizPayments = 1;
      return { text: `Skip business payments this round (vacation)`, delta: 0 };
    }
    case 'skip_turn': {
      player.flags.skipTurn = 1;
      return { text: `Skipping next full turn (Volunteer Day)`, delta: 0 };
    }
    case 'insurance_then_draw_community': {
      const invest = a.invest ?? 500;
      player.cash -= invest;
      player.inventory.insurance = true;
      // Draw a community card immediately
      const communityCard = CARD_DECKS.community[randInt(0, CARD_DECKS.community.length - 1)];
      player.cards.push(communityCard);
      return {
        text: `Invested in insurance (${currency}${invest}) and drew: ${communityCard.title}`,
        delta: -invest
      };
    }
    case 'draw_community': {
      const card = CARD_DECKS.community[randInt(0, CARD_DECKS.community.length - 1)];
      player.cards.push(card);
      return { text: `Drew Community Card: ${card.title}`, delta: 0 };
    }
    case 'draw_chance': {
      const card = CARD_DECKS.chance[randInt(0, CARD_DECKS.chance.length - 1)];
      player.cards.push(card);
      return { text: `Drew Chance Card: ${card.title}`, delta: 0 };
    }
    default:
      return { text: `Landed on ${tile.label}`, delta: 0 };
  }
}

// Card System: Chance and Community card functionality from MockGameSimulation
function applyCardEffect(player, card, allPlayers = []) {
  switch (card.effect) {
    case 'earn':
      player.cash += card.amount;
      return { text: `Card: ${card.title} - Earned ${currency}${card.amount.toLocaleString()}`, delta: card.amount };
    case 'pay':
      player.cash -= card.amount;
      return { text: `Card: ${card.title} - Paid ${currency}${card.amount.toLocaleString()}`, delta: -card.amount };
    case 'double_business':
      player.flags.doubleBusiness = 1;
      return { text: `Card: ${card.title} - Business income doubled this round`, delta: 0 };
    case 'advance':
      player.flags.advanceSpaces = card.spaces;
      return { text: `Card: ${card.title} - Advance ${card.spaces} spaces`, delta: 0 };
    case 'collect_from_players':
      let totalCollected = 0;
      allPlayers.forEach(p => {
        if (p.id !== player.id && p.cash >= card.amount) {
          p.cash -= card.amount;
          totalCollected += card.amount;
        }
      });
      player.cash += totalCollected;
      return { text: `Card: ${card.title} - Collected ${currency}${totalCollected.toLocaleString()} from other players`, delta: totalCollected };
    default:
      return { text: `Card: ${card.title} played`, delta: 0 };
  }
}

// AI decision making for bot players from MockGameSimulation
function makeAIDecision(player, tile, allPlayers) {
  // Simple AI logic
  if (tile.type === 'business' && !tile.owner) {
    // Buy if they have enough cash and it's a good deal
    if (player.cash > tile.cost * 1.5) {
      return 'buy';
    }
  }

  // Use cards strategically
  if (player.cards.length > 0) {
    const positiveCards = player.cards.filter(card =>
      card.effect === 'earn' || card.effect === 'double_business' || card.effect === 'advance'
    );
    if (positiveCards.length > 0 && player.cash < 3000) {
      return 'use_card';
    }
  }

  return 'pass'; // Default action
}

// Results Component
function Results({ players, onRestart, onLobby }) {
  const calculateNet = (p) => p.cash + p.assetsValue - p.loanBalance;
  const sorted = [...players].sort((a, b) => calculateNet(b) - calculateNet(a));
  const winner = sorted[0];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-sky-700">Game Complete!</h1>
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl">
            <h2 className="text-2xl font-bold text-white"><FaTrophy/> Winner: {winner.name} <FaTrophy/></h2>
            <p className="text-white/90">Net Worth: {currency}{calculateNet(winner).toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border bg-white shadow">
          <table className="w-full">
            <thead className="bg-sky-100">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Player</th>
                <th className="text-left p-3">Laps</th>
                <th className="text-right p-3">Cash</th>
                <th className="text-right p-3">Net Worth</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id} className={i === 0 ? 'bg-amber-50 font-bold' : 'odd:bg-gray-50'}>
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.laps}</td>
                  <td className="p-3 text-right">{currency}{p.cash.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold">{currency}{calculateNet(p).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600"
          >
            Play Again
          </button>
          <button
            onClick={onLobby}
            className="px-6 py-3 rounded-2xl bg-sky-500 text-white font-semibold shadow hover:bg-sky-600"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // Generate player colors
  const playerColors = useMemo(() => generatePlayerColors(players), [players]);

  // Hide viewer's roll button
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `[title="Roll Dice"]{display:none !important}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const everyoneDone = players.every(p => p.laps >= settings.laps);
  const currentPlayer = players[activePlayerIndex];
  const currentTileId = useMemo(() => BOARD_ORDER[currentPlayer?.pos ?? 0], [currentPlayer]);
  const currentTile = BOARD_TILES[currentTileId];

  const advanceToNextPlayer = () => {
    setTimeout(() => {
      let nextIndex = (activePlayerIndex + 1) % players.length;

      // Skip bankrupt players
      let attempts = 0;
      while (players[nextIndex]?.cash <= 0 && attempts < players.length) {
        nextIndex = (nextIndex + 1) % players.length;
        attempts++;
      }

      setActivePlayerIndex(nextIndex);
      setIsMoving(false);
      setDiceResult(null);
    }, 1000);
  };

  // Enhanced executeTurn function with bot AI and card system from MockGameSimulation
  const executeTurn = async () => {
    if (everyoneDone || !currentPlayer) return;

    setIsMoving(true);

    // Bot players auto-play
    if (currentPlayer.isBot) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause for bot "thinking"
    }

    // Roll dice
    const roll = randInt(1, 6);
    setDiceResult(roll);

    setTimeout(() => {
      setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => ({
          ...p,
          flags: { ...p.flags },
          businesses: [...p.businesses],
          cards: [...p.cards]
        }));

        const currentPlayer = updatedPlayers[activePlayerIndex];
        if (!currentPlayer) return updatedPlayers;

        // Handle skip turn
        if (currentPlayer.flags.skipTurn) {
          currentPlayer.flags.skipTurn = 0;
          advanceToNextPlayer();
          return updatedPlayers;
        }

        // Apply advance from cards
        const advanceSpaces = currentPlayer.flags.advanceSpaces || 0;
        const totalSpaces = roll + advanceSpaces;
        if (advanceSpaces > 0) {
          currentPlayer.flags.advanceSpaces = 0;
        }

        const oldPos = currentPlayer.pos;
        const newPos = (currentPlayer.pos + totalSpaces) % BOARD_ORDER.length;
        currentPlayer.pos = newPos;

        // Lap completion
        if (oldPos + totalSpaces >= BOARD_ORDER.length) {
          currentPlayer.laps += 1;
          let salary = currentPlayer.salary;
          if (currentPlayer.flags.halfSalary) {
            salary = Math.floor(salary / 2);
            currentPlayer.flags.halfSalary = 0;
          }
          currentPlayer.cash += salary;

          if (currentPlayer.laps >= settings.laps) {
            // Player has finished the game
          }
        }

        // Process tile effect
        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          const effect = applyTileEffect(currentPlayer, tile, updatedPlayers);
          setTilePopup({ open: true, data: tile });

          // AI decision for bot players
          if (currentPlayer.isBot && tile.action) {
            const decision = makeAIDecision(currentPlayer, tile, updatedPlayers);
            if (decision === 'buy' && tile.action.type === 'buy') {
              applyTileEffect(currentPlayer, tile, updatedPlayers);
            }
          }
        }

        // Business income
        if (!currentPlayer.flags.skipBizPayments && currentPlayer.businesses.length > 0) {
          let incomePerBusiness = 400;
          if (currentPlayer.flags.doubleBusiness) {
            incomePerBusiness *= 2;
            currentPlayer.flags.doubleBusiness = 0;
          }

          let totalIncome = incomePerBusiness * currentPlayer.businesses.length;
          if (currentPlayer.flags.reduceBusiness) {
            totalIncome = Math.floor(totalIncome / 2);
            currentPlayer.flags.reduceBusiness = 0;
          }
          currentPlayer.cash += totalIncome;
        }

        if (currentPlayer.flags.skipBizPayments) {
          currentPlayer.flags.skipBizPayments = 0;
        }

        // Handle card usage for bots
        if (currentPlayer.isBot && currentPlayer.cards.length > 0) {
          const usableCards = currentPlayer.cards.filter(card =>
            card.effect === 'earn' || card.effect === 'double_business'
          );
          if (usableCards.length > 0 && currentPlayer.cash < 3000) {
            const cardToUse = usableCards[0];
            applyCardEffect(currentPlayer, cardToUse, updatedPlayers);
            currentPlayer.cards = currentPlayer.cards.filter(c => c.id !== cardToUse.id);
          }
        }

        // Handle extra roll
        if (currentPlayer.flags.extraRoll) {
          currentPlayer.flags.extraRoll = 0;
          setIsMoving(false);
          return updatedPlayers;
        }

        advanceToNextPlayer();
        return updatedPlayers;
      });
    }, 1500);
  };

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
  }, [autoPlay, phase, activePlayerIndex, everyoneDone]);

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
    return <Results players={players} onRestart={restartGame} onLobby={returnToLobby} />;
  }

  const calculateNet = (p) => p.cash + p.assetsValue - p.loanBalance;
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
          currency={currency}
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
                <span>{currency}{currentPlayer.cash.toLocaleString()}</span>
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