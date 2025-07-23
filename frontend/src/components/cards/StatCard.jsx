import React from 'react';

const StatCard = ({ icon, value, label, color }) => (
  <div className="relative bg-white rounded-xl shadow-md p-4 flex items-center justify-between transition-transform hover:scale-[1.01]">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: `${color}20` }}
    >
      <div style={{ color }}>{icon}</div>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <div
      className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl"
      style={{ backgroundColor: color }}
    />
  </div>
);

export default StatCard;