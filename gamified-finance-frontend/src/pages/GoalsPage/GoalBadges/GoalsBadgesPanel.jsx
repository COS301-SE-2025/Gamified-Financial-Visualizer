import React from 'react';
import badge1 from '../../../assets/Images/awardIcon.png';
import badge2 from '../../../assets/Images/highFiveIcon.png';
import badge3 from '../../../assets/Images/moneyBagIcon.png';
import badge4 from '../../../assets/Images/notesIcon.png';
import badge5 from '../../../assets/Images/mountainIcon.png';
import badge6 from '../../../assets/Images/moneyGrowIcon.png';
import badge7 from '../../../assets/Images/scaleIcon.png';

const badges = [
  { id: 1, icon: badge1, label: 'Coins Earned' },
  { id: 2, icon: badge2, label: 'Stack Master' },
  { id: 3, icon: badge3, label: 'Teamwork' },
  { id: 4, icon: badge4, label: 'Top Saver' },
  { id: 5, icon: badge5, label: 'Finance Guru' },
  { id: 6, icon: badge6, label: 'Investor' },
  { id: 7, icon: badge7, label: 'Reward Champ' },
];

const GoalsBadgesPanel = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <h3 className="text-md font-semibold mb-4 text-orange-500">🎖️ Badges</h3>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center text-center space-y-2">
            <div className="w-[72px] h-[72px] rounded-full bg-gray-100 border-2 border-orange-300 shadow-sm flex items-center justify-center hover:scale-105 transition-transform">
              <img
                src={badge.icon}
                alt={badge.label}
                className="w-18 h-18 rounded-full"
              />
            </div>
            <span className="text-xs text-gray-600">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="mt-4 text-center">
        <button className="text-sm text-cyan-600 hover:underline">View All Badges</button>
      </div>
    </div>
  );
};

export default GoalsBadgesPanel;
