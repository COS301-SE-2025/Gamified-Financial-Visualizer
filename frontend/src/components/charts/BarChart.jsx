import React from 'react';

const BarChart = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-48 flex flex-col justify-center items-center">
      <p className="text-gray-600 text-sm mb-2">Monthly Contributions</p>
      <div className="flex gap-2 items-end w-full justify-around">
        {[100, 80, 120, 60, 90, 110].map((h, i) => (
          <div key={i} className="w-6 bg-green-400 rounded" style={{ height: `${h / 2}px` }}></div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
