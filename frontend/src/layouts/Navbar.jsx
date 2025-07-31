import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChevronRight, FaUser, FaCog, FaSignOutAlt, FaHome, FaWallet,
  FaBullseye, FaGraduationCap, FaMedal, FaUsers, FaQuestionCircle,
  FaFileImport, FaChartLine, FaPiggyBank, FaPlus, FaTrophy,
  FaBook, FaCheckCircle, FaBookOpen, FaUserFriends, FaSearch,
  FaVideo, FaListAlt, FaChevronDown, FaBell
} from 'react-icons/fa';
import logo from '../assets/Images/Logo1.png';
import avatar from '../assets/Images/avatars/sharkAvatar.jpeg';
import NotificationsPanel from '../components/notifications/NotificationsPanel';

const menuItems = [
  {
    label: 'Home',
    icon: <FaHome className="mr-1" />,
    items: [{
      label: 'Dashboard',
      sub: 'Your personal dashboard',
      to: '/dashboard',
      icon: <FaHome className="text-[#B4CB98]" />
    }],
  },
  {
    label: 'Accounts',
    icon: <FaWallet className="mr-1" />,
    items: [
      {
        label: 'Transactions',
        sub: 'Manage accounts',
        to: '/transactions',
        icon: <FaWallet className="text-[#B4CB98]" />
      },
      {
        label: 'Budgets',
        sub: 'Create and track',
        to: '/transactions/budget',
        icon: <FaPiggyBank className="text-[#B4CB98]" />
      },
      {
        label: 'Insights',
        sub: 'Financial summaries',
        to: '/transactions/insights',
        icon: <FaChartLine className="text-[#B4CB98]" />
      },
      {
        label: 'Import',
        sub: 'Upload statements',
        to: '/transactions/import',
        icon: <FaFileImport className="text-[#B4CB98]" />
      },
    ],
  },
  {
    label: 'Goals',
    icon: <FaBullseye className="mr-1" />,
    items: [
      {
        label: 'Your Goals',
        sub: 'Track your goals',
        to: '/goals',
        icon: <FaBullseye className="text-[#B4CB98]" />
      },
      {
        label: 'Create Goal',
        sub: 'Start something new',
        to: '/goals/create',
        icon: <FaPlus className="text-[#B4CB98]" />
      },
    ],
  },
  {
    label: 'Learn',
    icon: <FaGraduationCap className="mr-1" />,
    items: [
      {
        label: 'Modules',
        sub: 'Financial lessons',
        to: '/learn',
        icon: <FaBook className="text-[#B4CB98]" />
      },
      {
        label: 'Complete',
        sub: 'Completed modules',
        to: '/learn/complete',
        icon: <FaCheckCircle className="text-[#B4CB98]" />
      },
      {
        label: 'Incomplete',
        sub: 'Keep learning',
        to: '/learn/incomplete',
        icon: <FaBookOpen className="text-[#B4CB98]" />
      },
    ],
  },
  {
    label: 'Achievements',
    icon: <FaMedal className="mr-1" />,
    items: [
      {
        label: 'Your XP',
        sub: 'Progress & points',
        to: '/achievements',
        icon: <FaMedal className="text-[#B4CB98]" />
      },
      {
        label: 'Complete',
        sub: 'Completed achievements',
        to: '/achievements/complete',
        icon: <FaTrophy className="text-[#B4CB98]" />
      },
      {
        label: 'Incomplete',
        sub: 'Still to achieve',
        to: '/achievements/incomplete',
        icon: <FaMedal className="text-[#B4CB98]" />
      },
    ],
  },
  {
    label: 'Community',
    icon: <FaUsers className="mr-1" />,
    items: [
      {
        label: 'Social',
        sub: 'Community home',
        to: '/community',
        icon: <FaUsers className="text-[#B4CB98]" />
      },
      {
        label: 'Friends',
        sub: 'Your friends list',
        to: '/community/friends',
        icon: <FaUserFriends className="text-[#B4CB98]" />
      },
      {
        label: 'Communities',
        sub: 'Browse communities',
        to: '/community/list',
        icon: <FaSearch className="text-[#B4CB98]" />
      },
      {
        label: 'Challenges',
        sub: 'View challenges',
        to: '/community/challenges',
        icon: <FaBullseye className="text-[#B4CB98]" />
      },
    ],
  },
  {
    label: 'Support',
    icon: <FaQuestionCircle className="mr-1" />,
    items: [
      {
        label: 'Help Center',
        sub: 'Guides & FAQs',
        to: '/support',
        icon: <FaQuestionCircle className="text-[#B4CB98]" />
      },
      {
        label: 'Overview',
        sub: 'Page help sections',
        to: '/support/overview',
        icon: <FaListAlt className="text-[#B4CB98]" />
      },
      {
        label: 'Tutorials',
        sub: 'Walkthrough videos',
        to: '/support/tutorials',
        icon: <FaVideo className="text-[#B4CB98]" />
      },
      {
        label: 'FAQs',
        sub: 'Common questions',
        to: '/support/faqs',
        icon: <FaListAlt className="text-[#B4CB98]" />
      },
    ],
  },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : {
      username: 'kevin_park',
      tier: 'Silver',
      avatar,
      id: null
    };
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/landing');
  };

  const toggleMenu = (label) => {
    setActiveMenu(activeMenu === label ? null : label);
    setProfileOpen(false);
    setShowNotifications(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setActiveMenu(null);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setActiveMenu(null);
    setProfileOpen(false);
  };

  const closeAll = () => {
    setActiveMenu(null);
    setProfileOpen(false);
    setShowNotifications(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user?.id) {
          const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`);
          const data = await res.json();
          setNotifications(data.data?.length || 0);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetch(`http://localhost:5000/api/community/performance-summary/${user.id}`)
    .then(res => res.json())
    .then(data => setPerformance(data?.data))
    .catch(err => console.error('Community performance summary error:', err));

    fetchNotifications();

    const updateListener = () => fetchNotifications();
    window.addEventListener('userUpdated', updateListener);

    return () => window.removeEventListener('userUpdated', updateListener);
  }, [user]);

  return (
    <>
      <nav className="bg-white shadow px-6 py-2 flex items-center justify-between relative z-50">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-16 h-16" />
          <h1 className="text-xl font-bold text-[#83AB55]">Gamified Finance</h1>
        </div>

        {/* Main Navigation */}
        <div className="hidden lg:flex gap-6 items-center">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              {menu.items.length === 1 ? (
                <NavLink
                  to={menu.items[0].to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-sm font-semibold transition-colors ${isActive ? 'text-[#83AB55]' : 'text-gray-700 hover:text-[#83AB55]'
                    }`
                  }
                  onClick={closeAll}
                >
                  {menu.icon}
                  <span>{menu.label}</span>
                </NavLink>
              ) : (
                <>
                {/* Adds the button highlight */}
                  <button
                    onClick={() => toggleMenu(menu.label)}
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors ${menu.items.some(item => location.pathname.startsWith(item.to)) || activeMenu === menu.label
                        ? 'text-[#83AB55]'
                        : 'text-gray-700 hover:text-[#83AB55]'
                      }`}
                  >
                    {menu.icon}
                    <span>{menu.label}</span>
                    <FaChevronDown className={`text-xs mt-0.5 transition-transform ${activeMenu === menu.label ? 'rotate-180' : ''
                      }`} />
                  </button>

                  {activeMenu === menu.label && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg p-3 z-50 border border-gray-100">
                      <p className="text-[#83AB55] font-bold mb-2 px-2">{menu.label}</p>
                      <div className="space-y-1">
                        {menu.items.map((item) => (
                          <NavLink
                            key={item.label}
                            to={item.to}
                            onClick={closeAll}
                            className={({ isActive }) => `
                              flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                              ${isActive ? 'bg-green-50 text-[#83AB55]' : 'hover:bg-gray-50 text-gray-700'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{item.icon}</span>
                              <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.sub}</p>
                              </div>
                            </div>
                            <FaChevronRight className="text-gray-400 text-xs" />
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaBell className="text-xl text-gray-700 hover:text-[#83AB55]" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#72C1F5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-400">{user.tier}</p>
              </div>
              <img
                src={performance?.avatar_image_path
                  ? `/assets/Images/${performance.avatar_image_path}`
                  : avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''
                }`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg p-2 z-50 border border-gray-100">
                <NavLink
                  to="/profile"
                  onClick={closeAll}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-green-50 text-[#83AB55]' : 'hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <FaUser className="text-gray-500" />
                  <span className="text-sm">Profile</span>
                </NavLink>
                <NavLink
                  to="/profile/settings"
                  onClick={closeAll}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-green-50 text-[#83AB55]' : 'hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <FaCog className="text-gray-500" />
                  <span className="text-sm">Settings</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(activeMenu !== null || profileOpen || showNotifications) && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-10"
            onClick={closeAll}
          />
        )}
      </nav>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed right-4 top-16 z-50">
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;