import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle, FaBookOpen, FaTrophy, FaFire, FaStar, FaMedal } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HelpMain = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('dailyTasks');
    return saved
      ? JSON.parse(saved)
      : [
        { task: 'Complete a tutorial', done: false, path: '/support/tutorials' },
        { task: 'Read through the FAQs', done: false, path: '/support/faqs' },
        { task: 'Check out the AI Companion Info Page', done: false, path: '/support/overview/ai' }
      ];
  });

  const toggleTask = (index) => {
    setTasks(prev => {
      const updated = prev.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      );
      localStorage.setItem('dailyTasks', JSON.stringify(updated));
      return updated;
    });
  };

  // Mock user data
  const userStats = {
    xp: 150,
    level: 3,
    nextLevelXp: 200,
    completedTutorials: 2,
    streakDays: 5,
    achievements: [
      { id: 1, name: 'First Steps', icon: <FaStar />, earned: true },
      { id: 2, name: 'Tutorial Master', icon: <FaBookOpen />, earned: false },
      { id: 3, name: 'Help Hero', icon: <FaMedal />, earned: false }
    ]
  };

  const handleButtonClick = (path) => {
    setShowXpAnimation(true);
    setTimeout(() => {
      navigate(path);
      setShowXpAnimation(false);
    }, 800);
  };

  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100;
  const completedCount = tasks.filter(t => t.done).length;

  const claimReward = () => {
    if (completedCount === 3) {
      console.log('Reward Claimed! +15 XP');
      setTasks(tasks.map(t => ({ ...t, done: false })));
    } else {
      console.log(`${3 - completedCount} more tasks to complete!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6 dark:bg-gray-900 min-h-screen">
      {/* Top Row - XP Overview Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md dark:shadow-gray-700/50 border-l-4 sm:border-l-8 border-t-2 border-r-2 border-b-2 border-[#FFD18C] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#fef9c3] dark:bg-yellow-900 rounded-full filter blur-3xl opacity-40 dark:opacity-20 -mr-6 sm:-mr-10 -mt-6 sm:-mt-10"></div>

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-sky-300 mb-1">Knowledge Quest</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Level {userStats.level} Scholar</p>

            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                <motion.div
                  className="bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53] h-2 sm:h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] sm:min-w-auto">{userStats.xp}/{userStats.nextLevelXp} XP</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="bg-[#fff7ed] dark:bg-gray-700 border border-[#fed7aa] dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-2 justify-center sm:justify-start">
                <FaFire className="text-[#fb923c] text-sm sm:text-base" />
                <span className="text-[#9a3412] dark:text-orange-300 text-xs sm:text-sm">{userStats.streakDays} day streak</span>
              </div>
              <div className="bg-[#fffbeb] dark:bg-gray-700 border border-[#fde68a] dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center gap-2 justify-center sm:justify-start">
                <FaTrophy className="text-[#fbbf24] text-sm sm:text-base" />
                <span className="text-[#92400e] dark:text-yellow-300 text-xs sm:text-sm">{userStats.completedTutorials} tutorials</span>
              </div>
            </div>
          </div>

          <div className="relative self-center sm:self-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 border-4 border-[#FFD18C] rounded-full shadow-lg flex flex-col items-center justify-center">
              <p className="text-lg sm:text-2xl font-bold text-[#FFBF1A]">{userStats.xp}</p>
              <p className="text-[10px] sm:text-xs text-[#6b7280]">XP</p>
            </div>
            {showXpAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-[#f59e0b] text-2xl sm:text-4xl font-bold">+5 XP</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Middle Row - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column - Navigation Tiles in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered('faq')}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick('/support/faqs')}
            className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border-l-4 border-[#B1E1FF] hover:border-[#518fc5] transition-all relative overflow-hidden group w-full h-full min-h-[100px] sm:min-h-[120px]"
          >
            <AnimatePresence>
              {isHovered === 'faq' && (
                <motion.div
                  className="absolute inset-0 bg-[#CBEEA5]/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#E8F5E9] flex items-center justify-center text-[#88BC46] group-hover:text-[#6B9E3D] transition-colors mb-2">
                <FaQuestionCircle className="text-xl sm:text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#6B9E3D] transition-colors line-clamp-2">
                  FAQ Library
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">Instant answers with XP rewards</p>
              </div>
            </div>
            <div className="absolute right-2 top-2 bg-[#F0F4C3] text-[#689F38] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#DCEDC8]">
              +5 XP
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered('tutorials')}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick('/support/tutorials')}
            className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border-l-4 border-[#f472b6] hover:border-[#ec4899] transition-all relative overflow-hidden group w-full h-full min-h-[100px] sm:min-h-[120px]"
          >
            <AnimatePresence>
              {isHovered === 'tutorials' && (
                <motion.div
                  className="absolute inset-0 bg-[#fce7f3]/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#fcf5e7] flex items-center justify-center text-[#FFD18C] group-hover:text-[#f5ca84] transition-colors mb-2">
                <FaBookOpen className="text-xl sm:text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#f5ca84] transition-colors line-clamp-2">
                  Tutorial Quests
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">Master features with guided tours</p>
              </div>
            </div>
            <div className="absolute right-2 top-2 bg-[#fef9c3] text-[#e89e59] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#fde047]">
              +15 XP
            </div>
          </motion.button>

          {/* Additional navigation options can be added here for a complete 2x2 grid */}
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleButtonClick('/support/overview/ai')}
            className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border-l-4 border-[#7FDD53] hover:border-[#5FBFFF] transition-all relative overflow-hidden group w-full h-full min-h-[100px] sm:min-h-[120px]"
          >
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#E8F4FF] flex items-center justify-center text-[#5FBFFF] group-hover:text-[#4a9cd6] transition-colors mb-2">
                <FaStar className="text-xl sm:text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#5FBFFF] transition-colors line-clamp-2">
                  AI Companion
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">Learn about AI features</p>
              </div>
            </div>
            <div className="absolute right-2 top-2 bg-[#E8F4FF] text-[#5FBFFF] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#B1E1FF]">
              +10 XP
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleButtonClick('/support/community')}
            className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border-l-4 border-[#FFD18C] hover:border-[#fb923c] transition-all relative overflow-hidden group w-full h-full min-h-[100px] sm:min-h-[120px]"
          >
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#fff7ed] flex items-center justify-center text-[#fb923c] group-hover:text-[#e07a2f] transition-colors mb-2">
                <FaMedal className="text-xl sm:text-2xl" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#fb923c] transition-colors line-clamp-2">
                  Community
                </p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">Join other learners</p>
              </div>
            </div>
            <div className="absolute right-2 top-2 bg-[#fff7ed] text-[#fb923c] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#fed7aa]">
              +8 XP
            </div>
          </motion.button>
        </div>

        {/* Right Column - Achievements Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md border-t-4 sm:border-t-8 border-[#88BC46] h-full"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 flex items-center gap-2">
            <FaTrophy className="text-[#88BC46]" /> Your Achievements
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex flex-col items-center border-2 ${achievement.earned ? 'border-[#FFD18C] bg-[#f9efcb]' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}`}
              >
                <div className={`text-lg sm:text-2xl mb-1 sm:mb-2 ${achievement.earned ? 'text-[#fbca80]' : 'text-gray-400 dark:text-gray-500'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-xs sm:text-sm font-medium text-center ${achievement.earned ? 'text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                  {achievement.name}
                </p>
                {achievement.earned ? (
                  <span className="text-[10px] sm:text-xs text-[#b45309] mt-1 font-medium">Unlocked!</span>
                ) : (
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">Locked</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row - Daily Challenge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md border-t-4 sm:border-t-8 border-[#fb923c] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-[#ffedd5] rounded-full filter blur-3xl opacity-40 -mr-6 sm:-mr-10 -mt-6 sm:-mt-10"></div>
        <div className="relative z-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Daily Challenge</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Complete today's tasks to earn bonus XP!</p>

          <ul className="space-y-2 sm:space-y-3">
            {tasks.map((item, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border text-sm ${item.done ? 'bg-[#ecfccb] border-[#a3e635] text-green-800' : 'bg-[#fef3c7] border-[#facc15] text-yellow-800'
                  } cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => {
                  toggleTask(i);
                  if (!tasks[i].done && tasks[i].path) navigate(tasks[i].path);
                }}
              >
                <span className="font-medium truncate pr-2">{item.task}</span>
                {item.done ? (
                  <span className="text-xs font-bold whitespace-nowrap">✓ Done</span>
                ) : (
                  <span className="text-xs font-medium opacity-70 whitespace-nowrap">Pending</span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mt-4 sm:mt-5">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
              <div
                className="bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53] h-2 sm:h-3 rounded-full"
                style={{ width: `${Math.min((completedCount / 3) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{completedCount}/3 completed</span>
          </div>

          <button
            className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 font-bold rounded-full shadow-md transition-all w-full text-sm sm:text-base ${completedCount === 3
              ? 'bg-gradient-to-r from-[#88BC46] to-[#CBEEA5] hover:to-[#A0D672] text-white'
              : 'bg-gradient-to-r from-[#ED5E52] to-[#FFCE51] hover:from-[#F0685E] hover:to-[#F68D2B] text-white'
              }`}
            onClick={claimReward}
          >
            {completedCount === 3 ? 'Claim Reward' : 'Start Challenge'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HelpMain;