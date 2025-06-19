import React from 'react';

const data = [
  { month: 'Jan', val: 25 },
  { month: 'Feb', val: 40 },
  { month: 'Mar', val: 60 },
  { month: 'Apr', val: 90 },
  { month: 'May', val: 85 },
  { month: 'Jun', val: 45 },
  { month: 'Jul', val: 35 },
];

const MonthlyBarChart = () => {
  return (
    <div className="bg-white shadow rounded-2xl p-6 w-full h-full">
      <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Monthly Progress</p>

      <div className="flex items-end justify-between gap-3 h-40">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center justify-end">
            <div
              className={`w-8 rounded-t-md transition-all duration-300 ${
                i === data.length - 1 ? 'bg-[#fbc676]' : 'bg-blue-400'
              }`}
              style={{ height: `${d.val * 1.2}px` }} // Convert % to px
            />
            <span className="text-[10px] text-gray-500 mt-1">{d.month}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center text-red-500 mt-4 font-semibold">
        This month’s performance is 30% better than last
      </p>
    </div>
  );
};

export default MonthlyBarChart;
