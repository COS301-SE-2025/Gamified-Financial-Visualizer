// src/pages/Community/CommunityGameRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import GameHUD from '../../components/game/hud/GameHUD'
import HUDPortal from '../../components/game/hud/HUDPortal'
import CommunityLayout from '../../pages/Community/CommunityLayout';
import GameBoardViewer from '../../components/game/GameBoardViewer';
import GameLobby from '../../components/game/lobby/GameLobby';
import CharacterSelectViewer from '../../components/game/CharacterSelectViewer'

import { FaClock, FaBolt, FaChartBar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useGLTF } from '@react-three/drei'

// Connect to Socket.IO server (adjust URL as needed)
const socket = io('http://localhost:3000', { autoConnect: false });
useGLTF.preload('/game/Monopoly_Game.glb')

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
    const [headerHeight, setHeaderHeight] = useState(0);
    const [gameAreaHeight, setGameAreaHeight] = useState(0);

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
    const gameContainerRef = useRef(null);

    useEffect(() => {
        // Function to calculate header height
        const calculateHeaderHeight = () => {
            const header = document.querySelector('header');
            if (header) {
                setHeaderHeight(header.offsetHeight);
            } else {
                // Fallback if no header is found
                setHeaderHeight(80); // Default header height
            }
        };
        
        // Calculate initially
        calculateHeaderHeight();
        
        // Recalculate on window resize
        window.addEventListener('resize', calculateHeaderHeight);
        
        return () => {
            window.removeEventListener('resize', calculateHeaderHeight);
        };
    }, []);

    useEffect(() => {
        // Calculate game area height when step changes to playing
        if (step === 'playing' && gameContainerRef.current) {
            setGameAreaHeight(gameContainerRef.current.offsetHeight);
        }
    }, [step]);

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

        // Player joining a game socekt
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

        // Game startign
        socket.on('gameStarted', (questions) => {
            console.log('Mock game started with questions:', questions);
            setGameState('playing');
            setStep('playing');
            startTimer(sampleQuestions[0].timeLimit);
        });

        // How the player answers 
        socket.on('playerAnswered', (data) => {
            console.log('Mock player answered:', data);
            setPlayers(prev => prev.map(p =>
                p.id === data.playerId ? { ...p, hasAnswered: true } : p
            ));
        });

        // the next question 
        socket.on('nextQuestion', (questionIndex) => {
            console.log('Mock next question:', questionIndex);
            setCurrentQuestion(questionIndex);
            setSelected(null);
            startTimer(sampleQuestions[questionIndex]?.timeLimit || gameSettings.timePerQuestion);
        });

        // Ended the game 
        socket.on('gameEnded', (finalLeaderboard) => {
            console.log('Mock game ended with leaderboard:', finalLeaderboard);
            setLeaderboard(mockLeaderboard);
            setGameState('finished');
            setStep('results');
        });

        // the time limit updating
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
            {step === 'mode' || step === 'lobby' ? (
                <GameLobby
                    defaultMode="multiplayer"
                    defaultPlayers={4}
                    defaultLaps={4}
                    onQuickJoin={() => {
                        // use your existing joinRoom mock
                        joinRoom()
                        setStep('lobby')
                    }}
                    onCreateRoom={() => {
                        createRoom()
                        setStep('lobby')
                    }}
                    onJoinWithCode={(code) => {
                        setRoomCode(code || roomCode)
                        joinRoom()
                        setStep('lobby')
                    }}
                    onWatchTutorial={() => console.log('open tutorial modal')}
                    onReadRules={() => console.log('open rules modal')}
                    onStart={(settings, character) => {
                        // persist chosen settings/character as needed, then start
                        console.log('START with:', settings, character)
                        setStep('playing')          // next: render the board + HUD here
                        socket.emit('startGame')    // triggers your existing mock flow
                    }}
                />
            ) : step === 'playing' ? (
                <div 
                    ref={gameContainerRef}
                    className="relative overflow-hidden"
                    style={{ 
                        height: `calc(100vh - ${headerHeight}px)`,
                        marginTop: `${headerHeight}px`
                    }}
                >
                    <GameBoardViewer glbPath="/game/Monopoly_Game.glb" />
                    <HUDPortal>
                        <GameHUD
                            currency="R"
                            turn={{ name: username, cash: 5000, assetValue: 0, loanBalance: 0, laps: 0, timer: 30 }}
                            tile={{ type: 'start', title: 'Start / Salary', subtitle: 'Collect on pass' }}
                            onAction={(id) => console.log('HUD action:', id)}
                            headerHeight={headerHeight}
                            gameAreaHeight={gameAreaHeight}
                        />
                    </HUDPortal>
                </div>
            ) : null}
        </CommunityLayout>
    );
};

export default CommunityGameRoom;