import React from 'react';
import { FaCrown, FaArrowRight, FaUsers, FaBullseye, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import bannerImg from '../../assets/Images/banners/pixelStore.gif';
import avatarImg from '../../assets/Images/avatars/totoroAvatar.jpeg';

// Charts 
import XPProgressRing from '../../components/charts/XPProgressRing';
import MonthlyBarChart from '../../components/charts/MonthlyBarChart';

// Community Icons 
import community1 from '../../assets/Images/banners/pixelHouse.gif';
import community2 from '../../assets/Images/banners/pixelBalcony.gif';
import community3 from '../../assets/Images/banners/pixelApartment.gif';
import community4 from '../../assets/Images/banners/pixelStudents.jpeg';

// Community Member Icons 
import av1 from '../../assets/Images/avatars/catAvatar.jpeg';
import av2 from '../../assets/Images/avatars/flowerAvatar.jpeg';
import av3 from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import av4 from '../../assets/Images/avatars/totoroAvatar.jpeg';
import av5 from '../../assets/Images/avatars/pinkskyAvatar.jpeg';
import av6 from '../../assets/Images/avatars/carAvatar.jpeg';
import av7 from '../../assets/Images/avatars/cottageAvatar.jpeg';
import av8 from '../../assets/Images/avatars/ghostAvatar.jpeg';

const Overview = () => {
  const communityCards = [
    { 
      name: 'Savings Squad', 
      image: community1, 
      xp: 4504, 
      members: 8, 
      goals: 9,
      avatars: [av1, av2, av3] 
    },
    { 
      name: 'Investment Guild', 
      image: community2, 
      xp: 4524, 
      members: 12, 
      goals: 15,
      avatars: [av3, av4, av1] 
    },
    { 
      name: 'Budget Masters', 
      image: community3, 
      xp: 7806, 
      members: 24, 
      goals: 18,
      avatars: [av5, av6, av2, av3] 
    },
    { 
      name: 'Student Financers', 
      image: community4, 
      xp: 2581, 
      members: 5, 
      goals: 7,
      avatars: [av7, av8] 
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Banner with Avatar */}
      <motion.div 
        className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Banner Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={bannerImg}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>

        {/* Avatar and User Info */}
        <div className="absolute left-6 -bottom-16 flex items-end gap-4">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden">
              <img
                src={avatarImg}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-1 shadow-md">
              <FaCrown size={16} />
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200 mb-4">
            <h1 className="text-xl font-bold text-gray-800">satoshi_nak</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-600">Lv. Silver</span>
              <span className="text-xs text-red-500 font-medium">Joined: 21/07/2027</span>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-20"></div>
      </motion.div>

      {/* XP Progress Section */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" /> Level Progress
          </h2>
          <p className="text-sm text-gray-600">500 XP to next level</p>
        </div>
        
        <div className="relative w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-sm font-medium text-gray-700">5,200 XP</span>
          <span className="text-sm font-medium text-gray-700">6,000 XP</span>
        </div>
      </motion.div>

      {/* Stats Dashboard */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Monthly Progress</h3>
          <MonthlyBarChart />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">XP Breakdown</h3>
          <XPProgressRing xp={350} total={1000} />
        </div>
      </motion.div>

      {/* Active Communities */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-indigo-500" /> Your Communities
          </h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            View all <FaArrowRight size={12} />
          </button>
        </div>

        <div className="space-y-4">
          {communityCards.map((comm, i) => (
            <motion.div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              whileHover={{ y: -3 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={comm.image}
                      alt={comm.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{i+1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">{comm.name}</h3>
                    <div className="flex gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FaUsers size={10} /> {comm.members}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FaBullseye size={10} /> {comm.goals}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {comm.avatars.map((av, j) => (
                      <div key={j} className="relative group">
                        <img
                          src={av}
                          alt={`Member ${j+1}`}
                          className="w-9 h-9 rounded-full border-2 border-white object-cover shadow"
                        />
                        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-indigo-400 transition-all"></div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-1">
                    View <FaArrowRight size={12} />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaTrophy size={10} className="text-yellow-800" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{comm.xp} XP</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Last active: {Math.floor(Math.random() * 12) + 1}h ago
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;