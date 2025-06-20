import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

// Icons
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

// Avatar Imports
import cindy from '../../assets/Images/avatars/beachAvatar.jpeg';
import shark from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import bear from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import thatsMe from '../../assets/Images/avatars/stonesAvatar.jpeg';
import banner from '../../assets/Images/banners/pixelStudents.jpeg';
import banner1 from '../../assets/Images/banners/pixelGirlAlly.gif';

const mockMembers = [
  { name: 'just_cindy', level: 'Gold', avatar: cindy },
  { name: 'shark', level: 'Gold', avatar: shark },
  { name: 'andy_bear', level: 'Gold', avatar: bear },
  { name: 'thats_me', level: 'Platinum', avatar: thatsMe },
];

const mockChallenges = [
  {
    title: 'Vacation - Bali',
    xp: 1000,
    deadline: '2025-07-20',
    status: '2 Goals Left',
    avatarGroup: [cindy, shark],
  },
  {
    title: 'Vacation - Japan',
    xp: 2000,
    deadline: '2026-10-10',
    status: '4 Goals Left',
    avatarGroup: [bear, thatsMe, cindy],
  },
];

const handleDelete = (itemName) => {
  toast((t) => (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-800">Delete <strong>{itemName}</strong>?</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            toast.success(`Deleted "${itemName}"`);
            // TODO: Actual delete logic here
            console.log(`Deleted ${itemName}`);
          }}
          className="px-4 py-1 text-sm font-semibold text-white bg-[#ED5E52] rounded-full hover:bg-[#FE9B90]"
        >
          Confirm
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-4 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-center',
  });
};


const CommunityDetail = () => {
  const navigate = useNavigate();
  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        {/* Search bar */}
        <CommunityHeader />

        {/* Header */}
        <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center border" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-4">
            <img src={banner} className="w-16 h-16 rounded-full object-cover border" />
            <h2 className="text-2xl font-bold" style={{ color: '#66BFBF' }}>Happy Savers</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-[#E0F2FE] hover:bg-[#BDE0FE] text-[#5FBFFF] px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <FaPlus /> Request
            </button>
            <Link to={`/community/edit/happy_savers`}>
              <button className="flex items-center gap-2 bg-[#B1E1FF] hover:bg-[#4BA5E6] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                Edit
              </button>
            </Link>
            {/* Back Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
              >
                <FaArrowLeft /> Back
              </button>
            </div>

          </div>
        </div>


        {/* Community Members */}
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#4B5563' }}>Community Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockMembers.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border"
                style={{ borderColor: '#E5E7EB' }}
              >
                <img
                  src={member.avatar}
                  className="w-12 h-12 rounded-full border object-cover"
                  alt={member.name}
                />
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#374151' }}>{member.name}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{member.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Challenges */}
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#4B5563' }}>Community Challenges</h3>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {mockChallenges.map((challenge, i) => (
              <div
                key={i}
                className="bg-white p-4 pt-10 rounded-3xl shadow-md border relative"
                style={{ borderColor: '#E5E7EB' }}
              >
                {/* Banner image */}
                <img
                  src={banner1}
                  alt="Challenge"
                  className="absolute -top-8 left-4 w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                />

                {/* Title + Deadline + Status + Tags */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-[#111827]">{challenge.title}</h4>
                    <p className="text-sm text-[#ED5E52] font-medium mt-1">2000/4000 ZAR</p>
                    <p className="text-sm text-[#374151]">2000 ZAR Left</p>
                    <p className="text-sm text-[#6B7280] mt-1">Goal will be accomplished on <span className="text-[#ED5E52] font-semibold">21/07/2027</span></p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs px-4 py-1 rounded-full bg-[#B1E1FF] text-[#4B82A2] font-medium">In-Progress</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-[#FFFFFF] font-medium">Savings</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-[#FFFFFF] font-semibold">{challenge.xp} XP</span>
                  </div>
                </div>

                {/* Avatars */}
                <div className="flex gap-2 mt-4">
                  {challenge.avatarGroup.map((src, j) => (
                    <img
                      key={j}
                      src={src}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <div className="flex-1">
                    <Link to={`/community/challenges/${challenge.id}`}>
                      <button className="w-full bg-[#AAD977] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#83AB55] transition">
                        View
                      </button>
                    </Link>
                  </div>

                  <div className="flex-1">
                    <button
                      onClick={() => handleDelete(challenge.title)}
                      className="w-full bg-[#FE9B90] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition">
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>


        {/* Community Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* XP Collected */}
          <div className="bg-white p-5 rounded-2xl shadow border" style={{ borderColor: '#E5E7EB' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>XP Collected</h4>
            <div className="flex items-center justify-between">
              <div className="w-full h-4 rounded-full overflow-hidden bg-white border border-[#FBBF24] mr-4">
                <div
                  className="h-full"
                  style={{
                    width: '60%',
                    background: 'linear-gradient(to right, #FACC15, #FB923C)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#F97316' }}>
                2504 XP
              </span>
            </div>
            <p className="text-xs mt-1 text-right" style={{ color: '#6B7280' }}>Out of 4000 XP Goal</p>
          </div>

          {/* Goals Completed */}
          <div className="bg-white p-5 rounded-2xl shadow border" style={{ borderColor: '#E5E7EB' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#1F2937' }}>Goals Completed</h4>
            <div className="flex items-center justify-between">
              <div className="w-full h-4 rounded-full overflow-hidden bg-white border border-[#FBBF24] mr-4">
                <div
                  className="h-full"
                  style={{
                    width: '50%',
                    background: 'linear-gradient(to right, #FACC15, #FB923C)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#F97316' }}>
                4 / 8
              </span>
            </div>
            <p className="text-xs mt-1 text-right" style={{ color: '#6B7280' }}>Goals Completed</p>
          </div>
        </div>

      </div>
    </CommunityLayout>
  );
};

export default CommunityDetail;