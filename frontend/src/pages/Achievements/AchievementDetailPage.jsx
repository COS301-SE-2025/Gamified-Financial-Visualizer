import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

// Badge icons
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

// Dynamic icon detector
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
  return badge1;
};

// Dynamic color detector
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

const hexMap = {
  red: '#ED5E52',
  blue: '#5FBFFF',
  green: '#88BC46',
};

const gradientMap = {
  red: 'linear-gradient(to right, #FF4C28, #FFCE51)',
  blue: 'linear-gradient(to right, #5FBFFF, #B1E1FF)',
  green: 'linear-gradient(to right, #88BC46, #CBEEA5)',
};

const BadgeTaskCard = ({ task, primaryColor, image, barGradient }) => {
  const progressPercent = (task.progress / task.total) * 100;

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-md border"
         style={{ borderColor: primaryColor }}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br"
             style={{ border: `1.5px solid ${primaryColor}` }}>
          <img src={image} alt={task.title} className="w-9 h-9 object-contain" />
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
            <div className="h-2 rounded-full" style={{ width: `${progressPercent}%`, background: barGradient }} />
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
  const [tasks, setTasks] = useState([]);

  const colorKey = detectColorKey(id);
  const primaryColor = hexMap[colorKey];
  const barGradient = gradientMap[colorKey];
  const badgeImage = getBadgeImage(id);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id || !id) return;

    const loadTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/achievements/task/${id}/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch achievement tasks');
        const data = await response.json();
        setTasks(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Could not load achievement tasks');
      }
    };

    loadTasks();
  }, [id]);

  if (!tasks.length) {
    return (
      <AchievementsLayout>
        <div className="p-6 space-y-6 rounded-2xl -mt-6">
          <div className="flex items-center justify-center h-64">
            <FaBolt className="text-gray-400 text-6xl" />
          </div>
          <p className="text-center text-gray-500">Loading achievement tasks...</p>
        </div>
      </AchievementsLayout>
    );
  }

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
              WebkitTextFillColor: 'transparent',
            }}
          >
            {id}
          </div>

          <p className="text-sm text-gray-500 mt-2 mb-4">
            Unlock your badges by completing tasks on the site.
          </p>

          <div className="space-y-4">
            {tasks.map((task, i) => (
              <BadgeTaskCard
                key={i}
                task={{
                  title: task.title,
                  reward: task.points_awarded,
                  progress: task.progress,
                  total: task.total,
                }}
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
