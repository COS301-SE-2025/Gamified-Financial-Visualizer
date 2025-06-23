import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import {
  FaFire, FaTag, FaClock, FaMedal, FaArrowLeft, FaCoins, FaUsers, FaImage, FaListUl, FaUserPlus
} from 'react-icons/fa';

// Mock friend list (would come from API in production)
const mockFriends = [
  { name: 'snow', level: 'Silver', avatar: require('../../assets/Images/avatars/snakeAvatar.jpeg') },
  { name: 'beached_in', level: 'Gold', avatar: require('../../assets/Images/avatars/beachAvatar.jpeg') },
  { name: 'miss_smith', level: 'Gold', avatar: require('../../assets/Images/avatars/windowAvatar.jpeg') },
];

const ChallengeCreate = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    xpReward: '',
    category: '',
    type: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    participants: 1,
    image: null,
    imageId: '',
  });
  const [searchFriend, setSearchFriend] = useState('');
  const [invitedFriends, setInvitedFriends] = useState([]);

  const imageOptions = [
    { id: 'store_banner', src: require('../../assets/Images/banners/pixelStore.gif'), label: 'Pixel Store' },
    { id: 'apartment_banner', src: require('../../assets/Images/banners/pixelApartment.gif'), label: 'Pixel Apartment' },
    { id: 'ally_banner', src: require('../../assets/Images/banners/pixelGirlAlly.gif'), label: 'Pixel Ally' },
    { id: 'students_banner', src: require('../../assets/Images/banners/pixelStudents.jpeg'), label: 'Pixel Students' },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInvite = (friend) => {
    if (!invitedFriends.includes(friend.name)) {
      setInvitedFriends([...invitedFriends, friend.name]);
      toast.success(`Invite sent to ${friend.name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Challenge created!');
  };

  const today = new Date().toISOString().split('T')[0];
  const filteredFriends = mockFriends.filter(f => f.name.toLowerCase().includes(searchFriend.toLowerCase()));

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        <div className="bg-white p-6 rounded-3xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
              <FaFire className="text-[#B1E1FF]" /> Create New Challenge
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Challenge Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Challenge Image</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {imageOptions.map((img) => (
                  <label
                    key={img.id}
                    className={`cursor-pointer border rounded-xl overflow-hidden transition ${formData.imageId === img.id ? 'ring-2 ring-[#B1E1FF]' : 'border-gray-300'}`}
                  >
                    <input
                      type="radio"
                      name="imageId"
                      value={img.id}
                      onChange={(e) => setFormData({ ...formData, imageId: e.target.value })}
                      className="hidden"
                    />
                    <img src={img.src} alt={img.label} className="w-full h-24 object-cover" />
                    <div className="p-2 text-center text-sm font-medium text-gray-700">{img.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title and Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B1E1FF]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B1E1FF]"
              ></textarea>
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaListUl /> Challenge Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Goal">Goal</option>
                  <option value="Savings">Savings</option>
                  <option value="Spending">Spending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaTag /> Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Target & XP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaCoins /> Target Amount (ZAR)
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaMedal /> XP Reward
                </label>
                <input
                  type="number"
                  name="xpReward"
                  value={formData.xpReward}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaClock /> Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  min={today}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaClock /> End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  min={today}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* Invite Friends */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaUserPlus /> Invite Friends to Challenge
              </label>
              <input
                type="text"
                placeholder="Search friend by username..."
                value={searchFriend}
                onChange={(e) => setSearchFriend(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredFriends.map((friend, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200"
                  >
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">@{friend.name}</p>
                      <p className="text-xs text-gray-500 italic">{friend.level}</p>
                    </div>
                    <button
                      onClick={() => handleInvite(friend)}
                      className="bg-[#AAD977] text-white px-3 py-1 rounded-full text-xs hover:bg-[#83AB55]"
                    >
                      Invite
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#B1E1FF] hover:bg-[#4BA5E6] text-white px-6 py-2 rounded-full font-semibold shadow-md"
              >
                Create Challenge
              </button>
            </div>
          </form>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default ChallengeCreate;
