// src/pages/Community/CommunityGameRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import {
    FaUserFriends, FaPlay, FaClock, FaCheckCircle, FaArrowLeft,
    FaUser, FaTrophy, FaCrown, FaUsers, FaBolt, FaChartBar
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

// Connect to Socket.IO server (adjust URL as needed)
const socket = io('http://localhost:3000', { autoConnect: false });

const QUESTION_TYPES = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    OPEN_ENDED: 'open_ended'
};

const DIFFICULTY_LEVELS = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

// Mocked questions with financial literacy focus
const sampleQuestions = [
    {
        id: 1,
        question: "What is the primary purpose of a 401(k) plan?",
        options: [
            "Short-term savings account",
            "Retirement investment account",
            "College savings plan",
            "Emergency fund account"
        ],
        answer: 1,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        difficulty: DIFFICULTY_LEVELS.EASY,
        timeLimit: 20,
        points: 100
    },
    {
        id: 2,
        question: "Which of these has the highest potential investment returns (and risk)?",
        options: [
            "Savings account",
            "Corporate bonds",
            "Index funds",
            "Cryptocurrency"
        ],
        answer: 3,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        timeLimit: 25,
        points: 150
    },
    {
        id: 3,
        question: "A Roth IRA allows for tax-free withdrawals in retirement.",
        options: ["True", "False"],
        answer: 0,
        type: QUESTION_TYPES.TRUE_FALSE,
        difficulty: DIFFICULTY_LEVELS.HARD,
        timeLimit: 15,
        points: 200
    },
    {
        id: 4,
        question: "What does APR stand for?",
        options: [
            "Annual Percentage Rate",
            "Average Payment Ratio",
            "Accrued Principal Return",
            "Automatic Payment Reminder"
        ],
        answer: 0,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        timeLimit: 20,
        points: 150
    },
    {
        id: 5,
        question: "Which of these is NOT a good strategy to improve your credit score?",
        options: [
            "Paying bills on time",
            "Keeping credit card balances low",
            "Applying for multiple new credit cards each month",
            "Maintaining old credit accounts"
        ],
        answer: 2,
        type: QUESTION_TYPES.MULTIPLE_CHOICE,
        difficulty: DIFFICULTY_LEVELS.HARD,
        timeLimit: 30,
        points: 200
    }
];

// Mock player data
const mockPlayers = [
    {
        id: 'player1',
        username: 'FinanceWizard',
        score: 450,
        isHost: true,
        hasAnswered: false,
        avatar: 'FW'
    },
    {
        id: 'player2',
        username: 'MoneyMaster',
        score: 380,
        isHost: false,
        hasAnswered: true,
        avatar: 'MM'
    },
    {
        id: 'player3',
        username: 'BudgetPro',
        score: 520,
        isHost: false,
        hasAnswered: false,
        avatar: 'BP'
    },
    {
        id: 'player4',
        username: 'InvestorGuru',
        score: 410,
        isHost: false,
        hasAnswered: true,
        avatar: 'IG'
    }
];

// Mock leaderboard data
const mockLeaderboard = [
    {
        id: 'player3',
        username: 'BudgetPro',
        score: 750,
        correctAnswers: 5,
        timeBonus: 50
    },
    {
        id: 'player1',
        username: 'FinanceWizard',
        score: 680,
        correctAnswers: 4,
        timeBonus: 80
    },
    {
        id: 'player4',
        username: 'InvestorGuru',
        score: 590,
        correctAnswers: 4,
        timeBonus: 30
    },
    {
        id: 'player2',
        username: 'MoneyMaster',
        score: 550,
        correctAnswers: 3,
        timeBonus: 70
    }
];

const CommunityGameRoom = () => {
    const [step, setStep] = useState('mode');
    const [mode, setMode] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameSettings, setGameSettings] = useState({
        category: 'finance',
        difficulty: 'mixed',
        questionCount: 5,
        timePerQuestion: 30
    });
    const [players, setPlayers] = useState([]);
    const [roomCode, setRoomCode] = useState('F1N4NC3');
    const [username, setUsername] = useState('Player' + Math.floor(Math.random() * 1000));
    const [gameState, setGameState] = useState('waiting');
    const [leaderboard, setLeaderboard] = useState([]);

    // Power up related work 
    const [powerUps, setPowerUps] = useState([]);
    const availablePowerUps = [
        { id: 1, name: 'Double Points', icon: <FaBolt />, effect: 'nextQuestionDoublePoints' },
        { id: 2, name: 'Time Freeze', icon: <FaClock />, effect: 'addExtraTime' },
        { id: 3, name: '50/50', icon: <FaChartBar />, effect: 'eliminateTwoOptions' }
    ];

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [gameHistory, setGameHistory] = useState([
        {
            date: '2023-05-15T14:30:00Z',
            mode: 'solo',
            score: 450,
            totalQuestions: 5,
            correctAnswers: 4
        },
        {
            date: '2023-05-10T09:15:00Z',
            mode: 'multiplayer',
            score: 680,
            totalQuestions: 5,
            correctAnswers: 5
        }
    ]);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    // Regular function to get a power-up
    const acquirePowerUp = () => {
        const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
        setPowerUps(prev => [...prev, randomPowerUp]);
    };

    // Regular function to use a power-up
    const activatePowerUp = (powerUpId) => {
        const powerUp = powerUps.find(p => p.id === powerUpId);
        if (!powerUp) return;

        // Handle different power-up effects
        switch (powerUp.effect) {
            case 'addExtraTime':
                setTimeLeft(prev => prev + 10);
                alert('Added 10 seconds to timer!');
                break;
            case 'nextQuestionDoublePoints':
                alert('Double Points activated for next question!');
                // You would implement the double points logic here
                break;
            case 'eliminateTwoOptions':
                alert('Two incorrect options removed!');
                // You would implement the option elimination logic here
                break;
            default:
                break;
        }

        // Remove the used power-up
        setPowerUps(prev => prev.filter(p => p.id !== powerUpId));
    };


    // Initialize socket connection with mock data
    useEffect(() => {
        // Mock socket connection
        socket.connect = () => {
            console.log('Mock socket connected');
            return socket;
        };

        // Mock socket events
        socket.on('roomCreated', (code) => {
            console.log('Mock room created:', code);
            setRoomCode(code);
            setStep('lobby');
            setPlayers([...mockPlayers.slice(0, 1), {
                id: 'currentPlayer',
                username: username,
                score: 0,
                isHost: true,
                hasAnswered: false,
                avatar: username.substring(0, 2).toUpperCase()
            }]);
        });

        socket.on('playerJoined', (playerList) => {
            console.log('Mock players joined:', playerList);
            setPlayers(mockPlayers.slice(0, 3).concat([{
                id: 'currentPlayer',
                username: username,
                score: 0,
                isHost: false,
                hasAnswered: false,
                avatar: username.substring(0, 2).toUpperCase()
            }]));
        });

        socket.on('gameStarted', (questions) => {
            console.log('Mock game started with questions:', questions);
            setGameState('playing');
            setStep('playing');
            startTimer(sampleQuestions[0].timeLimit);
        });

        socket.on('playerAnswered', (data) => {
            console.log('Mock player answered:', data);
            setPlayers(prev => prev.map(p =>
                p.id === data.playerId ? { ...p, hasAnswered: true } : p
            ));
        });

        socket.on('nextQuestion', (questionIndex) => {
            console.log('Mock next question:', questionIndex);
            setCurrentQuestion(questionIndex);
            setSelected(null);
            startTimer(sampleQuestions[questionIndex]?.timeLimit || gameSettings.timePerQuestion);
        });

        socket.on('gameEnded', (finalLeaderboard) => {
            console.log('Mock game ended with leaderboard:', finalLeaderboard);
            setLeaderboard(mockLeaderboard);
            setGameState('finished');
            setStep('results');
        });

        socket.on('timeUpdate', (time) => {
            console.log('Mock time update:', time);
            setTimeLeft(time);
        });

        // Mock emit functions
        socket.emit = (event, data) => {
            console.log(`Mock socket emit: ${event}`, data);

            if (event === 'createRoom') {
                setTimeout(() => {
                    socket.emit('roomCreated', 'F1N4NC3');
                }, 500);
            } else if (event === 'joinRoom') {
                setTimeout(() => {
                    socket.emit('playerJoined', mockPlayers);
                }, 500);
            } else if (event === 'startGame') {
                setTimeout(() => {
                    socket.emit('gameStarted', sampleQuestions);
                }, 1000);
            } else if (event === 'answer') {
                setTimeout(() => {
                    const randomPlayers = mockPlayers.map(p => ({
                        ...p,
                        hasAnswered: Math.random() > 0.5
                    }));
                    socket.emit('playerAnswered', { playerId: data.playerId });
                }, 500);
            }
        };

        return () => {
            console.log('Mock socket cleanup');
        };
    }, [username]);

    const startTimer = (duration) => {
        clearInterval(timerRef.current);
        setTimeLeft(duration);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleTimeUp = () => {
        if (selected === null && mode === 'solo') {
            if (currentQuestion + 1 < sampleQuestions.length) {
                setTimeout(() => {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelected(null);
                    startTimer(sampleQuestions[currentQuestion + 1]?.timeLimit || gameSettings.timePerQuestion);
                }, 1000);
            } else {
                setStep('results');
            }
        }
    };

    const handleAnswer = (index) => {
        if (selected !== null) return;

        setSelected(index);
        const isCorrect = index === sampleQuestions[currentQuestion].answer;
        const pointsEarned = isCorrect ? sampleQuestions[currentQuestion].points : 0;

        if (mode === 'solo') {
            setScore(score + pointsEarned);
        } else {
            // Mock socket answer
            socket.emit('answer', {
                playerId: 'currentPlayer',
                questionId: sampleQuestions[currentQuestion].id,
                answerIndex: index,
                isCorrect,
                points: pointsEarned,
                timeLeft
            });
        }

        setTimeout(() => {
            if (mode === 'solo') {
                if (currentQuestion + 1 < sampleQuestions.length) {
                    setCurrentQuestion(currentQuestion + 1);
                    setSelected(null);
                    startTimer(sampleQuestions[currentQuestion + 1]?.timeLimit || gameSettings.timePerQuestion);
                } else {
                    setStep('results');
                }
            }
        }, 1000);
    };

    const createRoom = () => {
        if (!username) {
            alert('Please enter a username');
            return;
        }
        socket.emit('createRoom', {
            host: 'currentPlayer',
            username,
            settings: gameSettings
        });
    };

    const joinRoom = () => {
        if (!username || !roomCode) {
            alert('Please enter both username and room code');
            return;
        }
        socket.emit('joinRoom', {
            roomCode,
            username,
            playerId: 'currentPlayer'
        });
        setStep('lobby');
    };

    const startGame = () => {
        socket.emit('startGame');
    };

    const handleGameSettingsChange = (setting, value) => {
        setGameSettings(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const saveGameResult = () => {
        const newGame = {
            date: new Date().toISOString(),
            mode,
            score,
            totalQuestions: sampleQuestions.length,
            correctAnswers: score / 100
        };
        setGameHistory(prev => [...prev, newGame]);
    };

    return (
        <CommunityLayout>
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                <CommunityHeader />

                {/* Select Game Mode */}
                {step === 'mode' && (
                    <div className="bg-white p-6 rounded-3xl shadow text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Choose Game Mode</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setMode('solo');
                                    setStep('settings');
                                }}
                                className="flex flex-col items-center justify-center bg-[#AAD977] hover:bg-[#83AB55] text-white px-6 py-4 rounded-2xl shadow gap-2 transition-transform hover:scale-105"
                            >
                                <FaUser className="text-2xl" />
                                Solo Play
                                <span className="text-xs opacity-80">Test your knowledge alone</span>
                            </button>
                            <button
                                onClick={() => {
                                    setMode('multiplayer');
                                    setStep('multiplayer-setup');
                                }}
                                className="flex flex-col items-center justify-center bg-[#72C1F5] hover:bg-[#4BA5E6] text-white px-6 py-4 rounded-2xl shadow gap-2 transition-transform hover:scale-105"
                            >
                                <FaUserFriends className="text-2xl" />
                                Multiplayer
                                <span className="text-xs opacity-80">Challenge friends or others</span>
                            </button>
                        </div>
                        <div className="pt-2">
                            <Link
                                to="/community"
                                className="text-sm text-[#88BC46] flex items-center justify-center gap-1 hover:underline"
                            >
                                <FaArrowLeft /> Back to Community
                            </Link>
                        </div>
                    </div>
                )}

                {/* Game Settings for Solo */}
                {step === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-6 rounded-3xl shadow space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Game Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                                <select
                                    value={gameSettings.questionCount}
                                    onChange={(e) => handleGameSettingsChange('questionCount', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    {[5, 10, 15, 20].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <select
                                    value={gameSettings.difficulty}
                                    onChange={(e) => handleGameSettingsChange('difficulty', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="mixed">Mixed</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time per Question (seconds)</label>
                                <select
                                    value={gameSettings.timePerQuestion}
                                    onChange={(e) => handleGameSettingsChange('timePerQuestion', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    {[10, 15, 20, 25, 30].map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                onClick={() => setStep('mode')}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    setStep('playing');
                                    startTimer(gameSettings.timePerQuestion);
                                }}
                                className="px-6 py-2 bg-[#AAD977] hover:bg-[#83AB55] text-white rounded-lg"
                            >
                                Start Game
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Multiplayer Setup */}
                {step === 'multiplayer-setup' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-6 rounded-3xl shadow space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">Multiplayer Setup</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your display name"
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <button
                                    onClick={createRoom}
                                    className="flex items-center justify-center bg-[#72C1F5] hover:bg-[#4BA5E6] text-white px-4 py-3 rounded-lg gap-2"
                                >
                                    <FaCrown className="text-lg" />
                                    Create Room
                                </button>

                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value)}
                                        placeholder="Enter room code"
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    <button
                                        onClick={joinRoom}
                                        disabled={!roomCode || !username}
                                        className="w-full flex items-center justify-center bg-[#AAD977] hover:bg-[#83AB55] text-white px-4 py-2 rounded-lg gap-2 disabled:opacity-50"
                                    >
                                        <FaUsers className="text-lg" />
                                        Join Room
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => setStep('mode')}
                                className="text-sm text-[#88BC46] flex items-center gap-1 hover:underline"
                            >
                                <FaArrowLeft /> Back to Mode Selection
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Multiplayer Lobby */}
                {step === 'lobby' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-6 rounded-3xl shadow space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Room: {roomCode}</h2>
                            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {players.length} {players.length === 1 ? 'player' : 'players'} joined
                            </div>
                        </div>

                        <div className="border rounded-lg divide-y">
                            {players.map((player, idx) => (
                                <div key={idx} className="p-3 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                        {player.avatar || player.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium">{player.username}</span>
                                    {player.id === 'currentPlayer' && <span className="ml-2 text-xs text-gray-500">(You)</span>}
                                    {player.isHost && <FaCrown className="ml-2 text-yellow-500" />}
                                </div>
                            ))}
                        </div>

                        {players.some(p => p.id === 'currentPlayer' && p.isHost) ? (
                            <div className="space-y-3">
                                <button
                                    onClick={startGame}
                                    disabled={players.length < 2}
                                    className="w-full py-3 bg-[#AAD977] hover:bg-[#83AB55] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Start Game ({players.length}/2+)
                                </button>

                                <div className="text-sm text-gray-600">
                                    <h3 className="font-medium mb-1">Game Settings</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs">Questions</label>
                                            <select
                                                value={gameSettings.questionCount}
                                                onChange={(e) => handleGameSettingsChange('questionCount', e.target.value)}
                                                className="w-full p-1 border rounded text-sm"
                                            >
                                                {[5, 10, 15].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs">Difficulty</label>
                                            <select
                                                value={gameSettings.difficulty}
                                                onChange={(e) => handleGameSettingsChange('difficulty', e.target.value)}
                                                className="w-full p-1 border rounded text-sm"
                                            >
                                                <option value="mixed">Mixed</option>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-600">
                                Waiting for host to start the game...
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Gameplay - Solo & Multiplayer */}
                {(step === 'playing' || gameState === 'playing') && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white p-6 rounded-3xl shadow space-y-6"
                        >
                            {/* Game Header */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    {mode === 'multiplayer' && (
                                        <button
                                            onClick={() => setShowLeaderboard(!showLeaderboard)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <FaTrophy className="text-yellow-500" />
                                        </button>
                                    )}
                                    <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                                        {mode === 'solo' ? 'Solo' : `Room: ${roomCode}`}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 text-sm text-gray-700">
                                        <FaUser className="text-gray-500" />
                                        <span>{mode === 'solo' ? '1' : players.length}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm text-gray-700">
                                        <FaChartBar className="text-gray-500" />
                                        <span>{score} pts</span>
                                    </div>
                                    <div className={`flex items-center space-x-1 text-sm font-medium ${timeLeft < 10 ? 'text-red-500' : 'text-gray-700'
                                        }`}>
                                        <FaClock />
                                        <span>{timeLeft}s</span>
                                    </div>
                                </div>
                            </div>

                            {/* Leaderboard Popup */}
                            {showLeaderboard && mode === 'multiplayer' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-20 right-4 bg-white p-4 rounded-xl shadow-lg z-10 border w-64"
                                >
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                                        <FaTrophy className="mr-2 text-yellow-500" /> Leaderboard
                                    </h3>
                                    <div className="space-y-2">
                                        {mockLeaderboard.slice(0, 5).map((player, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <span className="text-gray-500 w-6">{idx + 1}.</span>
                                                    <span className={`${player.id === 'currentPlayer' ? 'font-bold text-blue-600' : ''}`}>
                                                        {player.username}
                                                    </span>
                                                </div>
                                                <span className="font-medium">{player.score} pts</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Question */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Question {currentQuestion + 1}/{sampleQuestions.length}</span>
                                    {sampleQuestions[currentQuestion]?.difficulty && (
                                        <span className={`px-2 py-1 rounded-full text-xs ${sampleQuestions[currentQuestion].difficulty === DIFFICULTY_LEVELS.EASY
                                            ? 'bg-green-100 text-green-800'
                                            : sampleQuestions[currentQuestion].difficulty === DIFFICULTY_LEVELS.MEDIUM
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {sampleQuestions[currentQuestion].difficulty}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-gray-800">
                                    {sampleQuestions[currentQuestion].question}
                                </h3>

                                {/* Answer Options */}
                                <div className="grid gap-3">
                                    {sampleQuestions[currentQuestion].options.map((opt, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: selected === null ? 1.02 : 1 }}
                                            whileTap={{ scale: selected === null ? 0.98 : 1 }}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={selected !== null}
                                            className={`w-full px-4 py-3 rounded-xl border text-left transition-all font-medium ${selected === idx
                                                ? idx === sampleQuestions[currentQuestion].answer
                                                    ? 'bg-green-100 border-green-500 text-green-700'
                                                    : 'bg-red-100 border-red-500 text-red-700'
                                                : 'bg-white hover:bg-blue-50 border-gray-300 text-gray-700'
                                                } ${selected !== null && idx === sampleQuestions[currentQuestion].answer
                                                    ? 'ring-2 ring-green-500'
                                                    : ''}`}
                                        >
                                            {opt}
                                            {mode === 'multiplayer' && selected === null && (
                                                <div className="h-1 mt-1 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500"
                                                        style={{
                                                            width: `${Math.random() * 100}%`,
                                                            opacity: 0.5
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Power-ups (for solo mode) */}
                            {mode === 'solo' && (
                                <div className="flex justify-end space-x-2">
                                    {powerUps.map(powerUp => (
                                        <button
                                            key={powerUp.id}
                                            onClick={() => activatePowerUp(powerUp.id)}  // Now using the regular function
                                            className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                        >
                                            {powerUp.icon} {powerUp.name}
                                        </button>
                                    ))}
                                    <button
                                        onClick={acquirePowerUp}  // Now using the regular function
                                        disabled={powerUps.length >= 2}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm disabled:opacity-50"
                                    >
                                        Get Power-up
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Results */}
                {(step === 'results' || gameState === 'finished') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-6 rounded-3xl shadow text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="relative">
                                <FaCheckCircle className="text-[#AAD977] text-5xl" />
                                {mode === 'multiplayer' && (
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                        {mockLeaderboard.findIndex(p => p.id === 'currentPlayer') + 1}
                                    </div>
                                )}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">Game Over!</h2>

                        {mode === 'solo' ? (
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    Your score: <span className="text-[#72C1F5] font-bold text-xl">{score}</span>
                                </p>
                                <p className="text-gray-600">
                                    Correct answers: <span className="font-medium">
                                        {score / 100}/{sampleQuestions.length}
                                    </span>
                                </p>
                                <div className="h-4 bg-gray-200 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className="h-full bg-[#AAD977]"
                                        style={{ width: `${(score / (sampleQuestions.length * 100)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-700">Final Standings</h3>
                                <div className="max-h-64 overflow-y-auto">
                                    {mockLeaderboard.map((player, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex justify-between items-center p-3 rounded-lg ${player.id === 'currentPlayer' ? 'bg-blue-50' : 'bg-gray-50'
                                                } ${idx === 0 ? 'border border-yellow-300' : ''}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {idx === 0 ? (
                                                    <FaCrown className="text-yellow-500 text-xl" />
                                                ) : (
                                                    <span className="text-gray-500 w-5">{idx + 1}.</span>
                                                )}
                                                <span className={`${player.id === 'currentPlayer' ? 'font-bold text-blue-600' : ''}`}>
                                                    {player.username}
                                                </span>
                                            </div>
                                            <span className="font-bold">{player.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setStep(mode === 'solo' ? 'settings' : 'mode');
                                    setCurrentQuestion(0);
                                    setScore(0);
                                    setSelected(null);
                                    if (mode === 'multiplayer') {
                                        socket.emit('leaveRoom');
                                    }
                                }}
                                className="px-6 py-2 bg-[#AAD977] hover:bg-[#83AB55] text-white font-semibold rounded-full"
                            >
                                Play Again
                            </button>
                            <Link
                                to="/community"
                                className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-full"
                            >
                                Back to Community
                            </Link>
                        </div>

                        {mode === 'solo' && (
                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Your Game History</h3>
                                {gameHistory.length > 0 ? (
                                    <div className="space-y-2">
                                        {gameHistory.slice(0, 3).map((game, idx) => (
                                            <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                                                <span>{new Date(game.date).toLocaleDateString()}</span>
                                                <span>{game.score} pts ({game.correctAnswers}/{game.totalQuestions})</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No previous games yet</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </CommunityLayout>
    );
};

export default CommunityGameRoom;