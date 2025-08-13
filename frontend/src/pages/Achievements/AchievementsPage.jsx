import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

// Import all badge images as before
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
import badge11 from '../../assets/Images/badges/balance-scale.png';
import badge12 from '../../assets/Images/badges/brainstorming.png';
import badge13 from '../../assets/Images/badges/customer.png';
import badge14 from '../../assets/Images/badges/discussion.png';
import badge15 from '../../assets/Images/badges/expense.png';
import badge16 from '../../assets/Images/badges/idea.png';
import badge17 from '../../assets/Images/badges/income.png';
import badge18 from '../../assets/Images/badges/lighthouse.png';
import badge19 from '../../assets/Images/badges/meeting.png';
import badge20 from '../../assets/Images/badges/planing.png';
import badge21 from '../../assets/Images/badges/presentation.png';
import badge22 from '../../assets/Images/badges/profit.png';
import badge23 from '../../assets/Images/badges/start-up.png';
import badge24 from '../../assets/Images/badges/support.png';
import badge25 from '../../assets/Images/badges/team.png';

// Color system matching Figma card groups
const colorMap = {
  red: {
    border: 'border-[#ED5E52]',
    fill: 'bg-[#ED5E52]',
    text: 'text-[#ED5E52]',
    bg: 'bg-red-50',
  },
  blue: {
    border: 'border-[#5FBFFF]',
    fill: 'bg-[#5FBFFF]',
    text: 'text-[#5FBFFF]',
    bg: 'bg-blue-50',
  },
  green: {
    border: 'border-[#88BC46]',
    fill: 'bg-[#88BC46]',
    text: 'text-[#88BC46]',
    bg: 'bg-green-50',
  },
};

const allBadges = [
  badge1, badge2, badge3, badge4, badge5,
  badge6, badge7, badge8, badge9, badge10, badge11, badge12,
  badge13, badge14, badge15, badge16, badge17, badge18,
  badge19, badge20, badge21, badge22, badge23, badge24, badge25
];

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

  return allBadges[Math.floor(Math.random() * allBadges.length)];
};

const detectColorKey = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes('grow') || lower.includes('plant') || lower.includes('first') || lower.includes('friend') || lower.includes('master') || lower.includes('stock') || lower.includes('daily') || lower.includes('learn') || lower.includes('investment') || lower.includes('save') || lower.includes('wealth') || lower.includes('spend') || lower.includes('transaction')) {
    return 'green';
  }
  if (lower.includes('bank') || lower.includes('top') || lower.includes('habits') || lower.includes('score') || lower.includes('secret') || lower.includes('data') || lower.includes('weekly') || lower.includes('milestone') || lower.includes('budget') || lower.includes('quiz') || lower.includes('target') || lower.includes('goal')) {
    return 'blue';
  }
  return 'red';
};

const AchievementCard = ({ achievement }) => {
  const navigate = useNavigate();
  const {
    achievement_title,
    points_awarded,
    progress_value,
    trigger_condition_json,
    achievement_description,
  } = achievement;

  const total = trigger_condition_json.count || trigger_condition_json.value || 1;
  const progress = progress_value;
  const percent = Math.min((progress / total) * 100, 100);

  const colorKey = detectColorKey(achievement_title);
  const { border, fill, text, bg } = colorMap[colorKey];
  const image = getBadgeImage(achievement_title);

  {/*Achievements card*/}
  return (
    <div
      onClick={() => navigate(`/achievements/${achievement_title}`)}
      className={`cursor-pointer border-2 ${border} rounded-xl p-4 bg-white dark:bg-gray-800 flex flex-col items-center gap-3 hover:shadow-md transition-shadow ${bg}`}  
      title="Click to view details and sub-achievements"
    >
      <div className="relative">
        <img src={image} alt={achievement_title} className="w-16 h-16 object-contain dark:text-gray-200" />
        {percent === 100 && (
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center dark:text-gray-300">
            <span className="text-xs font-bold">✓</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <h3 className={`text-sm font-semibold dark:text-gray-200 ${text}`}>{achievement_title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 dark:text-gray-300">{achievement_description || 'Complete tasks to earn this achievement'}</p>
      </div>

      <div className="w-full mt-1">
        <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300">
          <span className={`${text}`}>{points_awarded} XP</span>
          <span className="text-gray-600">{progress}/{total}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className={`${fill} h-2 rounded-full`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 font-medium pt-1 dark:text-gray-300">
          <span>{points_awarded} XP</span>
          <span>{progress}/{total}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">
        {percent === 100 ? 'Completed!' : 'Click for details'}
      </div>
    </div>
  );
};

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const fetchAchievements = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  

  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        {/* Achievemnets page banner */}
        <div className="bg-gradient-to-r from-[#B1E1FF20] to-[#7FDD5320] rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-200">All Your Achievements</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Complete challenges to earn XP and unlock badges. Click on any achievement to see its sub-tasks and requirements.
              </p>

              <div className="flex items-center text-sm text-gray-500 mt-3">
                <span className="inline-block w-3 h-3 bg-[#88BC46] rounded-full mr-1"></span>
                <span className="mr-3">Financial</span>
                <span className="inline-block w-3 h-3 bg-[#5FBFFF] rounded-full mr-1"></span>
                <span className="mr-3">Learning</span>
                <span className="inline-block w-3 h-3 bg-[#ED5E52] rounded-full mr-1"></span>
                <span>Community</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {achievements.length > 0 ? (
            achievements.map((ach, idx) => (
              <AchievementCard key={idx} achievement={ach} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No achievements found. Start completing tasks to earn your first badge!</p>
            </div>
          )}
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default AchievementsPage;