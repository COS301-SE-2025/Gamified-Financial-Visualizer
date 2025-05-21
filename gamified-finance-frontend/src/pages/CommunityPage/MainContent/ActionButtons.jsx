import React from 'react';

const actions = [
  { icon: '✏️', label: 'Create Post' },
  { icon: '👥', label: 'Friends' },
  { icon: '🌍', label: 'Community' },
  { icon: '➕', label: 'Create Community' },
];

const ActionButtons = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action, index) => (
        <button
          key={index}
          className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition"
        >
          <span>{action.icon}</span>
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
