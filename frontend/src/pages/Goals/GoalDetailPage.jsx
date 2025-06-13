import React from 'react';
import { FaTrashAlt, FaUmbrellaBeach } from 'react-icons/fa';
import GoalsViewLayout from '../../pages/Goals/GoalsViewLayout';
import image from '../../assets/Images/banners/pixelStore.gif';

const GoalsDetailPage = () => {
  const percentage = 50;

  return (
    <GoalsViewLayout>
      <div className="flex gap-6 justify-center mt-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-start gap-6">
            {/* Goal Image */}
            <img src={image} alt="Goal" className="rounded-xl w-1/3 object-cover shadow" />

            {/* Goal Info */}
            <div className="flex-1 space-y-2">
              {/* Progress Ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#F3F4F6"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#grad1)"
                      strokeWidth="10"
                      strokeDasharray="282"
                      strokeDashoffset={282 - (282 * percentage) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="40%" stopColor="#FF4C28" />
                        <stop offset="100%" stopColor="#FFCE51" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-orange-500 font-bold text-lg">{percentage}%</span>
                  </div>
                </div>

                {/* Title + Progress Info */}
                <div>
                  <h2 className="text-2xl font-medium text-gray-800 flex items-center gap-2">
                    Vacation - Bali <FaUmbrellaBeach className="text-[#AAD977]" />
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="text-[#ED5E52] font-medium">2000</span>/
                    <span className="text-gray-800 font-normal">4000 ZAR</span> |
                    <span className="text-[#5FBFFF] font-semibold ml-1">2000 ZAR Left</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Goal will be accomplished on{' '}
                    <span className="text-[#E6904E] font-semibold">21/07/2027</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-[#4B82A2] text-xs rounded-full shadow-sm">In-Progress</span>
                    <span className="px-3 py-1 border border-orange-400 text-orange-500 text-xs rounded-full shadow-sm">Vacation</span>
                    <span className="px-3 py-1 border border-[#E6904E] text-[#E6904E] text-xs rounded-full shadow-sm">Savings</span>
                    <span className="px-3 py-1 border border-gray-300 text-gray-500 text-xs rounded-full shadow-sm">17/03/2025</span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full shadow-sm">200 XP Reward</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div className="mt-6 text-right">
            <button className="px-5 py-2 bg-red-100 text-red-500 hover:bg-red-200 rounded-full flex items-center gap-2 text-sm font-medium">
              <FaTrashAlt /> Delete
            </button>
          </div>
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsDetailPage;