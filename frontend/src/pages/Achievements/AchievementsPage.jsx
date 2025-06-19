import React,{useState} from 'react';

import AchievementsSidebar from '../../layouts/sidebars/AchievementsSidebar';
import AchievementsHeader from '../../layouts/headers/AchievementsHeader';

const AchievementsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
        <div className="flex">
          <div className="w-[400px] -ml-[-15px] -mt-[-19px]">
            <AchievementsSidebar />
          </div>
          <div className="flex-1 px-4"></div>
        </div>

      {/* Main content */}
      <main className="w-3/4 p-6 space-y-6">
        <AchievementsHeader />
      </main>
    </div>
  );
};

export default AchievementsPage;
