import React from 'react';

const XPProgressRing = ({ level, xp }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 flex items-center justify-center text-white text-xl font-bold">
        {level}
      </div>
      <p className="mt-2 text-sm text-gray-700">Level {level}</p>
      <p className="text-xs text-gray-500">{xp} XP</p>
    </div>
  );
};

export default XPProgressRing;
