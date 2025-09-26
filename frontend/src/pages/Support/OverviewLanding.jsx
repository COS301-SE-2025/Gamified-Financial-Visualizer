import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowRight, FaUser, FaDragon,
  FaScroll, FaCoins, FaShieldAlt, FaHatWizard,
  FaCrown, FaTrophy, FaGlasses, FaRobot
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import headerImage from '../../assets/Images/badges/idea.png'; // Update with your actual image path

const OverviewLanding = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(null);

  const sections = [
    // dashboard
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: <FaShieldAlt className="text-xl" />, 
      color: '#72C1F5',
      desc: 'Your personal financial city with a financial account overview.',
    },
    
    // transactions 
    { 
      id: 'transactions', 
      label: 'Accounts', 
      icon: <FaCoins className="text-xl" />, 
      color: '#FFA726',
      desc: 'Manage accounts, transactions and track income/expense flows.',
    },

    // goals
    { 
      id: 'goals', 
      label: 'Goals', 
      icon: <FaScroll className="text-xl" />, 
      color: '#88BC46',
      desc: 'Create intuitive goals and manage your finances.',
    },

    // community 
    { 
      id: 'community', 
      label: 'Community', 
      icon: <FaDragon className="text-xl" />, 
      color: '#9575CD',
      desc: 'Join various communities, join challenges and make friends.',
    },

    // learn
    { 
      id: 'learn', 
      label: "Learn", 
      icon: <FaHatWizard className="text-xl" />, 
      color: '#FF7043',
      desc: 'Master financial basics and advance in financial literacy.',
    },

    // achievements
    { 
      id: 'achievements', 
      label: 'Achievements', 
      icon: <FaCrown className="text-xl" />, 
      color: '#FF4080',
      desc: 'Showcase your financial achievements and hard-earned badges.',
    },

    // profile 
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: <FaUser className="text-xl" />, 
      color: '#26C6DA',
      desc: 'Customize your avatar, banners and journey',
    },

    // ar
    {
      id: 'ar',
      label: 'AR World',
      icon: <FaGlasses className="text-xl" />,
      color: '#FFCB05',
      desc: 'Visualize financial data in augmented reality',
    },

    // ai
    {
      id: 'ai',
      label: 'AI Companion',
      icon: <FaRobot className="text-xl" />,
      color: '#BA59FF',
      desc: 'Your smart financial guide and assistant.',
    }
  ];

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Card */}
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
                <span className="text-[#92400e] dark:text-yellow-300 text-sm">{sections.length} areas to explore</span>
              </div>
            </div>
          </div>

          {/* Replaced XP circle with your image */}
          <div className="relative">
            <img 
              src={headerImage} 
              alt="Adventure Guide" 
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FFD18C] shadow-lg dark:shadow-gray-700/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ id, label, icon, color, desc }) => (
          <motion.div
            key={id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(id)}
            onHoverEnd={() => setIsHovered(null)}
            onClick={() => handleButtonClick(`/support/overview/${id}`)}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-700/50 border-l-8 hover:shadow-md dark:hover:shadow-gray-600/50 transition-all relative overflow-hidden group cursor-pointer"
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