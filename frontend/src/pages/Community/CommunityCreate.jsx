import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import {
  FaFire, FaTag, FaPlusCircle, FaSearch, FaClock, FaMedal, FaArrowLeft, FaCoins, FaUsers, FaListUl
} from 'react-icons/fa';

const bannerOptions = [
  { id: 'apartment', label: 'Pixel Apartment', src: require('../../assets/Images/banners/pixelApartment.gif') },
  { id: 'store', label: 'Pixel Store', src: require('../../assets/Images/banners/pixelStore.gif') },
  { id: 'students', label: 'Pixel Students', src: require('../../assets/Images/banners/pixelStudents.jpeg') },
];

const friendsList = [
  { name: 'snow', avatar: require('../../assets/Images/avatars/snakeAvatar.jpeg') },
  { name: 'beached_in', avatar: require('../../assets/Images/avatars/beachAvatar.jpeg') },
  { name: 'miss_smith', avatar: require('../../assets/Images/avatars/windowAvatar.jpeg') },
  { name: 'thats_me', avatar: require('../../assets/Images/avatars/lilyAvatar.jpeg') },
  { name: 'james_link', avatar: require('../../assets/Images/avatars/cottageAvatar.jpeg') },
];


const CommunityCreate = () => {
  const [invitedFriends, setInvitedFriends] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '',
    goalCount: 0,
    memberCount: 0,
    bannerId: '',
    selectedFriends: [],
    challengeTitles: ['']
  });
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const handleInvite = (friend) => {
    if (!invitedFriends.includes(friend.name)) {
      setInvitedFriends([...invitedFriends, friend.name]);
      toast.success(`Invite sent to ${friend.name}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Community created and invitations sent!');
  };
  const filteredFriends = friendsList.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const today = new Date().toISOString().split('T')[0];

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        <div className="bg-white p-6 rounded-3xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
              <FaPlusCircle className="text-[#88BC46]" /> Create New Community
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#E5E7EB] text-[#374151] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Create Community Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
            </div>

            {/* Select a community banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select a Banner</label>
              <div className="flex gap-4">
                {bannerOptions.map((banner) => (
                  <div key={banner.id} className={`cursor-pointer border-2 rounded-xl p-1 ${formData.bannerId === banner.id ? 'border-[#88BC46]' : 'border-gray-300'}`} onClick={() => setFormData({ ...formData, bannerId: banner.id })}>
                    <img src={banner.src} alt={banner.label} className="w-24 h-24 rounded-lg object-cover" />
                    <p className="text-xs text-center mt-1">{banner.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Create a challengs */}
            {/* Challenge Creation Form */}
            <div className="space-y-4 mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
                <FaFire className="text-[#B1E1FF]" /> Create a Challenge for this Community
              </h3>

              {/* Challenge Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenge Image</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'store_banner', src: require('../../assets/Images/banners/pixelStore.gif'), label: 'Pixel Store' },
                    { id: 'apartment_banner', src: require('../../assets/Images/banners/pixelApartment.gif'), label: 'Pixel Apartment' },
                    { id: 'ally_banner', src: require('../../assets/Images/banners/pixelGirlAlly.gif'), label: 'Pixel Ally' },
                    { id: 'students_banner', src: require('../../assets/Images/banners/pixelStudents.jpeg'), label: 'Pixel Students' },
                  ].map((img) => (
                    <label key={img.id} className={`cursor-pointer border rounded-xl overflow-hidden transition ${formData.imageId === img.id ? 'ring-2 ring-[#B1E1FF]' : 'border-gray-300'}`}>
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

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
                <input
                  type="text"
                  name="challengeTitle"
                  value={formData.challengeTitle || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                ></textarea>
              </div>

              {/* Type, Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaTag /> Category
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Select Type</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Travel">Travel</option>
                    <option value="Subscriptions">Subscriptions</option>
                  </select>
                </div>
              </div>


              {/* Target & XP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaCoins /> Target Amount (ZAR)
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
            </div>

            {/* Search for friend */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaUsers /> Invite Friends</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
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

            {/* Display the friends  */}
            <div className="pt-4">
              <button type="submit" className="bg-[#AAD977] hover:bg-[#83AB55] text-white px-6 py-2 rounded-full font-semibold shadow-md">Create Community</button>
            </div>
          </form>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityCreate;
