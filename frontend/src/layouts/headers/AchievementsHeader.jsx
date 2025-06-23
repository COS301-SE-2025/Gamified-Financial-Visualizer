import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaTrophy, FaListAlt, FaCheckCircle } from 'react-icons/fa';

const AchievementsHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Button configuration for achievements
  const tabs = [
    {
      path: '/achievements',
      icon: <FaTrophy />,
      label: 'All',
      matchPaths: ['/achievements'] 
    },
    {
      path: '/achievements/incomplete',
      icon: <FaListAlt />,
      label: 'Incomplete',
      matchPaths: ['/achievements/incomplete']
    },
    {
      path: '/achievements/complete',
      icon: <FaCheckCircle />,
      label: 'Complete',
      matchPaths: ['/achievements/complete']
    }
  ];

  // Check if tab is active
  const isActive = (tabPaths) => {
    return tabPaths.some(path => pathname === path);
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow rounded-xl">
      {/* Search Input */}
      <div className="flex items-center w-full max-w-4xl px-4 py-2 rounded-3xl border-4 border-[#E5794B] bg-white shadow-sm">
        <FaSearch className="text-[#E5794B] mr-2" />
        <input
          type="text"
          placeholder="Search achievements..."
          className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 ml-4">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
              isActive(tab.matchPaths) ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AchievementsHeader;