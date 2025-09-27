import React from 'react';
import { motion } from 'framer-motion';
import backgroundImg from '../assets/Images/banners/pixelWoodShop.gif';

const AuthLayout = ({ children, reverse = false }) => {
  const greenPanelStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      {/* Mobile & Tablet: Only show forms, no image panel */}
      
      {/* Desktop: Green panel (left/right based on reverse prop) */}
      <motion.div
        className="hidden lg:flex lg:w-[60%] relative text-white items-center justify-center"
        style={greenPanelStyle}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold drop-shadow-lg">Welcome to Gamified Finance!</h1>
          <p className="text-lg mt-2 max-w-md drop-shadow-md">
            Where Saving is a Quest, Spending is Strategy, and Every Goal Levels You Up
          </p>
        </div>
      </motion.div>

      {/* Mobile & Tablet: Full screen form, Desktop: 40% width - KEEP ORIGINAL SPACING */}
      <motion.div 
        className="w-full lg:w-[40%] flex items-center justify-center bg-white px-10 py-6 overflow-y-auto"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;