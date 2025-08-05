import React, { useState, useEffect } from 'react';
import PacmanLoader from '../../components/loaders/PacmanLoader';
import AchievementsSidebar from '../../layouts/sidebars/AchievementsSidebar'; // rename if needed

const AchievementsLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loader */}
      {/* {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <PacmanLoader />
        </div>
      )} */}

      {/* Main Layout */}
      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Achievements Header */}
        <div className="px-6 pt-6">
          <AchievementsSidebar />
        </div>

        {/* Page Content */}
        <div className="flex">
          <div className="flex-1 flex flex-col h-full pr-6">
            <div className="px-6 pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsLayout;
