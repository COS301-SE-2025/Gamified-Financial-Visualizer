import React, { useEffect, useState } from 'react';
import { FaDice, FaUsers, FaTrophy, FaRocket, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function GameLoader({ 
  players = [], 
  gameSettings = {}, 
  onComplete,
  loadingProgress = 0 
}) {
  const [tips] = useState([
    "Tip: Buying businesses early can give you a steady income stream!",
    "Tip: Landing on your own businesses earns you rent from other players!",
    "Tip: Complete laps to earn your salary and boost your cash flow!",
    "Tip: Keep an eye on your loan balance - interest can add up quickly!",
    "Tip: Some tiles offer special actions that can change the game!",
    "Tip: The player with the highest net worth at the end wins!",
  ]);
  const [currentTip, setCurrentTip] = useState(0);
  const [readyPlayers, setReadyPlayers] = useState(new Set());
  const [countdown, setCountdown] = useState(3);

  // Rotate tips every 3 seconds
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    
    return () => clearInterval(tipInterval);
  }, [tips.length]);

  // Simulate players getting ready
  useEffect(() => {
    const readyInterval = setInterval(() => {
      if (readyPlayers.size < players.length) {
        const nextPlayer = players[readyPlayers.size];
        if (nextPlayer) {
          setReadyPlayers(prev => new Set([...prev, nextPlayer.id]));
        }
      }
    }, 800);
    
    return () => clearInterval(readyInterval);
  }, [players, readyPlayers.size]);

  // Countdown and completion
  useEffect(() => {
    if (loadingProgress >= 100 && readyPlayers.size === players.length) {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setTimeout(() => onComplete?.(), 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [loadingProgress, readyPlayers.size, players.length, onComplete]);

  const allPlayersReady = readyPlayers.size === players.length;
  const allAssetsLoaded = loadingProgress >= 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-4 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaRocket className="text-3xl text-yellow-300 animate-bounce" />
            <h1 className="text-4xl font-bold text-white">Get Ready to Play!</h1>
            <FaRocket className="text-3xl text-yellow-300 animate-bounce" />
          </div>
          <p className="text-blue-100 text-lg">Loading your game adventure...</p>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Left Column - Loading Progress */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                Loading Game Assets
              </h2>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-white/80 text-sm mb-2">
                  <span>Loading...</span>
                  <span>{Math.round(loadingProgress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
              </div>

              {/* Loading Steps */}
              <div className="space-y-3">
                {[
                  { label: "Game Board", completed: loadingProgress > 20 },
                  { label: "3D Models", completed: loadingProgress > 40 },
                  { label: "Character Assets", completed: loadingProgress > 60 },
                  { label: "Game Logic", completed: loadingProgress > 80 },
                  { label: "Final Setup", completed: loadingProgress >= 100 }
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white/50'
                    }`}>
                      {step.completed ? <FaCheckCircle /> : index + 1}
                    </div>
                    <span className={`font-medium ${
                      step.completed ? 'text-green-300' : 'text-white/70'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Tips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaDice className="text-yellow-400" />
                Pro Tip
              </h3>
              <div className="bg-black/20 rounded-xl p-4 min-h-[60px] flex items-center">
                <p className="text-blue-100 text-sm leading-relaxed">
                  {tips[currentTip]}
                </p>
              </div>
              <div className="flex justify-center mt-3 gap-1">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTip ? 'bg-yellow-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Players Ready */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaUsers />
                Players Getting Ready
                <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded-full ml-2">
                  {readyPlayers.size}/{players.length}
                </span>
              </h2>
              
              <div className="space-y-3">
                {players.map((player, index) => {
                  const isReady = readyPlayers.has(player.id);
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        isReady
                          ? 'bg-green-500/20 border border-green-500/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        isReady
                          ? 'bg-green-500 text-white'
                          : 'bg-white/20 text-white/70 animate-pulse'
                      }`}>
                        {isReady ? <FaCheckCircle /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{player.name}</div>
                        <div className="text-xs text-white/60">
                          {isReady ? 'Ready to play!' : 'Getting ready...'}
                        </div>
                      </div>
                      {isReady && (
                        <FaCheckCircle className="text-green-400 text-lg" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Game Settings */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                Game Settings
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-white/80">Game Mode:</div>
                <div className="text-white font-medium">{gameSettings.mode || 'Laps'}</div>
                
                <div className="text-white/80">Total Laps:</div>
                <div className="text-white font-medium">{gameSettings.laps || 10}</div>
                
                <div className="text-white/80">Players:</div>
                <div className="text-white font-medium">{players.length}</div>
                
                <div className="text-white/80">Starting Cash:</div>
                <div className="text-white font-medium">R10,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown Section */}
        {(allPlayersReady && allAssetsLoaded) && (
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center border-t border-white/20">
            <div className="flex items-center justify-center gap-4">
              <div className="text-white text-lg font-semibold">Starting in:</div>
              <div className="text-4xl font-bold text-yellow-300 bg-black/30 px-6 py-3 rounded-2xl min-w-[80px]">
                {countdown > 0 ? countdown : 'GO!'}
              </div>
              <div className="text-white text-lg font-semibold">
                {countdown > 0 ? 'seconds' : 'Game starting...'}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-black/20 p-4 text-center">
          <p className="text-white/60 text-sm">
            Please wait while we prepare your game experience...
          </p>
        </div>
      </div>
    </div>
  );
}