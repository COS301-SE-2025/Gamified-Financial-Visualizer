import React from 'react';

const badges = [
  { icon: '💰', label: 'Saver' },
  { icon: '🚀', label: 'Streak' },
  { icon: '🏆', label: 'Achiever' },
  { icon: '💵', label: 'Investor' },
];

const BadgesPanel = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h4 className="text-md font-semibold text-red-500 mb-2">Badges</h4>
      <div className="flex items-center space-x-4 overflow-x-auto">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-sm text-gray-600"
          >
            <div className="text-3xl">{badge.icon}</div>
            <span className="text-xs mt-1">{badge.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 bg-green-600 rounded-full">
        <div className="h-2 bg-pixel border-pixel rounded-full w-full"></div>
      </div>
    </div>
  );
};

export default BadgesPanel;
