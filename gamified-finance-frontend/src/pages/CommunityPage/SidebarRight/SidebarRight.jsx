import React from 'react';
import CommunityList from './CommunityList';
import NotificationsPanel from './NotificationsPanel';

const SidebarRight = () => {
  return (
    <div className="space-y-4">
      <CommunityList />
      <NotificationsPanel />
    </div>
  );
};

export default SidebarRight;
