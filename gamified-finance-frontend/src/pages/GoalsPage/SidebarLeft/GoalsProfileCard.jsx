// ✅ GoalsProfileCard.jsx
import React from 'react';
import Avatar from '../../../assets/Images/pixelWindow.gif';

const GoalsProfileCard = () => {
  const user = {
    name: 'Lebo',
    avatar: Avatar,
    level: 3,
    xp: 5200,
    xpTarget: 6000,
    tier: 'Silver',
  };

  const progressPercent = Math.min((user.xp / user.xpTarget) * 100, 100);
  const strokeDasharray = 276;
  const strokeDashoffset = strokeDasharray - (progressPercent / 100) * strokeDasharray;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-center relative">
      {/* Circular XP Ring */}
      <div className="relative w-28 h-28 mx-auto mb-3">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="44"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="56"
            cy="56"
            r="44"
            stroke="url(#gradientRing)"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradientRing" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-white shadow"
          />
        </div>
      </div>

      {/* User Info */}
      <h2 className="text-md font-semibold text-gray-800">{user.name}</h2>
      <p className="text-sm text-yellow-600 font-medium mb-1">Tier: {user.tier}</p>

      <div className="bg-gray-100 p-2 rounded-xl mb-3">
        <p className="text-xs text-gray-500">Level</p>
        <p className="text-lg font-bold text-gray-800">Lv {user.level}</p>
        <p className="text-xs text-green-600 mt-1">
          {user.xp} / {user.xpTarget} XP
        </p>
      </div>

      {/* Settings */}
      <button
        className="text-sm text-blue-600 hover:underline"
        onClick={() => alert('Open profile settings')}
      >
        ⚙️ Profile Settings
      </button>
    </div>
  );
};

export default GoalsProfileCard;