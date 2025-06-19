// src/pages/Community/ChallengesPage.jsx
import React from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaFire, FaTrophy, FaCheckCircle, FaClock, FaCoins, FaChartLine } from 'react-icons/fa';

const mockChallenges = [
  {
    id: 1,
    title: '💰 Save R5000 in 30 days',
    description: 'Reach your savings goal and build financial discipline',
    status: 'Active',
    reward: '100 XP + Bronze Badge',
    daysLeft: 12,
    progress: 65,
    participants: 342,
    difficulty: 'Medium'
  },
  {
    id: 2,
    title: '📉 Track all spending for 7 days',
    description: 'Record every expense to understand your spending habits',
    status: 'Upcoming',
    reward: '50 XP',
    startsIn: 3,
    participants: 128,
    difficulty: 'Easy'
  },
  {
    id: 3,
    title: '🎯 Complete 3 goals this month',
    description: 'Achieve multiple financial targets in one month',
    status: 'Completed',
    reward: '200 XP + Silver Badge',
    completedOn: '2025-06-10',
    participants: 567,
    difficulty: 'Hard'
  },
  {
    id: 4,
    title: '💸 No spend weekend',
    description: 'Avoid unnecessary purchases for an entire weekend',
    status: 'Active',
    reward: '75 XP',
    daysLeft: 2,
    progress: 90,
    participants: 421,
    difficulty: 'Easy'
  },
];

const getStatusIcon = (status) => {
  switch(status) {
    case 'Active': return <FaFire className="text-orange-500" />;
    case 'Upcoming': return <FaClock className="text-yellow-500" />;
    case 'Completed': return <FaCheckCircle className="text-green-500" />;
    default: return <FaChartLine className="text-blue-500" />;
  }
};

const ChallengesPage = () => {
  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <CommunityHeader />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Community Challenges</h2>
            <p className="text-gray-600">Join challenges to earn rewards and improve your finances</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
            <FaTrophy /> Create Challenge
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-5 rounded-2xl shadow border transition-all hover:shadow-lg ${
                challenge.status === 'Active'
                  ? 'bg-gradient-to-br from-green-50 to-white border-green-200'
                  : challenge.status === 'Upcoming'
                  ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200'
                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                    {getStatusIcon(challenge.status)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-800">{challenge.title}</h3>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                      <FaCoins className="text-yellow-500" />
                      <span className="text-sm font-medium">{challenge.reward}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-1">{challenge.description}</p>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {challenge.status === 'Active' && (
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{challenge.progress}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.difficulty === 'Easy' 
                          ? 'bg-green-100 text-green-800' 
                          : challenge.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span>•</span>
                      <span>👥 {challenge.participants} participants</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  {challenge.status === 'Active' && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <FaFire size={14} /> Active • {challenge.daysLeft} days left
                    </span>
                  )}
                  {challenge.status === 'Upcoming' && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <FaClock size={14} /> Starts in {challenge.startsIn} days
                    </span>
                  )}
                  {challenge.status === 'Completed' && (
                    <span className="flex items-center gap-1 text-green-600">
                      <FaCheckCircle size={14} /> Completed on {challenge.completedOn}
                    </span>
                  )}
                </div>
                
                <button className={`text-sm px-4 py-2 rounded-lg font-medium ${
                  challenge.status === 'Active'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : challenge.status === 'Upcoming'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  {challenge.status === 'Active' ? 'Join Challenge' : 
                   challenge.status === 'Upcoming' ? 'Remind Me' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition">
            Load More Challenges
          </button>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default ChallengesPage;