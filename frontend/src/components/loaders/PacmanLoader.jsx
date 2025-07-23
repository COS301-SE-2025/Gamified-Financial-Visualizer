import React from 'react';

const PacmanLoader = () => {
  return (
    <div className="relative w-[120px] h-[60px] mx-auto my-10">
      {/* Pacman top jaw */}
      <div className="absolute left-[30px] top-1/2 w-[50px] h-[25px] bg-[#AAD977] rounded-t-full animate-pacman-top origin-bottom -translate-x-1/2 -translate-y-1/2 z-10"></div>

      {/* Pacman bottom jaw */}
      <div className="absolute left-[30px] top-1/2 w-[50px] h-[25px] bg-[#AAD977] rounded-b-full animate-pacman-bottom origin-top -translate-x-1/2 translate-y-1/2 z-10"></div>

      {/* Coins */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[90px] animate-coin-move1 z-0 text-yellow-600 w-5 h-5 flex justify-center items-center bg-[#FFD18C] border-t-2 border-yellow-500 rounded-full">
        $
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[60px] animate-coin-move1 z-0 text-yellow-600 w-5 h-5 flex justify-center items-center bg-[#FFD18C] border-t-2 border-yellow-500 rounded-full">
        $
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[30px] animate-coin-move1 z-0 text-yellow-600 w-5 h-5 flex justify-center items-center bg-[#FFD18C] border-t-2 border-yellow-500 rounded-full">
        $
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[10px] animate-coin-scale z-0 text-yellow-600 w-5 h-5 flex justify-center items-center bg-[#FFD18C] border-t-2 border-yellow-500 rounded-full">
        $
      </div>
    </div>
  );
};

export default PacmanLoader;
