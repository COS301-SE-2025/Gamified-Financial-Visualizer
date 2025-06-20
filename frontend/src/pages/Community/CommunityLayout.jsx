// src/layouts/CommunityLayout.jsx
import React from 'react';
import LeaderboardPanel from '../../components/community/LeaderboardPanel';
import CommunitySidebar from '../../layouts/sidebars/CommunitySidebar';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

const CommunityLayout = ({ children }) => {
  return (
    <div className="flex bg-[#F7F9FB] h-screen overflow-hidden">
      
      {/* Left Sidebar */}
      <div className="w-1/4 pl-6 pt-6 pb-6">
        <CommunitySidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {/* Right Sidebar (Leaderboard) */}
      <div className="w-[260px] p-4 pr-6">
        <LeaderboardPanel />
      </div>
    </div>
  );
};

export default CommunityLayout;
