import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const achievements = [
  {
    title: 'Cash Horder',
    reward: 500,
    progress: 3,
    total: 5,
    image: badge1,
    color: 'from-[#FFC857] to-[#F5A623]',
    border: 'border-[#ED5E52]',
    text: 'text-[#ED5E52]'
  },
  {
    title: 'OverAchiever',
    reward: 600,
    progress: 3,
    total: 5,
    image: badge8,
    color: 'from-[#5FBFFF] to-[#5FBFFF]',
    border: 'border-[#5FBFFF]',
    text: 'text-[#5FBFFF]'
  },
  {
    title: 'Just Grow it',
    reward: 450,
    progress: 3,
    total: 5,
    image: badge4,
    color: 'from-[#88BC46] to-[#88BC46]',
    border: 'border-[#88BC46]',
    text: 'text-[#88BC46]'
  },
  {
    title: 'Money Major',
    reward: 50,
    progress: 3,
    total: 5,
    image: badge6,
    color: 'from-[#FFC857] to-[#F5A623]',
    border: 'border-[#ED5E52]',
    text: 'text-[#ED5E52]'
  },
  {
    title: 'Real Banker',
    reward: 900,
    progress: 3,
    total: 5,
    image: '/images/achievements/banker.png',
    color: 'from-[#5FBFFF] to-[#5FBFFF]',
    border: 'border-[#5FBFFF]',
    text: 'text-[#5FBFFF]'
  },
  {
    title: 'Stack Stacker',
    reward: 650,
    progress: 3,
    total: 5,
    image: badge2,
    color: 'from-[#88BC46] to-[#88BC46]',
    border: 'border-[#88BC46]',
    text: 'text-[#88BC46]'
  },
  {
    title: 'All My Friends',
    reward: 150,
    progress: 3,
    total: 5,
    image: badge5,
    color: 'from-[#FFC857] to-[#F5A623]',
    border: 'border-[#ED5E52]',
    text: 'text-[#ED5E52]'
  },
  {
    title: 'Target Chaser',
    reward: 5000,
    progress: 3,
    total: 5,
    image:  badge3,
    color: 'from-[#5FBFFF] to-[#5FBFFF]',
    border: 'border-[#5FBFFF]',
    text: 'text-[#5FBFFF]'
  },
  {
    title: 'Building Wealth',
    reward: 30,
    progress: 3,
    total: 5,
    image:  badge7,
    color: 'from-[#88BC46] to-[#88BC46]',
    border: 'border-[#88BC46]',
    text: 'text-[#88BC46]'
  },
  {
    title: '#1 Investor',
    reward: 850,
    progress: 3,
    total: 5,
    image: badge9,
    color: 'from-[#FFC857] to-[#F5A623]',
    border: 'border-[#ED5E52]',
    text: 'text-[#ED5E52]'
  }
];

const ProgressBar = ({ percentage }) => (
  <div className="w-full p-4 bg-white rounded-xl border border-yellow-300">
    <div className="relative w-full bg-white border border-yellow-300 rounded-full h-6 flex items-center px-2">
      <div className="absolute h-6 left-0 rounded-full bg-gradient-to-r from-[#FFC857] to-[#F5A623]"
        style={{ width: `${percentage}%` }}></div>
      <div className="w-full flex justify-between text-[12px] font-semibold text-[#ED5E52] relative z-10">
        <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
      </div>
    </div>
  </div>
);

const AchievementCard = ({ title, reward, progress, total, image, color, border, text }) => {
  const navigate = useNavigate();
  const progressPercent = (progress / total) * 100;
  return (
    <div
      className={`rounded-2xl p-4 shadow-md transition duration-300 ease-in-out hover:shadow-lg cursor-pointer border-2 ${border} bg-white`}
      onClick={() => navigate(`/achievements/${encodeURIComponent(title)}`)}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Title */}
        <h3 className={`text-sm font-bold ${text}`}>{title}</h3>

        {/* Image */}
        <img
          src={image}
          alt={title}
          className="w-22 h-20 object-contain"
        />

        {/* Progress bar */}
        <div className="w-full mt-1">
          <div className="relative h-2 rounded-full bg-gray-200">
            <div
              className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between w-full text-xs text-gray-600 font-medium pt-1">
          <span>{reward} XP Reward</span>
          <span>{progress}/{total}</span>
        </div>
      </div>
    </div>
  );
};

const IncompleteAchievementsPage = () => {
  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        {/* Heading */}
        <div>
          <h2 className="text-2xl font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6">
           Incomplete Achievements
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {achievements.map((a, i) => (
            <AchievementCard key={i} {...a} />
          ))}
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default IncompleteAchievementsPage;
