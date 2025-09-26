import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";


const COLORS = ['#FFD18C', '#F97156', '#F68D2B', '#5FBFFF', '#88BC46'];

const DonutChart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/goal/${user.id}/category-summary`);
        const result = await res.json();
        const mapped = result.data.map(item => ({
          name: item.goal_type[0].toUpperCase() + item.goal_type.slice(1),
          value: parseInt(item.count),
        }));
        setData(mapped);
      } catch (err) {
        console.error('Failed to fetch donut chart data', err);
      }
    };

    if (user?.id) fetchSummary();
  }, [user?.id]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
   <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full dark:bg-gray-800 dark:text-gray-400">
      <h3 className="text-md font-semibold text-gray-600 mb-2 text-center">Category Breakdown</h3>

      {/* Donut Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend below */}
      <div className="grid grid-cols-2 gap-2 justify-items-start mt-4 text-sm text-gray-700">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-gray-800">Total: {total}</p>
        <p className="text-sm text-gray-500">Number of Goals Across Types</p>
      </div>
    </div>
  );
};

export default DonutChart;
