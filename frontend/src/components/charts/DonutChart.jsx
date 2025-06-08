import React from 'react';

const DonutChart = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-48 flex flex-col justify-center items-center">
      <svg width="100" height="100" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="#eee"
          strokeWidth="4"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeDasharray="75, 100"
        />
      </svg>
      <p className="text-sm text-gray-600 mt-2">75% Completed</p>
    </div>
  );
};

export default DonutChart;
