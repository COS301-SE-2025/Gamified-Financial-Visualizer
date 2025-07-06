import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

// badge images
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

// static styling maps keyed by achievement_title
const styleMap = {
  'Cash Horder':    { color: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
  'OverAchiever':   { color: 'from-[#5FBFFF] to-[#5FBFFF]', border: 'border-[#5FBFFF]', text: 'text-[#5FBFFF]' },
  'Just Grow it':   { color: 'from-[#88BC46] to-[#88BC46]', border: 'border-[#88BC46]', text: 'text-[#88BC46]' },
  'Money Major':    { color: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
  'Real Banker':    { color: 'from-[#5FBFFF] to-[#5FBFFF]', border: 'border-[#5FBFFF]', text: 'text-[#5FBFFF]' },
  'Stack Stacker':  { color: 'from-[#88BC46] to-[#88BC46]', border: 'border-[#88BC46]', text: 'text-[#88BC46]' },
  'All My Friends': { color: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
  'Target Chaser':  { color: 'from-[#5FBFFF] to-[#5FBFFF]', border: 'border-[#5FBFFF]', text: 'text-[#5FBFFF]' },
  'Building Wealth':{ color: 'from-[#88BC46] to-[#88BC46]', border: 'border-[#88BC46]', text: 'text-[#88BC46]' },
  '#1 Investor':    { color: 'from-[#FFC857] to-[#F5A623]', border: 'border-[#ED5E52]', text: 'text-[#ED5E52]' },
};

const badgeImageMap = {
  'Cash Horder':     badge1,
  'OverAchiever':    badge2,
  'Just Grow it':    badge4,
  'Money Major':     badge6,
  'Real Banker':     badge10,
  'Stack Stacker':   badge2,
  'All My Friends':  badge5,
  'Target Chaser':   badge3,
  'Building Wealth': badge7,
  '#1 Investor':     badge9,
};

// Card component
const AchievementCard = ({ achievement }) => {
  const navigate = useNavigate();
  const {
    achievement_title,
    points_awarded,
    progress_value,
    trigger_condition_json,
    achievement_status, 
    image_path
  } = achievement;

  const total = trigger_condition_json.count || trigger_condition_json.value || 1;
  const progress = progress_value;
  const percent = Math.min((progress / total) * 100, 100);

  const { color, border, text } = styleMap[achievement_title] || styleMap['Cash Horder'];
  const image = image_path;

  return (
    <div
      className={`rounded-2xl p-4 shadow-md transition hover:shadow-lg cursor-pointer border-2 ${border} bg-white`}
      onClick={() => navigate(`/achievements/${achievement_title}`)}
    >
      <div className="flex flex-col items-center gap-2">
        <h3 className={`text-sm font-bold ${text}`}>{achievement_title}</h3>
        <img src={image} alt={achievement_title} className="w-22 h-20 object-contain" />
        <div className="w-full mt-1">
          <div className="relative h-2 rounded-full bg-gray-200">
            <div
              className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${color}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between w-full text-xs text-gray-600 font-medium pt-1">
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
        if (!defsRes.ok || !userRes.ok) throw new Error('Failed fetch');

        const defsData = await defsRes.json();
        const userData = await userRes.json();

        // merge definitions + user progress
        const mergedData = defsData.data.map(def => {
          const userAch = userData.data.find(ua => ua.achievement_id === def.achievement_id);
          return {
            ...def,
            ...userAch,
            progress_value: userAch?.progress_value || 0,
            achievement_status: userAch?.achievement_status || 'incomplete',
            image_path: def.image_path|| badge1
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
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading achievements...</p>
        </div>
      </AchievementsLayout>
    );
  }

  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        <h2 className="text-2xl font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6">
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
