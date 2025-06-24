import React from 'react';
import { FaUserCog, FaHome } from 'react-icons/fa';

const ProfileHeader = ({ tab, setTab }) => {
  return (
    <div className="flex justify-between rounded-xl items-center px-6 py-4 bg-[#ffffff] border-b shadow">
      {/* Empty div to take up left space and keep actions right-aligned */}
      <div className="w-full"></div>

      {/* 🧭 Action Buttons: Main | Settings */}
      <div className="flex space-x-2">
        <button
          onClick={() => setTab('main')} 
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            tab === 'main' ? 'bg-[#88BC46] text-[#ffffff]' : 'bg-white text-gray-600'
          }`}
        >
          <FaHome className="text-md" /> Main
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
