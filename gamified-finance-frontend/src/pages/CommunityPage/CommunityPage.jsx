import React from 'react';
import SidebarLeft from './SidebarLeft/SidebarLeft';
import MainContent from './MainContent/MainContent';
import SidebarRight from './SidebarRight/SidebarRight';

const CommunityPage = () => {
  return (
    <div className="flex min-h-screen px-6 gap-4 text-gray-800 pt-6">
      {/* Left Sidebar */}
      <aside className="w-[350px] shrink-0">
        <SidebarLeft />
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        <MainContent />
      </main>

      {/* Right Sidebar */}
      <aside className="w-[350px] shrink-0">
        <SidebarRight />
      </aside>
    </div>
  );
};

export default CommunityPage;
