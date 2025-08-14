import React, { useState, useEffect } from 'react';
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
    community: '',
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
  const [categories, setCategories] = useState([]);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/transactions/categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchCommunities = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/communities/${user.id}`);
      const data = await res.json();
      setCommunities(data.data || []);
    } catch (err) {
      console.error('Failed to load communities:', err);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);


  const imageOptions = [
    { id: 'store_banner', apiId: 1, src: require('../../assets/Images/banners/pixelStore.gif'), label: 'Pixel Store' },
    { id: 'apartment_banner', apiId: 2, src: require('../../assets/Images/banners/pixelApartment.gif'), label: 'Pixel Apartment' },
    { id: 'ally_banner', apiId: 3, src: require('../../assets/Images/banners/pixelGirlAlly.gif'), label: 'Pixel Ally' },
    { id: 'students_banner', apiId: 4, src: require('../../assets/Images/banners/pixelStudents.jpeg'), label: 'Pixel Students' },
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
    setShowConfirmation(true);
  };

  // Challenges confirmation popup
  const confirmCreate = async () => {
    setIsCreating(true);
    setShowConfirmation(false);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      toast.error('You must be logged in to create a challenge');
      setIsCreating(false);
      return;
    }

    const xpReward = parseInt(formData.xpReward) || 0;
    let difficulty;

    if (xpReward < 100) {
      difficulty = 'easy';
    } else if (xpReward < 250) {
      difficulty = 'medium';
    } else if (xpReward < 500) {
      difficulty = 'hard';
    } else {
      difficulty = 'extreme';
    }

    // Map form data to API expected structure
    const challengeData = {
      creator_id: user.id,
      community_id: formData.community,
      challenge_title: formData.title,
      challenge_type: formData.type,
      measurement_type: formData.measurementType,
      target_amount: parseFloat(formData.targetAmount),
      start_date: formData.startDate,
      target_date: formData.endDate,
      category_id: formData.category || null,
      custom_category_id: null, // Not in form yet
      banner_id: formData.imageId || 1,
      difficulty: difficulty, // Default or could add to form
    };

    try {
      const response = await fetch('http://localhost:5000/api/community/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add if your API needs auth
        },
        body: JSON.stringify(challengeData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create challenge');
      }

      toast.success('Challenge created successfully!');

      // Handle sending invitations if any
      if (invitedFriends.length > 0) {
        try {
          // Assuming you have an endpoint to handle invitations
          await fetch('http://localhost:5000/api/community/challenges/invite', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              challenge_id: data.data.challenge_id, // Assuming API returns the new challenge ID
              invited_users: invitedFriends
            })
          });
          toast.success(`Invitations sent to ${invitedFriends.length} friends`);
        } catch (inviteError) {
          console.error('Failed to send invitations:', inviteError);
          toast.error('Challenge created but failed to send some invitations');
        }
      }

      // Redirect after success
      setTimeout(() => {
        navigate('/community');
      }, 2000);

    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error(error.message || 'Failed to create challenge');
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
                      onChange={(e) => {
                        const selected = imageOptions.find(i => i.id === e.target.value);
                        setFormData({ ...formData, imageId: selected?.apiId || null });
                      }}
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
                  <option value="savings">Savings</option>
                  <option value="debt">Debt</option>
                  <option value="investment">Investment</option>
                  <option value="spending limit">Spending Limit</option>
                  <option value="donation">Donation</option>
                </select>
              </div>
              {/* Category dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaTag /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}

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
                  {communities.map((cat) => (
                    <option key={cat.community_id} value={cat.community_id}>
                      {cat.community_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaListUl /> Measurement Type
                </label>
                <select
                  name="measurementType"
                  value={formData.measurementType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Type</option>
                  <option value="goals_completed">Goals Completed</option>
                  <option value="transactions_logged">Transactions Logged</option>
                  <option value="amount_invested">Amount Invested</option>
                  <option value="amount_donated">Amount Donated</option>
                  <option value="spending_within_limit">Spending within limit</option>
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
