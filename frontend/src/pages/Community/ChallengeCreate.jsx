import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import {
  FaFire, FaTag, FaClock, FaMedal, FaArrowLeft, FaCoins, FaListUl, FaUserPlus,
  FaUsers
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
    community:'',
    targetAmount: '',
    startDate: '',
    endDate: '',
    participants: 1,
    image: null,
    imageId: '',
  });
  const [searchFriend, setSearchFriend] = useState('');
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const imageOptions = [
    { id: 'store_banner', src: require('../../assets/Images/banners/pixelStore.gif'), label: 'Pixel Store' },
    { id: 'apartment_banner', src: require('../../assets/Images/banners/pixelApartment.gif'), label: 'Pixel Apartment' },
    { id: 'ally_banner', src: require('../../assets/Images/banners/pixelGirlAlly.gif'), label: 'Pixel Ally' },
    { id: 'students_banner', src: require('../../assets/Images/banners/pixelStudents.jpeg'), label: 'Pixel Students' },
  ];

  // 
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handles sending an invite to a friend 
  const handleInvite = (friend) => {
    if (!invitedFriends.includes(friend.name)) {
      setInvitedFriends([...invitedFriends, friend.name]);
      toast.success(`Invite sent to ${friend.name}`);
    }
  };

  // handle the submitting of the form 
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Challenge created!');
  };

  // Challenges confrimation popup
   const confirmCreate = async () => {
    setIsCreating(true);
    setShowConfirmation(false);

    try {
      // Mock API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful creation
      toast.success(`Community "${formData.name}" created successfully!`);

      // Simulate sending invitations
      if (invitedFriends.length > 0) {
        toast.success(`Invitations sent to ${invitedFriends.length} friends`);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        tag: '',
        goalCount: 0,
        memberCount: 0,
        bannerId: '',
        selectedFriends: [],
        challengeTitles: ['']
      });
      setInvitedFriends([]);

      // Mock redirect after 2 seconds
      setTimeout(() => {
        navigate('/community');
      }, 2000);

    } catch (error) {
      // Simulate error case
      toast.error('Failed to create community. Please try again.');
      console.error('Mock API Error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const cancelCreate = () => {
    setShowConfirmation(false);
  };


  const today = new Date().toISOString().split('T')[0];
  const filteredFriends = mockFriends.filter(f => f.name.toLowerCase().includes(searchFriend.toLowerCase()));

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        {/* Confrimation popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Challenge Creation</h3>
              <p className="mb-6">
                Are you sure you want to create a challenge"{formData.name}"?
                {invitedFriends.length > 0 && (
                  <span className="block mt-2">
                    This will invite {invitedFriends.length} member{invitedFriends.length !== 1 ? 's' : ''}.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={cancelCreate}
                  disabled={isCreating}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCreate}
                  disabled={isCreating}
                  className="px-4 py-2 bg-[#AAD977] text-white rounded-full hover:bg-[#83AB55] disabled:opacity-50 flex items-center justify-center min-w-24"
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl shadow-md">
          {/* Create a challenge button */}
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

            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Challenge type dropdown */}
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
                  <option value="Goal">Investment</option>
                  <option value="Savings">Savings</option>
                  <option value="Spending">Spending</option>
                </select>
              </div>
              {/* Category dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaTag /> Category
                </label>
                <select
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Goal">Vacation</option>
                  <option value="Savings">Travel</option>
                  <option value="Spending">Subcriptions</option>
                </select>
              </div>
              {/* Community dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaUsers /> Community
                </label>
                <select
                  type="text"
                  name="community"
                  value={formData.community}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="Goal">Happy Savers</option>
                  <option value="Savings">Coupon Crew</option>
                  <option value="Spending">Money Maniacs</option>
                  <option value="Spending">Heist Club</option>
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
                  min="1"
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
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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

            {/* Submit challenge button */}
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
