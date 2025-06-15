import React from 'react';
import { FaSearch, FaUserCog, 	FaHome } from 'react-icons/fa';

const ProfileHeader = ({ tab, setTab }) => {
  return (
    
    // Search main box
        <div className="flex justify-between rounded-xl items-center space-x-4 px-6 py-4 bg-[#ffffff] border-b shadow">
          {/* 🔍 Search Input */}
          <div className="flex items-center w-full bg-white px-3 py-2 rounded-xl shadow border max-w-md">
            <FaSearch className="text-[#E5794B] mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none bg-transparent text-sm text-[#E5794B]"
            />
          </div>
      {/* 🧭 Action Buttons: Main | Settings */}
      <div className="flex space-x-2">
        <button
          onClick={() => setTab('main')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            tab === 'main' ? 'bg-[#88BC46] text-[#ffffff]' : 'bg-white text-gray-600'
          }`}
        >
          <	FaHome className="text-md" /> Main
        </button>

        <button
          onClick={() => setTab('settings')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            tab === 'settings' ? 'bg-[#88BC46] text-[#ffffff]' : 'bg-white text-gray-600'
          }`}
        >
          <FaUserCog className="text-md" /> Settings
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
