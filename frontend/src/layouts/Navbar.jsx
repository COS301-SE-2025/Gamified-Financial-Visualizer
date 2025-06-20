import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  FaHome, FaCalculator, FaBullseye, FaUsers, FaGraduationCap, FaMedal,
  FaQuestionCircle, FaBell, FaUser, FaSignOutAlt
} from 'react-icons/fa';

import Logo from '../assets/Images/Logo.png';
import User from '../assets/Images/avatars/totoroAvatar.jpeg';
import NotificationsPanel from '../components/notifications/NotificationsPanel';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
      <nav className="bg-white h-20 px-6 flex items-center justify-between border-b-2 border-[#83AB55] shadow-sm">
        {/* Left: User Info */}
        <div className="flex items-center space-x-4">
          <img src={User} alt="User" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{user ? user.username : "Guest"}</p>
            <p className="text-xs text-gray-400">Silver</p>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
          <NavLink to="/Dashboard" className={navClasses}><FaHome /> <span>Home</span></NavLink>
          <NavLink to="/transactions" className={navClasses}><FaCalculator /> <span>Accounts</span></NavLink>
          <NavLink to="/goals" className={navClasses}><FaBullseye /> <span>Goals</span></NavLink>
          <NavLink to="/community" className={navClasses}><FaUsers /> <span>Community</span></NavLink>
          <NavLink to="/learn" className={navClasses}><FaGraduationCap /> <span>Learn</span></NavLink>
          <NavLink to="/achievements" className={navClasses}><FaMedal /> <span>Achievements</span></NavLink>
          <NavLink to="/support" className={navClasses}><FaQuestionCircle /> <span>Support</span></NavLink>
          <NavLink to="/profile" className={navClasses}><FaUser /> <span>Profile</span></NavLink>
        </div>

        {/* Right: Icons + Logout */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <FaBell
              className="text-xl text-gray-700 hover:text-[#83AB55] cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            <span className="absolute -top-2 -right-2 bg-[#FB7272] text-white text-xs rounded-full px-1">5</span>
          </div>

          {/* Dark Mode Toggle */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${darkMode ? 'bg-[#83AB55]' : 'bg-gray-300'
              }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
          </div>


          {/* Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow hover:bg-[#F0F0F0] transition"
            >
              <FaSignOutAlt className="text-[#83AB55] text-2xl" />
            </button>
          ) : (
            <NavLink to="/landing" className="bg-[#83AB55] text-white px-4 py-1 rounded-full shadow">
              Login
            </NavLink>
          )}

          {/* Logo */}
          <img src={Logo} alt="brand" className="w-16 h-16 object-cover" />
        </div>
      </nav>

      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </>
  );
};

export default Navbar;
