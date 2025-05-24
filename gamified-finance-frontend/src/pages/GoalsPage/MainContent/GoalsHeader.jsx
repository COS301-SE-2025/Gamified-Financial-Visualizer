import React from 'react';
import latestBanner from '../../../assets/Images/pixelRiver.gif';
import flagIcon from '../../../assets/Images/CoinStack.png';

const GoalsHeader = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow border relative">
      <img
        src={latestBanner}
        alt="Latest Goal Banner"
        className="w-full h-40 object-cover"
      />

      {/* Floating flag */}
      <img
        src={flagIcon}
        alt="Flag Icon"
        className="absolute top-12 right-4 w-20 h-20 object-contain rounded-full drop-shadow"
      />

      {/* Section Label */}
      <div
        className="px-4 py-2 text-center text-sm font-medium"
        style={{ backgroundColor: '#83AB55', color: '#FFFFFF' }}
      >
        Goals
      </div>
    </div>
  );
};

export default GoalsHeader;