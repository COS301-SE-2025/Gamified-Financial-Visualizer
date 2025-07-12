import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

import badge1 from '../../assets/Images/badges/CoinStack.png';
import badge2 from '../../assets/Images/badges/notesIcon.png';
import badge3 from '../../assets/Images/badges/targetIcon.png';
import badge4 from '../../assets/Images/badges/plantIcon.png';
import badge5 from '../../assets/Images/badges/highFiveIcon.png';
import badge6 from '../../assets/Images/badges/moneyBagIcon.png';
import badge7 from '../../assets/Images/badges/moneyGrowIcon.png';
import badge8 from '../../assets/Images/badges/mountainIcon.png';
import badge9 from '../../assets/Images/badges/awardIcon.png';

// badge images mapping


// style maps keyed by title
const styleMap = {
  'Cash Horder': { gradient: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
  'OverAchiever': { gradient: 'from-[#5FBFFF] to-[#5FBFFF]', border: 'border-[#5FBFFF]', text: 'text-[#5FBFFF]' },
  'Just Grow it': { gradient: 'from-[#88BC46] to-[#88BC46]', border: 'border-[#88BC46]', text: 'text-[#88BC46]' },
  'Money Major': { gradient: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
  'Real Banker': { gradient: 'from-[#5FBFFF] to-[#5FBFFF]', border: 'border-[#5FBFFF]', text: 'text-[#5FBFFF]' },
  'Stack Stacker': { gradient: 'from-[#88BC46] to-[#88BC46]', border: 'border-[#88BC46]', text: 'text-[#88BC46]' },
  'All My Friends': { gradient: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
  'Target Chaser': { gradient: 'from-[#5FBFFF] to-[#5FBFFF]', border: 'border-[#5FBFFF]', text: 'text-[#5FBFFF]' },
  'Building Wealth': { gradient: 'from-[#88BC46] to-[#88BC46]', border: 'border-[#88BC46]', text: 'text-[#88BC46]' },
  '#1 Investor': { gradient: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
};

const badgeMap = {
  'Cash Horder': badge1,
  'OverAchiever': badge2,
  'Just Grow it': badge4,
  'Money Major': badge6,
  'Real Banker': badge9,
  'Stack Stacker': badge2,
  'All My Friends': badge5,
  'Target Chaser': badge3,
  'Building Wealth': badge7,
  '#1 Investor': badge9,
};

const AchievementCard = ({ ach }) => {
  const navigate = useNavigate();
  const {
    achievement_title: title,
    points_awarded: reward,
    progress_value: progress,
    achievement_status: status,
    badge_image_path: imagePath
  } = ach;

  // Determine total from trigger JSON
  const total = 1;
  const percent = Math.min((progress / total) * 100, 100);

  const style = styleMap[title] || styleMap['Cash Horder'];
  const badgeImage = imagePath;

  return (
    <div
      className={`rounded-2xl p-4 shadow hover:shadow-lg cursor-pointer border-2 ${style.border} bg-white transition`}
      onClick={() => navigate(`/achievements/${title}`)}
    >
      <h3 className={`text-sm font-bold ${style.text}`}>{title}</h3>
      <img src={badgeImage} alt={title} className="w-20 h-20 object-contain mx-auto" />
      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${style.gradient}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 font-medium mt-1">
        <span>{reward} XP</span>
        <span>{progress}/{total}</span>
      </div>
    </div>
  );
};

const IncompleteAchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/achievements/user/${user.id}`);
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        const incomplete = data.data.filter(a => a.achievement_status === 'complete');
        setAchievements(incomplete);
      } catch (err) {
        console.error(err);
        toast.error('Could not load achievements');
      }
    };
    load();
  }, []);

  if (!achievements.length) {
    return (
      <AchievementsLayout>
        <div className="flex items-center justify-center h-full text-gray-500">
          No incomplete achievements!
        </div>
      </AchievementsLayout>
    );
  }

  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        <h2 className="text-2xl font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6"> 
          Complete Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {achievements.map((ach, i) => (
            <AchievementCard key={i} ach={ach} />
          ))}
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default IncompleteAchievementsPage;