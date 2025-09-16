// MockGameSimulation.jsx - Updated with complete game simulation
import React, { useEffect, useMemo, useRef, useState } from 'react';
import GameLobby from '../game/lobby/GameLobby';
import GameBoardViewer from '../game/GameBoardViewer';
import BoardTileModal from "./BoardTileModal";
import GameHUD from '../game/hud/GameHUD';
import HUDPortal from '../game/hud/HUDPortal';
import { BOARD_TILES, BOARD_ORDER } from '../../components/game/data/boardTiles';

// --- Helpers ---------------------------------------------------------------
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const currency = 'R';

// Minimal rule runner: applies action to player and returns a log entry
function applyTileEffect(player, tile) {
    if (!tile || !tile.action) return { text: `Nothing happened`, delta: 0 };

    const a = tile.action;
    switch (a.type) {
        case 'earn': {
            player.cash += a.amount ?? 0;
            return { text: `Earned ${currency}${(a.amount ?? 0).toLocaleString()} from ${tile.label}`, delta: +(a.amount ?? 0) };
        }
        case 'pay': {
            const amt = a.cost ?? 0;
            player.cash -= amt;
            return { text: `Paid ${currency}${amt.toLocaleString()} for ${tile.label}`, delta: -amt };
        }
        case 'buy': {
            const cost = a.cost ?? 0;
            if (player.cash >= cost) {
                player.cash -= cost;
                player.assetsValue += Math.round(cost * 0.8);
                player.businesses.push(tile.id);
                return { text: `Bought ${tile.label} for ${currency}${cost.toLocaleString()}`, delta: -cost };
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
            // We'll mark a flag so the engine gives this player an immediate extra roll.
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
            player.flags.halfSalary = 1; // one round
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
            // grant a generic "insurance" inventory flag
            player.inventory.insurance = true;
            return { text: `Invested in insurance (${currency}${invest}) and drew a community card`, delta: -invest };
        }
        default:
            return { text: `Landed on ${tile.label}`, delta: 0 };
    }
}

// Compute simple "net worth"
const calculateNet = (p) => p.cash + p.assetsValue - p.loanBalance;

// --- Results view ----------------------------------------------------------
function Results({ players, onRestart }) {
    const sorted = [...players].sort((a, b) => calculateNet(b) - calculateNet(a));
    
    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center">
            <div className="max-w-4xl mx-auto space-y-6 bg-white p-8 rounded-3xl shadow-2xl">
                <h1 className="text-4xl font-extrabold text-center text-sky-700">Game Results</h1>
                <p className="text-gray-600 text-center">Leaderboard after 5 laps each.</p>

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
                                <tr key={p.id} className={`${i === 0 ? 'bg-amber-50 font-bold' : 'odd:bg-gray-50'}`}>
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3 font-semibold flex items-center gap-2">
                                        <img 
                                            src={p.avatar} 
                                            alt={p.name} 
                                            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        {p.name}
                                        {i === 0 && <span className="text-amber-500">👑</span>}
                                    </td>
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

// --- The Simulation shell ---------------------------------------------------
export default function MockGameSimulation() {
    const [phase, setPhase] = useState('lobby'); // 'lobby' | 'playing' | 'results'
    const [settings, setSettings] = useState({ players: 4, laps: 5 });
    const [active, setActive] = useState(0); // active player idx

    // Player avatars
    const playerAvatars = {
        'p1': '/avatars/CityBuilding.png',
        'p2': '/avatars/Skull.png',
        'p3': '/avatars/koiFish.png',
        'p4': '/avatars/Ramen.png'
    };

    // 4 players, different baselines so they "feel" unique
    const [players, setPlayers] = useState(() => ([
        { 
            id: 'p1', 
            name: 'lily_rose', 
            characterKey: 'Green_girl', 
            avatar: playerAvatars['p1'],
            pos: 0, 
            laps: 0, 
            cash: 6000, 
            assetsValue: 1500, 
            loanBalance: 500, 
            salary: 2000, 
            businesses: [], 
            flags: {}, 
            inventory: {} 
        },
        { 
            id: 'p2', 
            name: 'kevin_park', 
            characterKey: 'Cowboy', 
            avatar: playerAvatars['p2'],
            pos: 0, 
            laps: 0, 
            cash: 5000, 
            assetsValue: 2000, 
            loanBalance: 1000, 
            salary: 2200, 
            businesses: [], 
            flags: {}, 
            inventory: {} 
        },
        { 
            id: 'p3', 
            name: 'nile_waters', 
            characterKey: 'Mr_suit', 
            avatar: playerAvatars['p3'],
            pos: 0, 
            laps: 0, 
            cash: 7000, 
            assetsValue: 1200, 
            loanBalance: 0, 
            salary: 1800, 
            businesses: [], 
            flags: {}, 
            inventory: {} 
        },
        { 
            id: 'p4', 
            name: 'man_person', 
            characterKey: 'Kimono_girl', 
            avatar: playerAvatars['p4'],
            pos: 0, 
            laps: 0, 
            cash: 5500, 
            assetsValue: 1800, 
            loanBalance: 800, 
            salary: 2100, 
            businesses: [], 
            flags: {}, 
            inventory: {} 
        },
    ]));

    const [log, setLog] = useState([]);
    const [auto, setAuto] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [diceResult, setDiceResult] = useState(null);
    const [showDiceResult, setShowDiceResult] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTile, setActiveTile] = useState(null);
    const [showInventory, setShowInventory] = useState(false);
    const [showCard, setShowCard] = useState(false);

    // Hide the viewer's internal Roll button so we drive the turn flow consistently
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `[title="Roll Dice"]{display:none !important}`;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const everyoneDone = players.every(p => p.laps >= settings.laps);

    const currentTileId = useMemo(() => BOARD_ORDER[players[active].pos], [players, active]);
    const currentTile = BOARD_TILES[currentTileId];

    // Roll dice function
    const rollDice = () => Math.floor(Math.random() * 6) + 1;

    // Core "play one move"
    const stepTurn = () => {
        if (everyoneDone) return;

        const roll = rollDice();
        setDiceResult(roll);
        setShowDiceResult(true);
        
        // Start moving animation
        setIsMoving(true);
        
        setTimeout(() => {
            setPlayers(prev => {
                const ps = prev.map(p => ({ ...p, flags: { ...p.flags } })); // shallow clone
                const p = ps[active];

                // If skipping full turn, consume flag and rotate
                if (p.flags.skipTurn) {
                    p.flags.skipTurn = 0;
                    setLog(l => [`${p.name} skips a turn`, ...l]);
                    setActive(i => (i + 1) % settings.players);
                    setIsMoving(false);
                    return ps;
                }

                // Move player
                const oldPos = p.pos;
                const newPos = (p.pos + roll) % BOARD_ORDER.length;
                p.pos = newPos;

                // Laps
                if (oldPos + roll >= BOARD_ORDER.length) {
                    p.laps += 1;
                    // Salary payout when crossing start (with modifiers)
                    let gain = p.salary;
                    if (p.flags.halfSalary) { gain = Math.floor(gain / 2); p.flags.halfSalary = 0; }
                    p.cash += gain;
                    setLog(l => [`${p.name} completed a lap (+${currency}${gain.toLocaleString()} salary)`, ...l]);
                }

                // Apply landed tile
                const tile = BOARD_TILES[BOARD_ORDER[newPos]];
                const res = applyTileEffect(p, tile);
                setLog(l => [`${p.name} rolled ${roll} to ${tile?.label}. ${res.text}`, ...l]);
                
                // Show tile modal
                setActiveTile(tile);
                setModalOpen(true);

                // One-round business income tick (if not skipped)
                if (!p.flags.skipBizPayments && p.businesses.length) {
                    const perBiz = 300; // tiny mock income per lap tick
                    let income = perBiz * p.businesses.length;
                    if (p.flags.reduceBusiness) { income = Math.floor(income / 2); p.flags.reduceBusiness = 0; }
                    p.cash += income;
                    setLog(l => [`${p.name} earned ${currency}${income.toLocaleString()} from businesses`, ...l]);
                }
                if (p.flags.skipBizPayments) p.flags.skipBizPayments = 0;

                // Extra roll resolution
                if (p.flags.extraRoll) {
                    p.flags.extraRoll = 0;
                    // keep the same active index to grant an immediate second move
                    setIsMoving(false);
                    return ps;
                }

                // Rotate active player unless someone still needs an extra roll
                setActive(i => (i + 1) % settings.players);
                setIsMoving(false);
                return ps;
            });
        }, 1500); // Wait for movement animation to complete
    };

    // Auto-play driver
    useEffect(() => {
        if (!auto || phase !== 'playing' || everyoneDone) return;
        const t = setTimeout(stepTurn, 2000); // 2 seconds per move for demo
        return () => clearTimeout(t);
    }, [auto, phase, players, active, settings, everyoneDone]);

    // Transition to results when done
    useEffect(() => {
        if (phase === 'playing' && everyoneDone) {
            setAuto(false);
            setTimeout(() => setPhase('results'), 1000);
        }
    }, [phase, everyoneDone]);

    // LOBBY → start
    const startFromLobby = ({ laps = 5, players: pCount = 4 }) => {
        setSettings({ laps, players: pCount });
        setPhase('playing');
    };

    // Reset all for another run
    const restart = () => {
        setPlayers(players.map(p => ({
            ...p, pos: 0, laps: 0, cash: 6000, assetsValue: 1500, loanBalance: 500,
            salary: p.salary, businesses: [], flags: {}, inventory: {}
        })));
        setActive(0);
        setLog([]);
        setAuto(false);
        setPhase('lobby');
    };

    if (phase === 'lobby') {
        // Reuse your lobby UI; configure for 4 players + 5 laps.
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <GameLobby
                    highestScore={12345}
                    totalPoints={420}
                    currentPlayers={[
                        { id: 'p1', name: 'lily_rose', ready: true, characterKey: 'Green_girl' },
                        { id: 'p2', name: 'kevin_park', ready: true, characterKey: 'Cowboy' },
                        { id: 'p3', name: 'nile_waters', ready: true, characterKey: 'Mr_suit' },
                        { id: 'p4', name: 'man_person', ready: true, characterKey: 'Kimono_girl' },
                    ]}
                    availableGames={[
                        { id: 'r2', code: 'MOCK', name: 'Mock Demo Room', players: 4, maxPlayers: 4, laps: 5 },
                    ]}
                    defaultPlayers={4}
                    defaultLaps={5}
                    onStart={(settings) => startFromLobby(settings)}
                    onRefreshGames={() => Promise.resolve([{ id: 'r2', code: 'MOCK', name: 'Mock Demo Room', players: 4, maxPlayers: 4, laps: 5 }])}
                />
            </div>
        );
    }

    if (phase === 'results') {
        return <Results players={players} onRestart={restart} />;
    }

    // PLAYING phase
    const me = players[active];
    const netWorth = calculateNet(me);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Board viewer (visuals). Its internal roll button is hidden; we drive logic here */}
            <div className="h-[72vh]">
                <GameBoardViewer
                    selectedCharacter={me.characterKey}
                    pawns={players.map(p => ({
                        key: p.id,
                        character: p.characterKey || 'Cowboy', // set in lobby or default
                        index: p.pos,                          // pos updated each turn in the sim
                    }))}
                />
            </div>

            {/* HUD rendered in-place (or use HUDPortal if you have #hud-root) */}
            <HUDPortal>
                <GameHUD
                    playerName={me.name}
                    playerNumber={active + 1}
                    netWorth={netWorth}
                    timePlaying={"demo"}
                    goalLaps={me.laps}
                    totalLaps={settings.laps}
                    businessWorth={me.assetsValue}
                    loanBalance={me.loanBalance}
                    assetsValue={me.assetsValue}
                    cardsCount={Object.keys(me.inventory).length}
                    currentBusiness={BOARD_TILES[currentTileId]?.label ?? '—'}
                    currentTileLabel={BOARD_TILES[currentTileId]?.label ?? '—'}
                    currency={currency}
                    onRoll={stepTurn}
                    isMoving={isMoving}
                    showInventory={showInventory}
                    setShowInventory={setShowInventory}
                    showCard={showCard}
                    setShowCard={setShowCard}
                />
            </HUDPortal>

            {/* Right: controls + log */}
            <div className="fixed top-24 right-6 z-[1000] w-[360px] space-y-3">
                <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white">
                    <div className="px-4 py-2 bg-sky-300 border-b text-white flex items-center justify-between">
                        <div className="text-sm font-extrabold tracking-wide">Simulation Controls</div>
                        <div className={`w-3 h-3 rounded-full ${isMoving ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="text-sm text-gray-700">
                            <div><b>Active:</b> <span className="font-bold text-sky-600">{me.name}</span></div>
                            <div><b>Tile:</b> {currentTile?.label ?? '—'}</div>
                            <div><b>Lap:</b> {me.laps}/{settings.laps}</div>
                            <div><b>Cash:</b> {currency}{me.cash.toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-2 rounded-xl bg-amber-400 text-white font-semibold shadow hover:bg-amber-500 transition-colors"
                                onClick={stepTurn}
                                disabled={isMoving || everyoneDone}
                            >
                                Step Turn
                            </button>
                            <button
                                className={`px-3 py-2 rounded-xl ${auto ? 'bg-gray-500' : 'bg-emerald-500'} text-white font-semibold shadow hover:opacity-90 transition-colors`}
                                onClick={() => setAuto(a => !a)}
                                disabled={everyoneDone}
                            >
                                {auto ? 'Pause' : 'Auto Play'}
                            </button>
                            <button
                                className="px-3 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition-colors"
                                onClick={() => setPhase('results')}
                            >
                                End Now
                            </button>
                        </div>
                    </div>
                </div>

                {showDiceResult && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white p-4 text-center">
                        <div className="text-lg font-bold text-sky-700">Dice Roll</div>
                        <div className="text-4xl font-extrabold my-2">{diceResult}</div>
                        <div className="text-sm text-gray-600">{me.name} rolled a {diceResult}</div>
                    </div>
                )}

                <div className="rounded-2xl overflow-hidden shadow-2xl border bg-white max-h-[40vh]">
                    <div className="px-4 py-2 bg-sky-300 border-b text-white">
                        <div className="text-sm font-extrabold tracking-wide">Event Log</div>
                    </div>
                    <div className="p-3 space-y-2 overflow-auto max-h-[32vh]">
                        {log.length === 0 ? (
                            <div className="text-sm text-gray-500">Roll to begin…</div>
                        ) : log.map((line, i) => (
                            <div key={i} className="text-sm text-gray-700 p-2 bg-gray-50 rounded-lg">{line}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tile Modal */}
            <BoardTileModal
                open={modalOpen}
                data={activeTile}
                onClose={() => setModalOpen(false)}
                onAction={() => setModalOpen(false)}
            />
        </div>
    );
}