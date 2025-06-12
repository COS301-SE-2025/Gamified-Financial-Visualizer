import React from 'react';

const GoalCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-green-600">🎯 New Laptop</h3>
      <p className="text-sm text-gray-600">R1500 / R3000</p>
      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
        <div className="h-2 bg-green-500 rounded-full" style={{ width: '50%' }}></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Target by July 2025</p>
    </div>
  );
};

export default GoalCard;
