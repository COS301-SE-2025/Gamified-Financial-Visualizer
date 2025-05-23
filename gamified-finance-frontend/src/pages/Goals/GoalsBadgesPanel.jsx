import React from 'react';
import badge1 from '../../assets/Images/awardIcon.png';
import badge2 from '../../assets/Images/highFiveIcon.png';
import badge3 from '../../assets/Images/moneyBagIcon.png';
import badge4 from '../../assets/Images/notesIcon.png';
import badge5 from '../../assets/Images/mountainIcon.png';
import badge6 from '../../assets/Images/moneyGrowIcon.png';
import badge7 from '../../assets/Images/scaleIcon.png';


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
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-md font-semibold mb-3 text-orange-400">Badges</h3>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="w-[120px] h-[120px] rounded-full bg-white border border-grey-600 shadow-sm flex items-center justify-center"
          >
            <img src={badge.icon} alt={badge.label} className="w-22 h-22 rounded-full" />
          </div>
        ))}
        <button className="text-sm text-green-600 hover:underline">View More</button>
      </div>
    </div>
  );
};

export default GoalsBadgesPanel;
