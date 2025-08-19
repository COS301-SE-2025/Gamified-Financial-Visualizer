import React, { useEffect, useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AchievementsLayout from '../../pages/Achievements/AchievementsLayout';
import toast from 'react-hot-toast';
import { FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

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
import badge25 from '../../assets/Images/badges/team.png';
import badge26 from '../../assets/Images/badges/accepted.png';

// Mapping
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

const colorMap = {
  red: { border: 'border-[#ED5E52]', fill: 'bg-[#ED5E52]', text: 'text-[#ED5E52]', bg: 'bg-red-50 dark:bg-red-900/20' },
  blue: { border: 'border-[#5FBFFF]', fill: 'bg-[#5FBFFF]', text: 'text-[#5FBFFF]', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  green: { border: 'border-[#88BC46]', fill: 'bg-[#88BC46]', text: 'text-[#88BC46]', bg: 'bg-green-50 dark:bg-green-900/20' },
};

const allBadges = [badge1, badge2, badge3, badge4, badge5, badge6, badge7, badge8, badge9, badge10, badge11, badge12, badge13, badge14, badge15, badge16, badge17, badge18, badge19, badge20, badge21, badge22, badge23, badge24, badge25];

const getBadgeImage = (title) => {
  const m = lookupMeta(title);
  if (m?.badge) return m.badge;
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
  const m = lookupMeta(title);
  if (m?.color) return m.color;
  const lower = (title || '').toLowerCase();
  if (lower.match(/grow|plant|first|friend|master|stock|daily|learn|investment|save|wealth|spend|transaction/)) return 'green';
  if (lower.match(/bank|top|habits|score|secret|data|weekly|milestone|budget|quiz|target|goal/)) return 'blue';
  return 'red';
};

const parseJsonSafe = (v) => { if (!v) return {}; if (typeof v === 'object') return v; try { return JSON.parse(v); } catch { return {}; } };
const toNum = (v, d = 0) => Number.isFinite(+v) ? +v : d;
const computePercent = (a) => {
  const cond = parseJsonSafe(a?.trigger_condition_json);
  const totalFromTrigger = toNum(cond?.count ?? cond?.value, 0);
  const total = totalFromTrigger > 0 ? totalFromTrigger : (toNum(a?.child_task_count, 0) || 1);
  const completed = totalFromTrigger > 0 ? toNum(a?.progress_value, 0) : toNum(a?.completed_task_count, 0);
  return Math.min((completed / Math.max(1, total)) * 100, 100);
};

const AchievementCard = ({ achievement }) => {
  const navigate = useNavigate();

  const {
    achievement_id, achievement_title, points_awarded,
    progress_value, trigger_condition_json, achievement_description,
    completed_task_count, child_task_count
  } = achievement;

  const cond = parseJsonSafe(trigger_condition_json);
  const totalFromTrigger = toNum(cond.count ?? cond.value, 0);
  const total = totalFromTrigger > 0 ? totalFromTrigger : (toNum(child_task_count, 0) || 1);
  const completed = totalFromTrigger > 0 ? toNum(progress_value, 0) : toNum(completed_task_count, 0);
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
        <img src={image} alt={achievement_title} className="w-16 h-16 object-contain" />
      </div>

      <div className="text-center">
        <h3 className={`text-sm font-semibold ${text} dark:text-gray-200`}>{achievement_title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 dark:text-gray-300">
          {achievement_description || 'Complete tasks to earn this achievement'}
        </p>
      </div>

      <div className="w-full mt-1">
        <div className="flex justify-between text-xs font-medium mb-1 dark:text-gray-300">
          <span className={`${text}`}>{toNum(points_awarded, 0)} XP</span>
          {toNum(child_task_count, 0) > 0 && (
            <span className="text-gray-600 dark:text-gray-300">
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

const SortDropdown = ({ name, value, onChange, options, placeholder = 'Select...', offsetY = 12, placement = 'auto' }) => {
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = React.useState({});

  const selectedIndex = options.findIndex(o => String(o.value) === String(value));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Close on outside click (treat portaled menu as "inside")
  React.useEffect(() => {
    const onPointerDown = (e) => {
      const inButton = wrapRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (inButton || inMenu) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  // Position the portaled menu
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;

    const calc = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Approx height: each <li> is ~32px (h-8) + a bit of padding
      const itemH = 36;     // 32 + ~4 padding
      const chrome = 8;     // list padding/border
      const wantedH = chrome + (options?.length || 0) * itemH;

      const maxH = Math.min(320, Math.floor(viewportH * 0.4));
      const menuH = Math.min(wantedH, maxH);

      const gap = 8; // breathing room from edges
      const availBelow = viewportH - rect.bottom - gap;
      const availAbove = rect.top - gap;

      let placeBelow;
      if (placement === 'bottom') placeBelow = true;
      else if (placement === 'top') placeBelow = false;
      else {
        // 'auto': prefer below unless it clearly doesn't fit
        placeBelow = availBelow >= Math.min(menuH, 160) || availBelow >= availAbove;
      }

      const top = placeBelow
        ? rect.bottom + offsetY
        : Math.max(gap, rect.top - offsetY - menuH); // use actual menuH here

      const left = Math.min(rect.left, window.innerWidth - rect.width - gap);

      setMenuStyle({
        position: 'fixed',
        top,
        left,
        width: rect.width,
        maxHeight: maxH, // still cap scrolling
        zIndex: 9999,
      });
    };

    calc();
    const onScrollOrResize = () => calc();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open, offsetY, placement, options?.length]);


  // Reset keyboard highlight on open/selection change
  React.useEffect(() => {
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  const commit = (idx) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(highlight); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKey}
        className="w-full rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none
                   bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white flex items-center justify-between"
      >
        <span className={`${selected ? '' : 'text-gray-400 dark:text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <FaChevronDown className="ml-3 text-gray-400 dark:text-gray-500" />
      </button>

      {open && createPortal(
        <ul
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          style={menuStyle}
          onKeyDown={onKey}
          onWheel={(e) => e.stopPropagation()}
          className="rounded-xl border border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
        >
          <style>{`.dropdown-overscroll { overscroll-behavior: contain; }`}</style>
          <div className="dropdown-overscroll">
            {options.length === 0 && (
              <li className="px-3 h-8 flex items-center text-sm text-gray-500 dark:text-gray-300">No options</li>
            )}
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={String(opt.value) === String(value)}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commit(idx)}
                className={`px-3 h-8 flex items-center text-sm cursor-pointer
                            ${idx === highlight ? 'bg-gray-100 dark:bg-gray-700' : ''}
                            ${String(opt.value) === String(value) ? 'font-medium text-[#1b5e20]' : 'text-gray-800 dark:text-gray-100'}`}
              >
                {opt.label}
              </li>
            ))}
          </div>
        </ul>,
        document.body
      )}

      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  );
};

const IncompleteAchievement = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Learn-style controls
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [groupFilter, setGroupFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    let user = null;
    try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { }
    if (!user?.id) { setIsLoading(false); toast.error('No user found.'); return; }

    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:5000/api/achievements/list/${user.id}`);
        if (!res.ok) throw new Error('Fetch failed');
        const payload = await res.json();
        setRows(Array.isArray(payload?.data) ? payload.data : []);
      } catch (err) {
        console.error(err); toast.error('Could not load achievements');
      } finally { setIsLoading(false); }
    })();
  }, []);

  // Build incomplete list, then apply search/filter/sort
  const incomplete = useMemo(() => {
    const normalized = (rows || []).map(def => ({
      ...def,
      trigger_condition_json: parseJsonSafe(def.trigger_condition_json),
      points_awarded: toNum(def.points_awarded, 0),
      child_task_count: toNum(def.child_task_count, 0),
      completed_task_count: toNum(def.completed_task_count, 0),
      progress_value: toNum(def.progress_value, 0),
    }));
    return normalized.filter((a) => {
      const cond = parseJsonSafe(a.trigger_condition_json);
      const totalFromTrigger = toNum(cond.count ?? cond.value, 0);
      const total = totalFromTrigger > 0 ? totalFromTrigger : (toNum(a.child_task_count, 0) || 1);
      const done = totalFromTrigger > 0 ? toNum(a.progress_value, 0) : toNum(a.completed_task_count, 0);
      return total <= 0 ? true : done < total;
    });
  }, [rows]);

  const viewList = useMemo(() => {
    let arr = [...incomplete];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      arr = arr.filter(a => (a?.achievement_title || '').toLowerCase().includes(q));
    }
    if (groupFilter !== 'all') {
      arr = arr.filter(a => detectColorKey(a?.achievement_title) === groupFilter);
    }
    if (sortBy === 'az') arr.sort((a, b) => (a?.achievement_title || '').localeCompare(b?.achievement_title || ''));
    else if (sortBy === 'xpDesc') arr.sort((a, b) => toNum(b?.points_awarded, 0) - toNum(a?.points_awarded, 0));
    else if (sortBy === 'progDesc') arr.sort((a, b) => computePercent(b) - computePercent(a));
    return arr;
  }, [incomplete, searchTerm, groupFilter, sortBy]);


  return (
    <AchievementsLayout>
      <div className="space-y-6 px-6 pt-10 pb-6 -mt-8">
        <div className="bg-gradient-to-r from-[#B1E1FF20] to-[#7FDD5320] rounded-xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-200">Incomplete Achievements</h1>
            <p className="text-gray-600 dark:text-gray-300">You’re close! Keep pushing to finish these.</p>

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

        {/* Search & Filters (Learning style) */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white dark:bg-gray-800 shadow-sm dark:border-[#AAD977]">
              <FaSearch className="text-[#76B947] dark:text-[#AAD977] mr-2" />
              <input
                type="text"
                placeholder="Search achievements..."
                className="w-full outline-none bg-transparent text-sm text-[#76B947] dark:text-[#AAD977] placeholder-[#76B947]/70 dark:placeholder-[#AAD977]/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-[#76B947] dark:border-[#AAD977] rounded-lg shadow-sm hover:bg-lime-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaFilter className="text-[#76B947] dark:text-[#AAD977]" />
              <span className="text-[#76B947] dark:text-[#AAD977]">Filters</span>
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'blue', label: 'Learning' },
                      { key: 'green', label: 'Financial' },
                      { key: 'red', label: 'Community' },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setGroupFilter(key)}
                        className={`px-3 py-1 rounded-full text-sm ${groupFilter === key
                          ? key === 'blue'
                            ? 'bg-[#B1E1FF] dark:bg-[#5FBFFF] text-white'
                            : key === 'green'
                              ? 'bg-[#AAD977] dark:bg-[#76B947] text-white'
                              : key === 'red'
                                ? 'bg-[#FE9B90] dark:bg-[#F97156] text-white'
                                : 'bg-[#AAD977] dark:bg-[#76B947] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</label>
                  <SortDropdown
                    name="sortBy"
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    options={[
                      { value: 'default', label: 'Default' },
                      { value: 'az', label: 'A–Z' },
                      { value: 'xpDesc', label: 'XP: High → Low' },
                      { value: 'progDesc', label: 'Progress: High → Low' },
                    ]}
                    placeholder="Sort by"
                    offsetY={24}
                  />

                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Grid */}
        {viewList.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {viewList.map((ach) => (
              <AchievementCard key={ach.achievement_id ?? ach.achievement_title} achievement={ach} />
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Nice! Nothing incomplete matches your filters 🎉</p>
          </div>
        )}
      </div>
    </AchievementsLayout>
  );
};

export default IncompleteAchievementsPage;
