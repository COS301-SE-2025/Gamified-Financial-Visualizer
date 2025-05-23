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
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-md font-semibold mb-3">Goal Stats</h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-full">
                {stat.icon}
              </div>
              <span className="text-sm text-gray-700">{stat.title}</span>
            </div>
            <span className="text-sm font-bold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsStatsPanel;
