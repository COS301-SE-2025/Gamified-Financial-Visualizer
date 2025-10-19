import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

// Turn phases
const TURN = {
  AWAIT_ROLL: 'await_roll',
  MOVING: 'moving',
  TILE_DECISION: 'tile_decision',
  CARD_DECISION: 'card_decision',
  COMPLETE: 'complete'
};

// Helper function to get user data from localStorage
const getLoggedInUser = () => {
  try {
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
    return {
      id: 'user_' + Date.now(),
      username: 'Player',
      displayName: 'Player',
      characterKey: 'Cowboy'
    };
  } catch (error) {
    console.warn('Error reading user data from localStorage:', error);
    return {
      id: 'user_' + Date.now(),
      username: 'Player',
      displayName: 'Player',
      characterKey: 'Cowboy'
    };
  }
};

// Generate consistent random colors for each player based on their ID
const generatePlayerColors = (players) => {
  const colors = [
    'bg-rose-500', 'bg-sky-500', 'bg-lime-500', 'bg-amber-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const playerColors = {};
  players.forEach((player, index) => {
    playerColors[player.id] = colors[index % colors.length];
  });
  return playerColors;
};

// Main MockGame Component
export default function MockGame() {
  const [phase, setPhase] = useState('lobby');
  const [settings, setSettings] = useState({ players: 4, laps: 5, mode: 'bots' });
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [tilePopup, setTilePopup] = useState({ open: false, data: null });
  const [diceResult, setDiceResult] = useState(null);
  const [turnPhase, setTurnPhase] = useState(TURN.AWAIT_ROLL);
  const [pendingTile, setPendingTile] = useState(null);
  const [gameLog, setGameLog] = useState([]);
  const [waitingForHuman, setWaitingForHuman] = useState(false);

  // Add game log function
  const addGameLog = (message) => {
    setGameLog(prev => [...prev, { message, timestamp: new Date() }]);
    console.log('Game Log:', message);
  };

  // Initialize players with human always as first player
  const [players, setPlayers] = useState(() => {
    const loggedInUser = getLoggedInUser();

    const initialPlayers = [
      // Human player always first
      {
        id: 'human',
        name: loggedInUser.displayName || loggedInUser.username || 'Player',
        characterKey: loggedInUser.characterKey || 'Cowboy',
        pos: 0, laps: 0,
        cash: 10000, assetsValue: 2000, loanBalance: 1000, salary: 2200,
        businesses: [], cards: [], flags: {}, inventory: {},
        isBot: false,
        userId: loggedInUser.id
      },
      // Bot players
      {
        id: 'p1', name: 'lily_rose', characterKey: 'Green_girl', pos: 0, laps: 0,
        cash: 10000, assetsValue: 1500, loanBalance: 500, salary: 2000,
        businesses: [], cards: [], flags: {}, inventory: {}, isBot: true
      },
      {
        id: 'p2', name: 'nile_waters', characterKey: 'Mr_suit', pos: 0, laps: 0,
        cash: 10000, assetsValue: 1200, loanBalance: 0, salary: 1800,
        businesses: [], cards: [], flags: {}, inventory: {}, isBot: true
      },
      {
        id: 'p3', name: 'man_person', characterKey: 'Kimono_girl', pos: 0, laps: 0,
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
  const playerColors = useMemo(() => generatePlayerColors(players), [players]);

  // Refs for stable execution
  const playersRef = React.useRef(players);
  const activePlayerIndexRef = React.useRef(activePlayerIndex);
  const phaseRef = React.useRef(phase);
  const everyoneDoneRef = React.useRef(everyoneDone);
  const autoPlayRef = React.useRef(autoPlay);
  const settingsRef = React.useRef(settings);
  const turnPhaseRef = React.useRef(turnPhase);

  // Keep refs in sync
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { activePlayerIndexRef.current = activePlayerIndex; }, [activePlayerIndex]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { everyoneDoneRef.current = everyoneDone; }, [everyoneDone]);
  useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { turnPhaseRef.current = turnPhase; }, [turnPhase]);

  const currentPlayer = players[activePlayerIndex];

  // Move to next player - only called when current turn is COMPLETELY finished
  const moveToNextPlayer = useCallback(() => {
    console.log('Moving to next player...');
    setActivePlayerIndex(prev => {
      const nextIndex = (prev + 1) % players.length;
      console.log(`Player ${prev} -> ${nextIndex}: ${players[nextIndex]?.name}`);
      setTurnPhase(TURN.AWAIT_ROLL);
      setDiceResult(null);
      setWaitingForHuman(false);
      return nextIndex;
    });
  }, [players.length]);

  // Complete human turn - called when human has finished all actions
  const completeHumanTurn = useCallback(() => {
    console.log('Completing human turn, moving to next player');
    setIsMoving(false);
    setTurnPhase(TURN.AWAIT_ROLL);
    setTilePopup({ open: false, data: null });
    setWaitingForHuman(false);
    
    // Move to next player after a short delay
    setTimeout(moveToNextPlayer, 3000);
  }, [moveToNextPlayer]);

  // Handle human roll
  const handleHumanRoll = () => {
    if (currentPlayer.isBot || turnPhase !== TURN.AWAIT_ROLL || isMoving) return;
    
    console.log('Human rolling dice...');
    const roll = randInt(1, 6);
    setDiceResult(roll);
    addGameLog(`${currentPlayer.name} rolled a ${roll}`);
    setIsMoving(true);
    setTurnPhase(TURN.MOVING);
    setWaitingForHuman(true);

    setTimeout(() => {
      setPlayers(prev => {
        const updated = prev.map(p => ({ 
          ...p, 
          flags: { ...(p.flags || {}) }, 
          businesses: [...(p.businesses || [])], 
          cards: [...(p.cards || [])] 
        }));
        
        const me = updated[activePlayerIndex];
        if (!me) return prev;

        // Movement logic
        const advanceSpaces = me.flags.advanceSpaces || 0;
        const totalSpaces = roll + advanceSpaces;
        if (advanceSpaces) me.flags.advanceSpaces = 0;

        const oldPos = me.pos;
        const newPos = (oldPos + totalSpaces) % BOARD_ORDER.length;
        me.pos = newPos;

        // Lap completion
        if (oldPos + totalSpaces >= BOARD_ORDER.length) {
          me.laps += 1;
          let salary = me.salary || 0;
          if (me.flags.halfSalary) { 
            salary = Math.floor(salary / 2); 
            me.flags.halfSalary = 0; 
          }
          me.cash += salary;
          addGameLog(`${me.name} completed lap ${me.laps}! (+${CURRENCY}${salary.toLocaleString()})`);
        }

        // Tile effect
        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          if (tile.type === 'business' && !tile.owner && tile.action?.type === 'buy') {
            // Show purchase decision for human
            setPendingTile(tile);
            setTilePopup({ open: true, data: tile });
            setTurnPhase(TURN.TILE_DECISION);
          } else {
            const eff = applyTileEffect(me, tile, updated);
            addGameLog(`${me.name} landed on ${tile.label}. ${eff.text}`);
            setTilePopup({ open: true, data: tile });
            // Auto-close popup but wait for human to acknowledge
            setTurnPhase(TURN.CARD_DECISION);
          }
        } else {
          // No special tile - human turn complete
          setIsMoving(false);
          setTurnPhase(TURN.COMPLETE);
        }

        return updated;
      });
    }, 1200);
  };

// Execute bot turn
  const executeBotTurn = useCallback(() => {
    const currentPlayer = playersRef.current[activePlayerIndexRef.current];
    if (!currentPlayer?.isBot || waitingForHuman || isMoving) return;

    console.log(`Bot ${currentPlayer.name} taking turn...`);
    
    const roll = randInt(1, 6);
    setDiceResult(roll);
    addGameLog(`${currentPlayer.name} rolled a ${roll}`);
    setIsMoving(true);
    setTurnPhase(TURN.MOVING);

    setTimeout(() => {
      setPlayers(prev => {
        const updated = prev.map(p => ({
          ...p,
          flags: { ...(p.flags || {}) },
          businesses: [...(p.businesses || [])],
          cards: [...(p.cards || [])]
        }));

        const current = updated[activePlayerIndexRef.current];
        if (!current) {
          return prev;
        }

        // Skip turn logic
        if (current.flags.skipTurn) {
          current.flags.skipTurn = 0;
          addGameLog(`${current.name} skips their turn`);
          return updated;
        }

        // Movement logic
        const advanceSpaces = current.flags.advanceSpaces || 0;
        const totalSpaces = roll + advanceSpaces;
        if (advanceSpaces) current.flags.advanceSpaces = 0;

        const oldPos = current.pos;
        const newPos = (oldPos + totalSpaces) % BOARD_ORDER.length;
        current.pos = newPos;

        // Lap completion
        if (oldPos + totalSpaces >= BOARD_ORDER.length) {
          current.laps += 1;
          let salary = current.salary || 0;
          if (current.flags.halfSalary) {
            salary = Math.floor(salary / 2);
            current.flags.halfSalary = 0;
          }
          current.cash += salary;
          addGameLog(`${current.name} completed lap ${current.laps}! (+${CURRENCY}${salary.toLocaleString()})`);
        }

        // Tile effect - bots make automatic decisions
        const tile = BOARD_TILES[BOARD_ORDER[newPos]];
        if (tile) {
          if (tile.type === 'business' && !tile.owner && tile.action?.type === 'buy') {
            // Bot decision for buying property
            const shouldBuy = makeAIDecision(current, tile, 'buy');
            if (shouldBuy && current.cash >= (tile.cost || 0)) {
              tile.owner = current.id;
              current.businesses.push(BOARD_ORDER[newPos]);
              current.cash -= (tile.cost || 0);
              current.assetsValue += (tile.cost || 0);
              addGameLog(`${current.name} bought ${tile.label} for ${CURRENCY}${(tile.cost || 0).toLocaleString()}`);
            } else {
              addGameLog(`${current.name} decided not to buy ${tile.label}`);
            }
          } else {
            const eff = applyTileEffect(current, tile, updated);
            addGameLog(`${current.name} landed on ${tile.label}. ${eff.text}`);
          }
        }
        
        return updated;
      });

      // Complete the bot turn after player state updates
      setTimeout(() => {
        setIsMoving(false);
        setTurnPhase(TURN.COMPLETE);
        
        // Move to next player
        setTimeout(moveToNextPlayer, 800);
      }, 200);
    }, 1200);
  }, [moveToNextPlayer, waitingForHuman, isMoving]);
  
  // Handle tile popup actions (for human decisions)
  const handleTileAction = (tile) => {
    if (tile.type === 'business' && !tile.owner && tile.action?.type === 'buy') {
      // Human decided to buy
      setPlayers(prev => {
        const updated = prev.map(p => ({ ...p }));
        const me = updated[activePlayerIndex];
        
        if (me.cash >= (tile.cost || 0)) {
          tile.owner = me.id;
          me.businesses.push(BOARD_ORDER[me.pos]);
          me.cash -= (tile.cost || 0);
          me.assetsValue += (tile.cost || 0);
          addGameLog(`${me.name} bought ${tile.label} for ${CURRENCY}${(tile.cost || 0).toLocaleString()}`);
        }
        
        return updated;
      });
    }
    
    // Complete the human turn after decision
    completeHumanTurn();
  };

  // Handle tile popup close (human decided not to buy or viewed tile)
  const handleTilePopupClose = () => {
    setTilePopup({ open: false, data: null });
    
    // If human was in tile decision phase (business purchase), complete turn
    if (turnPhase === TURN.TILE_DECISION) {
      addGameLog(`${currentPlayer.name} decided not to buy ${pendingTile?.label}`);
      completeHumanTurn();
    } else if (turnPhase === TURN.CARD_DECISION) {
      // If human was just viewing a tile, complete turn
      completeHumanTurn();
    }
  };

  // Handle card decision complete
  const handleCardDecisionComplete = () => {
    completeHumanTurn();
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
      addGameLog(`${currentPlayer.name} used card: ${card.title}`);

      return updatedPlayers;
    });
  };

  // Auto-play for bots - ONLY when it's a bot's turn and not waiting for human
  useEffect(() => {
    if (phase === 'playing' && !everyoneDone && !isMoving && !waitingForHuman) {
      if (currentPlayer.isBot && turnPhase === TURN.AWAIT_ROLL) {
        console.log(`Auto-playing bot: ${currentPlayer.name}`);
        const timer = setTimeout(executeBotTurn, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, activePlayerIndex, everyoneDone, isMoving, turnPhase, currentPlayer, executeBotTurn, waitingForHuman]);

  // Game completion
  useEffect(() => {
    if (phase === 'playing' && everyoneDone) {
      setAutoPlay(false);
      setTimeout(() => setPhase('results'), 3000);
    }
  }, [phase, everyoneDone]);

  const startGame = (gameSettings, selectedCharacter) => {
    const loggedInUser = getLoggedInUser();
    
    // Create players array with human always first
    const humanPlayer = {
      id: 'human',
      name: loggedInUser.displayName || loggedInUser.username || 'Player',
      characterKey: selectedCharacter || loggedInUser.characterKey || 'Cowboy',
      pos: 0, laps: 0,
      cash: 10000, assetsValue: 2000, loanBalance: 1000, salary: 2200,
      businesses: [], cards: [], flags: {}, inventory: {},
      isBot: false,
      userId: loggedInUser.id
    };

    // Create bot players based on selected number
    const botPlayers = [];
    const botNames = ['lily_rose', 'nile_waters', 'man_person', 'charlie_bot', 'diana_ai', 'ethan_machine'];
    const botCharacters = ['Green_girl', 'Mr_suit', 'Kimono_girl', 'Ninja.001', 'Lilac_girl', 'Cowboy'];
    
    for (let i = 0; i < gameSettings.players - 1; i++) {
      botPlayers.push({
        id: `bot${i + 1}`,
        name: botNames[i % botNames.length],
        characterKey: botCharacters[i % botCharacters.length],
        pos: 0, laps: 0,
        cash: 10000, 
        assetsValue: 1500 + (i * 200), 
        loanBalance: 500 + (i * 100), 
        salary: 2000 + (i * 100),
        businesses: [], cards: [], flags: {}, inventory: {},
        isBot: true
      });
    }

    const resetPlayers = [humanPlayer, ...botPlayers];

    // Reset business ownership
    Object.values(BOARD_TILES).forEach(tile => {
      if (tile.type === 'business') {
        tile.owner = null;
      }
    });

    setPlayers(resetPlayers);
    setSettings({ ...gameSettings, mode: 'bots' });
    setActivePlayerIndex(0);
    setPhase('playing');
    setTurnPhase(TURN.AWAIT_ROLL);
    setDiceResult(null);
    setIsMoving(false);
    setWaitingForHuman(false);
    setGameLog(['Game started! Human player goes first.']);
  };

  const restartGame = () => {
    startGame(settings, currentPlayer.characterKey);
  };

  const returnToLobby = () => {
    setPhase('lobby');
  };

  const endGameImmediately = () => {
    setAutoPlay(false);
    setPhase('results');
  };

  const handleLeaveGame = () => {
    endGameImmediately();
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

  const netWorth = calculateNet(currentPlayer);
  const playersSummary = players.map(p => ({
    id: p.id,
    name: p.name,
    position: p.pos,
    laps: p.laps,
    cash: p.cash,
    active: p.id === currentPlayer.id,
    color: playerColors[p.id]
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
          onRoll={currentPlayer.isBot ? undefined : handleHumanRoll}
          isMoving={isMoving}
          playersSummary={playersSummary}
          activePlayerId={currentPlayer.id}
          inventoryCards={currentPlayer.cards}
          diceToast={diceResult}
          playerColors={playerColors}
          canRoll={!currentPlayer.isBot && !isMoving && turnPhase === TURN.AWAIT_ROLL && !waitingForHuman}
          players={players}
          currentPlayer={currentPlayer}
          onLeaveGame={handleLeaveGame}
          onCardDecisionComplete={handleCardDecisionComplete}
        />
      </HUDPortal>

      {/* Debug info */}
      <div className="fixed bottom-14 left-4 bg-sky-500 text-white p-3 rounded-lg text-xs z-50">
        <div>Phase: {phase}</div>
        <div>Turn Phase: {turnPhase}</div>
        <div>Active Player: {currentPlayer?.name} ({(currentPlayer?.isBot ? 'Bot' : 'Human')})</div>
        <div>Player Index: {activePlayerIndex}</div>
        <div>Moving: {isMoving ? 'YES' : 'NO'}</div>
        <div>Waiting for Human: {waitingForHuman ? 'YES' : 'NO'}</div>
        <div>Everyone Done: {everyoneDone ? 'YES' : 'NO'}</div>
      </div>

      {/* Game Controls */}
      <div className="pointer-events-auto fixed bottom-32 right-4 z-[10] w-[360px] space-y-4">
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
                <span><strong>Turn Phase:</strong></span>
                <span>{turnPhase}</span>
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

            {!currentPlayer.isBot && (
              <button
                onClick={handleHumanRoll}
                disabled={isMoving || turnPhase !== TURN.AWAIT_ROLL || waitingForHuman}
                className="w-full px-3 py-2 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 disabled:opacity-50"
              >
                {isMoving ? 'Moving...' : 
                 waitingForHuman ? 'Processing...' : 
                 turnPhase !== TURN.AWAIT_ROLL ? 'Complete Turn First' : 
                 'Roll Dice'}
              </button>
            )}

            {currentPlayer.cards.length > 0 && !currentPlayer.isBot && (
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

            {!currentPlayer.isBot && turnPhase === TURN.CARD_DECISION && (
              <button
                onClick={handleCardDecisionComplete}
                className="w-full px-3 py-2 rounded-xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600"
              >
                Continue
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
        onClose={handleTilePopupClose}
        onAction={handleTileAction}
      />
    </div>
  );
}