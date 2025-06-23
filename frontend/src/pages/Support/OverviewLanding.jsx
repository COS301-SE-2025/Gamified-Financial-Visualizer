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
      label: 'Mission Control', 
      icon: <FaShieldAlt className="text-xl" />, 
      color: '#72C1F5',
      desc: 'Your command center for tracking XP and quests',
      xpReward: 5
    },
    { 
      id: 'transactions', 
      label: 'Account Vault', 
      icon: <FaCoins className="text-xl" />, 
      color: '#FFA726',
      desc: 'Manage your treasury and track gold flow',
      xpReward: 5
    },
    { 
      id: 'goals', 
      label: 'Goal Quests', 
      icon: <FaScroll className="text-xl" />, 
      color: '#88BC46',
      desc: 'Accept challenges and earn XP',
      xpReward: 10
    },
    { 
      id: 'community', 
      label: 'Community Adventures', 
      icon: <FaDragon className="text-xl" />, 
      color: '#9575CD',
      desc: 'Join forces with fellow adventurers',
      xpReward: 8
    },
    { 
      id: 'learn', 
      label: "Knowledge Path", 
      icon: <FaHatWizard className="text-xl" />, 
      color: '#FF7043',
      desc: 'Level up your financial magic',
      xpReward: 15
    },
    { 
      id: 'achievements', 
      label: 'Trophy Room', 
      icon: <FaCrown className="text-xl" />, 
      color: '#FF4080',
      desc: 'Display your hard-earned badges',
      xpReward: 5
    },
    { 
      id: 'profile', 
      label: 'Character Profile', 
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* XP Header Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-t-2 border-r-2 border-b-2 border-[#FFD18C] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#fef9c3] rounded-full filter blur-3xl opacity-40 -mr-10 -mt-10"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#FFBF1A] mb-1">Adventure Guide</h1>
            <p className="text-gray-600 mb-4">Explore different areas of your financial journey</p>
            
            <div className="flex gap-3">
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-3 py-2 flex items-center gap-2">
                <FaFire className="text-[#fb923c]" />
                <span className="text-[#9a3412] text-sm">{userStats.streakDays} day streak</span>
              </div>
              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2 flex items-center gap-2">
                <FaTrophy className="text-[#fbbf24]" />
                <span className="text-[#92400e] text-sm">7 areas to explore</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-24 h-24 bg-white border-4 border-[#FFD18C] rounded-full shadow-lg flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-[#FFBF1A]">{userStats.xp}</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
            {showXpAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-[#f59e0b] text-2xl font-bold">+{showXpAnimation} XP</div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ id, label, icon, color, desc, xpReward }) => (
          <motion.div
            key={id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(id)}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick(`/support/overview/${id}`, xpReward)}
            className="bg-white p-6 rounded-2xl shadow-sm border-l-8 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
            style={{ borderLeftColor: color }}
          >
            <AnimatePresence>
              {isHovered === id && (
                <motion.div
                  className="absolute inset-0 bg-white/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
            
            <div className="relative z-10 flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${color}20`,
                  color: color
                }}
              >
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
                <p className="text-sm text-gray-600 mt-1">{desc}</p>
                <motion.div 
                  className="flex items-center mt-3 text-xs font-medium"
                  style={{ color }}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>Learn more</span>
                  <FaArrowRight className="ml-1" />
                </motion.div>
              </div>
            </div>
            
            <div className="absolute right-4 top-4 bg-[#fef9c3] text-[#e46349] text-xs font-bold px-2 py-1 rounded-full border border-[#fde047]">
              +{xpReward} XP
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OverviewLanding;