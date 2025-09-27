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

function applyTileEffect(player, tile, allPlayers = []) {
  if (!tile || !tile.action) return { text: `Landed on ${tile?.label || 'unknown tile'}`, delta: 0 };

  const a = tile.action;

  // Handle business ownership and rent
  if (tile.type === 'business' && tile.owner && tile.owner !== player.id) {
    const owner = allPlayers.find(p => p.id === tile.owner);
    if (owner && !owner.bankrupt) {
      const rent = tile.cost ? Math.floor(tile.cost * 0.1) : 500; // 10% of cost or default
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
        tile.owner = player.id; // Mark as owned
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

function Results({ players, onRestart }) {
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

        <div className="flex justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MockGameSimulation() {
  const [phase, setPhase] = useState('lobby');
  const [settings, setSettings] = useState({ players: 4, laps: 5 });
  const [active, setActive] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

   // Debug logging
  useEffect(() => {
    console.log('Current phase:', phase, 'Loading phase:', loadingPhase, 'Progress:', loadingProgress);
  }, [phase, loadingPhase, loadingProgress]);

  // Initialize players and reset business ownership
  const [players, setPlayers] = useState(() => {
    const initialPlayers = [
      { id: 'p1', name: 'lily_rose', characterKey: 'Green_girl', pos: 0, laps: 0, cash: 10000, assetsValue: 1500, loanBalance: 500, salary: 2000, businesses: [], flags: {}, inventory: {} },
      { id: 'p2', name: 'kevin_park', characterKey: 'Cowboy', pos: 0, laps: 0, cash: 10000, assetsValue: 2000, loanBalance: 1000, salary: 2200, businesses: [], flags: {}, inventory: {} },
      { id: 'p3', name: 'nile_waters', characterKey: 'Mr_suit', pos: 0, laps: 0, cash: 10000, assetsValue: 1200, loanBalance: 0, salary: 1800, businesses: [], flags: {}, inventory: {} },
      { id: 'p4', name: 'man_person', characterKey: 'Kimono_girl', pos: 0, laps: 0, cash: 10000, assetsValue: 1800, loanBalance: 800, salary: 2100, businesses: [], flags: {}, inventory: {} },
    ];

    // Reset business ownership
    Object.values(BOARD_TILES).forEach(tile => {
      if (tile.type === 'business') {
        tile.owner = null;
      }
    });

    return initialPlayers;
  });

  const [log, setLog] = useState([]);
  const [auto, setAuto] = useState(false);
  const [tilePopup, setTilePopup] = useState({ open: false, data: null });

  // Hide viewer's roll button
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `[title="Roll Dice"]{display:none !important}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const everyoneDone = players.every(p => p.laps >= settings.laps);
  const currentTileId = useMemo(() => BOARD_ORDER[players[active]?.pos ?? 0], [players, active]);
  const currentTile = BOARD_TILES[currentTileId];

  // Enhanced turn function with proper state handling
  const stepTurn = () => {
    if (everyoneDone || !players[active]) return;

    setIsMoving(true);

    setTimeout(() => {
      setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => ({
          ...p,
          flags: { ...p.flags },
          businesses: [...p.businesses]
        }));

        const currentPlayer = updatedPlayers[active];
        if (!currentPlayer) return updatedPlayers;

        // Handle skip turn
        if (currentPlayer.flags.skipTurn) {
          currentPlayer.flags.skipTurn = 0;
          setLog(prevLog => [`${currentPlayer.name} skips a turn`, ...prevLog]);
          setActive(prevActive => (prevActive + 1) % settings.players);
          setIsMoving(false);
          return updatedPlayers;
        }

        // Roll dice
        const baseRoll = randInt(1, 6);
        let roll = baseRoll;
        if (currentPlayer.businesses.length >= 2 && Math.random() < 0.3) {
          roll += 1;
          setLog(prevLog => [`${currentPlayer.name} gets +1 roll bonus from businesses!`, ...prevLog]);
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
          setLog(prevLog => [
            `${currentPlayer.name} completed lap ${currentPlayer.laps}! (+${currency}${salary.toLocaleString()} salary)`,
            ...prevLog
          ]);
        }

        // Process tile effect
        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          const effect = applyTileEffect(currentPlayer, tile, updatedPlayers);
          setLog(prevLog => [
            `${currentPlayer.name} rolled ${roll} and landed on ${tile.label}. ${effect.text}`,
            ...prevLog
          ]);
          setTilePopup({ open: true, data: tile });
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
          setLog(prevLog => [
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
          setLog(prevLog => [`${currentPlayer.name} gets an extra roll!`, ...prevLog]);
          setIsMoving(false);
          return updatedPlayers;
        }

        // Move to next player
        setActive(prevActive => (prevActive + 1) % settings.players);
        setIsMoving(false);
        return updatedPlayers;
      });
    }, 800);
  };

  // Auto-play
  useEffect(() => {
    if (!auto || phase !== 'playing' || everyoneDone) return;
    const timer = setTimeout(stepTurn, 1200);
    return () => clearTimeout(timer);
  }, [auto, phase, players, active, settings, everyoneDone]);

  // Game completion
  useEffect(() => {
    if (phase === 'playing' && everyoneDone) {
      setAuto(false);
      setTimeout(() => setPhase('results'), 1000);
    }
  }, [phase, everyoneDone]);

  const restart = () => {
    setPhase('lobby');
    setAuto(false);
    setActive(0);
    setLog([]);
    setLoadingPhase(false);
    setLoadingProgress(0);
  };

  const startFromLobby = (gameSettings) => {
    
    setLoadingPhase(true);
    setLoadingProgress(0);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Reset game state after loading completes
          const resetPlayers = players.map(p => ({
            ...p,
            pos: 0,
            laps: 0,
            cash: 10000,
            businesses: [],
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
          setActive(0);
          setLog(['Game started!']);
          
          // Don't set phase to 'playing' here - let GameLoader handle the countdown
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const handleLoaderComplete = () => {
    setLoadingPhase(false);
    setPhase('playing');
  };

  // render logic
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
    return <Results players={players} onRestart={restart} />;
  }

  const currentPlayer = players[active];
  if (!currentPlayer) return null;

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
          playerNumber={active + 1}
          netWorth={netWorth}
          timePlaying={`Turn ${log.length}`}
          goalLaps={currentPlayer.laps}
          totalLaps={settings.laps}
          businessWorth={currentPlayer.assetsValue}
          loanBalance={currentPlayer.loanBalance}
          assetsValue={currentPlayer.assetsValue}
          cardsCount={Object.keys(currentPlayer.inventory).length}
          currentBusiness={currentPlayer.businesses.length > 0 ? BOARD_TILES[currentPlayer.businesses[0]]?.label : 'No Business'}
          currentTileLabel={BOARD_TILES[BOARD_ORDER[currentPlayer.pos]]?.label || 'Starting Tile'}
          currency={currency}
          onRoll={stepTurn}
          isMoving={isMoving}
          playersSummary={playersSummary}
          activePlayerId={currentPlayer.id}
        />
      </HUDPortal>

      <div className="fixed top-24 right-6 z-[1000] w-[360px] space-y-3">
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-sky-300 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Game Controls</div>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-sm text-gray-700">
              <div><b>Active:</b> <span className="font-bold text-sky-600">{currentPlayer.name}</span></div>
              <div><b>Tile:</b> {currentTile?.label ?? '—'}</div>
              <div><b>Lap:</b> {currentPlayer.laps}/{settings.laps}</div>
              <div><b>Cash:</b> {currency}{currentPlayer.cash.toLocaleString()}</div>
              <div><b>Businesses:</b> {currentPlayer.businesses.length}</div>
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
                onClick={() => setAuto(!auto)}
                disabled={everyoneDone}
                className={`px-3 py-2 rounded-xl ${auto ? 'bg-gray-500' : 'bg-emerald-500'
                  } text-white font-semibold shadow hover:opacity-90 disabled:opacity-50`}
              >
                {auto ? 'Pause' : 'Auto Play'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white max-h-[40vh]">
          <div className="px-4 py-2 bg-sky-300 border-b text-white">
            <div className="text-sm font-extrabold tracking-wide">Game Log</div>
          </div>
          <div className="p-3 space-y-2 overflow-auto max-h-[32vh]">
            {log.length === 0 ? (
              <div className="text-sm text-gray-500">Click Roll Dice to start!</div>
            ) : log.map((line, i) => (
              <div key={i} className="text-sm text-gray-700 p-2 bg-gray-50 rounded-lg">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BoardTileModal
        open={tilePopup.open}
        data={tilePopup.data}
        onClose={() => setTilePopup({ open: false, data: null })}
        onAction={() => setTilePopup({ open: false, data: null })}
      />
    </div>
  );
}