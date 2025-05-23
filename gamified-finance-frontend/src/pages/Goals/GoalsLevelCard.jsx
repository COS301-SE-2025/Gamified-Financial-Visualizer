import React from 'react';
import badgeXp from '../../assets/Images/pixelStreet.gif';

const GoalsLevelCard = ({ level = 3, points = 5200, nextLevelPoints = 6000 }) => {
  const pointsToNext = nextLevelPoints - points;
  const progressPercent = Math.min((points / nextLevelPoints) * 100, 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
      {/* Level and Badge */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Lv Silver</h3>
        <img
          src={badgeXp}
          alt="XP Badge"
          className="w-6 h-6 rounded-full"
          title="Experience Points"
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Level Info */}
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <span>Level {level}</span>
        <span>{points}/{nextLevelPoints} XP</span>
        <span>Level {level + 1}</span>
      </div>

      {/* Points to Next */}
      <p className="mt-2 text-xs text-green-600">
        🎯 {pointsToNext} Points to next level
      </p>
    </div>
  );
};

export default GoalsLevelCard;
