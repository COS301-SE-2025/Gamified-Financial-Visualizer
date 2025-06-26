import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfileHeader from '../../layouts/headers/ProfileHeader';
import ProfileSidebar from '../../layouts/sidebars/ProfileSidebar';

const ProfileViewLayout = () => {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/4 pl-6 pt-6 pb-6 overflow-y-auto">
          <ProfileSidebar />
        </div>

        {/* Main Section */}
        <div className="flex-1 flex flex-col pr-6">
          {/* Header (static) */}
          <div className="p-6 shrink-0">
            <ProfileHeader />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewLayout;
