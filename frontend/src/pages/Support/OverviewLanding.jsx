// src/pages/Support/OverviewLanding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFire, FaArrowRight, FaUser, FaDragon,
  FaScroll, FaCoins, FaShieldAlt, FaHatWizard,
  FaCrown, FaTrophy, FaGlasses, FaRobot
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const OverviewLanding = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);
  const [showXpAnimation, setShowXpAnimation] = useState(false);

  // Mock user data
  const userStats = {
    xp: 150,
    level: 3,
    streakDays: 5,
  };

  const sections = [
    { 
      id: 'dashboard', 
      label: 'Home Dashboard', 
      icon: <FaShieldAlt className="text-xl" />, 
      color: '#72C1F5',
      desc: 'Your command center for tracking XP and quests',
      xpReward: 5
    },
    { 
      id: 'transactions', 
      label: 'Accounts', 
      icon: <FaCoins className="text-xl" />, 
      color: '#FFA726',
      desc: 'Manage your treasury and track gold flow',
      xpReward: 5
    },
    { 
      id: 'goals', 
      label: 'Goals', 
      icon: <FaScroll className="text-xl" />, 
      color: '#88BC46',
      desc: 'Accept challenges and earn XP',
      xpReward: 10
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: <FaDragon className="text-xl" />, 
      color: '#9575CD',
      desc: 'Join forces with fellow adventurers',
      xpReward: 8
    },
    { 
      id: 'learn', 
      label: "Learn", 
      icon: <FaHatWizard className="text-xl" />, 
      color: '#FF7043',
      desc: 'Level up your financial magic',
      xpReward: 15
    },
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: <FaCrown className="text-xl" />, 
      color: '#FF4080',
      desc: 'Display your hard-earned badges',
      xpReward: 5
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <FaUser className="text-xl" />, 
      color: '#26C6DA',
      desc: 'Customize your avatar and journey',
      xpReward: 3
    },
    {
      id: 'ar',
      label: 'AR World',
      icon: <FaGlasses className="text-xl" />,
      color: '#FFCB05',
      desc: 'View financial data in augmented reality',
      xpReward: 12
    },
    {
      id: 'ai',
      label: 'AI Companion',
      icon: <FaRobot className="text-xl" />,
      color: '#BA59FF',
      desc: 'Chat with your smart financial assistant',
      xpReward: 10
    }
  ];

  const handleButtonClick = (path, xpReward) => {
    setShowXpAnimation(xpReward);
    setTimeout(() => {
      navigate(path);
      setShowXpAnimation(false);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto dark:bg-gray-900 min-h-screen">
      {/* XP Header Card - Matches profile page styling */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#88BC46] dark:text-[#AAD977] mb-2">Adventure Guide</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Explore different areas of your financial journey</p>
            
            <div className="flex gap-2">
              <div className="bg-[#fffbeb] dark:bg-gray-700 border border-[#fde68a] dark:border-gray-600 rounded-lg px-3 py-2 flex items-center gap-2">
                <FaTrophy className="text-[#fbbf24]" />
                <span className="text-[#92400e] dark:text-yellow-300 text-xs sm:text-sm">{sections.length} areas to explore</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-700 border-4 border-[#FFD18C] rounded-full shadow flex flex-col items-center justify-center">
              <p className="text-lg sm:text-xl font-bold text-[#FFBF1A]">{userStats.xp}</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">XP</p>
            </div>
            {showXpAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-[#f59e0b] text-lg font-bold">+{showXpAnimation} XP</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation Grid - Matches profile page card styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map(({ id, label, icon, color, desc, xpReward }) => (
          <motion.div
            key={id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(id)}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick(`/support/overview/${id}`, xpReward)}
            className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 sm:p-6 hover:shadow-md dark:hover:shadow-gray-600/50 transition-all relative overflow-hidden group cursor-pointer border-l-4"
            style={{ borderLeftColor: color }}
          >
            <AnimatePresence>
              {isHovered === id && (
                <motion.div
                  className="absolute inset-0 bg-gray-50/30 dark:bg-gray-700/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: `${color}20`,
                    color: color
                  }}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">{label}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{desc}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center text-xs font-medium"
                  style={{ color }}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>Learn more</span>
                  <FaArrowRight className="ml-1" size={12} />
                </motion.div>
                
                <div className="bg-[#fef9c3] dark:bg-yellow-900/50 text-[#e46349] dark:text-yellow-300 text-xs font-bold px-2 py-1 rounded-full border border-[#fde047] dark:border-yellow-700">
                  +{xpReward} XP
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OverviewLanding;