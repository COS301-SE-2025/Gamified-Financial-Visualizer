import React from 'react';
import SidebarLeft from './SidebarLeft/SidebarLeft';
import MainContent from './MainContent/MainContent';
import SidebarRight from './SidebarRight/SidebarRight';

const CommunityPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="w-1/4 p-4">
        <SidebarLeft />
      </aside>
      <main className="flex-1 p-4">
        <MainContent />
      </main>
      <aside className="w-1/4 p-4">
        <SidebarRight />
      </aside>
    </div>
  );
};

export default CommunityPage;
