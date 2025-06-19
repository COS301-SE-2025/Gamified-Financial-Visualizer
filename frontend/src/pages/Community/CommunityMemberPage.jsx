// src/pages/Community/CommunityMemberPage.jsx
import React from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

const mockMember = {
  username: 'satoshi_nak',
  level: 'Silver',
  xp: 5200,
  avatar: '/images/avatars/satoshi.png',
  badges: ['💰', '🎯', '🌱', '🏆'],
  challenges: [
    { title: 'Save R5000 in 30 Days', status: 'Completed' },
    { title: 'Track Spending Daily', status: 'In Progress' },
    { title: '3 Community Posts', status: 'Completed' },
  ],
};

const CommunityMemberPage = () => {
  return (
    <CommunityLayout>
      <div className="space-y-6">
        <CommunityHeader />

        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={mockMember.avatar}
            alt={mockMember.username}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-3xl font-bold">{mockMember.username}</h2>
            <p className="text-sm text-gray-600">
              Level: {mockMember.level} • XP: {mockMember.xp}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">🏅 Badges</h3>
          <div className="flex gap-4 text-2xl">
            {mockMember.badges.map((badge, i) => (
              <div key={i} className="bg-gray-100 p-3 rounded-full">{badge}</div>
            ))}
          </div>
        </div>

        {/* Recent Challenges */}
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">📋 Recent Challenges</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {mockMember.challenges.map((c, i) => (
              <li key={i}>
                {c.title}{' '}
                <span
                  className={`ml-2 font-medium ${
                    c.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'
                  }`}
                >
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityMemberPage;
