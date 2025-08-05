import React, { useState, useEffect } from 'react';
import PacmanLoader from '../../components/loaders/PacmanLoader';
import CommunitySidebar from '../../layouts/sidebars/CommunitySidebar';
import LeaderboardPanel from '../../components/community/LeaderboardPanel';

const CommunityLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
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

      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Header */}
        <div className="px-6 pt-6">
          <CommunitySidebar />
        </div>

        {/* Content + Leaderboard */}
        <div className="flex flex-col lg:flex-row px-6 pb-6 gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
