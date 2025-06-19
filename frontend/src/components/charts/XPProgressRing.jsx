import React from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';

const XPProgressRing = ({ xp = 350 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow text-center w-full h-full">
      <p className="text-sm font-semibold text-gray-700 mb-4">XP Progress</p>

      <div className="relative w-40 h-40 mx-auto">
        <svg viewBox="0 0 100 100" className="w-40 h-40">
          <defs>
            <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFFF" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#eee"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeDasharray="270"
            strokeDashoffset="67"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>


        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-[#2D3748]">{xp}</p>
          <p className="text-lg text-[#e03b3b]">XP</p>
        </div>
      </div>
    </div>
  );
};

export default XPProgressRing;
