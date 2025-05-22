import React from 'react';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import CommunityPost from './CommunityPost';
import banner1 from '../../../assets/Images/pixelShop.gif';
import banner2 from '../../../assets/Images/pixelPorch.gif';
import avatar1 from '../../../assets/Images/pixelDesk.jpeg';
import avatar2 from '../../../assets/Images/pixelBar.jpeg';

const MainContent = () => {
  return (
    <div className="gap-4 space-y-6">
      <SearchBar />
      <ActionButtons />

      <CommunityPost
        title="New Business"
        year="2027"
        avatar={avatar1} // icon on post banner 
        bannerImage={banner1}
        themeColors={['#3b82f6', '#65a30d', '#15803d']}
        headerColor="#83AB55" //post header color
      />

      <CommunityPost
        title="Lets Go Tokyo"
        year="2028"
        avatar={avatar2} // icon on post banner 
        bannerImage={banner2}
        themeColors={['#f97316', '#eab308', '#8b5cf6']}
        headerColor="#83AB55" //post header color
      />
    </div>
  );
};

export default MainContent;
