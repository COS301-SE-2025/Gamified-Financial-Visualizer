import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaChartLine, FaStar, FaArrowLeft, FaCrown, FaEye, FaMedal, FaUserPlus, FaUserMinus, FaPaperPlane } from 'react-icons/fa';

import profileBanner from '../../assets/Images/banners/pixelCornerStore.gif';
import avatar4 from '../../assets/Images/avatars/beachAvatar.jpeg';
import comm1 from '../../assets/Images/banners/pixelApartment.gif';
import comm2 from '../../assets/Images/banners/pixelGirlAlly.gif';
import comm3 from '../../assets/Images/banners/pixelStudents.jpeg';

// badges
import streakIcon from '../../assets/Images/badges/CoinStack.png';
import budgetIcon from '../../assets/Images/badges/moneyGrowIcon.png';
import explorerIcon from '../../assets/Images/badges/plantIocn.png';

const mockMember = {
  username: 'beached_in',
  level: 'Silver',
  joined: '2024-10-12',
  xp: 5200,
  tier: 'Silver',
  avatar: avatar4,
  stats: {
    accuracy: 81,
    leaderboardRank: 5,
    outzoneChallenges: 32,
    goalsCompleted: 7,
    goalsTotal: 10,
    learningModulesCompleted: 14,
    achievements: 3,
  },
  achievements: [
    { title: 'Streak Master', detail: '7-day goal streak', xp: 75, icon: streakIcon },
    { title: 'Budget Boss', detail: 'Completed monthly savings goal', xp: 100, icon: budgetIcon },
    { title: 'Explorer', detail: 'Joined 3 communities', xp: 50, icon: explorerIcon },
  ],
  communities: [
    {
      name: 'Cash Cows',
      image: comm1,
      members: 8,
      goals: 9,
      xp: 4504,
      avatars: [avatar4, avatar4, avatar4]
    },
    {
      name: 'Coupon Crew',
      image: comm2,
      members: 6,
      goals: 5,
      xp: 3020,
      avatars: [avatar4, avatar4]
    },
    {
      name: 'Money Maniacs',
      image: comm3,
      members: 9,
      goals: 7,
      xp: 3890,
      avatars: [avatar4, avatar4, avatar4]
    },
  ],
};

const CommunityMemberPage = () => {
  const [isFriend, setIsFriend] = useState(false); // Track friend status
  const navigate = useNavigate();

  const handleFriendRequest = () => {
    toast.success(`Friend request sent to @${mockMember.username}`, {
      icon: <FaPaperPlane className="text-[#1E3A8A]" />,
      style: {
        borderRadius: '9999px',
        background: '#B1E1FF',
        color: '#1E3A8A',
      },
    });
    setIsFriend(true);
  };

  const handleRemoveFriend = () => {
    toast.success(`@${mockMember.username} removed from your friends list`, {
      icon: <FaUserMinus className="text-[#7F1D1D]" />,
      style: {
        borderRadius: '9999px',
        background: '#FE9B90',
        color: '#FFFFFF',
      },
    });
    setIsFriend(false);
  };

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        {/* Search bar */}

        <CommunityHeader />

        {/* Profile Banner */}
        <div className="relative">
          <img src={profileBanner} alt="banner" className="w-full h-40 object-cover rounded-2xl" />
          <div className="absolute -bottom-10 left-6 flex items-center gap-4">
            <img
              src={mockMember.avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
            />
            <div className="bg-white shadow-md px-4 py-2 rounded-full flex items-center gap-3">
              <p className="text-lg font-medium text-gray-800">{mockMember.username}</p>
              <p className="text-sm italic text-[#F28B82]">Joined: <span className="font-medium">{mockMember.joined}</span></p>
            </div>
          </div>
          
          {/* Action buttons moved to right side */}
          <div className="absolute right-6 -bottom-10 flex justify-end gap-3">
            {!isFriend ? (
              <button
                onClick={handleFriendRequest}
                className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition"
              >
                <FaPaperPlane /> Request
              </button>
            ) : (
              <button
                onClick={handleRemoveFriend}
                className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FA8B81] text-white shadow hover:bg-[#f56a5a] transition"
              >
                <FaUserMinus /> Remove
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white p-6 rounded-3xl shadow flex flex-col gap-4 mt-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-400 text-yellow-600 font-bold flex items-center justify-center shadow-sm">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Lv {mockMember.tier}</p>
                <p className="text-sm text-gray-500">800 Points to next level</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f8e5b5] text-yellow-600 font-bold flex items-center justify-center shadow-sm">
              4
            </div>
          </div>

          <div className="relative mt-2">
            <div className="w-full h-6 bg-yellow-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-[#FFCE51] rounded-full"
                style={{ width: `${(mockMember.xp / 6000) * 100}%` }}
              />
            </div>
            <div className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-yellow-700">
              {mockMember.xp}<span className="text-yellow-500">/6000</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Performance stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <FaChartLine className="text-[#88BC46] text-2xl" />
              <div>
                <p className="text-lg font-semibold text-gray-800">Performance Stats</p>
                <p className="text-sm text-gray-500">User metrics overview</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: `${mockMember.stats.accuracy}%`, label: 'Accuracy', color: 'text-[#88BC46]' },
                { value: `#${mockMember.stats.leaderboardRank}`, label: 'Leaderboard', color: 'text-[#72C1F5]' },
                { value: mockMember.stats.outzoneChallenges, label: 'Challenges', color: 'text-[#FF4080]' },
                { value: `${mockMember.stats.goalsCompleted}/${mockMember.stats.goalsTotal}`, label: 'Goals', color: 'text-[#FFBF1A]' },
                { value: mockMember.stats.learningModulesCompleted, label: 'Modules Learned', color: 'text-[#FF8C3C]' },
                { value: mockMember.stats.achievements, label: 'Achievements', color: 'text-[#EF4444]' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-[#1f2937] mb-4 flex items-center gap-2">
              <FaMedal className="text-[#FBBF24]" /> Recent Achievements
            </h2>

            <div className="space-y-4">
              {mockMember.achievements.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-[#FFFFFF] p-4 rounded-xl border-2 border-[#FFD18C]"
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <span className="text-xs bg-[#fef9c3] text-[#92400e] px-2 py-1 rounded-full border border-[#fde047]">
                        +{item.xp} XP
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shared Communities */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-xl font-bold text-[#1f2937] mb-6 flex items-center gap-2">
            <FaCrown className="text-[#fb923c]" /> Shared Communities
          </h2>

          <div className="space-y-4">
            {mockMember.communities.map((community, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />
                  <div>
                    <p className="text-lg font-medium text-gray-800">{community.name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                        {community.members} Members
                      </span>
                      <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                        {community.goals} Goals
                      </span>
                      <span className="bg-[#FEF9C3] text-yellow-500 text-xs font-medium px-3 py-1 rounded-full">
                        {community.xp} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {community.avatars.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <Link to={`/community/details/${community.name.toLowerCase().replace(/\s+/g, '_')}`}>
                    <button className="flex items-center gap-2 bg-[#AAD977] text-white font-medium text-sm px-4 py-1.5 rounded-full hover:bg-[#83AB55] transition-all">
                      <FaEye /> View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityMemberPage;