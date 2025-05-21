import React from 'react';
import Logo from '../assets/Images/Logo.png';
import User from '../assets/Images/pixelWindow.gif';

const Navbar = () => {
  return (
    <nav className="bg-white h-16 px-6 py-2 flex items-center justify-between border-b shadow-sm">
      {/* Left: Logo + User Info */}
      <div className="flex items-center space-x-4">
        <img src={User} alt="logo" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Lebo</p>
          <p className="text-xs text-gray-400">Silver</p>
        </div>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center space-x-8 text-sm font-medium text-gray-700">
        <a href="#" className="hover:text-green-600">Home</a>
        <a href="#" className="hover:text-green-600">Transactions</a>
        <a href="#" className="hover:text-green-600">Goals</a>
        <a href="#" className="text-green-600 border-b-2 border-green-600 pb-1">Community</a>
        <a href="#" className="hover:text-green-600">Learn</a>
        <a href="#" className="hover:text-green-600">Support</a>
      </div>

      {/* Right: Logout Button + Brand Icon */}
      <div className="flex items-center space-x-4 h-full">
        <button className="bg-gradient-to-r from-green-300 to-green-500 text-white px-4 py-1 rounded-full shadow hover:from-green-400 hover:to-green-600">
          Logout
        </button>
        <img
          src={Logo}
          alt="brand"
          className="w-20 h-20 object-cover max-h-full shrink-0"
        />
      </div>

    </nav>
  );
};

export default Navbar;
