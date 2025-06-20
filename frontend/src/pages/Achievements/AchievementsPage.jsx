import React from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';


const achievements = [
  {
    title: 'Cash Horder',
    reward: 500,
    progress: 3,
    total: 5,
    image: '/Images/badges/awardlcon.png',
    color: 'from-[#FFC857] to-[#F5A623]',
    border: 'border-[#ED5E52]',
    text: 'text-[#ED5E52]'
  },
  {
    title: 'OverAchiever',
    reward: 600,
    progress: 3,
    total: 5,
    image: '/images/achievements/overachiever.png',
    color: 'from-[#5FBFFF] to-[#5FBFFF]',
    border: 'border-[#5FBFFF]',
    text: 'text-[#5FBFFF]'
  },
  {
    title: 'Just Grow it',
    reward: 450,
    progress: 3,
    total: 5,
    image: '/images/achievements/grow.png',
    color: 'from-[#88BC46] to-[#88BC46]',
    border: 'border-[#88BC46]',
    text: 'text-[#88BC46]'
  },
  {
    title: 'Money Major',
    reward: 50,
    progress: 3,
    total: 5,
    image: '/images/achievements/money_major.png',
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
    image: '/images/achievements/stacks.png',
    color: 'from-[#88BC46] to-[#88BC46]',
    border: 'border-[#88BC46]',
    text: 'text-[#88BC46]'
  },
  {
    title: 'All My Friends',
    reward: 150,
    progress: 3,
    total: 5,
    image: '/images/achievements/friends.png',
    color: 'from-[#FFC857] to-[#F5A623]',
    border: 'border-[#ED5E52]',
    text: 'text-[#ED5E52]'
  },
  {
    title: 'Target Chaser',
    reward: 5000,
    progress: 3,
    total: 5,
    image: '/images/achievements/target.png',
    color: 'from-[#5FBFFF] to-[#5FBFFF]',
    border: 'border-[#5FBFFF]',
    text: 'text-[#5FBFFF]'
  },
  {
    title: 'Building Wealth',
    reward: 30,
    progress: 3,
    total: 5,
    image: '/images/achievements/wealth.png',
    color: 'from-[#88BC46] to-[#88BC46]',
    border: 'border-[#88BC46]',
    text: 'text-[#88BC46]'
  },
  {
    title: '#1 Investor',
    reward: 850,
    progress: 3,
    total: 5,
    image: '/images/achievements/investor.png',
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
  return (
    <div
      className={`border-2 ${border} rounded-xl p-4 flex flex-col items-center shadow-sm cursor-pointer transition hover:shadow-md`}
      onClick={() => navigate(`/achievements/${encodeURIComponent(title)}`)}
    >
      <h3 className={`text-sm font-semibold mb-2 ${text}`}>{title}</h3>
      <img src={image} alt={title} className="w-16 h-16 object-contain mb-3" />
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
        <div className={`h-2 bg-gradient-to-r ${color}`} style={{ width: `${(progress / total) * 100}%` }}></div>
      </div>
      <div className="flex justify-between w-full text-xs text-gray-600">
        <span className="font-medium">{reward} XP Reward</span>
        <span>{progress}/{total}</span>
      </div>
    </div>
  );
};

const AchievementsPage = () => {
  return (
    <AchievementsLayout>
      <div className="space-y-6 p-4">
        <ProgressBar percentage={60} />

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-1">Achievements</h2>
          <p className="text-sm text-gray-500 mb-4">Unlock your achievements by completing badge collections on the site.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((a, i) => (
              <AchievementCard key={i} {...a} />
            ))}
          </div>
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default AchievementsPage;
