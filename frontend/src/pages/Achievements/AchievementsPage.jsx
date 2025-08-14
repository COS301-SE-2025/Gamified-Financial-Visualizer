import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';

// Badge images
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

const colorMap = {
  red:   { border: 'border-[#ED5E52]', fill: 'bg-[#ED5E52]', text: 'text-[#ED5E52]', bg: 'bg-red-50' },
  blue:  { border: 'border-[#5FBFFF]', fill: 'bg-[#5FBFFF]', text: 'text-[#5FBFFF]', bg: 'bg-blue-50' },
  green: { border: 'border-[#88BC46]', fill: 'bg-[#88BC46]', text: 'text-[#88BC46]', bg: 'bg-green-50' },
};

const allBadges = [
  badge1, badge2, badge3, badge4, badge5,
  badge6, badge7, badge8, badge9, badge10, badge11, badge12,
  badge13, badge14, badge15, badge16, badge17, badge18,
  badge19, badge20, badge21, badge22, badge23, badge24, badge25
];

const getBadgeImage = (title) => {
  const lower = (title || '').toLowerCase();
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
  const lower = (title || '').toLowerCase();
  if (lower.match(/grow|plant|first|friend|master|stock|daily|learn|investment|save|wealth|spend|transaction/)) return 'green';
  if (lower.match(/bank|top|habits|score|secret|data|weekly|milestone|budget|quiz|target|goal/)) return 'blue';
  return 'red';
};

// Safe helpers
const parseJsonSafe = (val) => {
  if (!val) return {};
  if (typeof val === 'object') return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
  return {};
};
const toNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const AchievementCard = ({ achievement }) => {
  const navigate = useNavigate();

  const {
    achievement_id,
    achievement_title,
    points_awarded,
    progress_value,            // may be missing; default handled below
    trigger_condition_json,    // may be {} or string
    achievement_description,
    completed_task_count,      // strings from DB
    child_task_count           // strings from DB
  } = achievement;

  const cond = parseJsonSafe(trigger_condition_json);

  // Priority for progress/total:
  // 1) If trigger defines a numeric target (count/value), use that with progress_value
  // 2) Else use completed/child task counts for umbrella progress
  // 3) Default to 1 to avoid divide-by-zero
  const totalFromTrigger = toNum(cond.count ?? cond.value, 0);
  const total = totalFromTrigger > 0
    ? totalFromTrigger
    : (toNum(child_task_count, 0) || 1);

  const completed = totalFromTrigger > 0
    ? toNum(progress_value, 0)
    : toNum(completed_task_count, 0);

  const percent = Math.min((completed / total) * 100, 100);

  const colorKey = detectColorKey(achievement_title);
  const { border, fill, text, bg } = colorMap[colorKey] ?? colorMap.red;
  const image = getBadgeImage(achievement_title);

  return (
    <div
      onClick={() => navigate(`/achievements/${encodeURIComponent(achievement_title)}`)}
      className={`cursor-pointer border-2 ${border} rounded-xl p-4 bg-white dark:bg-gray-800 flex flex-col items-center gap-3 hover:shadow-md transition-shadow ${bg}`}
      title="Click to view details and sub-achievements"
      data-achievement-id={achievement_id}
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
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 dark:text-gray-300">
          {achievement_description || 'Complete tasks to earn this achievement'}
        </p>
      </div>

      <div className="w-full mt-1">
        <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300">
          <span className={`${text}`}>{toNum(points_awarded, 0)} XP</span>
          {toNum(child_task_count, 0) > 0 && (
            <span className="text-gray-600">
              {toNum(completed, 0)}/{toNum(total, 1)} tasks
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
          <div className={`${fill} h-2 rounded-full`} style={{ width: `${percent}%` }} />
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
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch {}

    if (!user?.id) {
      setIsLoading(false);
      toast.error('No user found.');
      return;
    }

    const fetchAchievements = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`http://localhost:5000/api/achievements/list/${user.id}`);
        if (!res.ok) throw new Error('Fetch failed');

        const payload = await res.json();
        const rows = Array.isArray(payload?.data) ? payload.data : [];

        // Normalize each row (numbers, JSON)
        const normalized = rows?.map((def) => ({
          ...def,
          achievement_id: def.achievement_id,
          trigger_condition_json: parseJsonSafe(def.trigger_condition_json),
          points_awarded: toNum(def.points_awarded, 0),
          child_task_count: toNum(def.child_task_count, 0),
          completed_task_count: toNum(def.completed_task_count, 0),
          // if backend ever includes progress_value, coerce it; else default 0
          progress_value: toNum(def.progress_value, 0),
        }));

        setAchievements(normalized);
      } catch (err) {
        console.error(err);
        toast.error('Could not load achievements');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (isLoading || !achievements) {
    return (
      <AchievementsLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your achievements...</p>
          </div>
        </div>
      </AchievementsLayout>
    );
  }

  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        {/* Banner */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {achievements?.length > 0 ? (
            achievements?.map((ach) => (
              <AchievementCard key={ach?.achievement_id} achievement={ach} />
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