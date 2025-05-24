import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2">
      <button 
      onClick={() => navigate('/community')}
      className="px-4 py-1 text-sm border border-gray-300 rounded-full bg-white hover:bg-gray-50">
        📝 Home
      </button>

      {/* <button
        onClick={() => navigate('/communities')}
        className="px-4 py-1 text-sm border border-gray-300 rounded-full bg-white hover:bg-gray-50"
      >
        👥 Friends
      </button> */}

      <button
        onClick={() => navigate('/communities')}
        className="px-4 py-1 text-sm border border-gray-300 rounded-full bg-white hover:bg-gray-50"
      >
        🏘️ Community
      </button>

      <button 
      onClick={() => navigate('/create-community')}
      className="px-4 py-1 text-sm border border-gray-300 rounded-full bg-white hover:bg-gray-50">
        ➕ New Community
      </button>
    </div>
  );
};

export default ActionButtons;
