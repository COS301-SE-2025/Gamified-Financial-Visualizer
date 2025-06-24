import React from 'react';
import LearnSidebar from '../../layouts/sidebars/LearnSidebar';
import LearnHeader from '../../layouts/headers/LearnHeader';

const LearnLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Sidebar with consistent padding */}
      <div className="pt-6 pl-6">
        <LearnSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="space-y-6">
          <LearnHeader />
          {children}
        </div>
      </main>
    </div>
  );
};
export default LearnLayout;