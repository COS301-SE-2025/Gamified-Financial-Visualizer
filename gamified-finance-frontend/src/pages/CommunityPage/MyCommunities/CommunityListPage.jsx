import React from 'react';
import SidebarLeft from '../SidebarLeft/SidebarLeft';
import SidebarRight from '../SidebarRight/SidebarRight';
import SearchBar from '../MainContent/SearchBar';
import ActionButtons from '../MainContent/ActionButtons';
import CommunityCard from '../MyCommunities/CommunityListCard'; 
import defaultAvatar1 from '../../../assets/Images/pixelBar.jpeg';
import defaultAvatar2 from '../../../assets/Images/pixelPond.jpeg';
import defaultAvatar3 from '../../../assets/Images/pixelPorch.gif';
import defaultAvatar4 from '../../../assets/Images/pixelAllyway.jpeg';
import badge1 from '../../../assets/Images/awardIcon.png';
import badge2 from '../../../assets/Images/highFiveIcon.png';
import badge3 from '../../../assets/Images/moneyBagIcon.png';
import badge4 from '../../../assets/Images/notesIcon.png';

// Sample community list data
const communities = [
  {
    title: 'Bali Trip',
    image: defaultAvatar1,
    badgeIcon: badge3,
  },
  {
    title: 'Sunday Dinner',
    image: defaultAvatar2,
    badgeIcon: badge2,
  },
  {
    title: 'New Apartment',
    image: defaultAvatar3,
    badgeIcon: badge1,
  },
  {
    title: 'GTA 6',
    image: defaultAvatar4,
    badgeIcon: '/assets/Images/controller.png',
  },
];


const CommunityListPage = () => {
  return (
    <div className="flex gap-4 p-6">
      <div className="w-1/4">
        <SidebarLeft />
      </div>

      <div className="flex-1 space-y-4">
        <SearchBar />
        <ActionButtons />

        <div className="space-y-4">
          {communities.map((c, idx) => (
            <CommunityCard key={idx} {...c} />
          ))}
        </div>
      </div>

      <div className="w-1/4">
        <SidebarRight />
      </div>
    </div>
  );
};

export default CommunityListPage;