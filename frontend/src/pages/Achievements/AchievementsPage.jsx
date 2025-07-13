import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

import badge1 from '../../assets/Images/badges/coin.png';
import badge2 from '../../assets/Images/badges/banknote.png';
import badge3 from '../../assets/Images/badges/target.png';
import badge4 from '../../assets/Images/badges/growth.png';
import badge5 from '../../assets/Images/badges/hi5.png';
import badge6 from '../../assets/Images/badges/money-bag.png';
import badge7 from '../../assets/Images/badges/investment.png';
import badge8 from '../../assets/Images/badges/goal.png';
import badge9 from '../../assets/Images/badges/trophy.png';
import badge10 from '../../assets/Images/badges/bank.png';

// Color system matching Figma card groups
const colorMap = {
  red: {
    border: 'border-[#ED5E52]',
    fill: 'bg-[#ED5E52]',
    text: 'text-[#ED5E52]',
  },
  blue: {
    border: 'border-[#5FBFFF]',
    fill: 'bg-[#5FBFFF]',
    text: 'text-[#5FBFFF]',
  },
  green: {
    border: 'border-[#88BC46]',
    fill: 'bg-[#88BC46]',
    text: 'text-[#88BC46]',
  },
};

// Assign color category per badge
const badgeColorCategory = {
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
  'Goal Getter': 'red',
  'Starter Saver': 'red',
  'Halfway Hero': 'red',
  'Goal Smasher': 'red',
  'Consistent Closer': 'red',
  'Challenge Champion': 'red',
  'First Steps': 'green',
  'Top Contributor': 'red',
  'Streak Star': 'red',
  'Transaction Master': 'green',
};

// mapping for the badge images 
const getBadgeImage = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('coin') || lower.includes('track') || lower.includes('halfway')) return badge1;
  if (lower.includes('bank') || lower.includes('stack')) return badge2;
  if (lower.includes('target') || lower.includes('top')) return badge3;
  if (lower.includes('grow') || lower.includes('transaction')) return badge4;
  if (lower.includes('friend') || lower.includes('closer') || lower.includes('hi5')) return badge5;
  if (lower.includes('money') || lower.includes('challenge')) return badge6;
  if (lower.includes('wealth') || lower.includes('first') || lower.includes('budget')) return badge7;
  if (lower.includes('goal') || lower.includes('smasher')) return badge8;
  if (lower.includes('investor') || lower.includes('quiz') || lower.includes('trophy')) return badge9;
  if (lower.includes('banker')) return badge10;

  return badge1; // default
};

const detectColorKey = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('grow') || lower.includes('plant') || lower.includes('first') || lower.includes('friend') || lower.includes('master') || lower.includes('stock') || lower.includes('daily') ||lower.includes('learn') || lower.includes('investment') || lower.includes('save') || lower.includes('wealth') || lower.includes('spend') || lower.includes('transaction')) {
    return 'green';
  }
  if (lower.includes('bank') || lower.includes('top') || lower.includes('habits') || lower.includes('score') || lower.includes('secret') || lower.includes('data') || lower.includes('weekly') || lower.includes('milestone') || lower.includes('budget') || lower.includes('quiz') || lower.includes('target') || lower.includes('goal')) {
    return 'blue';
  }
  return 'red'; // default
};

const AchievementCard = ({ achievement }) => {
  const navigate = useNavigate();
  const {
    achievement_title,
    points_awarded,
    progress_value,
    trigger_condition_json,
  } = achievement;

  const total = trigger_condition_json.count || trigger_condition_json.value || 1;
  const progress = progress_value;
  const percent = Math.min((progress / total) * 100, 100);

  const colorKey = detectColorKey(achievement_title);
  const { border, fill, text } = colorMap[colorKey];
 const image = getBadgeImage(achievement_title);

  return (
    <div
      onClick={() => navigate(`/achievements/${achievement_title}`)}
      className={`cursor-pointer border-2 ${border} rounded-xl px-4 pt-4 pb-3 bg-white flex flex-col items-center gap-2`}
    >
      <h3 className={`text-sm font-semibold ${text} text-center`}>{achievement_title}</h3>
      <img src={image} alt={achievement_title} className="w-14 h-14 object-contain" />

      <div className="w-full mt-1">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className={`${fill} h-2 rounded-full`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 font-medium pt-1">
          <span>{points_awarded} XP</span>
          <span>{progress}/{total}</span>
        </div>
      </div>
    </div>
  );
};

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const fetchAchievements = async () => {
      try {
        const [defsRes, userRes] = await Promise.all([
          fetch('http://localhost:5000/api/achievements'),
          fetch(`http://localhost:5000/api/achievements/user/${user.id}`)
        ]);
        if (!defsRes.ok || !userRes.ok) throw new Error('Fetch failed');

        const defsData = await defsRes.json();
        const userData = await userRes.json();

        const mergedData = defsData.data.map(def => {
          const userAch = userData.data.find(ua => ua.achievement_id === def.achievement_id);
          return {
            ...def,
            ...userAch,
            progress_value: userAch?.progress_value || 0,
            achievement_status: userAch?.achievement_status || 'incomplete',
          };
        });

        setAchievements(mergedData);
      } catch (err) {
        console.error(err);
        toast.error('Could not load achievements');
      }
    };

    fetchAchievements();
  }, []);

  if (!achievements.length) {
    return (
      <AchievementsLayout>
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading achievements...
        </div>
      </AchievementsLayout>
    );
  }

  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        <h2 className="text-xl font-semibold text-blue-500 bg-blue-100 inline-block px-4 py-1 rounded-full shadow-sm">
          All Achievements
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {achievements.map((ach, idx) => (
            <AchievementCard key={idx} achievement={ach} />
          ))}
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default AchievementsPage;
