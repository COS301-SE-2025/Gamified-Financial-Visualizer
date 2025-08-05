import React, { useState, useEffect } from 'react';
import GoalsSidebar from '../../layouts/sidebars/GoalsSidebar';
import PacmanLoader from '../../components/loaders/PacmanLoader';

const GoalsViewLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loading Animation */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <PacmanLoader />
        </div>
      )} 

      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Top Header */}
        <div className="px-6 pt-6">
          <GoalsSidebar />
        </div>

        {/* Main Page Content */}
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

export default GoalsViewLayout;
