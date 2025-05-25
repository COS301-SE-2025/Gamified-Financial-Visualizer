import React from 'react';
import SearchBar from '../MainContent/SearchBar';
import ActionButtons from '../MainContent/ActionButtons';
import SidebarLeft from '../SidebarLeft/SidebarLeft';
import SidebarRight from '../SidebarRight/SidebarRight';
import CommunityHeader from './CommunityHeader';
import CommunityInfo from './CommunityInfo';
import CommunityFriendsList from './CommunityFriendsList';

const CommunityDetailPage = () => {
  return (
    <div className="flex gap-4 p-4">
      <div className="w-1/4">
        <SidebarLeft />
      </div>

      <div className="flex-1 space-y-6">
        <SearchBar />
        <ActionButtons />
        <CommunityHeader
          name="New Business"
          year="2027"
          bannerImage="/assets/Images/japanBanner.png"
          avatar="/assets/Images/japanAvatar.png"
          headerColor="#6BAF4E"
        />

        <CommunityInfo
          description="This group is saving up for our 2028 Japan Trip! 🍜🎌"
          progress={62}
        />

        <CommunityFriendsList />
      </div>

      <div className="w-1/4">
        <SidebarRight />
      </div>
    </div>
  );
};

export default CommunityDetailPage;