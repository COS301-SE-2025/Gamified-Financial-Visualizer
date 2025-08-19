import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  FaHome, FaCalculator, FaBullseye, FaUsers, FaGraduationCap, FaMedal,
  FaQuestionCircle, FaBell, FaSignOutAlt
} from 'react-icons/fa';

import Logo from '../assets/Images/Logo.png';
import User from '../assets/Images/avatars/totoroAvatar.jpeg';
import NotificationsPanel from '../components/notifications/NotificationsPanel';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/landing');
  };

  const navClasses = ({ isActive }) =>
    isActive
      ? "text-[#83AB55] border-b-2 border-[#83AB55] pb-1 flex items-center space-x-1"
      : "hover:text-[#83AB55] flex items-center space-x-1";

  return (
    <>
      <nav className="bg-white shadow px-6 py-2 flex items-center justify-between relative z-50 dark:bg-gray-800 z-[9999]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-16 h-16" />
          <h1 className="text-xl font-bold text-[#83AB55]">Gamified Finance</h1>
        </div>

        {/* Main Navigation */}
        <div className="hidden lg:flex gap-6 items-center z-10000">
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              {menu.items.length === 1 ? (
                <NavLink
                  end
                  to={menu.items[0].to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 text-sm font-semibold transition-colors ${
                      isActive ? 'text-[#83AB55]' : 'text-gray-700 hover:text-[#83AB55] dark:text-gray-200 dark:hover:text-[#83AB55]'
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
                    className={`flex items-center gap-1 text-sm font-semibold transition-colors ${
                      menu.items.some(item => location.pathname.startsWith(item.to)) || activeMenu === menu.label
                        ? 'text-[#83AB55]'
                        : 'text-gray-700 hover:text-[#83AB55] dark:text-gray-200 dark:hover:text-[#83AB55]'
                    }`}
                  >
                    {menu.icon}
                    <span>{menu.label}</span>
                    <FaChevronDown className={`text-xs mt-0.5 transition-transform ${
                      activeMenu === menu.label ? 'rotate-180' : ''
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
                              ${
                                isActive 
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

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 z-10000">
          {/* Notifications */}
          <div className="relative">
            <FaBell
              className="text-xl text-gray-700 hover:text-[#83AB55] cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            <span className="absolute -top-2 -right-2 bg-[#FB7272] text-white text-xs rounded-full px-1">5</span>
          </div>

          {/* User Profile */}
          <div className="relative z-[9999]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow hover:bg-[#F0F0F0] transition"
            >
              <FaSignOutAlt className="text-[#83AB55] text-xl" />
              <span className="text-sm font-medium text-[#83AB55]">Logout</span>
            </button>

          ) : (
            <NavLink to="/landing" className="bg-[#83AB55] text-white px-4 py-1 rounded-full shadow">
              Login
            </NavLink>
          )}

          {/* Logo */}
          <img src={Logo} alt="brand" className="w-16 h-16 object-cover" />
        </div>

        {/* Click outside to close dropdowns */}
        {(activeMenu !== null || profileOpen || showNotifications) && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-10 z-10000"
            onClick={closeAll}
          />
        )}
      </nav>

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
