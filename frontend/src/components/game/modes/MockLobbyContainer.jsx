import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import GameLobby from '../lobby/GameLobby';
import GameBoardViewer from '../viewers/GameBoardViewer';
import GameHUD from '../ui/HUD/GameHUD';
import GameLoader from '../ui/GameLoader';
import HUDPortal from '../ui/HUD/HUDPortal';
import BoardTileModal from '../ui/BoardTileModal';
import Results from '../ui/Results';
import { BOARD_TILES, BOARD_ORDER } from '../data/boardTiles';
import { CURRENCY } from '../core/rules';
import { calculateNet } from '../core/selectors';
import { applyTileEffect, applyCardEffect } from '../core/tileEffects.jsx';
import { makeAIDecision } from '../core/ai';;

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function MockLobbyContainer() {
  const [phase, setPhase] = useState('lobby');
  const [settings, setSettings] = useState({ players: 4, laps: 1 });

  const [players, setPlayers] = useState(() => {
    const initialPlayers = [
      { id: 'p1', name: 'lily_rose',  characterKey: 'Green_girl',  pos: 0, laps: 0, cash: 10000, assetsValue: 1500, loanBalance: 500,  salary: 2000, businesses: [], cards: [], flags: {}, inventory: {}, isBot: true  },
      { id: 'p2', name: 'me',         characterKey: 'Cowboy',      pos: 0, laps: 0, cash: 10000, assetsValue: 2000, loanBalance: 1000, salary: 2200, businesses: [], cards: [], flags: {}, inventory: {}, isBot: false },
      { id: 'p3', name: 'nile_waters',characterKey: 'Mr_suit',     pos: 0, laps: 0, cash: 10000, assetsValue: 1200, loanBalance: 0,   salary: 1800, businesses: [], cards: [], flags: {}, inventory: {}, isBot: true  },
      { id: 'p4', name: 'man_person', characterKey: 'Kimono_girl', pos: 0, laps: 0, cash: 10000, assetsValue: 1800, loanBalance: 800, salary: 2100, businesses: [], cards: [], flags: {}, inventory: {}, isBot: true  },
    ];
    Object.values(BOARD_TILES).forEach(tile => { if (tile.type === 'business') tile.owner = null; });
    return initialPlayers;
  });

  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [gameLog, setGameLog] = useState(['Game initialized']);
  const [tilePopup, setTilePopup] = useState({ open: false, data: null });
  const [autoPlay, setAutoPlay] = useState(true);
  const [diceResult, setDiceResult] = useState(null);

  const everyoneDone = players.every(p => p.laps >= settings.laps);
  const currentPlayer = players[activePlayerIndex];
  const currentTileId = useMemo(() => BOARD_ORDER[currentPlayer?.pos ?? 0], [currentPlayer]);
  const currentTile = BOARD_TILES[currentTileId];

  const addGameLog = (message) => setGameLog(prev => [message, ...prev.slice(0, 50)]);

  // ===== Refs for stable executeTurn =====
  const playersRef = useRef(players);
  const activeIdxRef = useRef(activePlayerIndex);
  const phaseRef = useRef(phase);
  const everyoneDoneRef = useRef(everyoneDone);
  const autoPlayRef = useRef(autoPlay);
  const settingsRef = useRef(settings);

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { activeIdxRef.current = activePlayerIndex; }, [activePlayerIndex]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { everyoneDoneRef.current = everyoneDone; }, [everyoneDone]);
  useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const handleUseCard = (card) => {
    setPlayers(prev => {
      const updated = prev.map(p => ({ ...p, cards: [...p.cards], flags: { ...(p.flags||{}) } }));
      const me = updated[activeIdxRef.current];
      const eff = applyCardEffect(me, card, updated);
      me.cards = me.cards.filter(c => c.id !== card.id);
      addGameLog(`Card used: ${eff.text}`);
      setShowCardModal(false);
      return updated;
    });
  };

  const advanceToNextPlayer = useCallback(() => {
    setTimeout(() => {
      setActivePlayerIndex(prev => {
        let next = (prev + 1) % playersRef.current.length;
        let attempts = 0;
        while (playersRef.current[next]?.cash <= 0 && attempts < playersRef.current.length) {
          next = (next + 1) % playersRef.current.length;
          attempts++;
        }
        return next;
      });
      setIsMoving(false);
      setDiceResult(null);
    }, 1000);
  }, []);

  const executeTurn = useCallback(() => {
    if (phaseRef.current !== 'playing' || everyoneDoneRef.current) return;

    const idx = activeIdxRef.current;
    const settingsNow = settingsRef.current;
    const current = playersRef.current[idx];
    if (!current) return;

    setIsMoving(true);
    addGameLog(`--- ${current.name}'s turn ---`);

    const botDelay = current.isBot ? 1000 : 0;
    const roll = randInt(1, 6);
    setDiceResult(roll);
    addGameLog(`${current.name} rolled a ${roll}`);

    setTimeout(() => {
      setPlayers(prev => {
        const updated = prev.map(p => ({
          ...p,
          flags: { ...(p.flags || {}) },
          businesses: [...(p.businesses || [])],
          cards: [...(p.cards || [])],
        }));
        const me = updated[idx];
        if (!me) { setIsMoving(false); return prev; }

        if (me.flags.skipTurn) {
          me.flags.skipTurn = 0;
          addGameLog(`${me.name} skips a turn`);
          advanceToNextPlayer();
          return updated;
        }

        const adv = me.flags.advanceSpaces || 0;
        const totalSpaces = roll + adv;
        if (adv) {
          addGameLog(`${me.name} advances ${adv} extra spaces from card`);
          me.flags.advanceSpaces = 0;
        }

        const oldPos = me.pos;
        const newPos = (oldPos + totalSpaces) % BOARD_ORDER.length;
        me.pos = newPos;

        if (oldPos + totalSpaces >= BOARD_ORDER.length) {
          me.laps += 1;
          let salary = me.salary || 0;
          if (me.flags.halfSalary) {
            salary = Math.floor(salary / 2);
            me.flags.halfSalary = 0;
          }
          me.cash += salary;
          addGameLog(`${me.name} completed lap ${me.laps}! (+${CURRENCY}${salary.toLocaleString()} salary)`);
          if (me.laps >= (settingsNow?.laps ?? Infinity)) {
            addGameLog(`🎉 ${me.name} has finished the game!`);
            me.finished = true;
          }
        }

        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          const effect = applyTileEffect(me, tile, updated);
          addGameLog(`${me.name} landed on ${tile.label}. ${effect.text}`);
          setTilePopup({ open: true, data: tile });

          if (me.isBot && tile.action) {
            const decision = makeAIDecision(me, tile, updated);
            if (decision === 'buy' && tile.action.type === 'buy') {
              const buyEff = applyTileEffect(me, tile, updated);
              addGameLog(`🤖 ${me.name} decided to buy: ${buyEff.text}`);
            }
          }
        }

        if (!me.flags.skipBizPayments && me.businesses.length > 0) {
          let incomePer = 400;
          if (me.flags.doubleBusiness) {
            incomePer *= 2;
            me.flags.doubleBusiness = 0;
            addGameLog(`${me.name}'s business income was doubled this round!`);
          }
          let totalIncome = incomePer * me.businesses.length;
          if (me.flags.reduceBusiness) {
            totalIncome = Math.floor(totalIncome / 2);
            me.flags.reduceBusiness = 0;
          }
          me.cash += totalIncome;
          addGameLog(`${me.name} earned ${CURRENCY}${totalIncome.toLocaleString()} from ${me.businesses.length} businesses`);
        }
        if (me.flags.skipBizPayments) me.flags.skipBizPayments = 0;

        if (me.isBot && me.cards.length > 0 && me.cash < 3000) {
          const usable = me.cards.find(c => c.effect === 'earn' || c.effect === 'double_business');
          if (usable) {
            const eff = applyCardEffect(me, usable, updated);
            me.cards = me.cards.filter(c => c.id !== usable.id);
            addGameLog(`🤖 ${me.name} used card: ${eff.text}`);
          }
        }

        if (me.flags.extraRoll) {
          me.flags.extraRoll = 0;
          setIsMoving(false);
          return updated;
        }

        advanceToNextPlayer();
        return updated;
      });
    }, 1500 + botDelay);
  }, [advanceToNextPlayer]);

  // Auto-play
  useEffect(() => {
    if (autoPlay && phase === 'playing' && !everyoneDone) {
      const t = setTimeout(executeTurn, 2000);
      return () => clearTimeout(t);
    }
  }, [autoPlay, phase, everyoneDone, executeTurn]);

  // Complete game
  useEffect(() => {
    if (phase === 'playing' && everyoneDone) {
      setAutoPlay(false);
      addGameLog('🎊 Game completed! All players have finished their laps.');
      setTimeout(() => setPhase('results'), 3000);
    }
  }, [phase, everyoneDone]);

  const startFromLobby = (gameSettings) => {
    setLoadingPhase(true);
    setLoadingProgress(0);
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          const resetPlayers = playersRef.current.map(p => ({
            ...p, pos: 0, laps: 0, cash: 10000, businesses: [], cards: [], flags: {}, inventory: {}
          }));
          Object.values(BOARD_TILES).forEach(tile => { if (tile.type === 'business') tile.owner = null; });
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

  const restartGame = () => {
    setPhase('lobby');
    setAutoPlay(false);
    setActivePlayerIndex(0);
    setGameLog(['Game restarted']);
    setLoadingPhase(false);
    setLoadingProgress(0);
  };

  // Render
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
    return <Results players={players} onRestart={restartGame} onLobby={() => setPhase('lobby')} />;
  }

  const netWorth = calculateNet(currentPlayer);
  const playersSummary = players.map(p => ({
    id: p.id, name: p.name, position: p.pos, laps: p.laps, cash: p.cash, active: p.id === currentPlayer.id
  }));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="h-[72vh]">
        <GameBoardViewer
          selectedCharacter={currentPlayer.characterKey}
          pawns={players.map(p => ({ key: p.id, character: p.characterKey, index: p.pos }))}
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
          currency={CURRENCY}
          onRoll={executeTurn}
          isMoving={isMoving}
          playersSummary={playersSummary}
          activePlayerId={currentPlayer.id}
          inventoryCards={currentPlayer.cards}
          diceToast={diceResult}
        />
      </HUDPortal>

      {/* Controls + Log */}
      <div className="fixed top-24 right-6 z-[1000] w-[380px] space-y-3">
        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white">
            <div className="text-sm font-extrabold tracking-wide">Game Controls</div>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
              <div><b>Active Player:</b></div><div className="font-bold text-sky-600">{currentPlayer.name}</div>
              <div><b>Tile:</b></div><div>{currentTile?.label ?? '—'}</div>
              <div><b>Lap:</b></div><div>{currentPlayer.laps}/{settings.laps}</div>
              <div><b>Cash:</b></div><div>{CURRENCY}{currentPlayer.cash.toLocaleString()}</div>
              <div><b>Businesses:</b></div><div>{currentPlayer.businesses.length}</div>
              <div><b>Cards:</b></div><div>{currentPlayer.cards.length}</div>
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
                className={`px-3 py-2 rounded-xl ${autoPlay ? 'bg-gray-500' : 'bg-emerald-500'} text-white font-semibold shadow hover:opacity-90`}
              >
                {autoPlay ? 'Pause Auto' : 'Resume Auto'}
              </button>

              {!!currentPlayer.cards.length && (
                <button
                  onClick={() => { setCurrentCard(currentPlayer.cards[0]); setShowCardModal(true); }}
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

        <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white max-h-[40vh]">
          <div className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white flex justify-between items-center">
            <div className="text-sm font-extrabold tracking-wide">Game Log</div>
            <div className="text-xs">Laps: {settings.laps}</div>
          </div>
          <div className="p-3 space-y-2 overflow-auto max-h-[32vh]">
            {gameLog.length === 0
              ? <div className="text-sm text-gray-500">Game starting...</div>
              : gameLog.map((line, i) => (
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
          <div className="relative z-10 bg-white rounded-2xl p-6 max-w-md w/full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-sky-700 mb-2">{currentCard.title}</h3>
            <p className="text-gray-600 mb-4">{currentCard.desc}</p>
            <div className="flex gap-3">
              <button onClick={() => handleUseCard(currentCard)} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600">Use Card</button>
              <button onClick={() => setShowCardModal(false)} className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600">Cancel</button>
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
