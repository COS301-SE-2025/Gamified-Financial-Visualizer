// src/pages/Community/CommunityGameRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import GameHUD from '../../components/game/hud/GameHUD';
import HUDPortal from '../../components/game/hud/HUDPortal';
import GameBoardViewer from '../../components/game/GameBoardViewer';
import GameLobby from '../../components/game/lobby/GameLobby';

import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useGLTF } from '@react-three/drei';

// Connect to Socket.IO server (adjust URL as needed)
const socket = io('http://localhost:3000', { autoConnect: false });
useGLTF.preload('/game/Monopoly_Game.glb');

const CommunityGameRoom = () => {
  const [step, setStep] = useState('mode');
  const [gameSettings] = useState({
    category: 'finance',
    difficulty: 'mixed',
    questionCount: 5,
    timePerQuestion: 30,
  });
  const [roomCode, setRoomCode] = useState('F1N4NC3');
  const [username, setUsername] = useState('Player' + Math.floor(Math.random() * 1000));
  const [gameAreaHeight, setGameAreaHeight] = useState(0);
  const navigate = useNavigate();
  const gameContainerRef = useRef(null);

  // Lock page scroll only while playing
  useEffect(() => {
    if (step === 'playing') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [step]);

  useEffect(() => {
    if (step === 'playing' && gameContainerRef.current) {
      setGameAreaHeight(gameContainerRef.current.offsetHeight);
    }
  }, [step]);

  const createRoom = () => {
    if (!username) return alert('Please enter a username');
    socket.emit('createRoom', { host: 'currentPlayer', username, settings: gameSettings });
    setStep('lobby');
  };

  const joinRoom = () => {
    if (!username || !roomCode) return alert('Please enter both username and room code');
    socket.emit('joinRoom', { roomCode, username, playerId: 'currentPlayer' });
    setStep('lobby');
  };

  return (
    <>
      {/* Slight spacer so content starts just under the fixed navbar (tighter to the nav) */}
      <div style={{ height: 'calc(var(--app-header-h, 75px) - 70px)' }} />

      {step === 'mode' || step === 'lobby' ? (
        // Lobby: scroll locally if tall
        <div className="px-6 h-[calc(100vh-var(--app-header-h,75px)- 70px)] overflow-auto pb-[max(24px,env(safe-area-inset-bottom))]">
          <GameLobby
            defaultMode="multiplayer"
            defaultPlayers={4}
            defaultLaps={4}
            onQuickJoin={() => { joinRoom(); setStep('lobby'); }}
            onCreateRoom={() => { createRoom(); setStep('lobby'); }}
            onJoinWithCode={(code) => { setRoomCode(code || roomCode); joinRoom(); setStep('lobby'); }}
            onWatchTutorial={() => console.log('open tutorial modal')}
            onReadRules={() => console.log('open rules modal')}
            onStart={(settings, character) => {
              console.log('START with:', settings, character);
              setStep('playing');
              socket.emit('startGame');
            }}
          />
        </div>
      ) : step === 'playing' ? (
        // Playing: fill viewport minus navbar (and safe area)
        <div
          ref={gameContainerRef}
          className="relative overflow-hidden"
          style={{
            height: 'calc(100vh - var(--app-header-h, 75px) - env(safe-area-inset-bottom, 0px))',
          }}
        >
          <GameBoardViewer glbPath="/game/Monopoly_Game.glb" />

          {/* >>> IMPORTANT: portal HUD back to the HUD layer under the navbar <<< */}
          <HUDPortal>
            <GameHUD
              currency="R"
              turn={{ name: username, cash: 5000, assetValue: 0, loanBalance: 0, laps: 0, timer: 30 }}
              tile={{ type: 'start', title: 'Start / Salary', subtitle: 'Collect on pass' }}
              onAction={(id) => console.log('HUD action:', id)}
              // gameAreaHeight available if needed
            />
          </HUDPortal>
        </div>
      ) : null}
    </>
  );
};

export default CommunityGameRoom;
