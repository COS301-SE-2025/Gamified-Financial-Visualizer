// src/pages/Community/CommunityDetail.jsx
import React from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

const mockMembers = [
  { name: 'ayaka', xp: 5100, avatar: '/images/avatars/ayaka.png' },
  { name: 'moonrider', xp: 4300, avatar: '/images/avatars/moon.png' },
  { name: 'zuluX', xp: 3700, avatar: '/images/avatars/zulu.png' },
];

const CommunityDetail = () => {
  return (
    <CommunityLayout>
      <div className="space-y-6">
        <CommunityHeader />
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src="/images/avatars/snow.png"
            alt="community"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-3xl font-bold">🌨 Snow Community</h2>
            <p className="text-gray-600 text-sm">Level: Platinum • Total XP: 14,300</p>
          </div>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow flex items-center gap-4"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.xp} XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityDetail;
