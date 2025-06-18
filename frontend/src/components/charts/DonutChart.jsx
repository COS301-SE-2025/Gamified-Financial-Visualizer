import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const data = [
  { name: 'Savings', value: 30 },
  { name: 'Debt', value: 15 },
  { name: 'Investment', value: 20 },
  { name: 'Spending Limit', value: 20 },
  { name: 'Donations', value: 15 },
];

const COLORS = ['#FFD18C', '#F97156', '#F68D2B', '#5FBFFF', '#88BC46'];

const DonutChart = () => {
  return (
    <div>
      <div className="bg-white rounded-2xl shadow p-4 w-[380px]">
        <h3 className="text-md font-semibold text-gray-600 mb-4">Category Breakdown</h3>

        <div className="flex items-start gap-4">
          {/* Donut Chart */}
          <div className="w-[60%] h-56 min-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ right: 0 }}>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex-1 grid gap-2 text-sm text-gray-700 min-w-[200px]">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Value Total Display */}
        <div className="mt-6 text-center">
          <p className="text-3xl font-bold text-gray-800">ZAR 1250</p>
          <p className="text-sm text-gray-500">Your total goal amounts so far</p>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;