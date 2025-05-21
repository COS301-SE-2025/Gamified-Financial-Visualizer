import React from 'react';

const GoalCard = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Bali Trip</h3>
          <p className="text-sm text-gray-400">2027</p>
        </div>
        <img
          src="https://via.placeholder.com/50"
          alt="Bali Trip"
          className="rounded-full w-12 h-12 object-cover"
        />
      </div>

      {/* Donut Chart Simulation */}
      <div className="relative w-24 h-24 mx-auto">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <path
            className="text-orange-400"
            strokeDasharray="60, 100"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <text
            x="18"
            y="20.35"
            className="fill-gray-700 text-sm"
            textAnchor="middle"
          >
            60%
          </text>
        </svg>
      </div>

      {/* Placeholder for goal details */}
      <div className="space-y-1">
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-2 bg-orange-400 rounded-full w-[60%]"></div>
        </div>
        <div className="text-right">
          <button className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-green-300 to-green-500 text-white">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
