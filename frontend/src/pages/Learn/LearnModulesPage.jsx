import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { FaSearch, FaFilter, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CoursesCard';

/* --------------------------- Reusable Dropdown --------------------------- */
/** Achievements-style portaled dropdown (keyboard + outside click safe) */
const CategoryDropdown = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select a topic...',
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

  // Position the portaled menu - MOBILE FIX: Better viewport handling
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;

    const calc = () => {
      const rect = btnRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;

      const itemH = 36;
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
        placeBelow = availBelow >= Math.min(maxH, 160) || availBelow >= availAbove;
      }

      const menuH = Math.min(wantedH, maxH);
      const top = placeBelow
        ? rect.bottom + offsetY
        : Math.max(gap, rect.top - offsetY - menuH);

      // Improved mobile positioning
      const isMobile = viewportW < 768;
      const left = isMobile 
        ? Math.max(gap, rect.left - (rect.width * 0.1)) // Slight adjustment for mobile
        : Math.min(rect.left, viewportW - rect.width - gap);

      const width = isMobile 
        ? Math.min(rect.width * 1.1, viewportW - (gap * 2)) // Slightly wider on mobile
        : rect.width;

      setMenuStyle({
        position: 'fixed',
        top,
        left,
        width,
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

  // Reset keyboard highlight on open/selection change
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
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
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
        className="w-full rounded-xl px-3 sm:px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none
                   bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white flex items-center justify-between
                   text-sm sm:text-base"
      >
        <span className={`truncate ${selected ? '' : 'text-gray-400 dark:text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <FaChevronDown className="ml-2 sm:ml-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
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
                     bg-white dark:bg-gray-800 shadow-lg overflow-y-auto
                     text-sm sm:text-base" // Responsive text size
        >
          <style>{`.dropdown-overscroll { overscroll-behavior: contain; }`}</style>
          <div className="dropdown-overscroll">
            {options.length === 0 && (
              <li className="px-4 h-10 md:h-8 flex items-center text-gray-500 dark:text-gray-300">No options</li>
            )}
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={String(opt.value) === String(value)}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commit(idx)}
                className={`px-3 h-8 flex items-center text-sm cursor-pointer truncate
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

const LearningPage = () => {
  const [modulesData, setModulesData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/learning');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setModulesData(data.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError(error.message);
      }
    };
    fetchModules();
  }, []);

  const filteredModules = modulesData.filter(module => {
    const matchesSearch = (module.module_title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'all' || module.topic === topicFilter;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  // Unique topics for the dropdown
  const uniqueTopics = Array.from(new Set(modulesData.map(m => m.topic).filter(Boolean)));
  const topicOptions = [{ value: 'all', label: 'All Topics' }]
    .concat(uniqueTopics.map(t => ({ value: t, label: t })));

  return (
    <LearnLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
              All Courses
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Find all and complete all your modules
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between mb-4 sm:mb-6">
            {/* Search Bar */}
            <div className="flex items-center w-full px-3 sm:px-4 py-2 border border-[#76B947] rounded-full bg-white dark:bg-gray-800 shadow-sm dark:border-[#AAD977]">
              <FaSearch className="text-[#76B947] dark:text-[#AAD977] mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search your modules..."
                className="w-full outline-none bg-transparent text-sm text-[#76B947] dark:text-[#AAD977] placeholder-[#76B947]/70 dark:placeholder-[#AAD977]/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-[#76B947] dark:border-[#AAD977] rounded-lg shadow-sm hover:bg-lime-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <FaFilter className="text-[#76B947] dark:text-[#AAD977] text-sm sm:text-base" />
              <span className="text-[#76B947] dark:text-[#AAD977] text-sm sm:text-base whitespace-nowrap">
                Filters
              </span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4 sm:mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Difficulty pills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficultyFilter(level)}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                          difficultyFilter === level
                            ? level === 'beginner'
                              ? 'bg-[#95cdf0] dark:bg-[#5FBFFF] text-white'
                              : level === 'intermediate'
                              ? 'bg-[#FFD18C] dark:bg-[#FFC541] text-white'
                              : level === 'advanced'
                              ? 'bg-[#FE9B90] dark:bg-[#F97156] text-white'
                              : 'bg-[#AAD977] dark:bg-[#76B947] text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {level === 'all'
                          ? 'All Levels'
                          : level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic/Category dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </label>
                  <CategoryDropdown
                    name="topic"
                    value={topicFilter}
                    onChange={(val) => setTopicFilter(val)}
                    options={topicOptions}
                    placeholder="Select topic..."
                    offsetY={24}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Courses Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {filteredModules.length} {filteredModules.length === 1 ? 'Course' : 'Courses'} Available
          </h2>
          {searchTerm && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Results for: <span className="font-semibold dark:text-gray-300">"{searchTerm}"</span>
            </p>
          )}
        </div>

        {/* Courses Grid */}
        {filteredModules.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              No courses found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setDifficultyFilter('all');
                setTopicFilter('all');
              }}
              className="px-4 py-2 bg-[#E5794B] dark:bg-[#d46b3f] text-white rounded-lg hover:bg-[#d46b3f] dark:hover:bg-[#c45f37] transition-colors text-sm sm:text-base"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredModules.map(module => (
              <CourseCard
                key={module.module_id}
                id={module.module_id}
                title={module.module_title}
                lessons={module.lesson_count}
                topic={module.topic}
                difficulty={module.difficulty}
                image={`/assets/Images/${module.banner_image_path}`} 
                moduleId={module.module_id}
              />
            ))}
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default LearningPage;