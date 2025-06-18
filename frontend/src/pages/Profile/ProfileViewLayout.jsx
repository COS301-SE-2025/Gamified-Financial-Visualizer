import React from 'react';
import ProfileHeader from '../../layouts/headers/ProfileHeader';
import ProfileSidebar from '../../layouts/sidebars/ProfileSidebar';

const ProfileViewLayout = ({ children, tab, setTab }) => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* Header at the top */}
      <div className="px-6 pt-6 pb-2">
        <ProfileHeader tab={tab} setTab={setTab} /> 
      </div>

      {/* Content Row: Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar with matching top padding */}
        <div className="w-1/4 pl-6 pt-2 pb-6">
          <ProfileSidebar />
        </div>

        {/* Main content aligned with sidebar */}
        <div className="flex-1 pr-6 pt-2 pb-6">
          {children}
        </div>
      </div>

      {/* Notifications overlay (absolute/fixed) */}

    </div>
  );
};

export default ProfileViewLayout;