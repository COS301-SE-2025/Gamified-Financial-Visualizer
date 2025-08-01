import React, { useState, useEffect } from 'react';
// import { PacmanLoader } from 'react-spinners';
import LearnSidebar from '../../layouts/sidebars/LearnSidebar';

const LearnLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Loader */}

      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Top Learn Header */}
        <div className="px-4 sm:px-6 pt-4">
          <LearnSidebar />
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

export default LearnLayout;
