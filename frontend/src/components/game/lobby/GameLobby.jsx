// GameLobby.jsx (inline panels version)
import { useEffect, useMemo, useState } from 'react'
import {
    FaPlay, FaRandom, FaUserPlus, FaLink, FaInfoCircle, FaBookOpen, FaCrown, FaCoins,
    FaUsers, FaUser, FaLock, FaDoorOpen, FaSignOutAlt, FaSyncAlt, FaKey, FaClipboard, FaClipboardCheck
} from 'react-icons/fa'

import CharacterSelectViewer from '../CharacterSelectViewer'
import { io } from 'socket.io-client';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getSocket } from '../socket';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";


const ALL_CHARACTERS = [
    { label: 'Green girl', key: 'Green_girl' },
    { label: 'The Ninja', key: 'Ninja.001' },
    { label: 'Mr Suit', key: 'Mr_suit' },
    { label: 'A Cowboy', key: 'Cowboy' },
    { label: 'Kimono', key: 'Kimono_girl' },
    { label: 'Lilac girl', key: 'Lilac_girl' },
]

function genCode() {
    return Math.random().toString(36).slice(2, 6).toUpperCase()
}

function PlayerList({ players = [] }) {
    return (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
            <div className="flex items-center gap-2 text-sky-500 font-semibold mb-3">
                <FaUsers /> Players in lobby ({players.length})
            </div>
            <div className="space-y-2">
                {players.length === 0 && <div className="text-sm text-gray-500">No one here yet.</div>}
                {players.map(p => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 border">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-100 grid place-items-center">
                                <FaUser className="text-sky-500" />
                            </div>
                            <div className="leading-tight">
                                <div className="font-semibold">{p.name}</div>
                                <div className="text-xs text-gray-500">{p.characterKey || 'No character yet'}</div>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs ${p.ready ? 'bg-lime-100 text-lime-700' : 'bg-gray-100 text-gray-600'}`}>
                            {p.ready ? 'Ready' : 'Not ready'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function GameLobby({
    highestScore = 0,
    totalPoints = 0,
    defaultMode = 'multiplayer',
    defaultPlayers = 4,
    defaultLaps = 10,

    currentPlayers,
    availableGames,

    onCreateRoom,
    onJoinWithCode,
    onWatchTutorial,
    onReadRules,
    onLeaveLobby,
    onLeaveGame,
    onRefreshGames,
    onSaveCharacter,
    onStart,

    onQuickJoin,
}) {



    // global settings (left cards at top)
    const [mode, setMode] = useState(defaultMode)
    const [players, setPlayers] = useState(defaultPlayers)
    const [laps, setLaps] = useState(defaultLaps)

    // character picker
    const [character, setCharacter] = useState(ALL_CHARACTERS[3]) // Cowboy
    const [saving, setSaving] = useState(false)

    // inline panels
    const [showQuick, setShowQuick] = useState(false)
    const [showCreate, setShowCreate] = useState(false)

    // quick join data
    const [rooms, setRooms] = useState(availableGames || [])
    const [roomsRefreshing, setRoomsRefreshing] = useState(false)
    const [joinCode, setJoinCode] = useState('')

    // create room data
    const [roomName, setRoomName] = useState('My Room')
    const [roomMaxPlayers, setRoomMaxPlayers] = useState(4)
    const [roomLaps, setRoomLaps] = useState(10)
    const [roomCode, setRoomCode] = useState(() => genCode())

    const [countdown, setCountdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

        useEffect(() => {
        const socket = getSocket(token, user?.id);

        socket.on('connect_error', (err) => {
            console.error('Socket connection failed:', err.message);
        });

        return () => socket.off("connect_error", error);
    }, [token, user]);

    const lapOptions = [5, 10, 15, 20]
    const [playersInLobby, setPlayersInLobby] = useState([]);

    /*
   const playersInLobby = currentPlayers ?? [
       { id: 'u1', name: 'lily_rose', ready: true, characterKey: 'Green_girl' },
       { id: 'u2', name: 'big_bucks', ready: false, characterKey: 'Mr_suit' },
   ]
       */

    const takenKeys = new Set(
        playersInLobby
            .filter(p => p.characterKey && p.characterKey !== character?.key)
            .map(p => p.characterKey)
    );


    const canStart = useMemo(() => (mode === 'solo' ? true : players >= 2 && players <= 6), [mode, players])

    useEffect(() => { if (Array.isArray(availableGames)) setRooms(availableGames) }, [availableGames])

    const handleSaveCharacter = async () => {
        if (!character?.key) return;
        try {
            setSaving(true);
            const res = await apiCall('/lobby/character', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user?.id,
                    character: character.key
                }),
            });
            if (res.success) {
                //  onSaveCharacter?.(character.key);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    const handleRefreshRooms = async () => {
        try {
            setRoomsRefreshing(true)
            // getPublicLobbies();
            const res = await (onRefreshGames?.() ?? new Promise(res => setTimeout(() => {
                res([
                    { id: 'r1', code: 'ABCD', name: 'Public Room', players: 2, maxPlayers: 6, laps: 10 },
                    { id: 'r2', code: 'PQRS', name: 'Speed Run', players: 4, maxPlayers: 4, laps: 5 },
                ])
            }, 600)))
            if (Array.isArray(res)) setRooms(res)
        } finally {
            setRoomsRefreshing(false)
        }
    }




    // API Functions
    const apiCall = async (endpoint, options = {}) => {
        console.log('API Call:', endpoint, options);
        const response = await fetch(`${BASE_URL}/api/game${endpoint}`, {
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

    const handleCreateLobby = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await apiCall('/lobby/create', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: user?.id,
                    username: user?.username,
                    gameMode: 'laps',
                    maxLaps: laps,
                    maxPlayers: players,
                    isPrivate: false
                })
            });

            if (response.success) {
                console.log('Lobby created:', response.lobby);
                setRoomCode(response.lobby.code);
                onCreateRoom?.(response.lobby);
                setShowCreate(false);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinLobby = async (code) => {
        try {
            setLoading(true);
            setError('');

            const response = await apiCall('/lobby/join', {
                method: 'POST',
                body: JSON.stringify({ user_id: user?.id, username: user?.username, code }),
            });

            if (response.success) {
                console.log('Joined lobby:', response.lobby);
                onJoinWithCode?.(response.lobby);
            }

            // update lobby
            await handleGetMyLobby();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickMatch = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await apiCall('/matchmaking/quick-match', {
                method: 'POST',
                body: JSON.stringify({
                    gameMode: 'laps',
                    maxLaps: laps,
                    user: JSON.stringify({ user_id: user?.id, username: user?.username })
                }),
            });

            if (response.success) {
                console.log('Quick match found:', response.lobby);
                onQuickJoin?.(response.lobby);
            }

            await handleGetMyLobby();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getPublicLobbies = async () => {
        try {
            const response = await apiCall('/quick-match', {
                method: 'GET',
            });

            if (response.success && Array.isArray(response.lobbies)) {
                setRooms(response.lobbies);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGetMyLobby = async () => {
        try {
            const response = await apiCall('/lobby/my-lobby', {
                method: 'POST',
                body: JSON.stringify({ user_id: user?.id })
            });

            if (response.success && response.lobby) {
                console.log('Current lobby:', response.lobby);
                return response.lobby;
            }
            return null;
        } catch (err) {
            console.error('Error getting current lobby:', err);
            return null;
        }
    };

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const response = await apiCall('/lobby/my-lobby', {
                    method: 'POST',
                    body: JSON.stringify({ user_id: user.id })
                });
                const data = response;

                if (data.success && data.lobby) {
                    const mappedPlayers = data.lobby.players.map(p => ({
                        id: p.id,
                        name: p.username,
                        ready: p.isReady,
                        characterKey: p.character?.name ?? null,
                    }));

                    setPlayersInLobby(mappedPlayers);
                } else {
                    setPlayersInLobby([]); // no lobby found
                }
            } catch (err) {
                console.error('Error fetching lobby:', err);
            }
        };

        fetchLobby();
    }, [user]);

    const handleLeaveLobby = async () => {
        try {
            const response = await apiCall('/lobby/leave', {
                method: 'POST',
                body: JSON.stringify({ user_id: user?.id }),
            });

            if (response.success) {
                console.log('Left lobby successfully');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateLobbySettings = async (newSettings) => {
        try {
            const response = await apiCall('/lobby/settings', {
                method: 'PUT',
                body: JSON.stringify(newSettings),
            });

            if (response.success) {
                console.log('Lobby settings updated');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const start = () => {
        if (!canStart) return;
        //  socket.emit('lobby:start-game');  // backend will pick up userId from socket.data
        onStart?.({ mode, players, laps }, character.key);
        setCountdown(true);
    };

    const done = () => onStart?.({ mode, players, laps }, character.key)




    return (
        <div className="relative p-4 md:p-6 space-y-6 min-h-screen">
            {/* header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-gray-200 bg-clip-text text-transparent">
                        Game Lobby
                    </h1>
                    <p className="text-sky-500/80 mt-1">Customize your experience and start playing</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={handleLeaveLobby} className="px-4 py-2 rounded-2xl border border-red-200 bg-white hover:bg-red-50 text-red-600 flex items-center gap-2">
                        <FaDoorOpen /> Leave Lobby
                    </button>
                    <button onClick={onLeaveGame} className="px-4 py-2 rounded-2xl bg-red-400 hover:bg-red-500 text-white flex items-center gap-2 shadow">
                        <FaSignOutAlt /> Leave Game
                    </button>
                    <div className="px-4 py-2 rounded-2xl text-white shadow-lg bg-[#FFCE51] flex items-center gap-2">
                        <FaCrown className="text-amber-100" /> High: {highestScore}
                    </div>
                    <div className="px-4 py-2 rounded-2xl text-white shadow-lg bg-[#AAD977] flex items-center gap-2">
                        <FaCoins className="text-lime-200" /> Points: {totalPoints}
                    </div>
                    <button onClick={onReadRules} className="px-4 py-2 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center gap-2">
                        <FaBookOpen className="text-[#5FBFFF]" /> Rules
                    </button>
                    <button onClick={onWatchTutorial} className="px-4 py-2 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center gap-2">
                        <FaInfoCircle className="text-[#5FBFFF]" /> Tutorial
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
                {/* LEFT COLUMN */}
                <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-lg shadow-lg p-5 space-y-5">
                    {/* top settings */}
                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Mode */}
                        <div className="text-sky-400 font-semibold mb-3">Game Mode</div>

                        {/* Players */}

                        {/* Play with others */}
                        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 md:col-span-2">
                            <div className="text-sky-400 font-semibold mb-3">Play with others</div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => { setShowQuick(v => !v); if (!showQuick) handleRefreshRooms(); }}
                                    className={`px-4 py-3 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center justify-center gap-2 transition-all
                    ${showQuick ? 'ring-2 ring-sky-300' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                                >
                                    <FaRandom className="text-sky-600" /> Quick Join
                                </button>

                                <button
                                    onClick={() => { setShowCreate(v => !v); }}
                                    className={`px-4 py-3 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center justify-center gap-2 transition-all
                    ${showCreate ? 'ring-2 ring-sky-300' : 'hover:shadow-md hover:-translate-y-0.5'}`}
                                >
                                    <FaUserPlus className="text-sky-600" /> Create room
                                </button>
                            </div>

                            {/* INLINE: Quick Join */}
                            {showQuick && (
                                <div className="mt-4 p-4 rounded-2xl border bg-white/90 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-sky-600 flex items-center gap-2">
                                            <FaRandom /> Available games
                                        </div>
                                        <button
                                            onClick={handleRefreshRooms}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-white hover:bg-sky-50"
                                            disabled={roomsRefreshing}
                                        >
                                            <FaSyncAlt className={`${roomsRefreshing ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border bg-gray-50">
                                            <FaKey className="text-gray-500" />
                                            <input
                                                value={joinCode}
                                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                                placeholder="Enter room code"
                                                className="bg-transparent outline-none flex-1"
                                            />
                                        </div>
                                        <button
                                            onClick={handleJoinLobby.bind(null, joinCode.trim())}
                                            disabled={!joinCode.trim()}
                                            className="px-4 py-2 rounded-xl bg-lime-500 text-white hover:bg-lime-600 disabled:opacity-60"
                                        >
                                            Join
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-60 overflow-auto">
                                        {rooms.length === 0 ? (
                                            <div className="text-sm text-gray-500">No open rooms found.</div>
                                        ) : rooms.map(r => (
                                            <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border">
                                                <div className="leading-tight">
                                                    <div className="font-semibold">{r.name || `Room ${r.code}`}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Code: {r.code} • {r.players}/{r.maxPlayers} players • {r.laps} laps
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleJoinLobby(r.code)}
                                                    className="px-3 py-2 rounded-xl border bg-lime-500 text-white hover:bg-lime-600"
                                                >
                                                    Join
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* INLINE: Create Room */}
                            {showCreate && (
                                <div className="mt-4 p-4 rounded-2xl border bg-white/90 space-y-4">
                                    <div className="font-semibold text-sky-600 flex items-center gap-2">
                                        <FaUserPlus /> Create a room
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Max players: {roomMaxPlayers}</label>
                                            <input
                                                type="range" min={2} max={6} value={roomMaxPlayers}
                                                onChange={(e) => setRoomMaxPlayers(Number(e.target.value))}
                                                className="w-full accent-sky-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Game laps</label>
                                            <div className="flex flex-wrap gap-2">
                                                {lapOptions.map(n => (
                                                    <button
                                                        key={n} onClick={() => setRoomLaps(n)}
                                                        className={`px-3 py-1.5 rounded-xl border ${roomLaps === n ? 'bg-amber-400 text-white' : 'bg-white hover:bg-sky-50'}`}
                                                    >
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border bg-gray-50">
                                            <FaKey className="text-gray-500" />
                                            <div className="font-mono">{roomCode}</div>
                                        </div>
                                        <button onClick={() => setRoomCode(genCode())} className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50">
                                            Regenerate
                                        </button>
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => setShowCreate(false)}
                                            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await handleCreateLobby();   // call your async lobby creation function
                                                // close the create room panel after successful creation
                                            }}
                                            className="px-4 py-2 rounded-xl bg-lime-500 text-white hover:bg-lime-600"
                                        >
                                            Create
                                        </button>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>

                    {/* Players list  show only if lobby has been created or joined*/}
                    {playersInLobby.length > 0 ? (
                        <PlayerList players={playersInLobby} />
                    ) : (
                        <div className="text-gray-500">No players in lobby yet</div>
                    )}

                    {/* Start game */}
                    <div className="mt-2 flex items-center justify-center">
                        {/*Room code */}
                        {roomCode && (
                            <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gray-50">
                                <FaClipboard className="text-gray-500" />
                                <div className="font-mono">{roomCode}</div>
                                <CopyToClipboard text={roomCode} onCopy={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                                    <button className="px-2 py-1 rounded-lg bg-sky-500 text-white text-xs hover:bg-sky-600">
                                        {copied ? 'Copied!' : <FaClipboardCheck />}
                                    </button>
                                </CopyToClipboard>
                            </div>
                        )}
                        <button
                            disabled={!canStart}
                            onClick={start}
                            className="px-10 py-4 rounded-3xl text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100
               bg-gradient-to-r from-[#AAD977] to-lime-300 hover:from-lime-300 hover:to-[#AAD977] hover:shadow-2xl
               flex items-center gap-3 text-xl font-extrabold tracking-wide relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-all transform group-hover:scale-150"></span>
                            <FaPlay className="text-lg" /> START GAME
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: character select */}
                <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-lg shadow-lg p-5">
                    <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-indigo-100 h-72 mb-4 border border-white/30 shadow-inner">
                        <CharacterSelectViewer glbPath="/game/Monopoly_Characters.glb" focus={character?.key} />
                    </div>

                    <div className="text-sky-500 font-semibold mb-3 px-1">Available Characters</div>
                    <div className="grid grid-cols-2 gap-3">
                        {ALL_CHARACTERS.map((c) => {
                            // Check if this character is taken by someone else
                            const isTaken = takenKeys.has(c.key);

                            return (
                                <button
                                    key={c.key}
                                    onClick={() => {
                                        if (!isTaken) {
                                            setCharacter(c)
                                            //  handleSaveCharacter()
                                        }
                                    }}
                                    disabled={isTaken || saving} // disable while saving
                                    className={`relative px-4 py-3 rounded-2xl border transition-all shadow-sm
          ${character?.key === c.key
                                            ? 'bg-[#8dcced] text-white shadow-lg transform -translate-y-1'
                                            : 'bg-white/90 hover:bg-sky-50 border-sky-100 hover:shadow-md hover:-translate-y-0.5'
                                        }
          ${isTaken ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    title={isTaken ? 'Taken by another player' : 'Select'}
                                >
                                    {/* Render the label safely as a string */}
                                    {c.label}

                                    {/* Show lock if taken */}
                                    {isTaken && (
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white grid place-items-center shadow">
                                            <FaLock />
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <button
                            onClick={handleLeaveLobby}
                            className="px-4 py-2.5 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm transition-all hover:shadow-md flex items-center gap-2"
                        >
                            <FaDoorOpen /> Leave
                        </button>
                        <button
                            onClick={() => handleSaveCharacter()}
                            disabled={saving}
                            className="px-4 py-2.5 rounded-2xl bg-[#AAD977] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Character'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
