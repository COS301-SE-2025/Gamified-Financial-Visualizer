import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaWallet, FaBullseye, FaUsers, FaGraduationCap, FaMedal,
  FaUserAlt, FaQuestionCircle, FaGamepad, FaCoins, 
  FaGem, FaTrophy, FaChartLine, FaBookOpen, FaChevronRight,
  FaBell, FaCog, FaSearch, FaCalendarAlt, FaArrowUp, FaArrowDown, FaFire
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    level: 5,
    xp: 680,
    coins: 1250,
    streak: 7,
    gems: 3,
    netWorth: 45678,
    cashFlow: 1245,
    debtReduction: 18,
    dailyTasks: [false, false, false]
  });
  const [activeItem, setActiveItem] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Daily login bonus! +50 coins", read: false, time: "2 min ago" },
    { id: 2, text: "New achievement unlocked: Financial Wizard", read: false, time: "1 hour ago" },
    { id: 3, text: "Your investment grew by 3.2%", read: false, time: "5 hours ago" }
  ]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Color scheme based on dark mode
  const colors = {
    primary: darkMode ? 'from-teal-800 to-emerald-900' : 'from-teal-500 to-emerald-600',
    cardBg: darkMode ? 'bg-slate-800' : 'bg-white',
    text: darkMode ? 'text-slate-100' : 'text-slate-800',
    secondaryText: darkMode ? 'text-slate-300' : 'text-slate-600',
    accent: 'text-emerald-500',
    border: darkMode ? 'border-slate-700' : 'border-slate-200',
    button: darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200',
  };

  const dashboardItems = [
    { 
      name: 'Transactions', 
      icon: <FaWallet />, 
      path: '/transactions',
      color: '#E5794B',
      description: 'Track your financial journey',
      xpReward: 5
    },
    { 
      name: 'Goals', 
      icon: <FaBullseye />, 
      path: '/goals',
      color: '#4CAF50',
      description: 'Set and conquer financial targets',
      xpReward: 10
    },
    { 
      name: 'Community', 
      icon: <FaUsers />, 
      path: '/community',
      color: '#2196F3',
      description: 'Join forces with fellow adventurers',
      xpReward: 8
    },
    { 
      name: 'Learn', 
      icon: <FaGraduationCap />, 
      path: '/learn',
      color: '#9C27B0',
      description: 'Expand your financial knowledge',
      xpReward: 15
    },
    { 
      name: 'Achievements', 
      icon: <FaMedal />, 
      path: '/achievements',
      color: '#FFC107',
      description: 'Show off your financial prowess',
      xpReward: 5
    },
    { 
      name: 'Profile', 
      icon: <FaUserAlt />, 
      path: '/profile',
      color: '#607D8B',
      description: 'Customize your adventurer',
      xpReward: 2
    },
    { 
      name: 'Support', 
      icon: <FaQuestionCircle />, 
      path: '/support',
      color: '#795548',
      description: 'Get help on your journey',
      xpReward: 3
    },
    { 
      name: 'Financial Dungeon', 
      icon: <FaGamepad />, 
      path: '/community/game',
      color: '#F44336',
      description: 'Battle financial monsters!',
      xpReward: 20,
      isSpecial: true
    },
  ];

  const achievements = [
    { id: 1, name: 'First Steps', icon: <FaBookOpen />, earned: true, xp: 50 },
    { id: 2, name: 'Tutorial Master', icon: <FaGraduationCap />, earned: false, xp: 100 },
    { id: 3, name: 'Help Hero', icon: <FaMedal />, earned: false, xp: 75 },
    { id: 4, name: 'Savings Champion', icon: <FaCoins />, earned: true, xp: 150 }
  ];

  const recentTransactions = [
    { id: 1, name: 'Grocery Store', amount: -85.32, date: 'Today', category: 'Food' },
    { id: 2, name: 'Paycheck', amount: 2450.00, date: 'Today', category: 'Income' },
    { id: 3, name: 'Electric Bill', amount: -120.50, date: 'Yesterday', category: 'Utilities' },
    { id: 4, name: 'Coffee Shop', amount: -4.75, date: 'Yesterday', category: 'Food' }
  ];

  const upcomingBills = [
    { id: 1, name: 'Rent Payment', amount: 1200.00, due: 'Jun 25', paid: false },
    { id: 2, name: 'Netflix', amount: 14.99, due: 'Jun 28', paid: true },
    { id: 3, name: 'Gym Membership', amount: 29.99, due: 'Jul 1', paid: false }
  ];

  const xpPercentage = Math.min((userData.xp / (userData.level * 200)) * 100, 100);

// Level up effect
useEffect(() => {
  if (userData.xp >= userData.level * 200) {
    setUserData(prev => ({
      ...prev,
      level: prev.level + 1,
      xp: 0,
      coins: prev.coins + 100,
      gems: prev.gems + 1
    }));
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 3000);
    addNotification(`Level up! You're now level ${userData.level + 1}`);
  }
}, [userData.xp, userData.level]);

  // Level up effect
  useEffect(() => {
    if (userData.xp >= userData.level * 200) {
      setUserData(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: 0,
        coins: prev.coins + 100,
        gems: prev.gems + 1
      }));
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      addNotification(`Level up! You're now level ${userData.level + 1}`);
    }
  }, [userData.xp, userData.level]);

  const addNotification = (text) => {
    setNotifications(prev => [
      { id: Date.now(), text, read: false, time: "Just now" },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, read: true} : n)
    );
  };

  const handleItemClick = (item) => {
    setUserData(prev => ({
      ...prev,
      xp: prev.xp + item.xpReward
    }));
    navigate(item.path);
  };

  const toggleDailyTask = (index) => {
    const newTasks = [...userData.dailyTasks];
    newTasks[index] = !newTasks[index];
    
    setUserData(prev => ({
      ...prev,
      dailyTasks: newTasks
    }));

    // Check if all tasks are completed
    if (newTasks.every(task => task)) {
      setUserData(prev => ({
        ...prev,
        coins: prev.coins + 100,
        xp: prev.xp + 50,
        streak: prev.streak + 1
      }));
      addNotification("Daily quest completed! +100 coins");
    }
  };

  const LevelUpCelebration = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div 
        className="text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 mb-4">
          LEVEL UP!
        </div>
        <div className="text-4xl animate-bounce">
          🎉
        </div>
        <div className="text-xl mt-4 text-white">
          You're now level {userData.level}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} p-4 md:p-6 relative`}>
      {/* Level up celebration */}
      <AnimatePresence>
        {showLevelUp && <LevelUpCelebration />}
      </AnimatePresence>

      {/* Header - welcome banner*/}
      <div className="flex-1 bg-gradient-to-r from-[#B1E1FF] via-[#AAD977] to-[#FBD38D] p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            <FaGamepad /> Welcome Back satoshi_nak!
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            Let the savings and endless challenges commence.
          </p>
        </div>

      {/* User Stats Bar */}
      <div className={`flex items-center justify-between p-4 rounded-xl mb-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <div>
            <h3 className={`font-bold ${colors.text}`}>Adventurer #{Math.floor(Math.random() * 10000)}</h3>
            <p className={`text-xs ${colors.secondaryText}`}>Level {userData.level} • {userData.xp}/{userData.level * 200} XP</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FaCoins className="text-yellow-500" />
            <span className={`font-medium ${colors.text}`}>{userData.coins}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaGem className="text-purple-500" />
            <span className={`font-medium ${colors.text}`}>{userData.gems}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <FaFire className="text-white text-xs" />
            </div>
            <span className={`font-medium ${colors.text}`}>{userData.streak}</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}


      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            title: 'Net Worth',
            value: `$${userData.netWorth.toLocaleString()}`,
            change: '+12%',
            positive: true,
            icon: <FaWallet className="text-emerald-500" />
          },
          {
            title: 'Cash Flow',
            value: `$${userData.cashFlow.toLocaleString()}`,
            change: '+5%',
            positive: true,
            icon: <FaChartLine className="text-blue-500" />
          },
          {
            title: 'Debt Reduction',
            value: `${userData.debtReduction}%`,
            change: '3% this month',
            positive: true,
            icon: <FaBullseye className="text-amber-500" />
          },
          {
            title: 'Savings Rate',
            value: '18%',
            change: '+2%',
            positive: true,
            icon: <FaCoins className="text-yellow-500" />
          }
        ].map((metric, i) => (
          <div 
            key={i}
            className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className={`text-xs font-medium ${colors.secondaryText}`}>{metric.title}</p>
              <div className={`p-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                {metric.icon}
              </div>
            </div>
            <p className={`text-lg font-bold ${colors.text}`}>{metric.value}</p>
            <p className={`text-xs mt-1 ${metric.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {metric.change} {metric.positive ? <FaArrowUp className="inline" /> : <FaArrowDown className="inline" />}
            </p>
          </div>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {dashboardItems.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -3 }}
            onClick={() => handleItemClick(item)}
            className={`cursor-pointer rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'} 
              shadow-sm p-4 flex flex-col items-center gap-2 text-center transition-all duration-200
              ${item.isSpecial ? 'border-2 border-yellow-400' : ''}`}
          >
            <div 
              className={`text-3xl p-3 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
            <span className={`text-sm font-semibold ${colors.text}`}>{item.name}</span>
            <span className={`text-xs ${colors.secondaryText}`}>{item.description}</span>
            
            {item.isSpecial && (
              <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                NEW
              </div>
            )}

            <div className={`text-xs mt-1 px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} text-yellow-600`}>
              +{item.xpReward} XP
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Transactions */}
        <div className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm p-5`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${colors.text}`}>Recent Transactions</h3>
            <button className={`text-xs ${colors.accent} flex items-center`}>
              View All <FaChevronRight className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} flex items-center justify-center mr-3`}>
                    <FaWallet className={`text-xs ${transaction.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${colors.text}`}>{transaction.name}</p>
                    <p className={`text-xs ${colors.secondaryText}`}>{transaction.date} • {transaction.category}</p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm p-5`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${colors.text}`}>Upcoming Bills</h3>
            <button className={`text-xs ${colors.accent} flex items-center`}>
              View All <FaChevronRight className="ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingBills.map(bill => (
              <div key={bill.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} flex items-center justify-center mr-3`}>
                    <FaCalendarAlt className="text-xs text-blue-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${colors.text}`}>{bill.name}</p>
                    <p className={`text-xs ${colors.secondaryText}`}>Due {bill.due}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className={`text-sm font-medium mr-3 ${bill.paid ? 'text-emerald-500' : colors.text}`}>
                    ${bill.amount.toFixed(2)}
                  </p>
                  {bill.paid ? (
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Paid</span>
                  ) : (
                    <button className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">Pay</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Challenges */}
        <div className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm p-5`}>
          <h3 className={`font-bold ${colors.text} mb-4`}>Daily Challenges</h3>
          
          <div className="space-y-4">
            {[
              "Review your budget",
              "Log 3 transactions",
              "Read one financial article"
            ].map((task, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={userData.dailyTasks[index]}
                  onChange={() => toggleDailyTask(index)}
                  className={`mr-3 w-5 h-5 rounded ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border focus:ring-emerald-500`}
                />
                <p className={`text-sm ${colors.text}`}>{task}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
            <div>
              <p className={`text-xs ${colors.secondaryText}`}>Completion Reward</p>
              <div className="flex items-center mt-1">
                <FaCoins className="text-yellow-500 mr-1" />
                <span className={`text-sm font-medium ${colors.text}`}>100 coins</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-2">
                <FaFire className="text-white text-xs" />
              </div>
              <span className={`text-sm font-medium ${colors.text}`}>Day {userData.streak}</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm p-5`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${colors.text}`}>Recent Achievements</h3>
            <button className={`text-xs ${colors.accent} flex items-center`}>
              View All <FaChevronRight className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`p-3 rounded-lg flex flex-col items-center ${achievement.earned ? 
                  'bg-gradient-to-b from-yellow-50 to-yellow-100 border border-yellow-200' : 
                  darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
              >
                <div className={`text-2xl mb-2 ${achievement.earned ? 'text-yellow-500' : (darkMode ? 'text-gray-600' : 'text-gray-300')}`}>
                  {achievement.icon}
                </div>
                <p className={`text-xs font-medium text-center ${achievement.earned ? 'text-gray-800' : colors.secondaryText}`}>
                  {achievement.name}
                </p>
                {achievement.earned && (
                  <span className="text-xs text-yellow-600 mt-1">+{achievement.xp} XP</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm p-5`}>
          <h3 className={`font-bold ${colors.text} mb-4`}>Quick Actions</h3>
          
          <div className="space-y-3">
            <button className={`w-full flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <FaWallet className="text-emerald-500" />
                </div>
                <span className={`text-sm ${colors.text}`}>Add Transaction</span>
              </div>
              <FaChevronRight className={colors.secondaryText} />
            </button>
            
            <button className={`w-full flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <FaBullseye className="text-blue-500" />
                </div>
                <span className={`text-sm ${colors.text}`}>Set New Goal</span>
              </div>
              <FaChevronRight className={colors.secondaryText} />
            </button>
            
            <button className={`w-full flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center mr-3`}>
                  <FaGraduationCap className="text-purple-500" />
                </div>
                <span className={`text-sm ${colors.text}`}>Start Lesson</span>
              </div>
              <FaChevronRight className={colors.secondaryText} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;