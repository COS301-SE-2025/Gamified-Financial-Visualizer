import React from 'react';
import { motion } from 'framer-motion';
import backgroundImg from '../assets/Images/pixelWoodShop.gif';

const AuthLayout = ({ children, reverse = false }) => {
  const greenPanelStyle = {
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {reverse ? (
        <>
          <motion.div className="w-[40%] flex items-center justify-center bg-white px-10">
            {children}
          </motion.div>
          <motion.div
            className="w-[60%] relative text-white flex items-center justify-center"
            style={greenPanelStyle}
          >
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl font-bold drop-shadow-lg">Welcome to Gamified Finance!</h1>
              <p className="text-lg mt-2 max-w-md drop-shadow-md">
                Where Saving is a Quest, Spending is Strategy, and Every Goal Levels You Up
              </p>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            className="w-[60%] relative text-white flex items-center justify-center"
            style={greenPanelStyle}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"> 
              <h1 className="text-3xl font-bold drop-shadow-lg">Welcome to Gamified Finance!</h1>
              <p className="text-lg mt-2 max-w-md drop-shadow-md">
                Where Saving is a Quest, Spending is Strategy, and Every Goal Levels You Up
              </p>
            </div>
          </motion.div>
          <motion.div className="w-[40%] flex items-center justify-center bg-white px-10">
            {children}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AuthLayout;
