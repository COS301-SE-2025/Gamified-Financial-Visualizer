import React from 'react';
import GoalsProfileCard from './GoalsProfileCard';
import GoalsStatsPanel from './GoalsStatsPanel';
import latestBanner from '../../../assets/Images/pixelShop.gif';

const SidebarLeft = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <img src={latestBanner} alt="Latest Goal" className="rounded-md mb-2" />
        <h2 className="text-center bg-cyan-100 rounded-lg font-normal text-lg text-slate-500">Profile</h2>
      </div>
      <GoalsProfileCard />
      <GoalsStatsPanel />
    </div>
  );
};

export default SidebarLeft;
