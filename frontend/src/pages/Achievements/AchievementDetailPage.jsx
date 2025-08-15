
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCheck, FaTrophy } from 'react-icons/fa';
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

const getBadgeImage = (title = '') => {
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

const detectColorKey = (title = '') => {
  const lower = title.toLowerCase();
  if (lower.match(/grow|plant|first|friend|master|stock|daily|learn|investment|save|wealth|spend|transaction/)) return 'green';
  if (lower.match(/bank|top|habits|score|secret|data|weekly|milestone|budget|quiz|target|goal/)) return 'blue';
  return 'red';
};

const colorMap = {
  red:   { hex: '#ED5E52', gradient: 'linear-gradient(to right, #FF4C28, #FFCE51)', bg: 'bg-red-50',  text: 'text-red-500' },
  blue:  { hex: '#5FBFFF', gradient: 'linear-gradient(to right, #5FBFFF, #B1E1FF)', bg: 'bg-sky-50', text: 'text-sky-500' },
  green: { hex: '#88BC46', gradient: 'linear-gradient(to right, #88BC46, #CBEEA5)', bg: 'bg-lime-50', text: 'text-lime-600' },
};

const BadgeTaskCard = ({ task, colorInfo, image }) => {
  const progressPercent = Math.min((task.progress / Math.max(1, task.total)) * 100, 100);
  const isComplete = progressPercent >= 100;
  return (
    <div className={`flex items-center justify-between p-5 rounded-xl shadow-sm transition-all hover:shadow-md ${colorInfo.bg} border-l-4`} style={{ borderLeftColor: colorInfo.hex }}>
      <div className="flex items-center gap-4 w-full">
        <div className={`relative flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full ${isComplete ? 'ring-2 ring-yellow-400' : ''}`} style={{ backgroundColor: `${colorInfo.hex}20` }}>
          <img src={image} alt={task.title} className="w-10 h-10 object-contain" />
          {isComplete && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${colorInfo.text}`}>{task.title}</h3>
            <span className={`text-sm font-medium ${colorInfo.text}`}>{task.points_awarded} XP</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">({Math.round(progressPercent)}%)</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full">
              <div className="h-2.5 rounded-full" style={{ width: `${progressPercent}%`, background: colorInfo.gradient }} />
            </div>
          </div>
          {task.description && <p className="text-sm text-gray-600 mt-2">{task.description}</p>}
        </div>
      </div>
    </div>
  );
};

const AchievementDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [achievement, setAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const title = achievement?.achievement_title || String(id || '');
  const colorKey = detectColorKey(title);
  const colorInfo = colorMap[colorKey];
  const badgeImage = getBadgeImage(title);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?.id || !id) return;

    const isNumeric = /^\d+$/.test(String(id));

    const load = async () => {
      try {
        setIsLoading(true);

        // 1) Fetch achievement info by id OR title
        const infoUrl = isNumeric
          ? `http://localhost:5000/api/achievements/by-id/${id}/${user.id}`
          : `http://localhost:5000/api/achievements/by-title/${encodeURIComponent(id)}/${user.id}`;

        const infoRes = await fetch(infoUrl);
        if (!infoRes.ok) throw new Error('Failed to fetch achievement info');
        const { data: ach } = await infoRes.json();
        if (!ach) throw new Error('Achievement not found');
        setAchievement(ach);

        // 2) Fetch tasks by TITLE (from the server response)
        const tRes = await fetch(
          `http://localhost:5000/api/achievements/task/${encodeURIComponent(ach.achievement_title)}/${user.id}`
        );
        if (!tRes.ok) throw new Error('Failed to fetch tasks');
        const tJson = await tRes.json();
        setTasks(Array.isArray(tJson?.data) ? tJson.data : []);
      } catch (e) {
        console.error(e);
        toast.error('Could not load achievement data');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  if (isLoading) {
    return (
      <AchievementsLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-600">Loading achievement details...</p>
          </div>
        </div>
      </AchievementsLayout>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.progress >= t.total).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AchievementsLayout>
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
          <FaChevronLeft className="text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Back to Achievements</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${colorInfo.bg}`}>
                <img src={badgeImage} alt={title} className="w-16 h-16 object-contain" />
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-200">{title}</h1>

              {achievement?.achievement_description && (
                <p className="text-gray-600 mb-4">{achievement.achievement_description}</p>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-50 px-4 py-2 rounded-lg dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className={`font-medium ${colorInfo.text}`}>{colorKey[0].toUpperCase() + colorKey.slice(1)}</p>
                </div>

                <div className="bg-gray-50 px-4 py-2 rounded-lg dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total XP</p>
                  <p className="font-medium text-gray-900">
                    {tasks.reduce((sum, t) => sum + (t.points_awarded || 0), 0)} XP
                  </p>
                </div>

                <div className="bg-gray-50 px-4 py-2 rounded-lg dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
                  <p className="font-medium text-gray-900">
                    {completedTasks}/{totalTasks} tasks ({completionPercentage}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2 dark:text-gray-200">
            <FaTrophy className={colorInfo.text} />
            <span>Tasks to Complete</span>
          </h2>

          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((t) => (
                <BadgeTaskCard
                  key={t.achievement_id}
                  task={{
                    title: t.title,
                    points_awarded: t.points_awarded,
                    progress: t.progress,
                    total: t.total,
                    description: t.description
                  }}
                  colorInfo={colorInfo}
                  image={badgeImage}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-200">No tasks found for this achievement</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-sky-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-sky-700">How to earn this achievement</h3>
              <div className="mt-2 text-sm text-sky-700">
                <p>Complete all the tasks listed above to unlock this achievement. Each completed task earns you XP. Check back regularly as new tasks may be added!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AchievementsLayout>
  );
};

export default AchievementDetailPage;
