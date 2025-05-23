import React from 'react';
import badge1 from '../../../assets/Images/awardIcon.png';
import badge2 from '../../../assets/Images/highFiveIcon.png';
import badge3 from '../../../assets/Images/moneyBagIcon.png';
import badge4 from '../../../assets/Images/plantIocn.png';
import pixelBar from '../../../assets/Images/pixelPath.jpeg';

const badges = [
  { icon: badge1, label: 'Saver' },
  { icon: badge2, label: 'Focused' },
  { icon: badge3, label: 'Milestone' },
  { icon: badge4, label: 'Investor' },
];

const BadgesPanel = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3 border">
      <h4 className="text-md font-semibold text-red-500">Badges</h4>

      {/* Badges */}
      <div className="flex items-center gap-4 overflow-x-auto">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center space-y-1">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 border shadow">
              <img src={badge.icon} alt={badge.label} className="w-14 h-14 rounded-full border-orange-500" />
            </div>
            <span className="text-xs text-gray-600">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Pixel style bar */}
      <img
        src={pixelBar}
        alt="XP Progress"
        className="mt-3 w-full h-4 object-cover rounded shadow"
      />
    </div>
  );
};

export default BadgesPanel;
