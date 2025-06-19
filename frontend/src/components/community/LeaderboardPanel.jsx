// src/components/community/LeaderboardPanel.jsx
import React from 'react';

const mockLeaderboard = [
  { username: 'ayaka', level: 'Platinum', xp: 5600 },
  { username: 'moonrider', level: 'Gold', xp: 4800 },
  { username: 'zuluX', level: 'Silver', xp: 3700 },
];

const LeaderboardPanel = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-4">
      <h3 className="text-lg font-bold text-gray-700 border-b pb-2">🏆 Leaderboard</h3>

      {mockLeaderboard.map((user, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-1 border-b last:border-b-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-white text-sm font-bold">
              {i + 1}
            </div>
            <span className="text-sm font-medium text-gray-800">{user.username}</span>
          </div>
          <div className="text-xs text-gray-500">
            {user.level} • {user.xp} XP
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPanel;
