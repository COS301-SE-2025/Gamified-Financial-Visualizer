import React, { useEffect, useMemo, useState } from 'react';
import {
  FaUsers,
  FaBolt,
  FaUtensils,
  FaBus,
  FaFilm,
  FaHeartbeat,
  FaBook,
  FaMobileAlt,
  FaWifi,
  FaTv,
  FaHome,
  FaBuilding,
  FaShieldAlt,
  FaTshirt,
  FaDumbbell,
  FaHandsHelping,
  FaUser,
  FaGasPump,
  FaMoneyBillWave,
} from 'react-icons/fa';

/** --- Category icon mapping --- */
const categoryIcons = {
  groceries: <FaUtensils />,
  transport: <FaBus />,
  fuel: <FaGasPump />,
  utilities: <FaBolt />,
  rent: <FaHome />,
  mortgage: <FaBuilding />,
  internet: <FaWifi />,
  phone: <FaMobileAlt />,
  insurance: <FaShieldAlt />,
  medical: <FaHeartbeat />,
  health: <FaHeartbeat />,
  fitness: <FaDumbbell />,
  education: <FaBook />,
  subscriptions: <FaTv />,
  entertainment: <FaFilm />,
  restaurants: <FaUtensils />,
  clothing: <FaTshirt />,
  'personal care': <FaUser />,
  personal: <FaUser />,
  gifts: <FaHandsHelping />,
  charity: <FaHandsHelping />,
  default: <FaMoneyBillWave />,
};

/** --- (kept) category colors + fallback (unused for the top-6 palette now) --- */
const categoryColors = {
  groceries: '#FF8A8A',
  transport: '#5FBFFF',
  fuel: '#FF7F9E',
  utilities: '#7FDD53',
  rent: '#FFC541',
  mortgage: '#FF7F9E',
  internet: '#7FDD53',
  phone: '#93C5FD',
  insurance: '#4C51BF',
  medical: '#F56565',
  health: '#F68D2B',
  fitness: '#805AD5',
  education: '#4299E1',
  subscriptions: '#38B2AC',
  entertainment: '#FFC541',
  restaurants: '#E53E3E',
  clothing: '#DD6B20',
  personal: '#7FDD53',
  gifts: '#68D391',
  charity: '#48BB78',
};
const fallbackColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A6F', '#C44569', '#F8B500', '#6C5CE7',
  '#A29BFE', '#FD79A8', '#00B894', '#E17055', '#74B9FF',
  '#81ECEC', '#FAB1A0', '#E84393', '#00CEC9', '#FDCB6E'
];
const getCategoryColor = (key, idx = 0) =>
  categoryColors[key] || fallbackColors[idx % fallbackColors.length];

const STAT_PALETTE = ['#FF8A8A', '#7FDD53', '#5FBFFF', '#FFC541', '#F68D2B', '#FF7F9E'];

/** small helper to get a translucent bg from a hex */
const softBg = (hex) => `${hex}20`;

/** --- Helpers --- */
const parseAmountSafe = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return isFinite(val) ? val : 0;
  const s = String(val);
  const sign = s.trim().startsWith('-') ? -1 : 1;
  const num = parseFloat(s.replace(/[^\d.]/g, ''));
  return Number.isFinite(num) ? sign * num : 0;
};

const AccountsPerformanceHeader = () => {
  const [userTransactions, setUserTransactions] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');

  /** Get user from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) { setError('User not found in localStorage'); return; }
      const parsed = JSON.parse(raw);
      const id = parsed.id || parsed.user_id || parsed.userId;
      if (!id) { setError('User ID missing in localStorage user'); return; }
      setUserId(id);
    } catch (e) {
      console.error(e);
      setError('Failed to read user from localStorage');
    }
  }, []);

  /** Fetch performance summary + transactions */
  useEffect(() => {
    if (!userId) return;

    setError('');
    fetch(`http://localhost:5000/api/auth/profile/performance-summary/${userId}`)
      .then(res => res.json())
      .then(json => setPerformanceSummary(json?.data ?? null))
      .catch(err => console.error('Performance summary error:', err));

    (async () => {
      try {
        const resp = await fetch(`http://localhost:5000/api/transactions/user/${userId}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        if (json?.status === 'success') {
          setUserTransactions(json.data || []);
        } else {
          throw new Error(json?.message || 'Failed to load transactions');
        }
      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load transactions');
      }
    })();
  }, [userId]);

  /** Performance metrics (kept) */
  const performanceMetrics = useMemo(() => {
    if (!userTransactions || userTransactions.length === 0) {
      return { score: 0, level: 'Starter', levelNumber: 1, description: 'Getting Started', progressPercentage: 0 };
    }

    const totals = userTransactions.reduce((acc, t) => {
      const amount = parseFloat(t.transaction_amount) || parseFloat(t.amount) || 0;
      const type = (t.transaction_type || '').toLowerCase();
      if (['deposit', 'income'].includes(type)) acc.income += amount;
      else if (['expense', 'withdrawal', 'fee'].includes(type)) acc.expenses += amount;
      else if (type === 'transfer') acc.transfers += amount;
      return acc;
    }, { income: 0, expenses: 0, transfers: 0 });

    let score = 100;
    score += Math.min((totals.income / 100) * 5, 100);
    score -= Math.min((totals.expenses / 100) * 3, 80);
    score += Math.min((totals.transfers / 100) * 1, 20);
    score = Math.max(0, Math.min(300, score));

    let level = 'Starter', levelNumber = 1, description = 'Getting Started';
    if (score >= 250) { level = 'Diamond'; levelNumber = 5; description = 'Outstanding'; }
    else if (score >= 200) { level = 'Platinum'; levelNumber = 4; description = 'Excellent'; }
    else if (score >= 150) { level = 'Gold'; levelNumber = 3; description = 'Excellent'; }
    else if (score >= 100) { level = 'Silver'; levelNumber = 3; description = 'Good'; }
    else if (score >= 50) { level = 'Bronze'; levelNumber = 2; description = 'Fair'; }

    const progressPercentage = Math.min((score / 300) * 100, 100);
    return { score: Math.round(score), level, levelNumber, description, progressPercentage };
  }, [userTransactions]);

  /** --- Frontend-only: spending by category (top 6) --- */
  const topSixCategories = useMemo(() => {
    const spendByCat = new Map();

    (userTransactions || []).forEach((t) => {
      const type = (t.transaction_type || t.type || '').toString().toLowerCase();
      const isExpense = ['expense', 'withdrawal', 'fee'].includes(type);
      if (!isExpense) return;

      const rawCat = (t.category ?? t.category_name ?? 'Uncategorized').toString().trim();
      const key = (rawCat || 'Uncategorized').toLowerCase();

      const amt = Math.abs(parseAmountSafe(t.amount ?? t.transaction_amount));
      if (!amt) return;

      const prev = spendByCat.get(key) || { name: rawCat || 'Uncategorized', total: 0, count: 0 };
      prev.total += amt;
      prev.count += 1;
      spendByCat.set(key, prev);
    });

    const rows = Array.from(spendByCat.entries()).map(([key, v], idx) => ({
      name: v.name,
      total: v.total,
      transactionCount: v.count,
      icon: categoryIcons[key] || categoryIcons.default,
      color: getCategoryColor(key, idx),
    }));

    rows.sort((a, b) => b.total - a.total);

    return rows.slice(0, 6).map((row, idx) => ({
      ...row,
      color: STAT_PALETTE[idx % STAT_PALETTE.length],
    }));
  }, [userTransactions]);

  return (
    <div className="w-full mb-6">
      {/* Mobile Only: Clean Header */}
      <div className="lg:hidden">
        {/* Page Title at Top Left Corner */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-[#B4DFA4] dark:text-[#88BC46]">
            <FaUsers className="text-2xl" />
            <h1 className="text-2xl font-light dark:text-white">Accounts</h1>
          </div>
          <div className="mb-6">
          <p className="text-base text-gray-600 dark:text-gray-300">
            View and manage all your linked accounts and track recent transactions in one place.
          </p>
        </div>
        </div>
      </div>

      {/* Desktop Content (hidden on mobile) */}
      <div className="hidden lg:flex flex-wrap justify-between gap-6 items-start w-full">
        {/* Left Label */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4] dark:text-[#88BC46]">
            <FaUsers className="text-6xl" />
            <h1 className="text-5xl font-light dark:text-white">Accounts</h1>
          </div>
          <p className="text-lg text-gray-400 dark:text-gray-300 mt-1 max-w-xs mx-auto lg:mx-0">
            View and manage all your linked accounts and track recent transactions in one place.
          </p>
        </div>

        {/* Right Section (Performance Card + Stat Grid) */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Performance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Avatar + Info */}
            <div className="flex items-center gap-6">
              {performanceSummary?.avatar_image_path ? (
                <img
                  src={`/assets/Images/${performanceSummary.avatar_image_path}`}
                  className="w-16 h-16 rounded-full object-cover"
                  alt="Avatar"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              )}
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceMetrics.score}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{performanceMetrics.description}</p>
                <p className="text-sm text-[#F97156] dark:text-[#FF955A] font-medium">
                  Lv {performanceMetrics.levelNumber}: {performanceMetrics.level}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <p className="text-sm font-medium text-[#7FBCE9] dark:text-[#5FBFFF] mb-1">Accounts Performance</p>
              <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${performanceMetrics.progressPercentage}%`,
                    background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)',
                  }}
                />
                <div
                  className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                  style={{
                    left: `calc(${performanceMetrics.progressPercentage}% - 10px)`,
                    transform: 'translateY(-50%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stat Blocks: Top 6 categories with unified palette */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {topSixCategories.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden opacity-60">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700" />
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">R0.00</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">No data</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl bg-gray-200 dark:bg-gray-700" />
                </div>
              ))
            ) : (
              topSixCategories.map((category, i) => (
                <div key={i} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3">
                    {/* Icon circle with soft background */}
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: softBg(category.color) }}
                    >
                      <span className="text-xl" style={{ color: category.color }}>
                        {category.icon}
                      </span>
                    </div>

                    {/* Stat content */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        R{category.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {category.name}
                      </div>
                    </div>
                  </div>

                  {/* Bottom colored bar */}
                  <div
                    className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Error (if any) */}
          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPerformanceHeader;