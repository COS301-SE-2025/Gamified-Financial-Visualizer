import React, { useState } from 'react';
import ProfileHeader from '../../layouts/headers/ProfileHeader';
import ProfileSidebar from '../../layouts/sidebars/ProfileSidebar';
import Overview from './Overview';
import Settings from './Settings';

const ProfilePage = () => {
  const [tab, setTab] = useState('main'); // 'main' or 'settings'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with XP + Badges + Stats */}
      <aside className="w-72 bg-white border-r shadow-sm">
        <ProfileSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ProfileHeader tab={tab} setTab={setTab} />

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {tab === 'main' ? <Overview /> : <Settings />}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
