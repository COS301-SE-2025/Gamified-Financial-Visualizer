import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

import { FaChartLine, FaStar, FaPlus, FaArrowLeft, FaCrown, FaEye, FaMedal, FaUserPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import cindy from '../../assets/Images/avatars/beachAvatar.jpeg';
import shark from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import bear from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import thatsMe from '../../assets/Images/avatars/stonesAvatar.jpeg';
import banner from '../../assets/Images/banners/pixelStudents.jpeg';
import banner1 from '../../assets/Images/banners/pixelGirlAlly.gif';
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelStore.gif';

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

const bannerOptions = [
  { id: 'students', label: 'Pixel Students', src: banner },
  { id: 'ally', label: 'Pixel Ally', src: banner1 },
  { id: 'apartment', label: 'Pixel Apartment', src: banner2 },
  { id: 'store', label: 'Pixel Store', src: banner3 },
];

const CommunityDetail = () => {
  const navigate = useNavigate();
  const {id} = useParams()
  const [isEditing, setIsEditing] = useState(false);
  const [communityData, setCommunityData] = useState({
    name: 'Happy Savers',
    bannerId: 'students',
    description: 'A community for people who enjoy saving money together',
  });

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/community/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch community data');
        }
        const data = await response.json();
        setCommunityData(data);
      } catch (error) {
        console.error('Error fetching community data:', error);
        navigate('/community'); // Redirect if community not found
      }
    }
  }) 

  const handleDelete = (itemName) => {
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3">
        <p className="text-sm font-semibold text-gray-800">
          Delete <span className="text-[#ED5E52]">"{itemName}"</span> community?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.success(`Deleted "${itemName}"`);
              // TODO: Actual deletion logic here
              console.log(`Deleted ${itemName}`);
            }}
            className="bg-[#ED5E52] hover:bg-[#FE9B90] text-white px-4 py-1.5 text-sm rounded-full font-medium"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 text-sm rounded-full font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000, position: 'top-center' });
  };

  const handleRequestMembers = () => {
    toast((t) => (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-800">Send friend request to <strong>all members</strong>?</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast.success('Friend requests sent to all community members!');
              console.log('Friend requests sent to:', mockMembers.map(m => m.name));
            }}
            className="px-4 py-1 text-sm font-semibold text-white bg-[#5FBFFF] rounded-full hover:bg-[#3297E6]"
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommunityData({ ...communityData, [name]: value });
  };

  const handleSave = () => {
    toast.success('Community updated successfully!');
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const selectedBanner = bannerOptions.find(b => b.id === communityData.bannerId)?.src || banner;

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center border" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-4">
            <img src={selectedBanner} className="w-16 h-16 rounded-full object-cover border" />
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={communityData.name}
                onChange={handleChange}
                className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-[#66BFBF]"
                style={{ color: '#66BFBF' }}
              />
            ) : (
              <h2 className="text-2xl font-bold" style={{ color: '#66BFBF' }}>{communityData.name}</h2>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="pt-2 flex justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#AAD977] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#83AB55] transition"
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-300 transition ml-2"
                  >
                    <FaTimes /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRequestMembers}
                    className="flex items-center gap-2 bg-[#B1E1FF] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#4BA5E6] transition"
                  >
                    <FaUserPlus /> Request
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#B1E1FF] hover:bg-[#4BA5E6] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
                  >
                    <FaArrowLeft /> Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white p-6 rounded-2xl shadow border" style={{ borderColor: '#E5E7EB' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#4B5563' }}>Edit Community Details</h3>
            
            {/* Banner Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Change Banner</label>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {bannerOptions.map((banner) => (
                  <div 
                    key={banner.id} 
                    className={`cursor-pointer border-2 rounded-xl p-1 flex-shrink-0 ${communityData.bannerId === banner.id ? 'border-[#66BFBF]' : 'border-gray-300'}`}
                    onClick={() => setCommunityData({...communityData, bannerId: banner.id})}
                  >
                    <img src={banner.src} alt={banner.label} className="w-20 h-20 rounded-lg object-cover" />
                    <p className="text-xs text-center mt-1">{banner.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={communityData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Enter a description for your community"
              />
            </div>

            {/* Member Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manage Members</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockMembers.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border relative"
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
                    <button 
                      onClick={() => handleDelete(member.name)}
                      className="absolute top-2 right-2 text-xs bg-red-100 text-red-600 rounded-full px-2 py-1 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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