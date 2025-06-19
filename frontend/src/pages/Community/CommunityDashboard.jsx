import React from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaFire, FaTrophy, FaLeaf, FaHandsHelping, FaCoins, FaBell, FaChartLine, FaUsers } from 'react-icons/fa';

const CommunityDashboard = () => {
  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto space-y-6 px-4 py-6">
        <CommunityHeader />

        {/* XP Progress Card */}
        <div className="bg-gradient-to-r from-[#FFD18C] to-[#FFBF1A] p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <FaTrophy className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Big Saver Challenge</h2>
                <p className="text-sm text-white/90">Complete 5 savings goals to earn 500 XP</p>
              </div>
            </div>
            <div className="bg-white text-[#FF4C28] px-4 py-2 rounded-full font-bold">
              5/5
            </div>
          </div>
          <div className="mt-4 w-full bg-white/30 rounded-full h-2.5">
            <div 
              className="bg-white h-2.5 rounded-full" 
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="/images/avatars/satoshi.png"
                alt="user"
                className="w-20 h-20 rounded-full object-cover border-4 border-[#72C1F5]"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#FF4C28] text-white text-xs font-bold px-2 py-1 rounded-full">
                Silver
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">@satoshi_nak</h2>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-[#88BC46] h-2.5 rounded-full" 
                      style={{ width: `${(5200/6000)*100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">5,200 / 6,000 XP to next level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="bg-[#f8fafc] p-3 rounded-xl text-center">
              <div className="bg-[#B1E1FF] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaCoins className="text-[#72C1F5] text-lg" />
              </div>
              <p className="text-xs text-gray-500">Savings</p>
              <p className="font-bold text-gray-800">12</p>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-xl text-center">
              <div className="bg-[#FFD6E5] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaLeaf className="text-[#FF4080] text-lg" />
              </div>
              <p className="text-xs text-gray-500">Goals</p>
              <p className="font-bold text-gray-800">7</p>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-xl text-center">
              <div className="bg-[#E2F0D5] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaHandsHelping className="text-[#88BC46] text-lg" />
              </div>
              <p className="text-xs text-gray-500">Helped</p>
              <p className="font-bold text-gray-800">24</p>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-xl text-center">
              <div className="bg-[#FFEECC] w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaFire className="text-[#FFBF1A] text-lg" />
              </div>
              <p className="text-xs text-gray-500">Streak</p>
              <p className="font-bold text-gray-800">14d</p>
            </div>
          </div>
        </div>

        {/* New Notifications Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
            <button className="text-sm text-[#72C1F5] font-medium">View All</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-[#FFEECC] p-2 rounded-full">
                <FaBell className="text-[#FFBF1A]" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Your savings goal is 80% complete!</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="bg-[#E2F0D5] p-2 rounded-full">
                <FaUsers className="text-[#88BC46]" />
              </div>
              <div>
                <p className="font-medium text-gray-800">5 new members joined your community</p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Featured Community</h2>
            <button className="text-sm text-[#72C1F5] font-medium">View All</button>
          </div>

          <div className="flex items-center gap-5 p-4 bg-[#f8fafc] rounded-xl">
            <div className="relative">
              <img
                src="/images/avatars/snow.png"
                alt="community"
                className="w-16 h-16 rounded-full object-cover border-4 border-[#FF4080]"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#88BC46] text-white text-xs font-bold px-2 py-1 rounded-full">
                Platinum
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">@snow</h2>
              <p className="text-sm text-gray-500 mb-2">Financial independence advocate</p>
              <div className="flex items-center gap-2">
                <span className="bg-[#FFD18C] text-[#b45309] px-2 py-1 rounded-full text-xs">
                  12.5k members
                </span>
                <span className="bg-[#B1E1FF] text-[#1d4ed8] px-2 py-1 rounded-full text-xs">
                  Active now
                </span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow">
              Join
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-[#f8fafc] p-3 rounded-xl">
              <p className="text-xs text-gray-500">Weekly Challenge</p>
              <p className="font-medium text-gray-800">Save R500 this week</p>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-xl">
              <p className="text-xs text-gray-500">Top Contributor</p>
              <p className="font-medium text-gray-800">@crypto_queen</p>
            </div>
          </div>
        </div>

        {/* New Financial Tips Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Financial Tips</h2>
            <button className="text-sm text-[#72C1F5] font-medium">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-xl">
              <div className="bg-[#72C1F5] p-3 rounded-lg text-white">
                <FaChartLine size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">The 50/30/20 Rule</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Allocate 50% to needs, 30% to wants, and 20% to savings for balanced budgeting.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-[#f8fafc] rounded-xl">
              <div className="bg-[#88BC46] p-3 rounded-lg text-white">
                <FaCoins size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Automate Savings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Set up automatic transfers to savings right after payday to pay yourself first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityDashboard;