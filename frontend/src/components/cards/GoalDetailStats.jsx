import React from 'react';

const GoalDetailStats = () => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="p-3 rounded-lg bg-green-50 shadow text-sm">
        <p>Start Date:</p>
        <p className="font-medium text-green-700">01/01/2025</p>
      </div>
      <div className="p-3 rounded-lg bg-orange-50 shadow text-sm">
        <p>End Date:</p>
        <p className="font-medium text-orange-700">21/07/2027</p>
      </div>
      <div className="p-3 rounded-lg bg-blue-50 shadow text-sm">
        <p>Current Progress:</p>
        <p className="font-medium text-blue-700">50%</p>
      </div>
      <div className="p-3 rounded-lg bg-purple-50 shadow text-sm">
        <p>XP Reward:</p>
        <p className="font-medium text-purple-700">+200 XP</p>
      </div>
    </div>
  );
};

export default GoalDetailStats;
