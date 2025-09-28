import React, { useEffect, useMemo, useState } from 'react';
import GameLobby from '../game/lobby/GameLobby';
import GameBoardViewer from '../game/GameBoardViewer';
import GameHUD from '../game/hud/GameHUD';
import GameLoader from './GameLoader';
import HUDPortal from '../game/hud/HUDPortal';
import BoardTileModal from '../game/BoardTileModal';
import { BOARD_TILES, BOARD_ORDER } from '../../components/game/data/boardTiles';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const currency = 'R';

// Enhanced card deck system
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

// Tile Effects System: What happens when players land on different board spaces
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

//  Card System: Chance and Community card functionality
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

const calculateNet = (p) => p.cash + p.assetsValue - p.loanBalance;


function Results({ players, onRestart }) {
  const sorted = [...players].sort((a, b) => calculateNet(b) - calculateNet(a));
  const winner = sorted[0];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-sky-700">Game Complete!</h1>
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl">
            <h2 className="text-2xl font-bold text-white">🏆 Winner: {winner.name} 🏆</h2>
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
                <th className="text-right p-3">Assets</th>
                <th className="text-right p-3">Loans</th>
                <th className="text-right p-3">Businesses</th>
                <th className="text-right p-3">Cards</th>
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
                  <td className="p-3 text-right">{currency}{p.assetsValue.toLocaleString()}</td>
                  <td className="p-3 text-right text-rose-600">{currency}{p.loanBalance.toLocaleString()}</td>
                  <td className="p-3 text-right">{p.businesses.length}</td>
                  <td className="p-3 text-right">{p.cards.length}</td>
                  <td className="p-3 text-right font-bold">{currency}{calculateNet(p).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition-colors"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}

// AI decision making for bot players: AI logic for buying properties and using cards
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

export default function MockGameSimulation() {
  // Phase Management: 'lobby', 'playing', 'results'
  const [phase, setPhase] = useState('lobby');
  const [settings, setSettings] = useState({ players: 4, laps: 1 });
  // Player Turn System: Whose turn it is and movement animation state
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [gameLog, setGameLog] = useState(['Game initialized']);

  // Enhanced player initialization with cards and better AI behavior
  // All player data (position, cash, assets, flags, etc.)
  const [players, setPlayers] = useState(() => {
    const initialPlayers = [
      {
        id: 'p1',
        name: 'lily_rose',
        characterKey: 'Green_girl',
        pos: 0,
        laps: 0,
        cash: 10000,
        assetsValue: 1500,
        loanBalance: 500,
        salary: 2000,
        businesses: [],
        cards: [],
        // doubleBusiness, skipTurn, halfSalary, etc.
        flags: {},
        inventory: {},
        isBot: true 
      },
      {
        id: 'p2',
        name: 'me',
        characterKey: 'Cowboy',
        pos: 0,
        laps: 0,
        cash: 10000,
        assetsValue: 2000,
        loanBalance: 1000,
        salary: 2200,
        businesses: [],
        cards: [],
        flags: {},
        inventory: {},
        isBot: false // Human player
      },
      {
        id: 'p3',
        name: 'nile_waters',
        characterKey: 'Mr_suit',
        pos: 0,
        laps: 0,
        cash: 10000,
        assetsValue: 1200,
        loanBalance: 0,
        salary: 1800,
        businesses: [],
        cards: [],
        flags: {},
        inventory: {},
        isBot: true
      },
      {
        id: 'p4',
        name: 'man_person',
        characterKey: 'Kimono_girl',
        pos: 0,
        laps: 0,
        cash: 10000,
        assetsValue: 1800,
        loanBalance: 800,
        salary: 2100,
        businesses: [],
        cards: [],
        flags: {},
        inventory: {},
        isBot: true
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

  const [tilePopup, setTilePopup] = useState({ open: false, data: null });
  const [autoPlay, setAutoPlay] = useState(true); // Auto-play for demo
  const [diceResult, setDiceResult] = useState(null);

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

  const addGameLog = (message) => {
    setGameLog(prev => [message, ...prev.slice(0, 50)]); // Keep last 50 messages
  };

  // Function to handle card usage (renamed from useCard to avoid hook naming convention)
  const handleUseCard = (card) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(p => ({
        ...p,
        cards: [...p.cards]
      }));

      const currentPlayer = updatedPlayers[activePlayerIndex];
      const cardEffect = applyCardEffect(currentPlayer, card, updatedPlayers);

      // Remove the used card
      currentPlayer.cards = currentPlayer.cards.filter(c => c.id !== card.id);

      addGameLog(`Card used: ${cardEffect.text}`);
      setShowCardModal(false);

      return updatedPlayers;
    });
  };

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

  // Enhanced turn function with bot AI and card system
  const executeTurn = async () => {
    if (everyoneDone || !currentPlayer) return;

    setIsMoving(true);
    addGameLog(`--- ${currentPlayer.name}'s turn ---`);

    // Bot players auto-play
    if (currentPlayer.isBot) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief pause for bot "thinking"
    }

    // Roll dice
    const roll = randInt(1, 6);
    setDiceResult(roll);
    addGameLog(`${currentPlayer.name} rolled a ${roll}`);

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
          addGameLog(`${currentPlayer.name} skips a turn`);
          advanceToNextPlayer();
          return updatedPlayers;
        }

        // Apply advance from cards
        const advanceSpaces = currentPlayer.flags.advanceSpaces || 0;
        const totalSpaces = roll + advanceSpaces;
        if (advanceSpaces > 0) {
          addGameLog(`${currentPlayer.name} advances ${advanceSpaces} extra spaces from card`);
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
          addGameLog(`${currentPlayer.name} completed lap ${currentPlayer.laps}! (+${currency}${salary.toLocaleString()} salary)`);

          if (currentPlayer.laps >= settings.laps) {
            addGameLog(`🎉 ${currentPlayer.name} has finished the game!`);
          }
        }

        // Process tile effect
        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          const effect = applyTileEffect(currentPlayer, tile, updatedPlayers);
          addGameLog(`${currentPlayer.name} landed on ${tile.label}. ${effect.text}`);
          setTilePopup({ open: true, data: tile });

          // AI decision for bot players
          if (currentPlayer.isBot && tile.action) {
            const decision = makeAIDecision(currentPlayer, tile, updatedPlayers);
            if (decision === 'buy' && tile.action.type === 'buy') {
              const buyEffect = applyTileEffect(currentPlayer, tile, updatedPlayers);
              addGameLog(`🤖 ${currentPlayer.name} decided to buy: ${buyEffect.text}`);
            }
          }
        }

        // Business income
        if (!currentPlayer.flags.skipBizPayments && currentPlayer.businesses.length > 0) {
          let incomePerBusiness = 400;
          if (currentPlayer.flags.doubleBusiness) {
            incomePerBusiness *= 2;
            currentPlayer.flags.doubleBusiness = 0;
            addGameLog(`${currentPlayer.name}'s business income was doubled this round!`);
          }

          let totalIncome = incomePerBusiness * currentPlayer.businesses.length;
          if (currentPlayer.flags.reduceBusiness) {
            totalIncome = Math.floor(totalIncome / 2);
            currentPlayer.flags.reduceBusiness = 0;
          }
          currentPlayer.cash += totalIncome;
          addGameLog(`${currentPlayer.name} earned ${currency}${totalIncome.toLocaleString()} from ${currentPlayer.businesses.length} businesses`);
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
            const cardEffect = applyCardEffect(currentPlayer, cardToUse, updatedPlayers);
            currentPlayer.cards = currentPlayer.cards.filter(c => c.id !== cardToUse.id);
            addGameLog(`🤖 ${currentPlayer.name} used card: ${cardEffect.text}`);
          }
        }

        // Handle extra roll
        if (currentPlayer.flags.extraRoll) {
          currentPlayer.flags.extraRoll = 0;
          addGameLog(`${currentPlayer.name} gets an extra roll!`);
          setIsMoving(false);
          return updatedPlayers;
        }

        advanceToNextPlayer();
        return updatedPlayers;
      });
    }, 1500);
  };

  // Auto-play for demo
  useEffect(() => {
    if (autoPlay && phase === 'playing' && !everyoneDone) {
      const timer = setTimeout(executeTurn, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, phase, players, activePlayerIndex, everyoneDone]);

  // Game completion
  useEffect(() => {
    if (phase === 'playing' && everyoneDone) {
      setAutoPlay(false);
      addGameLog('🎊 Game completed! All players have finished their laps.');
      setTimeout(() => setPhase('results'), 3000);
    }
  }, [phase, everyoneDone]);

  const restartGame = () => {
    setPhase('lobby');
    setAutoPlay(false);
    setActivePlayerIndex(0);
    setGameLog(['Game restarted']);
    setLoadingPhase(false);
    setLoadingProgress(0);
  };

  const startFromLobby = (gameSettings) => {
    setLoadingPhase(true);
    setLoadingProgress(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);

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
          setGameLog(['Game started!']);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const handleLoaderComplete = () => {
    setLoadingPhase(false);
    setPhase('playing');
    addGameLog('Game loaded! Starting now...');
  };

  // Render logic
  if (phase === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <GameLobby
          highestScore={12345}
          totalPoints={420}
          currentPlayers={players.map(p => ({ ...p, ready: true }))}
          availableGames={[]}
          defaultPlayers={4}
          defaultLaps={5}
          onStart={startFromLobby}
          onRefreshGames={() => Promise.resolve([])}
        />
      </div>
    );
  }

  if (loadingPhase) {
    return (
      <GameLoader
        players={players}
        gameSettings={settings}
        loadingProgress={loadingProgress}
        onComplete={handleLoaderComplete}
      />
    );
  }

  if (phase === 'results') {
    return <Results players={players} onRestart={restartGame} />;
  }

  const netWorth = calculateNet(currentPlayer);
  const playersSummary = players.map(p => ({
    id: p.id,
    name: p.name,
    position: p.pos,
    laps: p.laps,
    cash: p.cash,
    active: p.id === currentPlayer.id
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
          timePlaying={`Turn ${gameLog.length}`}
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
        />
      </HUDPortal>

      {/* Enhanced Game Controls Panel */}
      <div className="fixed top-24 right-6 z-[1000] w-[380px] space-y-3">
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
            <div className="text-sm font-extrabold tracking-wide">Game Controls</div>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
              <div><b>Active Player:</b></div>
              <div className="font-bold text-sky-600">{currentPlayer.name}</div>

              <div><b>Tile:</b></div>
              <div>{currentTile?.label ?? '—'}</div>

              <div><b>Lap:</b></div>
              <div>{currentPlayer.laps}/{settings.laps}</div>

              <div><b>Cash:</b></div>
              <div>{currency}{currentPlayer.cash.toLocaleString()}</div>

              <div><b>Businesses:</b></div>
              <div>{currentPlayer.businesses.length}</div>

              <div><b>Cards:</b></div>
              <div>{currentPlayer.cards.length}</div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={executeTurn}
                disabled={isMoving || everyoneDone || currentPlayer.isBot}
                className="px-3 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-500 disabled:opacity-50"
              >
                Roll Dice
              </button>

              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`px-3 py-2 rounded-xl ${autoPlay ? 'bg-gray-500' : 'bg-emerald-500'
                  } text-white font-semibold shadow hover:opacity-90`}
              >
                {autoPlay ? 'Pause Auto' : 'Resume Auto'}
              </button>

              {currentPlayer.cards.length > 0 && (
                <button
                  onClick={() => {
                    setCurrentCard(currentPlayer.cards[0]);
                    setShowCardModal(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-500 text-white font-semibold shadow hover:bg-purple-600"
                >
                  Use Card
                </button>
              )}

              <button
                onClick={() => setPhase('results')}
                className="px-3 py-2 rounded-xl bg-rose-500 text-white font-semibold shadow hover:bg-rose-600"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Game Log */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white max-h-[40vh]">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white flex justify-between items-center">
            <div className="text-sm font-extrabold tracking-wide">Game Log</div>
            <div className="text-xs">Laps: {settings.laps}</div>
          </div>
          <div className="p-3 space-y-2 overflow-auto max-h-[32vh]">
            {gameLog.length === 0 ? (
              <div className="text-sm text-gray-500">Game starting...</div>
            ) : gameLog.map((line, i) => (
              <div key={i} className="text-sm p-2 bg-gray-50 rounded-lg border-l-4 border-sky-400">
                {line}
              </div>
            ))}
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