import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCheck, FaTrophy } from 'react-icons/fa';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

// Badges (full set + accepted.png for "Speed Runner")
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
import badge15 from '../../assets/Images/badges/profit (2).png';
import badge16 from '../../assets/Images/badges/idea.png';
import badge17 from '../../assets/Images/badges/income.png';
import badge18 from '../../assets/Images/badges/lighthouse.png';
import badge19 from '../../assets/Images/badges/meeting.png';
import badge20 from '../../assets/Images/badges/planing.png';
import badge21 from '../../assets/Images/badges/presentation.png';
import badge22 from '../../assets/Images/badges/profit.png';
import badge23 from '../../assets/Images/badges/start-up.png';
import badge24 from '../../assets/Images/badges/support.png';
import badge26 from '../../assets/Images/badges/accepted.png';

// Deterministic title → { color, badge } (case-insensitive)
const TITLE_META = {
  // Blue (Learning)
  'avid scholar': { color: 'blue', badge: badge10 },
  'quiz conqueror': { color: 'blue', badge: badge11 },
  'financial ace': { color: 'blue', badge: badge3 },
  'new world': { color: 'blue', badge: badge23 },
  'tutorial trailblazer': { color: 'blue', badge: badge20 },
  'over achiever': { color: 'blue', badge: badge21 },
  'quiz maniac': { color: 'blue', badge: badge12 },
  'ar viewer': { color: 'blue', badge: badge8 },

  // Green (Financial)
  'speed runner': { color: 'green', badge: badge26 },
  'money mover': { color: 'green', badge: badge2 },
  'investment guru': { color: 'green', badge: badge7 },
  'transaction master': { color: 'green', badge: badge13 },
  'points hoarder': { color: 'green', badge: badge6 },
  'goal getter': { color: 'green', badge: badge22 },
  'budget hero': { color: 'green', badge: badge17 },
  'transaction tycoon': { color: 'green', badge: badge1 },
  'custom king': { color: 'green', badge: badge16 },
  'point pursuer': { color: 'green', badge: badge4 },
  'budget boss': { color: 'green', badge: badge15 },

  // Red (Community)
  'top ranker': { color: 'red', badge: badge9 },
  'community champion': { color: 'red', badge: badge5 },
  'challenge accepted': { color: 'red', badge: badge24 },
  'challenge champion': { color: 'red', badge: badge19 },
  'trending now': { color: 'red', badge: badge18 },
  'social butterfly': { color: 'red', badge: badge14 },
};

const lookupMeta = (title) => TITLE_META[(title || '').trim().toLowerCase()] || null;

// Keep your existing color style
const colorMap = {
  red:   { hex: '#ED5E52', gradient: 'linear-gradient(to right, #FF4C28, #FFCE51)', bg: 'bg-red-50',  text: 'text-red-500' },
  blue:  { hex: '#5FBFFF', gradient: 'linear-gradient(to right, #5FBFFF, #B1E1FF)', bg: 'bg-sky-50', text: 'text-sky-500' },
  green: { hex: '#88BC46', gradient: 'linear-gradient(to right, #88BC46, #CBEEA5)', bg: 'bg-lime-50', text: 'text-lime-600' },
};

// Drop-in dark palette
const colorMapDark = {
  red: {
    // a muted "tomato/brick"
    hex: '#fe9994ff',                                   // main accent
    gradient: 'linear-gradient(to right, #fb927dff, #fbe5adff)',
    bg: 'bg-[rgba(184,93,88,0.15)]',                  // soft tinted surface
    text: 'text-rose-300'                             // readable on dark bg
  },
  blue: {
    // a calm "steel blue"
    hex: '#5A7FA6',
    gradient: 'linear-gradient(to right, #5FBFFF, #B1E1FF)',
    bg: 'bg-[rgba(90,127,166,0.15)]',
    text: 'text-sky-300'
  },
  green: {
    // a dusky "olive/sage"
    hex: '#6F8F4E',
    gradient: 'linear-gradient(to right, #88BC46, #CBEEA5)',
    bg: 'bg-[rgba(111,143,78,0.15)]',
    text: 'text-lime-300'
  }
};


const getBadgeImage = (title = '') => {
  const m = lookupMeta(title);
  if (m?.badge) return m.badge;
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
  const m = lookupMeta(title);
  if (m?.color) return m.color;
  const lower = title.toLowerCase();
  if (lower.match(/grow|plant|first|friend|master|stock|daily|learn|investment|save|wealth|spend|transaction/)) return 'green';
  if (lower.match(/bank|top|habits|score|secret|data|weekly|milestone|budget|quiz|target|goal/)) return 'blue';
  return 'red';
};

const BadgeTaskCard = ({ task, colorInfo, image }) => {
  const progressPercent = Math.min((task.progress / Math.max(1, task.total)) * 100, 100);
  const isComplete = progressPercent >= 100;
  return (
    <div className={`flex items-center justify-between p-4 sm:p-5 rounded-xl shadow-sm transition-all hover:shadow-md ${colorInfo.bg} border-l-4`} style={{ borderLeftColor: colorInfo.hex }}>
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <div className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full ${isComplete ? 'ring-2 ring-yellow-400' : ''}`} style={{ backgroundColor: `${colorInfo.hex}20` }}>
          <img src={image} alt={task.title} className="w-6 h-6 sm:w-10 sm:h-10 object-contain" />
          {isComplete && (
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-yellow-400 rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center">
              <FaCheck className="text-white text-xs" />
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
            <h3 className={`text-base sm:text-lg font-semibold ${colorInfo.text} truncate`}>{task.title}</h3>
            <span className={`text-sm font-medium ${colorInfo.text} whitespace-nowrap`}>{task.points_awarded} XP</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs sm:text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="font-medium">({Math.round(progressPercent)}%)</span>
            </div>
            <div className="w-full bg-gray-200 h-2 sm:h-2.5 rounded-full dark:bg-gray-700">
              <div className="h-2 sm:h-2.5 rounded-full" style={{ width: `${progressPercent}%`, background: colorInfo.gradient }} />
            </div>
          </div>
          {task.description && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2 dark:text-gray-300 line-clamp-2">
              {task.description}
            </p>
          )}
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

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Display meta based on mapping (keeps styling)
  const title = achievement?.achievement_title || String(id || '');
  const colorKey = detectColorKey(title);
  const isDark = document.documentElement.classList.contains('dark');
  const colorInfo = (isDark ? colorMapDark : colorMap)[colorKey];
  const badgeImage = getBadgeImage(title);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user?.id || !id) return;

    const isNumeric = /^\d+$/.test(String(id));

    const load = async () => {
      try {
        setIsLoading(true);

        // 1) Fetch achievement info
        const infoUrl = isNumeric
          ? `http://localhost:5000/api/achievements/by-id/${id}/${user.id}`
          : `http://localhost:5000/api/achievements/by-title/${encodeURIComponent(id)}/${user.id}`;

        const infoRes = await fetch(infoUrl);
        if (!infoRes.ok) throw new Error('Failed to fetch achievement info');
        const { data: ach } = await infoRes.json();
        if (!ach) throw new Error('Achievement not found');
        setAchievement(ach);

        // 2) Fetch tasks by TITLE from the server response
        const tRes = await fetch(
          `http://localhost:5000/api/achievements/task/${encodeURIComponent(ach.achievement_title)}/${user.id}`
        );
        if (!tRes.ok) throw new Error('Failed to fetch tasks');
        const tJson = await tRes.json();
        const list = Array.isArray(tJson?.data) ? tJson.data : [];
        setTasks(list);
        setPage(1);
      } catch (e) {
        console.error(e);
        toast.error('Could not load achievement data');
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(tasks.length / pageSize));
    if (page > maxPage) setPage(1);
  }, [tasks, pageSize]);

  const totalTasks = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalTasks / pageSize));
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalTasks);
  const paginatedTasks = useMemo(() => tasks.slice(startIdx, endIdx), [tasks, startIdx, endIdx]);

  const completedTasks = tasks.filter(t => (t.progress || 0) >= Math.max(1, t.total || 0)).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AchievementsLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 sm:mb-6 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 text-sm sm:text-base"
        >
          <FaChevronLeft className="text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Back to Achievements</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100 dark:bg-gray-800 dark:border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${colorInfo.bg}`}>
                <img src={badgeImage} alt={title} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
              </div>
            </div>

            <div className="flex-grow w-full text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 dark:text-gray-200 break-words">
                {title}
              </h1>

              {achievement?.achievement_description && (
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 dark:text-gray-300">
                  {achievement.achievement_description}
                </p>
              )}

              {/* Updated: Horizontal table-like layout for mobile, grid for desktop */}
              <div className="overflow-x-auto"> {/* Added for horizontal scrolling on very small screens */}
                <div className="grid grid-cols-3 gap-2 min-w-max sm:min-w-0 sm:grid-cols-3 sm:gap-3">
                  <div className="bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg dark:bg-gray-700 text-center min-w-[100px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
                    <p className={`font-medium text-xs sm:text-sm ${colorInfo.text}`}>
                      {colorKey[0].toUpperCase() + colorKey.slice(1)}
                    </p>
                  </div>

                  <div className="bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg dark:bg-gray-700 text-center min-w-[100px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total XP</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                      {tasks.reduce((sum, t) => sum + (t.points_awarded || 0), 0)} XP
                    </p>
                  </div>

                  <div className="bg-gray-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg dark:bg-gray-700 text-center min-w-[100px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completion</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                      {completedTasks}/{totalTasks}<br className="sm:hidden"/>({completionPercentage}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header row for tasks - Left aligned */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2 dark:text-gray-200 justify-start">
            <FaTrophy className={colorInfo.text} />
            <span>Tasks</span>
          </h2>
        </div>

        {/* Tasks list */}
        <div className="mb-4 sm:mb-6">
          {totalTasks > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {paginatedTasks.map((t, idx) => (
                <BadgeTaskCard
                  key={t.task_id ?? t.id ?? `${t.title}-${startIdx + idx}`}
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
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-200 text-sm sm:text-base">
                No tasks found for this achievement
              </p>
            </div>
          )}
        </div>

        {/* Tips box */}
        <div className="bg-blue-50 border-l-4 border-sky-400 p-3 sm:p-4 rounded-r-lg dark:bg-[#0b2535] dark:border-sky-600">
          <div className="flex">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-sky-700 dark:text-sky-300">
                How to earn this achievement
              </h3>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-sky-700 dark:text-sky-200">
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