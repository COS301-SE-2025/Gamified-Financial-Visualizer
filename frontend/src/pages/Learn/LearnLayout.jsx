import React, { useState, useEffect } from 'react';
import PacmanLoader from '../../components/loaders/PacmanLoader';
import LearnSidebar from '../../layouts/sidebars/LearnSidebar'; 

const LearnLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <PacmanLoader />
        </div>
      )}

      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Your "LearnSidebar" (which is actually a header) */}
        <div className="px-4 sm:px-6 pt-4">
        <LearnSidebar /> {/* This should now display properly */}
      </div>

        {/* Main content area - fixed to take full width */}
        <div className="w-full">
          <div className="px-4 sm:px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnLayout;