import React from 'react';

const BadgeRow = () => {
  const badges = ['🏆', '🎯', '💰', '🧠'];

  return (
    <div className="bg-white p-3 rounded-xl shadow grid grid-cols-4 gap-2">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center text-xl">
            {badge}
          </div>
          <p className="text-xs mt-1 text-gray-600">Badge {index + 1}</p>
        </div>
      ))}
    </div>
  );
};

export default BadgeRow;
