import React from 'react';
import { FaBell, FaCog } from 'react-icons/fa';

const ProfileHeader = ({ tab, setTab }) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-sm">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="w-1/3 px-4 py-2 border rounded-md shadow-sm"
      />

      {/* Toggle between Main and Settings */}
      <div className="flex space-x-2">
        <button
          onClick={() => setTab('main')}
          className={`px-4 py-2 rounded-full ${tab === 'main' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Main
        </button>
        <button
          onClick={() => setTab('settings')}
          className={`px-4 py-2 rounded-full ${tab === 'settings' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
