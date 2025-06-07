import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaHome, FaCalculator, FaBullseye, FaUsers, FaGraduationCap, FaMedal, FaQuestionCircle, FaBell, FaUser } from 'react-icons/fa';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { SiCashapp } from 'react-icons/si';

import Logo from '../assets/Images/Logo.png';
import User from '../assets/Images/banners/pixelCornerStore.gif';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navClasses = ({ isActive }) =>
    isActive
      ? "text-green-600 border-b-2 border-green-600 pb-1 flex items-center space-x-1"
      : "hover:text-green-600 flex items-center space-x-1";

  return (
    <nav className="bg-white h-20 px-6 flex items-center justify-between border-b-2 border-lime-500 shadow-sm">
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
        <NavLink to="/app/Dashboard" className={navClasses}><FaHome /> <span>Home</span></NavLink>
        <NavLink to="/app/transactions" className={navClasses}><FaCalculator /> <span>Accounts</span></NavLink>
        <NavLink to="/app/goals" className={navClasses}><FaBullseye /> <span>Goals</span></NavLink>
        <NavLink to="/app/community" className={navClasses}><FaUsers /> <span>Community</span></NavLink>
        <NavLink to="/app/learn" className={navClasses}><FaGraduationCap /> <span>Learn</span></NavLink>
        <NavLink to="/app/achievements" className={navClasses}><FaMedal /> <span>Achievements</span></NavLink>
        <NavLink to="/app/support" className={navClasses}><FaQuestionCircle /> <span>Support</span></NavLink>
        <NavLink to="/app/profile" className={navClasses}><FaUser /> <span>Profile</span></NavLink>
      </div>

      {/* Right: Icons + Logout */}
      <div className="flex items-center space-x-4">
        {/* Notification */}
        <div className="relative">
          <FaBell className="text-xl text-gray-700 hover:text-lime-600 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">5</span>
        </div>

        {/* Theme Toggle Placeholder */}
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" />
            <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner" />
            <div className="dot absolute left-1 top-1 w-3 h-3 bg-green-500 rounded-full transition" />
          </div>
        </label>

        {/* Logout Button */}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-green-300 to-green-500 text-white px-4 py-1 rounded-full shadow hover:from-green-400 hover:to-green-600"
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="bg-green-500 text-white px-4 py-1 rounded-full shadow">
            Login
          </NavLink>
        )}

        {/* Logo */}
        <img src={Logo} alt="brand" className="w-16 h-16 object-cover" />
      </div>
    </nav>
  );
};

export default Navbar;
