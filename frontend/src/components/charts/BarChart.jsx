import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { day: 'M', value: 60 },
  { day: 'T', value: 80 },
  { day: 'W', value: 40 },
  { day: 'T', value: 100 },
  { day: 'F', value: 90 },
  { day: 'S', value: 70 },
  { day: 'S', value: 70 },
];

const BarChart = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-md font-semibold text-gray-600 mb-4">Weekly Goal Completion</h3>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === 'F' ? '#FF955A' : '#5FBFFF'}
                  />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Message */}
        <div className="mt-[70px] flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#FEEBCB] flex items-center justify-center">
            <span className="text-[#FF955A] font-bold text-lg">☺</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">You are doing good!</p>
            <p className="text-xs text-gray-500">You almost reached your goal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
