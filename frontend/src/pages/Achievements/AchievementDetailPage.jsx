import React from 'react';
import { useParams } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import badge1 from '../../assets/Images/badges/CoinStack.png';
import badge2 from '../../assets/Images/badges/notesIcon.png';
import badge3 from '../../assets/Images/badges/targetIcon.png';
import badge4 from '../../assets/Images/badges/plantIocn.png';
import badge5 from '../../assets/Images/badges/highFiveIcon.png';
import badge6 from '../../assets/Images/badges/moneyBagIcon.png';
import badge7 from '../../assets/Images/badges/moneyGrowIcon.png';
import badge8 from '../../assets/Images/badges/mountainIcon.png';
import badge9 from '../../assets/Images/badges/awardIcon.png';

const sampleTasks = [
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'complete' },
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'incomplete' },
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'complete' },
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'incomplete' },
];

const gradientMap = {
  red: 'linear-gradient(to right, #FF4C28, #FFCE51)',
  blue: 'linear-gradient(to right, #5FBFFF, #B1E1FF)',
  green: 'linear-gradient(to right, #88BC46, #CBEEA5)',
};

const colorMap = {
  'Cash Horder': 'red',
  'OverAchiever': 'blue',
  'Just Grow it': 'green',
  'Money Major': 'red',
  'Real Banker': 'blue',
  'Stack Stacker': 'green',
  'All My Friends': 'red',
  'Target Chaser': 'blue',
  'Building Wealth': 'green',
  '#1 Investor': 'red',
};

const hexMap = {
  red: '#ED5E52',
  blue: '#5FBFFF',
  green: '#88BC46'
};

const BadgeTaskCard = ({ task, primaryColor, image, barGradient }) => {
  const isComplete = task.status === 'complete';

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-md border"
         style={{ borderColor: primaryColor }}>
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br "
          style={{ border: `1.5px solid ${primaryColor}` }}
        >
          <img src={image} alt="icon" className="w-9 h-9 object-contain" />
        </div>

        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-[16px] font-semibold" style={{ color: primaryColor }}>
              {task.title}
            </h3>
            <p className="text-sm font-light" style={{ color: primaryColor }}>
              {task.reward} XP Reward
            </p>
          </div>

          <div className="w-64 bg-gray-200 h-2 rounded-full mt-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${(task.progress / task.total) * 100}%`,
                background: barGradient
              }}
            />
          </div>

          <p className="text-xs mt-1" style={{ color: primaryColor }}>
            {task.progress}/{task.total}
          </p>
        </div>
      </div>
    </div>
  );
};


const AchievementDetailPage = () => {
  const { id } = useParams();
  const colorKey = colorMap[id] || 'red';
  const primaryColor = hexMap[colorKey];
  const barGradient = gradientMap[colorKey];
  const badgeMap = {
  'Cash Horder': badge1,
  'Stack Stacker': badge2,
  'Target Chaser': badge3,
  'Just Grow it': badge4,
  'All My Friends': badge5,
  'Money Major': badge6,
  'Building Wealth': badge7,
  'OverAchiever': badge8,
  '#1 Investor': badge9
};

const badgeImage = badgeMap[id] || badge9;
  return (
    <AchievementsLayout>
      <div className="p-6 space-y-6 rounded-2xl -mt-6">
        <div>
          <div
            className="inline-block px-4 py-1 rounded-full border font-bold text-lg"
            style={{
              borderColor: primaryColor,
              backgroundImage: barGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {id}
          </div>

          <p className="text-sm text-gray-500 mt-2 mb-4">
            Unlock your badges by completing tasks on the site.
          </p>

          <div className="space-y-4">
            {sampleTasks.map((task, i) => (
              <BadgeTaskCard
                key={i}
                task={task}
                primaryColor={primaryColor}
                barGradient={barGradient}
                image={badgeImage}
              />
            ))}
          </div>
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default AchievementDetailPage;
