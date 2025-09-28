import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChevronRight, FaUser, FaCog, FaSignOutAlt, FaHome, FaWallet,
  FaBullseye, FaGraduationCap, FaMedal, FaUsers, FaQuestionCircle,
  FaFileImport, FaChartLine, FaPiggyBank, FaPlus, FaTrophy,
  FaBook, FaCheckCircle, FaBookOpen, FaUserFriends, FaSearch,
  FaVideo, FaListAlt, FaChevronDown, FaBell, FaBars, FaTimes
} from 'react-icons/fa';
import logo from '../assets/Images/Logo1.png';
import avatar from '../assets/Images/avatars/LightPost.png';
import NotificationsPanel from '../components/notifications/NotificationsPanel';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";

const menuItems = [
  {
    label: 'Home',
    icon: <FaHome className="text-lg" />,
    items: [{
      label: 'Dashboard',
      sub: 'Your personal dashboard',
      to: '/dashboard',
      icon: <FaHome className="text-[#B4CB98]" />
    }],
  },
  {
    label: 'Accounts',
    icon: <FaWallet className="text-lg" />,
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
    icon: <FaBullseye className="text-lg" />,
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
    icon: <FaGraduationCap className="text-lg" />,
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
    icon: <FaMedal className="text-lg" />,
    items: [
      {
        label: 'Achievements',
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
    icon: <FaUsers className="text-lg" />,
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
    icon: <FaQuestionCircle className="text-lg" />,
    items: [
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : {
      username: 'sarah_williams',
      tier: 'Silver',
      avatar,
      id: null
    };
  });
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/landing');
    closeAll();
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

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
    setActiveMenu(null);
    setProfileOpen(false);
    setShowNotifications(false);
  };

  const closeAll = () => {
    setActiveMenu(null);
    setProfileOpen(false);
    setShowNotifications(false);
    setMobileSidebarOpen(false);
  };

  // Handle navigation for mobile sidebar
  const handleMobileNavigation = (to) => {
    navigate(to);
    setTimeout(() => {
      closeAll();
    }, 100);
  };

  // Close sidebar when route changes
  useEffect(() => {
    closeAll();
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-btn')) {
        closeAll();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user?.id) {
          const res = await fetch(`${BASE_URL}/api/notifications/${user.id}`);
          const data = await res.json();
          setNotifications(data.data?.length || 0);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetch(`${BASE_URL}/api/community/performance-summary/${user.id}`)
      .then(res => res.json())
      .then(data => setPerformance(data?.data))
      .catch(err => console.error('Community performance summary error:', err));

    fetchNotifications();

    const updateListener = () => fetchNotifications();
    window.addEventListener('userUpdated', updateListener);

    return () => window.removeEventListener('userUpdated', updateListener);
  }, [user]);

  const navRef = useRef(null);
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const set = () =>
      document.documentElement.style.setProperty(
        '--app-header-h',
        `${Math.ceil(el.getBoundingClientRect().height)}px`
      );
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mobile sidebar component
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9998] transition-opacity duration-300 lg:hidden ${
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeAll}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-[9999] transform transition-transform duration-300 ease-in-out lg:hidden mobile-sidebar ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header - User Info */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={performance?.avatar_image_path
                ? `/assets/Images/${performance.avatar_image_path}`
                : avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.tier}</p>
            </div>
          </div>
          <button 
            onClick={closeAll}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-gray-600 text-lg" />
          </button>
        </div>

       

        {/* Sidebar Content */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="p-4">
            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((menu) => (
                <div key={menu.label} className="relative">
                  {menu.items.length === 1 ? (
                    <button
                      onClick={() => handleMobileNavigation(menu.items[0].to)}
                      className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                        location.pathname === menu.items[0].to
                          ? 'bg-green-50 text-[#83AB55] border border-green-100' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#83AB55]'
                      }`}
                    >
                      <span className="text-lg">{menu.icon}</span>
                      <span>{menu.label}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleMenu(menu.label)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-colors ${
                          menu.items.some(item => location.pathname.startsWith(item.to)) || activeMenu === menu.label
                            ? 'bg-green-50 text-[#83AB55] border border-green-100'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#83AB55]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{menu.icon}</span>
                          <span>{menu.label}</span>
                        </div>
                        <FaChevronDown 
                          className={`text-xs transition-transform ${
                            activeMenu === menu.label ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>

                      {activeMenu === menu.label && (
                        <div className="ml-6 mt-2 space-y-2 border-l-2 border-green-100 pl-3">
                          {menu.items.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => handleMobileNavigation(item.to)}
                              className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors w-full text-left ${
                                location.pathname.startsWith(item.to)
                                  ? 'text-[#83AB55] font-medium bg-green-25'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                              }`}
                            >
                              <span className="text-md">{item.icon}</span>
                              <div className="flex-1 text-left">
                                <p className="font-medium">{item.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => handleMobileNavigation('/profile')}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  location.pathname.startsWith('/profile')
                    ? 'bg-green-50 text-[#83AB55] border border-green-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#83AB55]'
                }`}
              >
                <FaUser className="text-lg" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => handleMobileNavigation('/profile/settings')}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  location.pathname === '/profile/settings'
                    ? 'bg-green-50 text-[#83AB55] border border-green-100'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#83AB55]'
                }`}
              >
                <FaCog className="text-lg" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left border border-transparent hover:border-red-100"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <nav ref={navRef} className="bg-white shadow px-4 sm:px-6 py-3 flex items-center justify-between relative z-[9999] dark:bg-gray-800">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mobile-menu-btn"
          >
            {mobileSidebarOpen ? (
              <FaTimes className="text-xl text-gray-700" />
            ) : (
              <FaBars className="text-xl text-gray-700" />
            )}
          </button>
          
          {/* Logo - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16" />
            <h1 className="text-lg sm:text-xl font-bold text-[#83AB55]">Gamified Finance</h1>
          </div>

          {/* User Info - Show on mobile instead of logo */}
          <div className="lg:hidden flex items-center gap-3">
            <img
              src={performance?.avatar_image_path
                ? `/assets/Images/${performance.avatar_image_path}`
                : avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.tier}</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden lg:flex gap-6 items-center z-10000">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              {menu.items.length === 1 ? (
                <NavLink
                  end
                  to={menu.items[0].to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-sm font-semibold transition-colors ${isActive ? 'text-[#83AB55]' : 'text-gray-700 hover:text-[#83AB55] dark:text-gray-200 dark:hover:text-[#83AB55]'
                    }`
                  }
                  onClick={closeAll}
                >
                  {menu.icon}
                  <span>{menu.label}</span>
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(menu.label)}
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors ${menu.items.some(item => location.pathname.startsWith(item.to)) || activeMenu === menu.label
                      ? 'text-[#83AB55]'
                      : 'text-gray-700 hover:text-[#83AB55] dark:text-gray-200 dark:hover:text-[#83AB55]'
                      }`}
                  >
                    {menu.icon}
                    <span>{menu.label}</span>
                    <FaChevronDown className={`text-xs mt-0.5 transition-transform ${activeMenu === menu.label ? 'rotate-180' : ''
                      }`} />
                  </button>

                  {activeMenu === menu.label && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg p-3 z-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                      <p className="text-[#83AB55] font-bold mb-2 px-2">{menu.label}</p>
                      <div className="space-y-1">
                        {menu.items.map((item) => (
                          <NavLink
                            end
                            key={item.label}
                            to={item.to}
                            onClick={closeAll}
                            className={({ isActive }) => `
                              flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                              ${isActive
                                ? 'bg-green-50 text-[#83AB55] dark:bg-gray-700'
                                : 'hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{item.icon}</span>
                              <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.sub}</p>
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

        {/* Right Side Icons - Desktop Only */}
        <div className="hidden lg:flex items-center gap-4 z-10000">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
            >
              <FaBell className="text-xl text-gray-700 hover:text-[#83AB55] dark:text-gray-200" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#72C1F5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Profile */}
          <div className="relative z-[9999]">
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.username}</p>
                <p className="text-xs text-gray-400">{user.tier}</p>
              </div>
              <img
                src={performance?.avatar_image_path
                  ? `/assets/Images/${performance.avatar_image_path}`
                  : avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''
                }`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg p-2 z-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <NavLink
                  end
                  to="/profile"
                  onClick={closeAll}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-green-50 text-[#83AB55] dark:bg-gray-700'
                      : 'hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <FaUser className="text-gray-500" />
                  <span className="text-sm">Profile</span>
                </NavLink>
                <NavLink
                  end
                  to="/profile/settings"
                  onClick={closeAll}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-green-50 text-[#83AB55] dark:bg-gray-700'
                      : 'hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <FaCog className="text-gray-500" />
                  <span className="text-sm">Settings</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 transition-colors dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications Button - Mobile Only */}
        <div className="lg:hidden relative">
          <button
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaBell className="text-xl text-gray-700" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#72C1F5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>

        {/* Click outside to close dropdowns */}
        {(activeMenu !== null || profileOpen || showNotifications) && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-10 z-10000"
            onClick={closeAll}
          />
        )}
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* HUD layer lives right under the navbar */}
      <div
        id="hud-root"
        className="fixed left-0 right-0 z-40"
        style={{ top: 'var(--app-header-h, 88px)' }}
      />

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed right-4 top-16 z-[9999]">
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </>
  );
};

export default Navbar;