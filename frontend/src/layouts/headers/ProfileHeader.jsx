import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserCog, FaHome } from 'react-icons/fa';

const ProfileHeader = ({ tab, setTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex justify-between rounded-xl items-center px-6 py-4 bg-[#ffffff] border-b shadow">
      {/* Empty div to take up left space and keep actions right-aligned */}

      {/* 🧭 Action Buttons: Main | Settings */}
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => navigate('/profile')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/profile' ? 'bg-[#88BC46] text-[#ffffff]' : 'bg-white text-gray-600'
            }`}
        >
          <FaHome className="text-md" /> Main
        </button>

        <button
          onClick={() => navigate('/profile/settings')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/profile/settings' ? 'bg-[#88BC46] text-[#ffffff]' : 'bg-white text-gray-600'
            }`}
        >
          <FaUserCog className="text-md" /> Settings
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
