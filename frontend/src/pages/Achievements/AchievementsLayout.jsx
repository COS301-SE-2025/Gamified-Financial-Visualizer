import React,{useState}from 'react';
import AchievementsSidebar from '../../layouts/sidebars/AchievementsSidebar';
import AchievementsHeader from '../../layouts/headers/AchievementsHeader';

const AccountsLayout = ({ children }) => {
  const [tab, setTab] = useState('achievements'); // or 'main', etc.

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loader */}
       {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <PacmanLoader />
        </div>
      )} 

      {/* Main Layout */}
      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Achievements Header */}
        <div className="px-6 pt-6">
          <AchievementsSidebar />
        </div>

          {/* Scrollable content area */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto min-h-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsLayout;