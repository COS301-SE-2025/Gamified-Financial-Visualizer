import React from 'react';
import latestBanner from '../../assets/Images/pixelRiver.gif';
import flagIcon from '../../assets/Images/CoinStack.png';

const GoalsHeader = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow border relative">
      <img
        src={latestBanner}
        alt="Latest Goal Banner"
        className="w-full h-40 object-cover"
      />

      {/* Title and Flag */}
      <div className="absolute top-1 left-4 text-white font-bold text-lg shadow"></div>
      <img
        src={flagIcon}
        alt="flag"
        className="absolute top-12 rounded-full right-4 w-20 h-20 object-contain drop-shadow"
      />

      {/* Goal Name */}
      <div style={{ backgroundColor: '#83AB55', color: '#FFFFFF' }} className="px-4 py-2 text-center text-sm font-medium">
        Goals
      </div>

    </div>
  );
};

export default GoalsHeader;
