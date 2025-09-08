import { useMemo, useState } from 'react'
import { FaPlay, FaRandom, FaUserPlus, FaLink, FaInfoCircle, FaBookOpen, FaCrown, FaCoins } from 'react-icons/fa'
import CharacterSelectViewer from '../CharacterSelectViewer'

const CHARACTERS = [
    { label: 'Green girl', key: 'Green_girl' },
    { label: 'The Ninja', key: 'Ninja.001' },
    { label: 'Mr Suit', key: 'Mr_suit' },
    { label: 'A Cowboy', key: 'Cowboy' },
    { label: 'Kimono', key: 'Kimono_girl' },
    { label: 'Lilac girl', key: 'Lilac_girl' },
]

function Banner({ src = '/game/lobby-banner.png', alt = 'Game Banner' }) {
    return (
        <div className="rounded-3xl overflow-hidden border-2 border-white/20 shadow-lg mx-auto relative" style={{ aspectRatio: '5 / 1', maxWidth: 1200 }}>
            <img src={src} alt={alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0"></div>
        </div>
    )
}

function Countdown({ seconds = 5, onDone }) {
    const [n, setN] = useState(seconds)
    useState(() => {
        const t = setInterval(() => setN(v => { if (v <= 1) { clearInterval(t); onDone?.(); return 0 } return v - 1 }), 1000)
        return () => clearInterval(t)
    }, [])
    return (
        <div className="fixed inset-0 z-[2000] grid place-items-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-8xl md:text-9xl font-black text-white drop-shadow-lg animate-pulse">{n}</div>
                <div className="text-xl text-white/80 mt-4">Get ready!</div>
            </div>
        </div>
    )
}

export default function GameLobbyV3({
    highestScore = 0,
    totalPoints = 0,
    defaultMode = 'multiplayer',
    defaultPlayers = 4,
    defaultLaps = 10,
    onQuickJoin, onCreateRoom, onJoinWithCode,
    onWatchTutorial, onReadRules,
    onStart,
}) {
    const [mode, setMode] = useState(defaultMode)
    const [players, setPlayers] = useState(defaultPlayers)
    const [laps, setLaps] = useState(defaultLaps)
    const [roomCode, setRoomCode] = useState('')
    const [character, setCharacter] = useState(CHARACTERS[3]) // Cowboy
    const [countdown, setCountdown] = useState(false)
    const [saving, setSaving] = useState(false)

    const canStart = useMemo(() => (mode === 'solo' ? true : players >= 2 && players <= 6), [mode, players])
    const lapOptions = [5, 10, 15, 20]

    const start = () => setCountdown(true)
    const done = () => onStart?.({ mode, players, laps }, character.key)

    const handleSaveCharacter = () => {
        setSaving(true)
        // Simulate saving process
        setTimeout(() => setSaving(false), 800)
    }

    return (
        <div className="relative p-4 md:p-6 space-y-6 min-h-screen">
            {/* Animated background elements */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-sky-300 via-pink-300 to-rose-300 animate-pulse-slow" />
                <div className="absolute -bottom-28 -right-28 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-emerald-300 via-sky-300 to-amber-300 animate-pulse-slow delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-15 bg-gradient-to-br from-violet-300 to-fuchsia-300 animate-pulse-slow delay-500" />
            </div>

            {/* Header section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-gray-200 bg-clip-text text-transparent">Game Lobby</h1>
                    <p className="text-sky-500/80 mt-1">Customize your experience and start playing</p>
                </div>

                {/* stat chips + help */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl text-white shadow-lg bg-[#FFCE51] flex items-center gap-2">
                        <FaCrown className="text-amber-100" /> High: {highestScore}
                    </div>
                    <div className="px-4 py-2 rounded-2xl text-white shadow-lg bg-[#AAD977] flex items-center gap-2">
                        <FaCoins className="text-lime-200" /> Points: {totalPoints}
                    </div>
                    <button onClick={onReadRules} className="px-4 py-2 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
                        <FaBookOpen className="text-[#5FBFFF]" /> Rules
                    </button>
                    <button onClick={onWatchTutorial} className="px-4 py-2 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5">
                        <FaInfoCircle className="text-[#5FBFFF]" /> Tutorial
                    </button>
                </div>
            </div>

            {/* banner */}
            <Banner />

            <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                {/* LEFT: character */}
                <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-lg shadow-lg p-5">
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold text-sky-500">Select Your Character</h2>
                        <p className="text-sky-500/80 text-sm">Choose your avatar for the game</p>
                    </div>

                    <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100 to-indigo-100 h-72 mb-4 border border-white/30 shadow-inner">
                        <CharacterSelectViewer glbPath="/game/Monopoly_Characters.glb" focus={character?.key} />
                    </div>

                    <div className="text-sky-500 font-semibold mb-3 px-1">Available Characters</div>
                    <div className="grid grid-cols-2 gap-3">
                        {CHARACTERS.map((c) => (
                            <button
                                key={c.key}
                                onClick={() => setCharacter(c)}
                                className={`px-4 py-3 rounded-2xl border transition-all shadow-sm
                  ${character.key === c.key
                                        ? 'bg-[#8dcced] text-white shadow-lg transform -translate-y-1'
                                        : 'bg-white/90 hover:bg-sky-50 border-sky-100 hover:shadow-md hover:-translate-y-0.5'}`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <button className="px-4 py-2.5 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm transition-all hover:shadow-md">
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCharacter}
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

                {/* RIGHT: options */}
                <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-lg shadow-lg p-5">
                    <div className="text-center mb-5">
                        <h2 className="text-xl font-bold text-sky-500">Game Settings</h2>
                        <p className="text-sky-500/80 text-sm">Configure your gameplay options</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Game Mode */}
                        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
                            <div className="text-sky-400 font-semibold mb-3">Game Mode</div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setMode('multiplayer')}
                                    className={`flex-1 px-4 py-3 rounded-2xl border transition-all
                    ${mode === 'multiplayer'
                                            ? 'bg-[#8dcced] text-white transform -translate-y-1'
                                            : 'bg-white/90 hover:bg-sky-50 border-sky-100 hover:shadow-md hover:-translate-y-0.5'}`}
                                >Multiplayer</button>
                            </div>
                        </div>

                        {/* Players */}
                        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
                            <label className="text-sky-400 font-semibold block mb-3">Players: {players}</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min={mode === 'solo' ? 1 : 2}
                                    max={6}
                                    value={players}
                                    onChange={(e) => setPlayers(Number(e.target.value))}
                                    className="flex-1 accent-sky-500 h-2 rounded-full bg-white"
                                />
                                <div className="w-10 h-10 rounded-full bg-[#8dcced] text-white flex items-center justify-center font-bold shadow-sm">
                                    {players}
                                </div>
                            </div>
                        </div>

                        {/* Play with others */}
                        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
                            <div className="text-sky-400 font-semibold mb-3">Play with others</div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button
                                    onClick={onQuickJoin}
                                    className="px-4 py-3 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <FaRandom className="text-sky-600" /> Quick Join
                                </button>
                                <button
                                    onClick={onCreateRoom}
                                    className="px-4 py-3 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <FaUserPlus className="text-sky-600" /> Create room
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        placeholder="Enter room code"
                                        className="w-full px-4 py-3 rounded-2xl border border-sky-200 bg-white/90 focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => onJoinWithCode?.(roomCode)}
                                    disabled={!roomCode.trim()}
                                    className="px-4 py-3 rounded-2xl border border-sky-200 bg-white/90 hover:bg-white shadow-sm flex items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    <FaLink className="text-sky-600" /> Join
                                </button>
                            </div>
                        </div>

                        {/* Laps */}
                        <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100">
                            <div className="text-sky-700 font-semibold mb-3">Game Laps</div>
                            <div className="flex flex-wrap gap-3">
                                {lapOptions.map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setLaps(n)}
                                        className={`px-4 py-2.5 rounded-2xl border transition-all
                      ${laps === n
                                                ? 'bg-[#FFCE51] text-white shadow-lg border-amber-200 transform -translate-y-1'
                                                : 'bg-white hover:bg-sky-50 border-sky-100 hover:shadow-md hover:-translate-y-0.5'}`}
                                    >
                                        {n} {n === 1 ? 'lap' : 'laps'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PLAY button */}
                    <div className="mt-8 flex items-center justify-center">
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
            </div>

            {countdown && <Countdown seconds={5} onDone={done} />}
        </div>
    )
}