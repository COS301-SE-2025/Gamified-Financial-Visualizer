
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';



const COLORS = ['#FFD18C', '#F97156', '#F68D2B', '#5FBFFF', '#88BC46'];

const DonutChart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/goal/${user.id}/category-summary`);
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
    <div>
      <div className="bg-white rounded-2xl shadow p-4 w-full min-w-[380px] ml-auto">
        <h3 className="text-md font-semibold text-gray-600 mb-4">Category Breakdown</h3>


        <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
          {/* Donut Chart */}
          <div className="w-[60%] h-56 min-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex-1 grid gap-2 text-sm text-gray-700 min-w-[00px]">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-3xl font-bold text-gray-800">Total: {total}</p>
          <p className="text-sm text-gray-500">Number of Goals Across Types</p>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
