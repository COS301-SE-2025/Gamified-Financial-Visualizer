import React, { useEffect, useState } from 'react';
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

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const BarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/goal/${user.id}/progress-frequency`);
        const result = await res.json();

        // Map results to full week
        const apiData = result.data;
        const mapped = daysOfWeek.map(day => {
          const match = apiData.find(d => d.day.startsWith(day));
          return { day, value: match ? parseInt(match.count) : 0 };
        });

        setData(mapped);
      } catch (err) {
        console.error('Failed to load bar chart data', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-md font-semibold text-gray-600 mb-4">Weekly Progress Updates</h3>

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
                    fill={entry.day === 'Fri' ? '#FF955A' : '#5FBFFF'}
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
            <p className="text-sm font-semibold text-gray-700">You're doing great!</p>
            <p className="text-xs text-gray-500">Keep adding progress to your goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;