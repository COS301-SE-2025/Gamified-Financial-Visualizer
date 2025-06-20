import React from 'react';
import { useParams } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';

const sampleTasks = [
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'complete' },
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'incomplete' },
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'complete' },
  { title: 'First Time Saver', reward: 500, progress: 3, total: 5, status: 'incomplete' },
];

// Map achievement ID to its base color
const colorMap = {
  'Cash Horder': '#ED5E52',
  'OverAchiever': '#5FBFFF',
  'Just Grow it': '#88BC46',
  'Money Major': '#ED5E52',
  'Real Banker': '#5FBFFF',
  'Stack Stacker': '#88BC46',
  'All My Friends': '#ED5E52',
  'Target Chaser': '#5FBFFF',
  'Building Wealth': '#88BC46',
  '#1 Investor': '#ED5E52',
};

const BadgeTaskCard = ({ task, primaryColor, image }) => {
  const isComplete = task.status === 'complete';

  return (
    <div
      className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
      style={{ border: `1.5px solid ${primaryColor}` }}
    >
      <div className="flex items-center gap-4">
        {/* Icon circle */}
        <div
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-white to-[#FFF0F0]"
          style={{ border: `1.5px solid ${primaryColor}` }}
        >
          <img src={image} alt="icon" className="w-9 h-9 object-contain" />
        </div>

        {/* Text and progress */}
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
                background: `linear-gradient(to right, ${primaryColor}, #FACC15)`
              }}
            />
          </div>

          <p className="text-xs mt-1" style={{ color: primaryColor }}>
            {task.progress}/{task.total}
          </p>
        </div>
      </div>

      {/* Status badge */}
      <div
        className="flex items-center px-4 py-2 text-sm font-medium rounded-full shadow"
        style={{
          background: isComplete
            ? 'linear-gradient(to right, #FFF5D1, #FFECA8)'
            : 'linear-gradient(to right, #FFE3E3, #FFD1D1)',
          color: isComplete ? '#E1A400' : primaryColor,
          border: `1.5px solid ${isComplete ? '#FACC15' : primaryColor}`
        }}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
          style={{
            background: isComplete
              ? 'linear-gradient(to right, #FDE68A, #F59E0B)'
              : 'linear-gradient(to right, #FFBABA, #FF8C8C)'
          }}
        >
          <FaBolt className="text-white text-xs" />
        </div>
        {isComplete ? 'Completed' : 'Incomplete'}
      </div>
    </div>
  );
};

const AchievementDetailPage = () => {
  const { id } = useParams();
  const primaryColor = colorMap[id] || '#ED5E52';
  const badgeImage = `/images/badges/${id.toLowerCase().replace(/ /g, '_')}.png`;

  return (
    <AchievementsLayout>
      <div
        className="p-6 space-y-6 border-[3px] rounded-2xl"
        style={{ borderColor: primaryColor }}
      >
        {/* Progress Bar */}
        <div className="bg-white border border-yellow-200 rounded-xl p-4">
          <h2 className="text-blue-600 text-sm font-semibold">Badge Collection Progress</h2>
          <div className="relative w-full bg-yellow-100 h-4 mt-2 rounded-full">
            <div
              className="absolute top-0 left-0 h-4 bg-gradient-to-r from-[#FFC857] to-[#F5A623] rounded-full"
              style={{ width: '50%' }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 px-1 text-orange-500 font-semibold">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>

        {/* Header + Tasks */}
        <div>
          <div
            className="bg-white px-3 py-1 inline-block rounded-full text-sm font-semibold border"
            style={{ color: primaryColor, borderColor: primaryColor }}
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
