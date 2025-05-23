// ✅ GoalsStatsPanel.jsx
import React from 'react';
import { FiTarget, FiCheckCircle, FiStar, FiTrendingUp } from 'react-icons/fi';

const GoalsStatsPanel = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Goals',
      value: 7,
      icon: <FiTarget className="text-blue-500 w-5 h-5" />,
    },
    {
      id: 2,
      title: 'Completed Goals',
      value: 3,
      icon: <FiCheckCircle className="text-green-500 w-5 h-5" />,
    },
    {
      id: 3,
      title: 'XP Earned',
      value: '12,300',
      icon: <FiStar className="text-yellow-500 w-5 h-5" />,
    },
    {
      id: 4,
      title: 'Total Saved',
      value: 'R18,500',
      icon: <FiTrendingUp className="text-red-500 w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <h3 className="text-md font-semibold text-orange-500 mb-4">📊 Goal Stats</h3>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow">
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{stat.title}</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsStatsPanel;
