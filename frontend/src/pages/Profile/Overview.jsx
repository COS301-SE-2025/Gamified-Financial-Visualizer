import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaChartLine, FaEye, FaMedal, FaFire, FaTrophy, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Profile banner
import profileBanner from '../../assets/Images/banners/pixelStore.gif';

// Badges Images      // Top-left icon
import silverMedal from '../../assets/Images/badges/plantIocn.png';      // For "Silver"
import fireStreak from '../../assets/Images/badges/notesIcon.png';        // For "Streak"
import accuracyTarget from '../../assets/Images/badges/CoinStack.png'; // For "Accuracy"

// Community banner images
import comm1 from '../../assets/Images/banners/pixelApartment.gif';
import comm2 from '../../assets/Images/banners/pixelGirlAlly.gif';
import comm3 from '../../assets/Images/banners/pixelStudents.jpeg';
import comm4 from '../../assets/Images/banners/pixelWindow.gif';

// Avatar images
import avatar1 from '../../assets/Images/avatars/catAvatar.jpeg';
import avatar2 from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import avatar3 from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import avatar4 from '../../assets/Images/avatars/totoroAvatar.jpeg';
import avatar5 from '../../assets/Images/avatars/pinkskyAvatar.jpeg';
import avatar6 from '../../assets/Images/avatars/boatAvatar.jpeg';
import avatar7 from '../../assets/Images/avatars/ghostAvatar.jpeg';
import avatar8 from '../../assets/Images/avatars/boatAvatar.jpeg';
import avatar9 from '../../assets/Images/avatars/totoroAvatar.jpeg';
import avatar10 from '../../assets/Images/avatars/ladyAvatar.jpeg';
import avatar11 from '../../assets/Images/avatars/carAvatar.jpeg';
import avatar12 from '../../assets/Images/avatars/butterflyAvatar.jpeg';


const Overview = () => {
  const [setShowXpAnimation] = useState(false);
  const navigate = useNavigate();

  // Mock user data
  const userStats = {
    xp: 350,
    level: 2,
    nextLevelXp: 500,
    portfolioValue: 200000,
    username: "Satoshi_nak",
    tier: "Silver",
    achievements: [
      { id: 1, name: 'Silver Rank', icon: <FaMedal />, earned: true },
      { id: 2, name: 'Hot Streak', icon: <FaFire />, earned: true },
      { id: 3, name: 'Sharpshooter', icon: <FaStar />, earned: false }
    ],
    stats: {
      accuracy: 83,
      leaderboardRank: 2,
      outzoneChallenges: 55,
      goalsCompleted: 8,
      goalsTotal: 14
    }
  };

  // Community posts
  const userPosts = [
    { id: 1, image: comm1 },
    { id: 2, image: comm2 },
    { id: 3, image: comm3 },
    { id: 4, image: comm4 },
    { id: 5, image: profileBanner },
    { id: 6, image: comm2 },
    { id: 7, image: comm1 },
  ];

  // Active community data
  const communityData = [
    {
      id: 'Happy Savers',
      name: 'Happy Savers',
      image: comm1,
      members: 8,
      goals: 9,
      xp: 4504,
      avatars: [avatar1, avatar2, avatar3]
    },
    {
      id: 'Happy Savers',
      name: 'Money Makers',
      image: comm2,
      members: 8,
      goals: 9,
      xp: 4504,
      avatars: [avatar4, avatar5, avatar6]
    },
    {
      id: 'Happy Savers',
      name: 'Heists 101',
      image: comm3,
      members: 8,
      goals: 9,
      xp: 4504,
      avatars: [avatar7, avatar8, avatar9]
    },
    {
      id: 'Happy Savers',
      name: 'The Investors',
      image: comm4,
      members: 8,
      goals: 9,
      xp: 4504,
      avatars: [avatar10, avatar11, avatar12]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-2 pb-2 space-y-4">
      {/* Profile Banner Section */}
      <div className="relative">
        {/* Banner Image */}
        <img
          src={profileBanner}
          alt="profile-banner"
          className="w-full h-60 object-cover rounded-2xl"
        />

        {/* Avatar + Username container */}
        <div className="absolute -bottom-10 left-6 flex items-center gap-4">
          {/* Avatar */}
          <img
            src={avatar4}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
          />

          {/* Username and Join date card */}
          <div className="bg-white shadow-md px-4 py-2 rounded-full flex items-center gap-3">
            <p className="text-lg font-medium text-gray-800">{userStats.username}</p>
            <p className="text-sm italic text-[#F28B82]">Joined: <span className="font-medium">21/07/2027</span></p>
          </div>
        </div>
      </div>

      {/* Add margin below to push content down */}
      <div className="h-4" />

      {/* Level Progress Card */}
      <div className="bg-white p-6 rounded-3xl shadow flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          {/* Current Level Circle */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-yellow-400 text-yellow-600 font-bold flex items-center justify-center shadow-sm">
              {userStats.level}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Lv {userStats.tier}</p>
              <p className="text-sm text-gray-500">500 Points to next level</p>
            </div>
          </div>

          {/* Target Level Circle */}
          <div className="w-10 h-10 rounded-full bg-[#f8e5b5] text-yellow-600 font-bold flex items-center justify-center shadow-sm">
            4
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-2">
          <div className="w-full h-6 bg-yellow-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-[#FFCE51] rounded-full"
              style={{ width: `${(userStats.xp / 6000) * 100}%` }}
            />
          </div>
          <div className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-yellow-700">
            {userStats.xp}<span className="text-yellow-500">/6000</span>
          </div>
        </div>
      </div>


      {/* Middle Row - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Stats Tiles */}
        <div className="space-y-5">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm  hover:border-[#4d7c0f] transition-all relative overflow-hidden group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#88BC46] group-hover:text-[#88BC46] transition-colors">
                <FaChartLine className="w-10 h-10 text-2xl" />
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-[#1f2937]">Performance Stats</p>
                <p className="text-sm text-[#4b5563]">Your trading metrics</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { value: `${userStats.stats.accuracy}%`, label: 'Accuracy', color: 'text-[#88BC46]' },
                { value: `#${userStats.stats.leaderboardRank}`, label: 'Leaderboard', color: 'text-[#72C1F5]' },
                { value: userStats.stats.outzoneChallenges, label: 'Challenges', color: 'text-[#FF4080]' },
                { value: `${userStats.stats.goalsCompleted}/${userStats.stats.goalsTotal}`, label: 'Goals', color: 'text-yellow-600' }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-[#fce7f3] transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-[#F3B14E] shadow-inner">
                <div className="w-10 h-10 flex items-center justify-center text-[#F3B14E]">
                  <FaTrophy className="w-16 h-16 text-xl" />
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">Recent Achievements</p>
                <p className="text-sm text-gray-500">Earned rewards</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: silverMedal,
                  title: 'Silver',
                  xp: '+200 XP',
                  earned: true
                },
                {
                  icon: fireStreak,
                  title: 'Streak',
                  xp: '+50 XP',
                  earned: true
                },
                {
                  icon: accuracyTarget,
                  title: 'Accuracy',
                  xp: '+150 XP',
                  earned: true
                }
              ].map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`rounded-xl p-4 text-center border-2 transition-all ${a.earned
                    ? 'bg-white border-[#AAD977] shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div className="h-20 w-20 rounded-full">
                    <img
                      src={a.icon}
                      alt={a.title}
                      width={32}
                      height={32}
                      className={`object-contain h-full w-auto ${!a.earned && 'opacity-40 grayscale'
                        }`}
                    />
                  </div>
                  <p
                    className={`text-sm font-semibold ${a.earned ? 'text-gray-800' : 'text-gray-400'
                      }`}
                  >
                    {a.title}
                  </p>
                  {a.earned && (
                    <p className="text-xs text-yellow-600 font-medium mt-2 bg-yellow-100/50 px-2 py-1 rounded-full inline-block">
                      {a.xp}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Goals Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#ffffff] p-6 rounded-3xl shadow-md h-full"
        >
          <h2 className="text-xl font-bold text-[#1f2937] mb-4 flex items-center gap-2">
            <FaStar className="text-[#FFBF1A]" /> Current Goals
          </h2>

          <div className="space-y-4">
            {[
              { title: "Complete 5 trades", progress: 3, target: 5, xp: 50 },
              { title: "Reach Gold Tier", progress: 350, target: 1000, xp: 200 },
              { title: "7-day streak", progress: 5, target: 7, xp: 100 }
            ].map((goal, i) => (
              <div key={i} className="bg-[#fef9c3]/30 p-4 rounded-xl border border-[#fef08a]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{goal.title}</h3>
                  <span className="text-xs bg-[#fef9c3] text-[#92400e] px-2 py-1 rounded-full border border-[#fde047]">
                    +{goal.xp} XP
                  </span>
                </div>
                <div className="w-full bg-[#f3f4f6] rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#facc15] to-[#fb923c] h-2 rounded-full"
                    style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {goal.progress}/{goal.target} ({Math.round((goal.progress / goal.target) * 100)}%)
                </p>
              </div>
            ))}
          </div>

          <button
            className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-[#FFBF1A] to-[#FFD18C] hover:from-[#f59e0b] hover:to-[#fbbf24] text-white font-medium rounded-full shadow transition-all"
            onClick={() => setShowXpAnimation(true)}
          >
            View All Goals
          </button>
        </motion.div>
      </div>

      {/* Bottom Row - Active Communities */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-6 rounded-3xl shadow-md"
      >
        <h2 className="text-xl font-bold text-[#1f2937] mb-6 flex items-center gap-2">
          <FaCrown className="text-[#fb923c]" /> Active Communities
        </h2>

        <div className="space-y-4">
          {communityData.map((community, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-4"
            >
              {/* Left side */}
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

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Avatars */}
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

                {/* View Button */}
                <button
                  onClick={() => navigate(`/community/details/${community.id}`)}
                  className="flex items-center gap-2 bg-[#AAD977] text-white font-medium text-sm px-4 py-1.5 rounded-full hover:bg-[#83AB55] transition-all"
                >
                  <FaEye /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Grid – User Posts */}
      {/* Bottom Grid – User Posts */}
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h2 className="text-lg font-bold text-[#1f2937] mb-4">My Posts</h2>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-xl shadow-sm max-w-[110px] mx-auto"
            >
              <img
                src={post.image}
                alt={`post-${post.id}`}
                className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300" />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Overview;