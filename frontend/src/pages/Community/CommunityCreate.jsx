import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import {
  FaPlusCircle, FaSearch, FaArrowLeft, FaUsers,
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
  const [isCreating, setIsCreating] = useState(false); 
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  // confirmation popup
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

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        {/* Confrimation popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Community Creation</h3>
              <p className="mb-6">
                Are you sure you want to create the community "{formData.name}"?
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

            {/* Create Community Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Community Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what your community is about..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#88BC46] focus:border-transparent"
                required
              ></textarea>
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

            {/* Search for friend */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><FaUsers /> Invite Friends</label>
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
