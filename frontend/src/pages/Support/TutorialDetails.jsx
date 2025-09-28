import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  FaArrowRight, FaArrowLeft, FaPlay, FaCheckCircle, FaVideo,FaMagic, FaRobot,
  FaImages, FaTrophy, FaStar, FaMedal, FaBullseye, FaWallet, FaChartPie,
  FaMoneyBillWave, FaGraduationCap, FaBookOpen, FaUsers, FaUser
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const tutorials = [
  {
    id: 'goals',
    title: 'How to Set a Goal',
    color: '#88BC46',
    lightColor: '#e2f0d5',
    description: 'Learn how to create and track your financial goals step-by-step.',
    steps: [
      { image: require('../../assets/Tutorials/goals/goal1.png'), caption: 'Go to the Goals page.' },
      { image: require('../../assets/Tutorials/goals/goal2.png'), caption: 'Click "Create Goal".' },
      { image: require('../../assets/Tutorials/goals/goal3.png'), caption: 'Fill out your goal information.' },
      { image: require('../../assets/Tutorials/goals/goal4.png'), caption: 'Click confirm.' },
      { image: require('../../assets/Tutorials/goals/goal5.png'), caption: 'Goal details appear as first goal.' }
    ],
    video: require('../../assets/Videos/goals/goals.mp4'),
    xp: 20,
    badge: <FaBullseye className="text-[#66BB6A]" />,
    name: 'Goal Setter'
  },
  {
    id: 'transactions',
    title: 'Master Transactions',
    color: '#72C1F5',
    lightColor: '#d8edfd',
    description: 'Track, categorize, and visualize your expenses efficiently.',
    steps: [
      { image: '/images/tutorials/trans1.png', caption: 'Access Transactions from sidebar.' },
      { image: '/images/tutorials/trans2.png', caption: 'Add or categorize transactions.' },
      { image: '/images/tutorials/trans3.png', caption: 'Use Insights & Budget tabs.' }
    ],
    video: '/videos/transactions.mp4',
    xp: 25,
    badge: <FaWallet className="text-[#72C1F5]" />
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    color: '#FF4C28',
    lightColor: '#ffd8d0',
    description: 'Understand XP, goals, recent activity, and stats in your control center.',
    steps: [
      { image: '/images/tutorials/dashboard1.png', caption: 'Track XP progress.' },
      { image: '/images/tutorials/dashboard2.png', caption: 'Monitor your widgets.' }
    ],
    video: '/videos/dashboard.mp4',
    xp: 10,
    badge: <FaChartPie className="text-[#FF4C28]" />
  },
  {
    id: 'community',
    title: 'Join the Community',
    color: '#9575CD',
    lightColor: '#D8C2FD',
    description: 'Engage with your guild, join quests, and rise up the leaderboard.',
    steps: [
      { image: '/images/tutorials/community1.png', caption: 'View or join communities.' },
      { image: '/images/tutorials/community2.png', caption: 'Participate in group quests.' }
    ],
    video: '/videos/community.mp4',
    xp: 15,
    badge: <FaUsers className="text-[#9575CD]" />
  },
  {
    id: 'learn',
    title: 'Start Learning',
    color: '#FFBF1A',
    lightColor: '#FFECCF',
    description: 'Complete bite-sized lessons and quizzes to build financial mastery.',
    steps: [
      { image: '/images/tutorials/learn1.png', caption: 'Access Learning Modules.' },
      { image: '/images/tutorials/learn2.png', caption: 'Complete quizzes to earn XP.' }
    ],
    video: '/videos/learn.mp4',
    xp: 30,
    badge: <FaGraduationCap className="text-[#FFD18C]" />
  },
  {
    id: 'achievements',
    title: 'Explore Achievements',
    color: '#FF4080',
    lightColor: '#ffd6e5',
    description: 'Unlock badges, complete milestones, and show off your progress.',
    steps: [
      { image: '/images/tutorials/achieve1.png', caption: 'View your badge collection.' },
      { image: '/images/tutorials/achieve2.png', caption: 'Hover badges for unlock tips.' }
    ],
    video: '/videos/achievements.mp4',
    xp: 12,
    badge: <FaTrophy className="text-[#EF5350]" />
  },
  {
    id: 'profile',
    title: 'Customize Your Profile',
    color: '#26C6DA',
    lightColor: '#A6F5FF',
    description: 'Personalize your avatar and view your journey timeline.',
    steps: [
      { image: '/images/tutorials/profile1.png', caption: 'Visit your profile.' },
      { image: '/images/tutorials/profile2.png', caption: 'Edit info and change avatar.' }
    ],
    video: '/videos/profile.mp4',
    xp: 15,
    badge: <FaUser className="text-[#26C6DA]" />
  },
  {
    id: 'ar',
    title: 'Explore AR Mode',
    color: '#AB47BC',
    lightColor: '#EBD7F4',
    description: 'Activate AR to view a futuristic financial dashboard and interact with your data.',
    steps: [
      { image: '/images/tutorials/ar1.png', caption: 'Open AR from Dashboard or Profile.' },
      { image: '/images/tutorials/ar2.png', caption: 'Point camera at flat surface to place dashboard.' },
      { image: '/images/tutorials/ar3.png', caption: 'Interact with data using gestures.' }
    ],
    video: '/videos/ar.mp4',
    xp: 25,
    badge: <FaMagic className="text-[#AB47BC]" />,
    name: 'AR Adventurer'
  },
  {
    id: 'ai',
    title: 'Use AI Advisor',
    color: '#5C6BC0',
    lightColor: '#E0E4F5',
    description: 'Learn how to interact with your personal finance assistant using smart prompts.',
    steps: [
      { image: '/images/tutorials/ai1.png', caption: 'Open the AI tab in Transactions or Learn.' },
      { image: '/images/tutorials/ai2.png', caption: 'Ask a question like "How can I save more?"' },
      { image: '/images/tutorials/ai3.png', caption: 'Apply suggestions and track results.' }
    ],
    video: '/videos/ai.mp4',
    xp: 20,
    badge: <FaRobot className="text-[#5C6BC0]" />,
    name: 'AI Navigator'
  }
];


const ConfettiAndCoins = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {[...Array(40)].map((_, i) => {
        const size = Math.random() * 10 + 6;
        const left = Math.random() * 100;
        const rotation = Math.random() * 360;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: '#FFD700',
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: '-20px',
            }}
            initial={{ opacity: 1, y: -20 }}
            animate={{
              y: '100vh',
              rotate: rotation,
              opacity: 0,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
};

const TutorialCard = ({ tutorial, onClick }) => (
  <motion.div
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border-l-4 sm:border-l-8 transition-all relative overflow-hidden group cursor-pointer h-full"
    style={{ borderLeftColor: tutorial.color }}
  >
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white group-hover:text-gray-800 dark:group-hover:text-white transition-colors mb-2" style={{ color: tutorial.color }}>
          {tutorial.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2">{tutorial.description}</p>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: tutorial.lightColor, color: tutorial.color }}>
            {tutorial.steps.length} steps
          </span>
          <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1" style={{ backgroundColor: `${tutorial.color}20`, color: tutorial.color }}>
            <FaVideo size={10} /> Video
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs">+{tutorial.xp} XP</span>
          <span className="px-2 py-1 rounded-full text-xs flex items-center" style={{ backgroundColor: `${tutorial.color}20`, color: tutorial.color }}>
            {tutorial.badge}
          </span>
        </div>
        <button className="text-xs sm:text-sm flex items-center gap-1" style={{ color: tutorial.color }}>
          <FaPlay size={10} /> Start
        </button>
      </div>
    </div>
  </motion.div>
);

const TutorialDetails = () => {
  const [selected, setSelected] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [viewMode, setViewMode] = useState('steps');
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const location = useLocation();

  const handleSelect = (tut) => {
    setSelected(tut);
    setStepIndex(0);
    setCompleted(false);
    setViewMode('steps');
  };

  useEffect(() => {
    if (location.state?.focus) {
      const index = tutorials.findIndex(t => t.id === location.state.focus);
      if (index !== -1) {
        handleSelect(tutorials[index]);
      }
    }
  }, [location.state]);

  const next = () => {
    if (stepIndex < selected.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setShowXpAnimation(true);
      setCompleted(true);
      setTimeout(() => setShowXpAnimation(false), 1000);
    }
  };

  const prev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  if (!selected) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8 dark:bg-gray-900 min-h-screen">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md border-t-4 border-orange-500"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
            <FaTrophy className="text-yellow-400" /> Quest Academy
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Complete quests to master our platform and earn rewards!
          </p>
        </motion.div>

        {/* Tutorial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {tutorials.map((tut) => (
            <TutorialCard
              key={tut.id}
              tutorial={tut}
              onClick={() => handleSelect(tut)}
            />
          ))}
        </div>
      </div>
    );
  }

  const step = selected.steps[stepIndex];
  const progress = ((stepIndex + 1) / selected.steps.length) * 100;
  const isLastStep = stepIndex === selected.steps.length - 1;

  return (
    <div className="min-h-screen dark:bg-gray-900 py-4 sm:py-8 px-3 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-md border-t-4 overflow-hidden" style={{ borderTopColor: selected.color }}>
          {/* Tutorial Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1 text-xs sm:text-sm mb-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  style={{ color: selected.color }}
                >
                  <FaArrowLeft size={12} /> Back to Quests
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">{selected.title}</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">{selected.description}</p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap" style={{ backgroundColor: `${selected.color}20`, color: selected.color }}>
                Step {stepIndex + 1} of {selected.steps.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4 sm:mb-6">
              <motion.div
                className="h-full"
                style={{ background: selected.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setViewMode('steps')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  viewMode === 'steps' 
                    ? 'text-white shadow-md' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
                style={{ backgroundColor: viewMode === 'steps' ? selected.color : '' }}
              >
                <FaImages size={14} /> Step-by-Step
              </button>
              <button
                onClick={() => setViewMode('video')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  viewMode === 'video' 
                    ? 'text-white shadow-md' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
                style={{ backgroundColor: viewMode === 'video' ? selected.color : '' }}
              >
                <FaVideo size={14} /> Video Guide
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-3 sm:p-6">
            <AnimatePresence mode="wait">
              {!completed ? (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center"
                >
                  {viewMode === 'steps' && (
                    <div className="w-full max-w-2xl relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700">
                      <img
                        src={step.image}
                        alt={`Step ${stepIndex + 1}`}
                        className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain mx-auto p-2"
                      />
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                          {step.caption}
                        </p>
                      </div>
                    </div>
                  )}

                  {viewMode === 'video' && (
                    <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700">
                      <video controls className="w-full h-auto" playsInline>
                        <source src={selected.video} type="video/mp4" />
                        Your browser doesn't support videos.
                      </video>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative py-6 sm:py-10 px-4 sm:px-6 text-center rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-auto max-w-md"
                >
                  <ConfettiAndCoins />
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-700 rounded-full shadow-md flex items-center justify-center border-4" style={{ borderColor: '#FFD700' }}>
                      {showXpAnimation && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="text-yellow-500 text-lg sm:text-xl font-bold">+{selected.xp} XP</div>
                        </motion.div>
                      )}
                      <FaCheckCircle className="text-green-500 text-2xl sm:text-4xl" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Quest Complete!</h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      You earned <span className="font-bold" style={{ color: selected.color }}>+{selected.xp} XP</span>
                    </p>

                    <div className="bg-white dark:bg-gray-700 border-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-sm text-center max-w-xs" style={{ borderColor: '#FFD700' }}>
                      <div className="flex justify-center text-xl sm:text-2xl mb-1" style={{ color: selected.color }}>
                        {selected.badge}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">NEW BADGE UNLOCKED</div>
                    </div>

                    <button
                      onClick={() => setSelected(null)}
                      className="px-4 sm:px-6 py-2 text-white rounded-lg font-medium transition-all shadow-md text-sm sm:text-base"
                      style={{ background: selected.color }}
                    >
                      Continue Your Journey
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!completed && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full max-w-md mx-auto">
                <button
                  onClick={prev}
                  disabled={stepIndex === 0}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto text-sm ${
                    stepIndex === 0 
                      ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <FaArrowLeft size={12} /> Previous
                </button>

                <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                  Step {stepIndex + 1} of {selected.steps.length}
                </div>

                <button
                  onClick={next}
                  className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2 text-white rounded-lg font-medium transition-all shadow-md w-full sm:w-auto text-sm"
                  style={{ background: selected.color }}
                >
                  {isLastStep ? 'Complete' : 'Next'} <FaArrowRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialDetails;