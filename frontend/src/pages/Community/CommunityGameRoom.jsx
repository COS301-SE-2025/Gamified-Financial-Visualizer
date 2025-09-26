// src/pages/Community/CommunityGameRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import GameHUD from '../../components/game/hud/GameHUD';
import HUDPortal from '../../components/game/hud/HUDPortal';
import GameBoardViewer from '../../components/game/GameBoardViewer';
import GameLobby from '../../components/game/lobby/GameLobby';
import { BOARD_TILES, BOARD_ORDER } from '../../components/game/data/boardTiles';
import { FaInfoCircle, FaMoneyBillWave, FaStore, FaHome, FaUniversity, FaTree, FaStar, FaExclamationTriangle } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useGLTF } from '@react-three/drei';
import { useHudData } from '../../components/game/hooks/HudData';

useGLTF.preload('/game/Monopoly_Game.glb');

// Game simulation logic (moved from MockGameSimulation)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const currency = 'R';

// Tile Sidebar Component
function TileSidebar({ tile, isOpen, onClose }) {
  if (!isOpen || !tile) return null;

  const getTileIcon = () => {
    switch (tile.type) {
      case 'business': return <FaStore className="text-blue-500" />;
      case 'property': return <FaHome className="text-green-500" />;
      case 'tax': return <FaMoneyBillWave className="text-red-500" />;
      case 'bank': return <FaUniversity className="text-yellow-500" />;
      case 'nature': return <FaTree className="text-emerald-500" />;
      case 'bonus': return <FaStar className="text-amber-500" />;
      case 'penalty': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getActionDescription = () => {
    if (!tile.action) return "No special action";

    const action = tile.action;
    switch (action.type) {
      case 'earn': return `Earn ${currency}${action.amount?.toLocaleString() || '0'}`;
      case 'pay': return `Pay ${currency}${action.cost?.toLocaleString() || '0'}`;
      case 'buy': return `Buy for ${currency}${action.cost?.toLocaleString() || '0'}`;
      case 'pay_percent_salary': return `Pay ${(action.percent || 0.15) * 100}% of salary`;
      case 'advance_roll': return 'Get an extra roll!';
      case 'random_payout': return `Random payout: ${currency}${action.min || 100}-${currency}${action.max || 2500}`;
      case 'stock_random': return 'Stock market fluctuation';
      case 'halve_salary': return 'Salary halved next payout';
      case 'reduce_business_income_one_round': return 'Business income reduced this round';
      case 'skip_business_payments_one_round': return 'Skip business payments this round';
      case 'skip_turn': return 'Skip next turn';
      case 'insurance_then_draw_community': return `Invest ${currency}${action.invest || 500} in insurance`;
      default: return 'Special action';
    }
  };

  return (
    <div className="fixed left-4 top-24 z-[1000] w-80 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-2xl">
        <div className="text-2xl">{getTileIcon()}</div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">{tile.label}</h3>
          <p className="text-sm text-gray-600 capitalize">{tile.type}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Description */}
        {tile.description && (
          <div>
            <p className="text-sm text-gray-700 leading-relaxed">{tile.description}</p>
          </div>
        )}

        {/* Action Info */}
        <div className="bg-blue-50/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <FaInfoCircle className="text-blue-500" />
            <span className="font-semibold text-sm text-blue-800">Tile Action</span>
          </div>
          <p className="text-sm text-blue-700">{getActionDescription()}</p>
        </div>

        {/* Cost/Rent Info */}
        {tile.cost && (
          <div className="bg-green-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FaMoneyBillWave className="text-green-500" />
              <span className="font-semibold text-sm text-green-800">
                {tile.type === 'business' ? 'Purchase Price' : 'Cost'}
              </span>
            </div>
            <p className="text-lg font-bold text-green-700">{currency}{tile.cost.toLocaleString()}</p>
          </div>
        )}

        {/* Ownership Info */}
        {tile.owner && (
          <div className="bg-amber-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FaStore className="text-amber-500" />
              <span className="font-semibold text-sm text-amber-800">Owned by</span>
            </div>
            <p className="text-sm font-medium text-amber-700">Player {tile.owner}</p>
            {tile.cost && (
              <p className="text-xs text-amber-600 mt-1">
                Rent: {currency}{Math.floor(tile.cost * 0.1).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Tile Type Specific Info */}
        {tile.type === 'business' && !tile.owner && (
          <div className="bg-purple-50/50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaStore className="text-purple-500" />
              <span className="font-semibold text-sm text-purple-800">Available for Purchase</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
      return { text: `Invested in insurance (${currency}${invest}) and drew a community card`, delta: -invest };
    }
    default:
      return { text: `Landed on ${tile.label}`, delta: 0 };
  }
}

const calculateNet = (p) => p.cash + p.assetsValue - p.loanBalance;

function Results({ players, onRestart, onReturnToLobby }) {
  const sorted = [...players].sort((a, b) => calculateNet(b) - calculateNet(a));
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center text-sky-700">Game Results</h1>
        <p className="text-gray-600 text-center">Leaderboard after completing the game.</p>

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
            onClick={onReturnToLobby}
            className="px-6 py-3 rounded-2xl bg-sky-500 text-white font-semibold shadow hover:bg-sky-600 transition-colors"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    </div>
  );
}

const CommunityGameRoom = () => {
  const [gamePhase, setGamePhase] = useState('lobby');
  const [gameSettings, setGameSettings] = useState({ players: 4, laps: 5 });
  const [activePlayer, setActivePlayer] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentTile, setCurrentTile] = useState(null);
  const [showTileSidebar, setShowTileSidebar] = useState(false);
  const [gameLog, setGameLog] = useState([]);
  const [roomCode, setRoomCode] = useState('F1N4NC3');
  const [username, setUsername] = useState('Player' + Math.floor(Math.random() * 1000));
 const [gameId, setGameId] = useState(localStorage.getItem('gameId'))
  const navigate = useNavigate();
  const gameContainerRef = useRef(null);
const [socket, setSocket] = useState(null);
   const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
  const lobbyId = localStorage.getItem('lobbyId');

  const [players, setPlayers] = useState([]);
 const apiCall = async (endpoint, options = {}) => {
       // console.log('API Call:', endpoint, options);
        const response = await fetch(`http://localhost:5000/api/game${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API call failed');
        }

        return response.json();
    };

  const fetchGameState = async (gameIdd) => {
  try {
    const res = await fetch(`http://localhost:5000/api/game/state/${gameIdd}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });

    const data = await res.json();
    if (data.success) {
      // Set state for game data
      setPlayers(data.gameState.players);
      setGamePhase(data.gameState.gamePhase);
      setActivePlayer(data.gameState.currentPlayerId);
    }
  } catch (error) {
    console.error('Error fetching game state:', error);
  }
};

useEffect( () => {
  const fetchData = async () => {
    if (gameId) {
    fetchGameState(gameId);
    }
  };

  fetchData();
}, [gameId, user]);

  // Initialize players and reset business ownership
  
/*
   useEffect(() => {
    // Initialize socket connection
     if (!user) return; 

    const socketConnection = io('http://localhost:5000', {
      auth: { token: user?.token, userId: user?.id }
    });
    
    setSocket(socketConnection);

    // Listen for game state updates
    socketConnection.on('gameStateUpdated', (data) => {
      setPlayers(data.players);
      setActivePlayer(data.activePlayer);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [user]);

 */
  // Lock page scroll only while playing
  useEffect(() => {
    if (gamePhase === 'playing') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [gamePhase]);

  // Hide viewer's roll button
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `[title="Roll Dice"]{display:none !important}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const everyoneDone = players.every(p => p.laps >= gameSettings.laps);

  // Enhanced turn function with proper state handling
  const stepTurn = () => {
    if (everyoneDone || !players[activePlayer]) return;

    setIsMoving(true);

    setTimeout(() => {
      setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => ({
          ...p,
          flags: { ...p.flags },
          businesses: [...p.businesses]
        }));

        const currentPlayer = updatedPlayers[activePlayer];
        if (!currentPlayer) return updatedPlayers;

        // Handle skip turn
        if (currentPlayer.flags.skipTurn) {
          currentPlayer.flags.skipTurn = 0;
          setGameLog(prevLog => [`${currentPlayer.name} skips a turn`, ...prevLog]);
          setActivePlayer(prevActive => (prevActive + 1) % gameSettings.players);
          setIsMoving(false);
          return updatedPlayers;
        }

        // Roll dice
        const baseRoll = randInt(1, 6);
        let roll = baseRoll;
        if (currentPlayer.businesses.length >= 2 && Math.random() < 0.3) {
          roll += 1;
          setGameLog(prevLog => [`${currentPlayer.name} gets +1 roll bonus from businesses!`, ...prevLog]);
        }

        const oldPos = currentPlayer.pos;
        const newPos = (currentPlayer.pos + roll) % BOARD_ORDER.length;
        currentPlayer.pos = newPos;

        // Lap completion
        if (oldPos + roll >= BOARD_ORDER.length) {
          currentPlayer.laps += 1;
          let salary = currentPlayer.salary;
          if (currentPlayer.flags.halfSalary) {
            salary = Math.floor(salary / 2);
            currentPlayer.flags.halfSalary = 0;
          }
          currentPlayer.cash += salary;
          setGameLog(prevLog => [
            `${currentPlayer.name} completed lap ${currentPlayer.laps}! (+${currency}${salary.toLocaleString()} salary)`,
            ...prevLog
          ]);
        }

        // Process tile effect
        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          const effect = applyTileEffect(currentPlayer, tile, updatedPlayers);
          setGameLog(prevLog => [
            `${currentPlayer.name} rolled ${roll} and landed on ${tile.label}. ${effect.text}`,
            ...prevLog
          ]);

          // Show tile sidebar instead of modal
          setCurrentTile(tile);
          setShowTileSidebar(true);

          // Auto-hide sidebar after 5 seconds
          setTimeout(() => {
            setShowTileSidebar(false);
          }, 5000);
        }

        // Business income
        if (!currentPlayer.flags.skipBizPayments && currentPlayer.businesses.length > 0) {
          const incomePerBusiness = 400;
          let totalIncome = incomePerBusiness * currentPlayer.businesses.length;
          if (currentPlayer.flags.reduceBusiness) {
            totalIncome = Math.floor(totalIncome / 2);
            currentPlayer.flags.reduceBusiness = 0;
          }
          currentPlayer.cash += totalIncome;
          setGameLog(prevLog => [
            `${currentPlayer.name} earned ${currency}${totalIncome.toLocaleString()} from ${currentPlayer.businesses.length} businesses`,
            ...prevLog
          ]);
        }

        if (currentPlayer.flags.skipBizPayments) {
          currentPlayer.flags.skipBizPayments = 0;
        }

        // Handle extra roll
        if (currentPlayer.flags.extraRoll) {
          currentPlayer.flags.extraRoll = 0;
          setGameLog(prevLog => [`${currentPlayer.name} gets an extra roll!`, ...prevLog]);
          setIsMoving(false);
          return updatedPlayers;
        }

        // Move to next player
        setActivePlayer(prevActive => (prevActive + 1) % gameSettings.players);
        setIsMoving(false);
        return updatedPlayers;
      });
    }, 800);
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay || gamePhase !== 'playing' || everyoneDone) return;
    const timer = setTimeout(stepTurn, 1200);
    return () => clearTimeout(timer);
  }, [autoPlay, gamePhase, players, activePlayer, gameSettings, everyoneDone]);

  // Game completion
  useEffect(() => {
    if (gamePhase === 'playing' && everyoneDone) {
      setAutoPlay(false);
      setTimeout(() => setGamePhase('results'), 1000);
    }
  }, [gamePhase, everyoneDone]);

  const startFromLobby = (settings, character) => {
      setGamePhase('playing');
localStorage.removeItem('gamePhase');
localStorage.setItem('gamePhase', 'playing');
    // Proper reset with business ownership clearing
    let resetPlayers = players.map(p => ({
      ...p,
      pos: 0,
      laps: 0,
      cash: 10000,
      businesses: [],
      flags: {},
      inventory: {}
    }));

    // Clear business ownership
    Object.values(BOARD_TILES).forEach(tile => {
      if (tile.type === 'business') {
        tile.owner = null;
      }
    });

    setPlayers(resetPlayers);
    setGameSettings(settings);
    setActivePlayer(0);
    setGameLog(['Game started!']);
    setShowTileSidebar(false);
 //   localStorage.setItem('gamePhase', 'playing');

    // Emit socket event for multiplayer
   // socket.emit('startGame');
   // call start game api
   if(localStorage.getItem('gameId')){
   fetchGameState(localStorage.getItem('gameId'));
   }
  }

  const createRoom = () => {
    if (!username) return alert('Please enter a username');
  //  socket.emit('createRoom', { host: 'currentPlayer', username, settings: gameSettings });
  };

  const joinRoom = () => {
    if (!username || !roomCode) return console.error('Please enter both username and room code');
  //  socket.emit('joinRoom', { roomCode, username, playerId: 'currentPlayer' });
  };

  const restartGame = () => {
    setGamePhase('playing');
    startFromLobby(gameSettings);
  };

  const returnToLobby = () => {
    setGamePhase('lobby');
  };

  const currentPlayer = players[activePlayer];
 // const netWorth = calculateNet(currentPlayer);
  const playersSummary = players.map(p => ({
    id: p.id,
    name: p.name,
    position: p.pos,
    laps: p.laps,
    cash: p.cash,
    active: p.id === currentPlayer?.id
  }));

  if (gamePhase === 'results') {
    return (
      <Results
        players={players}
        onRestart={restartGame}
        onReturnToLobby={returnToLobby}
      />
    );
  }

  
  return (
    <>
      {/* Slight spacer so content starts just under the fixed navbar */}
      <div style={{ height: 'calc(var(--app-header-h, 75px) - 70px)' }} />
      {
        gamePhase === 'lobby' && !localStorage.getItem('gameId') ? (
          // Lobby: scroll locally if tall
            <div className="px-6 h-[calc(100vh-var(--app-header-h,75px)- 70px)] overflow-auto pb-[max(24px,env(safe-area-inset-bottom))]">
          <GameLobby
            defaultMode="multiplayer"
            defaultPlayers={4}
            defaultLaps={4}
            onQuickJoin={() => { joinRoom(); }}
            onCreateRoom={() => { createRoom(); }}
            onJoinWithCode={(code) => { setRoomCode(code || roomCode); joinRoom(); }}
            onWatchTutorial={() => console.log('open tutorial modal')}
            onReadRules={() => console.log('open rules modal')}
            onStart={startFromLobby}
            currentPlayers={players.map(p => ({ ...p, ready: true }))}
            availableGames={[]}
          />
        </div>
      ) : localStorage.getItem('gameId') ? (
        // Playing: fill viewport minus navbar (and safe area)
        <div
          ref={gameContainerRef}
          className="relative overflow-hidden"
          style={{
            height: 'calc(100vh - var(--app-header-h, 75px) - env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="h-[72vh]">
            <GameBoardViewer
              selectedCharacter={currentPlayer?.characterKey}
              pawns={players.map(p => ({
                key: p.id,
                character: p.characterKey,
                index: p.pos,
              }))}
            />
          </div>

          {/* Tile Sidebar */}
          <TileSidebar
            tile={currentTile}
            isOpen={showTileSidebar}
            onClose={() => setShowTileSidebar(false)}
          />

          {/* HUD Portal */}
          <HUDPortal>
            <GameHUD
              playerName={currentPlayer?.name}
              playerNumber={activePlayer + 1}
              netWorth={currentPlayer?.netWorth}
              goalLaps={currentPlayer?.laps}
              totalLaps={gameSettings.laps}
              businessWorth={currentPlayer?.assetsValue}
              loanBalance={currentPlayer?.loanBalance}
              assetsValue={currentPlayer?.assetsValue}
              cardsCount={Object.keys(currentPlayer?.inventory || {}).length}
              currentBusiness={currentPlayer?.businesses.length > 0 ? BOARD_TILES[currentPlayer.businesses[0]]?.label : 'No Business'}
              currentTileLabel={BOARD_TILES[BOARD_ORDER[currentPlayer?.pos]]?.label || 'Starting Tile'}
              currency={currency}
              onRoll={stepTurn}
              isMoving={isMoving}
              playersSummary={playersSummary}
              activePlayerId={currentPlayer?.id}
            />
          </HUDPortal>

          {/* Game Controls Panel */}
          <div className="fixed bottom-28 right-4 z-[1000] w-[360px] space-y-3">
            <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
              <div className="px-4 py-2 bg-sky-300 border-b text-white">
                <div className="text-sm font-extrabold tracking-wide">Game Controls</div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-sm text-gray-700">
                  <div><b>Active:</b> <span className="font-bold text-sky-600">{currentPlayer?.name}</span></div>
                  <div><b>Tile:</b> {BOARD_TILES[BOARD_ORDER[currentPlayer?.pos]]?.label ?? '—'}</div>
                  <div><b>Lap:</b> {currentPlayer?.laps}/{gameSettings.laps}</div>
                  <div><b>Cash:</b> {currency}{currentPlayer?.cash.toLocaleString()}</div>
                  <div><b>Businesses:</b> {currentPlayer?.businesses.length}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={stepTurn}
                    disabled={isMoving || everyoneDone}
                    className="px-3 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-500 disabled:opacity-50"
                  >
                    Roll Dice
                  </button>
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    disabled={everyoneDone}
                    className={`px-3 py-2 rounded-xl ${autoPlay ? 'bg-gray-500' : 'bg-emerald-500'
                      } text-white font-semibold shadow hover:opacity-90 disabled:opacity-50`}
                  >
                    {autoPlay ? 'Pause' : 'Auto Play'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CommunityGameRoom;