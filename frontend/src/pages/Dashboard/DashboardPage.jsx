import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaWallet, FaBullseye, FaUsers, FaGraduationCap, FaMedal,
  FaUserAlt, FaQuestionCircle, FaGamepad, FaCoins,
  FaGem, FaTrophy, FaBookOpen, FaChevronRight,
 FaCalendarAlt, FaFire
} from 'react-icons/fa';
import { motion} from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [darkMode] = useState(false);
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

  const [setNotifications] = useState([
    { id: 1, text: "Daily login bonus! +50 coins", read: false, time: "2 min ago" },
    { id: 2, text: "New achievement unlocked: Financial Wizard", read: false, time: "1 hour ago" },
    { id: 3, text: "Your investment grew by 3.2%", read: false, time: "5 hours ago" }
  ]);
  const [setShowLevelUp] = useState(false);

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
      color: '#F68D2B',
      description: 'Track your financial journey',
      xpReward: 5
    },
    {
      name: 'Goals',
      icon: <FaBullseye />,
      path: '/goals',
      color: '#88BC46',
      description: 'Set and conquer financial targets',
      xpReward: 10
    },
    {
      name: 'Community',
      icon: <FaUsers />,
      path: '/community',
      color: '#3AADFA',
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
      color: '#0B8A8F',
      description: 'Customize your adventurer',
      xpReward: 2
    },
    {
      name: 'Support',
      icon: <FaQuestionCircle />,
      path: '/support',
      color: '#FF9BB7',
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

  return (
    
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} p-4 md:p-6 relative`}>
      {/* Header - welcome banner*/}
      <div className="relative overflow-hidden mb-4 bg-gradient-to-r from-[#B1E1FF] via-[#AAD977] to-[#FFD18C] p-6 rounded-3xl shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-gray-700"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 pt-">
            Welcome Back {user ? user.username : "Guest"}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FaCoins className="text-white" />
              <span className={`font-medium ${colors.text}`}>{userData.coins}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaGem className="text-white" />
              <span className={`font-medium ${colors.text}`}>{userData.gems}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <FaFire className="text-orange-300 text-xs" />
              </div>
              <span className={`font-medium ${colors.text}`}>{userData.streak}</span>
            </div>
          </div>
        </div>
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
              ${item.isSpecial ? 'border-2 border-[#FFFFFF]' : ''}`}
          >
            <div
              className={`text-3xl p-3 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
            <span className={`text-sm font-semibold ${colors.text}`}>{item.name}</span>
            <span className={`text-xs ${colors.secondaryText}`}>{item.description}</span>

            <div className={`text-xs ] mt-1 px-2 py-1 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-[#FFD18C]'} text-white`}>
              +{item.xpReward} XP
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Transactions */}
        <div className={`rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg p-6 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} transition-all`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-lime-500 flex items-center gap-2">
              <FaWallet className="text-[#B4CB98]" /> Recent Transactions
            </h3>
            <button
              className="text-xs bg-gradient-to-r from-[#AAD977] to-[#88BC46] text-white font-bold px-4 py-1 rounded-full hover:brightness-110 transition"
              onClick={() => navigate('/transactions')}
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex justify-between items-center p-3 rounded-xl transition ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'
                      }`}
                  >
                    <FaWallet
                      className={`text-sm ${transaction.amount > 0 ? 'text-[#88BC46]' : 'text-[#FF4C28]'
                        }`}
                    />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${colors.text}`}>{transaction.name}</p>
                    <p className={`text-xs ${colors.secondaryText}`}>
                      {transaction.date} • {transaction.category}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-sm font-bold ${transaction.amount > 0 ? 'text-[#88BC46]' : 'text-[#FF4C28]'
                    }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className={`rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg p-6 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} transition-all`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-[#0B8A8F] flex items-center gap-2">
              <FaCalendarAlt className="text-blue-400" /> Upcoming Bills
            </h3>
            <button
              className="text-xs bg-gradient-to-r from-[#AAD977] to-[#88BC46] text-white font-bold px-4 py-1 rounded-full hover:brightness-110 transition"
              onClick={() => navigate('/budget')}
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className={`flex justify-between items-center p-3 rounded-xl transition ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'
                      }`}
                  >
                    <FaCalendarAlt className="text-sm text-[#5FBFFF]" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${colors.text}`}>{bill.name}</p>
                    <p className={`text-xs ${colors.secondaryText}`}>Due {bill.due}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p
                    className={`text-sm font-bold mr-3 ${bill.paid ? 'text-[#88BC46]' : colors.text
                      }`}
                  >
                    ${bill.amount.toFixed(2)}
                  </p>
                  {bill.paid ? (
                    <span className="text-xs bg-lime-200 text-lime-600 font-semibold px-3 py-1 rounded-full">
                      Paid
                    </span>
                  ) : (
                    <button className="text-xs font-semibold bg-red-200 text-[#FF4C28] px-3 py-1 rounded-full hover:brightness-105">
                      Pay
                    </button>
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
        <div className={`rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg p-6 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} transition-all`}>
          <h3 className="text-xl font-extrabold text-lime-500 mb-4 flex items-center gap-2">
            <FaBullseye className="text-orange-400" /> Daily Challenges
          </h3>

          <div className="space-y-4">
            {[
              "Review your budget",
              "Log 3 transactions",
              "Read one financial article"
            ].map((task, index) => (
              <label
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${darkMode
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={userData.dailyTasks[index]}
                  onChange={() => toggleDailyTask(index)}
                  className="w-5 h-5 accent-emerald-500"
                />
                <span className={`text-sm ${colors.text}`}>{task}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center gap-4">
            <div>
              <p className={`text-xs uppercase tracking-wide ${colors.secondaryText}`}>Completion Reward</p>
              <div className="flex items-center gap-2 mt-1 text-yellow-500 font-semibold">
                <FaCoins />
                <span>100 Coins</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gradient-to-br from-orange-500 to-red-500 px-3 py-1.5 rounded-full shadow">
              <FaFire className="text-white text-sm" />
              <span className="text-white text-sm font-semibold">Streak Day {userData.streak}</span>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className={`rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg p-6 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} transition-all`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-extrabold text-yellow-500 flex items-center gap-2">
              <FaTrophy className="text-yellow-400" /> Recent Achievements
            </h3>
            <button
              className="text-xs bg-gradient-to-r from-[#AAD977] to-[#88BC46] text-white font-bold px-6 py-2 rounded-full hover:brightness-110 transition"
              onClick={() => navigate('/achievements')}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center shadow-sm transition-all duration-200 ${achievement.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200'
                  : darkMode
                    ? 'bg-slate-700 border border-slate-600'
                    : 'bg-gray-50 border border-gray-200'
                  }`}
              >
                <div className={`text-3xl mb-2 ${achievement.earned
                  ? 'text-yellow-500'
                  : darkMode
                    ? 'text-slate-500'
                    : 'text-gray-300'
                  }`}>
                  {achievement.icon}
                </div>
                <p className={`text-sm font-medium ${achievement.earned
                  ? 'text-slate-800'
                  : darkMode
                    ? 'text-slate-400'
                    : 'text-gray-500'
                  }`}>
                  {achievement.name}
                </p>
                {achievement.earned && (
                  <span className="text-xs font-bold text-yellow-700 mt-1 block">+{achievement.xp} XP</span>
                )}
                {!achievement.earned && (
                  <span className="text-xs italic mt-1 block text-gray-400">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg p-6 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} transition-all`}>
          <h3 className="text-lg font-extrabold text-lime-500 mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h3>

          <div className="space-y-4">
            {[
              {
                label: 'Add Transaction',
                icon: <FaWallet className="text-lime-500" />,
                bg: 'bg-white',
                to: '/transactions',
              },
              {
                label: 'Set New Goal',
                icon: <FaBullseye className="text-[#5FBFFF]" />,
                bg: 'bg-white',
                to: '/goals/create',
              },
              {
                label: 'Start Lesson',
                icon: <FaGraduationCap className="text-orange-500" />,
                bg: 'bg-white',
                to: '/learn',
              },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.to)}
                className={`w-full flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center">
                  <div className={`w-9 h-9 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-white'} flex items-center justify-center shadow-inner mr-3`}>
                    {action.icon}
                  </div>
                  <span className={`text-sm font-medium ${colors.text}`}>{action.label}</span>
                </div>
                <FaChevronRight className={`text-sm ${colors.secondaryText}`} />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;