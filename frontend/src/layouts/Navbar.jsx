import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  FaHome, FaCalculator, FaBullseye, FaUsers, FaGraduationCap, FaMedal,
  FaQuestionCircle, FaBell, FaSignOutAlt
} from 'react-icons/fa';

import Logo from '../assets/Images/Logo.png';
import DefaultAvatar from '../assets/Images/avatars/totoroAvatar.jpeg';
import NotificationsPanel from '../components/notifications/NotificationsPanel';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.id) return;

    setUser(storedUser);

    fetch(`http://localhost:5000/api/community/performance-summary/${storedUser.id}`)
      .then(res => res.json())
      .then(data => setPerformance(data.data))
      .catch(err => console.error('Community performance summary error:', err));

    fetch(`http://localhost:5000/api/auth/profile/level-progress/${storedUser.id}`)
      .then(res => res.json())
      .then(res => setLevelProgress(res.data))
      .catch(err => console.error('Failed to load level progress:', err));
  };

  useEffect(() => {
    fetchUserData();

    // Listen for updates from settings page
    const handleUpdate = () => fetchUserData();
    window.addEventListener('userUpdated', handleUpdate);

    return () => window.removeEventListener('userUpdated', handleUpdate);
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
          <NavLink to="/profile">
            <img
              src={
                performance?.avatar_image_path
                  ? `/assets/Images/${performance.avatar_image_path}`
                  : DefaultAvatar
              }
              className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              alt="User Avatar"
            />
          </NavLink>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.username || 'Guest'}</p>
            <p className="text-xs text-gray-400">{levelProgress?.tier_status ?? '—'}</p>
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
        </div>

        {/* Right: Icons + Logout */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaBell
              className="text-xl text-gray-700 hover:text-[#83AB55] cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            <span className="absolute -top-2 -right-2 bg-[#FB7272] text-white text-xs rounded-full px-1">5</span>
          </div>

          {user ? (
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

          <img src={Logo} alt="brand" className="w-16 h-16 object-cover" />
        </div>
      </nav>

      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </>
  );
};

export default Navbar;
