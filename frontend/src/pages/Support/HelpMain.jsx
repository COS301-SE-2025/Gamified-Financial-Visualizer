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

  // Calculate completed count
  const completedCount = tasks.filter(t => t.done).length;

  // Claim reward function
  const claimReward = () => {
    if (completedCount === 3) {
      alert('Reward Claimed! +15 XP');
      // Reset all tasks
      setTasks(tasks.map(t => ({ ...t, done: false })));

    } else {
      alert(`${3 - completedCount} more tasks to complete!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Row - XP Overview Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#ffffff] p-6 rounded-3xl shadow-md border-l-8 border-t-2 border-r-2 border-b-2 border-[#FFD18C] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fef9c3] rounded-full filter blur-3xl opacity-40 -mr-10 -mt-10"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#FFBF1A] mb-1">Knowledge Quest</h1>
            <p className="text-[#4b5563] mb-4">Level {userStats.level} Scholar</p>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-full bg-[#f3f4f6] rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-[#facc15] to-[#fb923c] h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="text-sm font-medium text-[#374151]">{userStats.xp}/{userStats.nextLevelXp} XP</span>
            </div>

            <div className="flex gap-3">
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-3 py-2 flex items-center gap-2">
                <FaFire className="text-[#fb923c]" />
                <span className="text-[#9a3412] text-sm">{userStats.streakDays} day streak</span>
              </div>
              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2 flex items-center gap-2">
                <FaTrophy className="text-[#fbbf24]" />
                <span className="text-[#92400e] text-sm">{userStats.completedTutorials} tutorials</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-24 h-24 bg-[#ffffff] border-4 border-[#FFD18C] rounded-full shadow-lg flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-[#FFBF1A]">{userStats.xp}</p>
              <p className="text-xs text-[#6b7280]">XP</p>
            </div>
            {showXpAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-[#f59e0b] text-4xl font-bold">+5 XP</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Middle Row - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Navigation Tiles */}
        <div className="space-y-5">
          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered('faq')}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick('/support/faqs')}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border-l-8 border-[#B1E1FF] hover:border-[#518fc5] transition-all relative overflow-hidden group w-full"
          >
            <AnimatePresence>
              {isHovered === 'faq' && (
                <motion.div
                  className="absolute inset-0 bg-[#bfdbfe]/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dbeafe] flex items-center justify-center text-[#72C1F5] group-hover:text-[#518fc5] transition-colors">
                <FaQuestionCircle className="text-2xl" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-[#1f2937] group-hover:text-[#518fc5] transition-colors">FAQ Library</p>
                <p className="text-sm text-[#4b5563]">Instant answers with XP rewards</p>
              </div>
            </div>
            <div className="absolute right-4 top-4 bg-[#fef9c3] text-[#e46349] text-xs font-bold px-2 py-1 rounded-full border border-[#fde047]">
              +5 XP each
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered('tutorials')}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick('/support/tutorials')}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border-l-8 border-[#f472b6] hover:border-[#ec4899] transition-all relative overflow-hidden group w-full"
          >
            <AnimatePresence>
              {isHovered === 'tutorials' && (
                <motion.div
                  className="absolute inset-0 bg-[#fce7f3]/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#fce7f3] flex items-center justify-center text-[#ec4899] group-hover:text-[#f584b7] transition-colors">
                <FaBookOpen className="text-2xl" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-[#1f2937] group-hover:text-[#ef76ad] transition-colors">Tutorial Quests</p>
                <p className="text-sm text-[#4b5563]">Master features with guided tours</p>
              </div>
            </div>
            <div className="absolute right-4 top-4 bg-[#fef9c3] text-[#e46349] text-xs font-bold px-2 py-1 rounded-full border border-[#fde047]">
              +15 XP each
            </div>
          </motion.button>
        </div>

        {/* Right Column - Achievements Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#ffffff] p-6 rounded-3xl shadow-md border-t-8 border-[#88BC46] h-full"
        >
          <h2 className="text-xl font-bold text-[#1f2937] mb-4 flex items-center gap-2">
            <FaTrophy className="text-[#88BC46]" /> Your Achievements
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl flex flex-col items-center border-2 ${achievement.earned ? 'border-[#FFD18C] bg-[#f9efcb]' : 'border-[#e5e7eb] bg-[#f9fafb]'}`}
              >
                <div className={`text-2xl mb-2 ${achievement.earned ? 'text-[#fbca80]' : 'text-[#9ca3af]'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-sm font-medium text-center ${achievement.earned ? 'text-[#1f2937]' : 'text-[#6b7280]'}`}>
                  {achievement.name}
                </p>
                {achievement.earned ? (
                  <span className="text-xs text-[#b45309] mt-1 font-medium">Unlocked!</span>
                ) : (
                  <span className="text-xs text-[#9ca3af] mt-1">Locked</span>
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
        className="bg-white p-6 rounded-3xl shadow-md border-t-8 border-[#fb923c] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffedd5] rounded-full filter blur-3xl opacity-40 -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-[#1f2937] mb-2">Daily Challenge</h2>
          <p className="text-[#4b5563] mb-4">Complete today's tasks to earn bonus XP!</p>

          <ul className="space-y-3">
            {tasks.map((item, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-4 py-2 rounded-xl border ${item.done ? 'bg-[#ecfccb] border-[#a3e635] text-green-800' : 'bg-[#fef3c7] border-[#facc15] text-yellow-800'
                  } cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => {
                  toggleTask(i);
                  if (!tasks[i].done && tasks[i].path) navigate(tasks[i].path);
                }}

              >
                <span className="text-sm font-medium">{item.task}</span>
                {item.done ? (
                  <span className="text-xs font-bold">✓ Done</span>
                ) : (
                  <span className="text-xs font-medium opacity-70">Pending</span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mt-5">
            <div className="flex-1 bg-[#f3f4f6] rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#f8994c] to-[#FFD18C] h-3 rounded-full"
                style={{ width: `${Math.min((completedCount / 3) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-[#374151]">{completedCount}/3 completed</span>
          </div>

          <button
            className={`mt-4 px-6 py-2 ${completedCount === 3
              ? 'bg-gradient-to-r from-[#22c55e] to-[#86efac] hover:to-[#4ade80]'
              : 'bg-gradient-to-r from-[#fb923c] to-[#FFD18C] hover:from-[#f9925b] hover:to-[#f59e0b]'
              } text-white font-bold rounded-full shadow-md transition-all w-full`}
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