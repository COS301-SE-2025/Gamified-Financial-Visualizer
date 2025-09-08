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