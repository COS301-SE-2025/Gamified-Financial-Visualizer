import React from 'react';

const GoalStatsCard = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-2">
      <h3 className="text-md font-semibold text-gray-800">Goal Stats</h3>
      <p className="text-sm text-gray-600">Goals Created: 5</p>
      <p className="text-sm text-gray-600">Completed: 2</p>
      <p className="text-sm text-gray-600">Active: 3</p>
      <p className="text-sm text-gray-600">XP Earned: 480</p>
    </div>
  );
};

export default GoalStatsCard;
