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

const colorMap = {
  red: {
    hex: '#ED5E52',
    gradient: 'linear-gradient(to right, #FF4C28, #FFCE51)',
    bg: 'bg-red-50',
    text: 'text-red-500',
  },
  blue: {
    hex: '#5FBFFF',
    gradient: 'linear-gradient(to right, #5FBFFF, #B1E1FF)',
    bg: 'bg-sky-50',
    text: 'text-sky-500',
  },
  green: {
    hex: '#88BC46',
    gradient: 'linear-gradient(to right, #88BC46, #CBEEA5)',
    bg: 'bg-lime-50',
    text: 'text-lime-600',
  },
};

const BadgeTaskCard = ({ task, colorInfo, image, isCompleted }) => {
  const progressPercent = Math.min((task.progress / task.total) * 100, 100);
  const isComplete = progressPercent >= 100;

  return (
    <div className={`flex items-center justify-between p-5 dark:bg-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md ${colorInfo.bg} border-l-4`}
      style={{ borderLeftColor: colorInfo.hex }}>
      <div className="flex items-center gap-4 w-full">
        <div className={`relative flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-full ${isComplete ? 'ring-2 ring-yellow-400' : ''}`}
          style={{ backgroundColor: `${colorInfo.hex}20` }}>
          <img src={image} alt={task.title} className="w-10 h-10 object-contain" />
          {isComplete && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold dark:text-gray-200 ${colorInfo.text}`}>
              {task.title}
            </h3>
            <span className={`text-sm font-medium ${colorInfo.text}`}>
              {task.reward} XP
            </span>
          </div>

          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">
                {task.progress}/{task.total} ({Math.round(progressPercent)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full">
              <div className="h-2.5 rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: colorInfo.gradient
                }} />
            </div>
          </div>

          <p className="text-xs mt-1 dark:text-gray-300" style={{ color: primaryColor }}>
            {task.progress}/{task.total}
          </p>
        </div>
      </div>
    </div>
  );
};

const AchievementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievementInfo, setAchievementInfo] = useState(null);

  const colorKey = detectColorKey(id);
  const colorInfo = colorMap[colorKey];
  const badgeImage = getBadgeImage(id);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id || !id) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [tasksRes, achievementRes] = await Promise.all([
          fetch(`http://localhost:5000/api/achievements/task/${id}/${user.id}`),
          fetch(`http://localhost:5000/api/achievements/${id}`)
        ]);

        if (!tasksRes.ok) throw new Error('Failed to fetch tasks');
        if (!achievementRes.ok) throw new Error('Failed to fetch achievement info');

        const tasksData = await tasksRes.json();
        const achievementData = await achievementRes.json();

        setTasks(tasksData.data || []);
        setAchievementInfo(achievementData.data || null);
      } catch (error) {
        console.error(error);
        setError(error.message);
        toast.error('Could not load achievement data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  if (error) {
    return (
      <AchievementsLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 dark:bg-gray-800 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-700">Error loading achievement</h3>
                <div className="mt-2 text-sm text-red-600">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AchievementsLayout>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.progress >= task.total).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AchievementsLayout>
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        >
          <FaChevronLeft className="text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Back to Achievements</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${colorInfo.bg}`}>
                <img src={badgeImage} alt={id} className="w-16 h-16 object-contain" />
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{id}</h1>

              {achievementInfo?.description && (
                <p className="text-gray-600 mb-4">{achievementInfo.description}</p>
              )}

              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className={`font-medium ${colorInfo.text}`}>
                    {colorKey.charAt(0).toUpperCase() + colorKey.slice(1)}
                  </p>
                </div>

                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Total XP</p>
                  <p className="font-medium text-gray-900">
                    {tasks.reduce((sum, task) => sum + task.points_awarded, 0)} XP
                  </p>
                </div>

                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="font-medium text-gray-900">
                    {completedTasks}/{totalTasks} tasks ({completionPercentage}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaTrophy className={colorInfo.text} />
            <span>Tasks to Complete</span>
          </h2>

          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task, i) => (
                <BadgeTaskCard
                  key={i}
                  task={{
                    title: task.title,
                    reward: task.points_awarded,
                    progress: task.progress,
                    total: task.total,
                    description: task.description
                  }}
                  colorInfo={colorInfo}
                  image={badgeImage}
                  isCompleted={task.progress >= task.total}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No tasks found for this achievement</p>
            </div>
          )}
        </div>

        {/* How to earn badge at the bottom */}
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