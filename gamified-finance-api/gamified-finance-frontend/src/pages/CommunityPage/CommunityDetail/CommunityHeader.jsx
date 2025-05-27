import React from 'react';
import defaultAvatar from '../../../assets/Images/pixelDesk.jpeg';
import defaultBanner from '../../../assets/Images/pixelShop.gif';

const CommunityHeader = ({ name, year, bannerImage, avatar, headerColor }) => {
  return (
    <div className="rounded-xl overflow-hidden border shadow-md">
      <div
        className="flex items-center space-x-3 px-4 py-2"
        style={{ backgroundColor: headerColor }}
      >
        <img img src={defaultAvatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div className="text-white">
          <h2 className="font-bold text-lg leading-tight">{name}</h2>
          <p className="text-xs">{year}</p>
        </div>
      </div>
      <img
        img src={defaultBanner}
        alt="Banner"
        className="w-full h-52 object-cover"
      />
    </div>
  );
};

export default CommunityHeader;
