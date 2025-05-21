import React from 'react';

const badges = [
  { icon: '💰', label: 'Saver' },
  { icon: '🎯', label: 'Focused' },
  { icon: '🌟', label: 'Milestone' },
  { icon: '💼', label: 'Investor' },
  { icon: '🚀', label: 'Achiever' },
];

const BadgesPanel = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3 border">
      <h4 className="text-md font-semibold text-red-500">Badges</h4>

      {/* Badges */}
      <div className="flex items-center gap-4 overflow-x-auto">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 border shadow text-xl">
              {badge.icon}
            </div>
            <span className="text-xs text-gray-600">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Pixel style bar */}
      <div className="mt-3 h-3 w-full rounded-full bg-gradient-to-r from-green-700 via-green-500 to-green-300 shadow-inner"></div>
    </div>
  );
};

export default BadgesPanel;
