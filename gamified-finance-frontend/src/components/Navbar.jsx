import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Images/Logo.png';
import User from '../assets/Images/pixelWindow.gif';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    setUser(null); // Update state
    navigate('/login'); // Redirect to login page
  };

  const navClasses = ({ isActive }) =>
    isActive
      ? "text-green-600 border-b-2 border-green-600 pb-1"
      : "hover:text-green-600";

  return (
    <nav className="bg-white h-16 px-6 py-2 flex items-center justify-between border-b shadow-sm">
      {/* Left: Logo + User Info */}
      <div className="flex items-center space-x-4">
        <img src={User} alt="User" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{user ? user.username : "Guest"}</p>
          <p className="text-xs text-gray-400">Silver</p>
        </div>
      </div> 

      {/* Center: Nav Links */}
      <div className="flex items-center space-x-8 text-sm font-medium text-gray-700">
        <NavLink to="/app/home" className={navClasses}>Home</NavLink>
        <NavLink to="/app/transactions" className={navClasses}>Transactions</NavLink>
        <NavLink to="/app/goals" className={navClasses}>Goals</NavLink>
        <NavLink to="/app/community" className={navClasses}>Community</NavLink>
        <NavLink to="/app/learn" className={navClasses}>Learn</NavLink>
        <NavLink to="/app/support" className={navClasses}>Support</NavLink>
      </div>

      {/* Right: Logout + Logo */}
      <div className="flex items-center space-x-4 h-full">
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
        <img src={Logo} alt="brand" className="w-20 h-20 object-cover max-h-full shrink-0" />
      </div>
    </nav>
  );
};

export default Navbar;
