import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfileSidebar from '../../layouts/sidebars/ProfileSidebar';

const ProfileViewLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="p-6">
        <ProfileSidebar />
      </div>

      {/* Main Page Content */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileViewLayout;
