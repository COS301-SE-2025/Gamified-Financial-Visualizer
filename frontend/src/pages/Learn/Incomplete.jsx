import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CoursesCard';
import banner1 from '../../assets/Images/learn_banners/credit.png';
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelBalcony.gif';
import banner4 from '../../assets/Images/banners/pixelCafe.gif';
import banner5 from '../../assets/Images/banners/pixelCornerStore.gif';
import banner6 from '../../assets/Images/banners/pixelGirl.gif';
import { FaFilter, FaSearch, FaClock, FaChevronDown } from 'react-icons/fa';

const bannerImages = { 
  1: banner1,
  2: banner2,
  3: banner3,
  4: banner4,
  5: banner5,
  6: banner6
};

/* --------------------------- Reusable Dropdown --------------------------- */
const TopicDropdown = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select topic...',
  offsetY = 12,
  placement = 'auto',
}) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  const selectedIndex = options.findIndex(o => String(o.value) === String(value));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Close on outside click (treat portaled menu as "inside")
  useEffect(() => {
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

      const itemH = 36; // ~32px row + padding
      const chrome = 8;
      const wantedH = chrome + (options?.length || 0) * itemH;
      const maxH = Math.min(320, Math.floor(viewportH * 0.4));

      const gap = 8;
      const availBelow = viewportH - rect.bottom - gap;
      const availAbove = rect.top - gap;

      let placeBelow;
      if (placement === 'bottom') placeBelow = true;
      else if (placement === 'top') placeBelow = false;
      else {
        // 'auto'
        placeBelow = availBelow >= Math.min(maxH, 160) || availBelow >= availAbove;
      }

      const menuH = Math.min(wantedH, maxH);
      const top = placeBelow ? rect.bottom + offsetY : Math.max(gap, rect.top - offsetY - menuH);
      const left = Math.min(rect.left, window.innerWidth - rect.width - gap);

      setMenuStyle({
        position: 'fixed',
        top,
        left,
        width: rect.width,
        maxHeight: maxH,
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

  // Reset highlight when opening/selection changes
  useEffect(() => {
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
        className="w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white
                   flex items-center justify-between shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-[#5FBFFF] dark:focus:ring-[#93C5FD]"
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
          className="rounded-lg border border-gray-200 dark:border-gray-600
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
                            ${String(opt.value) === String(value)
                              ? 'font-medium text-[#1b5e20]'
                              : 'text-gray-800 dark:text-gray-100'}`}
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
/* ------------------------- End Reusable Dropdown ------------------------- */

const LearningIncompletePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [modulesData, setModulesData] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Extract unique topics safely
  const uniqueTopics = Array.from(new Set(modulesData.map(m => m?.topic).filter(Boolean)));
  const topicOptions = [{ value: 'all', label: 'All Topics' }]
    .concat(uniqueTopics.map(t => ({ value: t, label: t })));

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/learning/uncompleted/${user.id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setModulesData(data.data);
        setFilteredModules(data.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [user.id]);

  useEffect(() => {
    const filtered = modulesData.filter(module => {
      const matchesSearch = (module.module_title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
      const matchesTopic = topicFilter === 'all' || module.topic === topicFilter;
      return matchesSearch && matchesDifficulty && matchesTopic;
    });
    setFilteredModules(filtered);
  }, [searchTerm, difficultyFilter, topicFilter, modulesData]);

  if (error) {
    return (
      <LearnLayout>
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-[#FF8A8A] dark:border-[#F97156] p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#FF8A8A] dark:text-[#F97156]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[#FF8A8A] dark:text-[#F97156]">Error loading incomplete courses</h3>
                <div className="mt-2 text-sm text-[#FF8A8A] dark:text-[#F97156]">
                  <p>{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF8A8A] dark:bg-[#F97156] hover:bg-[#FF6B6B] dark:hover:bg-[#E5794B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A8A] dark:focus:ring-[#F97156]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </LearnLayout>
    );
  }

  return (
    <LearnLayout>
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Incomplete Courses</h1>
            <p className="text-gray-600 dark:text-gray-400">Continue learning where you left off</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#5FBFFF20] dark:bg-[#1E40AF30] text-[#5FBFFF] dark:text-[#93C5FD]">
              <FaClock className="mr-1" /> {filteredModules.length} In Progress
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search section */}
            <div className="flex items-center w-full px-4 py-2 border border-[#5FBFFF] dark:border-[#93C5FD] rounded-full bg-white dark:bg-gray-800 shadow-sm">
              <FaSearch className="text-[#5FBFFF] dark:text-[#93C5FD] mr-2" />
              <input
                type="text"
                placeholder="Search your incomplete courses..."
                className="w-full outline-none bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-[#5FBFFF] dark:border-[#93C5FD] rounded-lg shadow-sm hover:bg-[#5FBFFF10] dark:hover:bg-[#1E3A8A30] transition-colors"
            >
              <FaFilter className="text-[#5FBFFF] dark:text-[#93C5FD]" />
              <span className="text-[#5FBFFF] dark:text-[#93C5FD]">Filters</span>
            </button>
          </div>
  
          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty pills (unchanged) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDifficultyFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        difficultyFilter === 'all' 
                          ? 'bg-[#5FBFFF] dark:bg-[#1E40AF] text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      All Levels
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('beginner')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        difficultyFilter === 'beginner' 
                          ? 'bg-[#7FDD53] dark:bg-[#166534] text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('intermediate')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        difficultyFilter === 'intermediate' 
                          ? 'bg-[#FFC541] dark:bg-[#854D0E] text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Intermediate
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('advanced')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        difficultyFilter === 'advanced' 
                          ? 'bg-[#F68D2B] dark:bg-[#9A3412] text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>

                {/* Topic dropdown (new) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic</label>
                  <TopicDropdown
                    name="topic"
                    value={topicFilter}
                    onChange={(val) => setTopicFilter(val)}
                    options={topicOptions}
                    placeholder="All Topics"
                    offsetY={24}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Courses Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <CourseCard
                key={module.module_id}
                id={module.module_id}
                title={module.module_title}
                lessons={module.lesson_count}
                topic={module.topic}
                difficulty={module.difficulty}
                image={`/assets/Images/${module.banner_image_path}`}
                moduleId={module.module_id}
                completed={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-[#5FBFFF20] dark:bg-[#1E40AF30] rounded-full mb-4">
              <FaSearch className="text-[#5FBFFF] dark:text-[#93C5FD] text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm ? 
                `No incomplete courses match your search for "${searchTerm}". Try adjusting your filters.` : 
                "All your courses are completed! Great job!"}
            </p>
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default LearningIncompletePage;
