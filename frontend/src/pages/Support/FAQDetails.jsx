import React, { useState } from 'react';
import { FaPlus, FaMinus, FaCheckCircle, FaMedal, FaStar, FaFire, FaTrophy } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = {
  'Goal Quests': [
    'Set short-term goals',
    'Track goal progress',
    'Delete a goal',
    'Auto-contribute settings'
  ],
  'Community Adventures': [
    'Join a community',
    'Leave a group',
    'View members'
  ],
  'Treasure Management': [
    'Add or edit a transaction',
    'Connect and manage accounts',
    'Track spending by category',
    'Set transaction limits'
  ],
  'Achievement Badges': [
    'Unlock badges',
    'Track progress toward achievements',
    'Share your accomplishments'
  ],
  'Knowledge Path': [
    'Complete tutorials',
    'Earn XP through learning',
    'Retake previous lessons',
    'Track course progress'
  ],
  'Character Customization': [
    'Change your avatar',
    'Update personal details',
    'Switch light/dark mode',
    'Manage your password and login'
  ],
  'AR Explorer': [
    'What is the AR financial dashboard?',
    'How to visualize spending in 3D',
    'Use gestures to interact with data',
    'Switch between AR and classic mode'
  ]
};

const XpPopup = ({ amount }) => (
  <motion.div
    className="absolute top-0 right-0 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full shadow-md"
    initial={{ y: -20, opacity: 0, scale: 0.5 }}
    animate={{ y: -40, opacity: 1, scale: 1 }}
    exit={{ y: -60, opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    +{amount} XP
  </motion.div>
);

const FAQDetails = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [unlocked, setUnlocked] = useState({});
  const [xpEarned, setXpEarned] = useState({});
  const [showXpToast, setShowXpToast] = useState(null);
  const [masteredCategories, setMasteredCategories] = useState([]);

  const toggle = (index, category) => {
    setOpenIndex(openIndex === index ? null : index);
    
    if (!unlocked[index]) {
      // Unlock this FAQ
      setUnlocked(prev => ({ ...prev, [index]: true }));
      
      // Award XP for this category
      const xpAmount = 10 + Math.floor(Math.random() * 5); // Random 10-15 XP
      setXpEarned(prev => ({ ...prev, [category]: (prev[category] || 0) + xpAmount }));
      setShowXpToast(index);
      
      setTimeout(() => setShowXpToast(null), 1500);
      
      // Check if category is mastered
      const categoryItems = faqData[category];
      const unlockedCount = categoryItems.filter((_, i) => unlocked[`${category}-${i}`]).length + 1;
      
      if (unlockedCount === categoryItems.length && !masteredCategories.includes(category)) {
        setMasteredCategories(prev => [...prev, category]);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#88BC46] mb-2">Knowledge Vault</h1>
        <p className="text-lg text-[#858584]">Unlock answers and earn rewards!</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-[#88BC46] to-[#98C988] rounded-xl p-4 shadow-lg text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaFire className="text-orange-300 text-xl" />
            <div>
              <p className="text-xs text-white">Current Streak</p>
              <p className="font-bold">5 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaStar className="text-yellow-300 text-xl" />
            <div>
              <p className="text-xs text-white">Total XP Earned</p>
              <p className="font-bold">245 XP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-400 text-xl" />
            <div>
              <p className="text-xs text-white">Categories Mastered</p>
              <p className="font-bold">{masteredCategories.length}/{Object.keys(faqData).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      {Object.entries(faqData).map(([category, items]) => {
        const total = items.length;
        const unlockedCount = items.filter((_, i) => unlocked[`${category}-${i}`]).length;
        const complete = masteredCategories.includes(category);
        const progress = (unlockedCount / total) * 100;

        return (
          <motion.div 
            key={category}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-lime-100 overflow-hidden"
          >
            {/* Category Header */}
            <div className={`p-4 ${complete ? 'bg-gradient-to-r from-yellow-100 to-yellow-50' : 'bg-gradient-to-r from-lime-50 to-lime-50'}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-lime-700 flex items-center gap-2">
                  {complete && <FaMedal className="text-yellow-500" />}
                  {category}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${complete ? 'bg-yellow-100 text-yellow-800' : 'bg-lime-200 text-lime-800'}`}>
                    {unlockedCount}/{total} unlocked
                  </span>
                  {complete && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <FaCheckCircle /> Mastered
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <motion.div
                  className={`h-full ${complete ? 'bg-gradient-to-r from-yellow-300 to-orange-300' : 'bg-gradient-to-r from-blue-400 to-cyan-200'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* FAQ Items */}
            <div className="divide-y divide-indigo-50/50">
              {items.map((text, i) => {
                const index = `${category}-${i}`;
                const isOpen = openIndex === index;
                const isUnlocked = unlocked[index];

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => toggle(index, category)}
                    className={`p-4 cursor-pointer transition-all ${isUnlocked ? 'bg-green-50/50' : 'hover:bg-indigo-50/30'}`}
                  >
                    <div className="relative">
                      {/* XP Popup */}
                      <AnimatePresence>
                        {showXpToast === index && <XpPopup amount={xpEarned[category] - (xpEarned[category] - 10)} />}
                      </AnimatePresence>

                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${isUnlocked ? 'text-lime-700' : 'text-gray-800'}`}>
                          {isUnlocked && <FaCheckCircle className="inline mr-2 text-lime-500" />}
                          {text}
                        </h3>
                        <div className={`text-lg ${isUnlocked ? 'text-[#6BA226]' : 'text-red-500'}`}>
                          {isOpen ? <FaMinus /> : <FaPlus />}
                        </div>
                      </div>

                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-indigo-100/50">
                            <p className="text-sm text-gray-600">
                              This is where you'd explain <strong>{text}</strong>. Unlocking this earned you{' '}
                              <span className="text-[#6BA226] font-bold">+{xpEarned[category] - (xpEarned[category] - 10)} XP</span> and helps you progress toward mastering this category.
                            </p>
                            {!isUnlocked && (
                              <p className="text-xs text-[#FFBF1A] mt-2">
                                <FaStar className="inline mr-1" /> Unlock to earn XP!
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Mastered Categories Celebration */}
      {masteredCategories.length > 0 && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <FaTrophy className="text-yellow-500 text-2xl" />
            <div>
              <h3 className="font-bold text-yellow-800">Mastered Categories</h3>
              <p className="text-sm text-yellow-700">
                You've completed: {masteredCategories.join(', ')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FAQDetails;