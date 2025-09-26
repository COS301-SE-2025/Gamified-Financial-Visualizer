import React, { useState, useEffect } from 'react';
import PacmanLoader from '../../components/loaders/PacmanLoader';
import AchievementsSidebar from '../../layouts/sidebars/AchievementsSidebar';

const AchievementsLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        {/* Achievements Header - Enhanced mobile responsive padding */}
        <div className="px-4 sm:px-6 pt-4 sm:pt-6">
          <AchievementsSidebar />
        </div>

        {/* Page Content - Enhanced mobile responsive layout */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex flex-col h-full lg:pr-4 sm:pr-6">
            {/* Enhanced mobile responsive padding and overflow handling */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-x-auto">
              {/* Mobile-specific container adjustments */}
              <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl mx-auto">
                {/* Mobile touch-friendly scrolling and spacing */}
                <div className="min-h-screen sm:min-h-0 py-2 sm:py-0">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsLayout;