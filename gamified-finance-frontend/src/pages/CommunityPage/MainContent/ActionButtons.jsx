import React from 'react';

const ActionButtons = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600">
        Create Post
      </button>
      <button className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600">
        Friends
      </button>
      <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-500">
        Community Goals
      </button>
    </div>
  );
};

export default ActionButtons;
