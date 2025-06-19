// ProfileViewLayout.jsx
import React from 'react';
import ProfileHeader from '../../layouts/headers/ProfileHeader';
import ProfileSidebar from '../../layouts/sidebars/ProfileSidebar';

const ProfileViewLayout = ({ children, tab, setTab }) => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        <div className="w-1/4 pl-6 pt-6 pb-6"> 
          <ProfileSidebar />
        </div>
        <div className="flex-1 flex flex-col h-full pr-6">
          <div className="p-6">
            <ProfileHeader tab={tab} setTab={setTab} />
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewLayout;
