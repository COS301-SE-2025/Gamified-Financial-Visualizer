import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaPlus, FaSearch, FaUsers } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserCommunities = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/profile/communities/${user.id}`);
      const data = await res.json();
      setCommunities(data.data || []);
    } catch (err) {
      console.error('Failed to load communities:', err);
    }
  };

  const fetchRecommendations = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await fetch(`${BASE_URL}/api/community/recommended/${user.id}`);
      const data = await res.json();
      setRecommendations(data.data || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  const isOwner = (community) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id === community.owner_id;
  };

  const leaveCommunity = async (communityId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const res = await fetch(
      `${BASE_URL}/api/community/${communityId}/members/${userId}`,
      { method: 'DELETE' }
    );
  };

  useEffect(() => {
    fetchUserCommunities();
    fetchRecommendations();
  }, []);

  const handleDelete = (communityName, communityId) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3 mx-4 sm:mx-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Delete <span className="text-[#ED5E52]">"{communityName}"</span> community?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`${BASE_URL}/api/community/${communityId}`, {
                  method: 'DELETE',
                });

                const result = await res.json();

                if (res.ok) {
                  toast.success(result.message || `Deleted "${communityName}"`);
                  fetchUserCommunities();
                } else {
                  toast.error(result.message || 'Failed to delete.');
                }
              } catch (err) {
                toast.error('Server error. Could not delete.');
              }
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

  const communityList = searchTerm ? communities.filter(c => c.community_name.toLowerCase().includes(searchTerm.toLowerCase())) : communities;
  const recommendationsList = searchTerm ? recommendations.filter(c => c.community_name.toLowerCase().includes(searchTerm.toLowerCase())) : recommendations;
  const limitedRecommendations = recommendationsList.slice(0, 10).sort(() => Math.random() - 0.5);

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-3 sm:px-4 md:px-6 py-4 dark:bg-gray-900">
        {/* Search bar */}
        <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white shadow-sm dark:bg-gray-900">
          <FaSearch className="text-[#76B947] mr-2 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search your communities..."
            className="w-full outline-none bg-transparent text-sm text-[#76B947] placeholder-[#76B947]/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] dark:text-gray-300 flex items-center gap-2">
            <FaUsers className="text-[#72C1F5] text-lg sm:text-xl" />
            My Communities
          </h2>

          <Link to="/community/create" className="sm:w-auto">
            <button className="bg-[#AAD977] text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:bg-[#83AB55] transition whitespace-nowrap dark:bg-[#BBE48E] flex items-center gap-2">
              <FaPlus className="text-sm" />
              Create Community
            </button>
          </Link>
        </div>

        {/* My Communities List */}
        {communityList.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchTerm ? `No communities found matching "${searchTerm}"` : "You haven't joined any communities yet."}
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {communityList.map((community, i) => (
              <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-2xl px-4 py-4 sm:px-6 sm:py-4 dark:bg-gray-800">
                {/* Left Section - Community Info */}
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                  <img
                    src={`/assets/Images/${community.banner}`}
                    alt={community.community_name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow flex-shrink-0"
                  />

                  <div className="min-w-0 flex-1 sm:flex-none">
                    <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {community.community_name}
                    </p>

                    {community.description && (
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic mt-1 line-clamp-1 sm:line-clamp-2 max-w-xs">
                        {community.description}
                      </p>
                    )}

                    <div className="flex gap-1 sm:gap-2 mt-2 flex-wrap">
                      <span className="bg-[#E0F2FE] dark:bg-[#88D1FF] dark:text-[#065989] text-[#72C1F5] text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                        {community.member_count} Members
                      </span>
                      <span className="bg-[#E0F2FE] dark:bg-[#88D1FF] dark:text-[#065989] text-[#72C1F5] text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                        {community.challenge_count} Challenges
                      </span>
                      <span className="bg-[#FEF9C3] text-[#FBBF24] text-xs font-medium px-2 sm:px-3 py-1 rounded-full dark:bg-[#FFD18C] dark:text-[#CF6108]">
                        {Math.round(community.xp_total)} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Avatars and Actions */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
                  <div className="flex -space-x-2">
                    {community.preview_avatars?.slice(0, 3).map((src, index) => (
                      <img
                        key={index}
                        src={`/assets/Images/${src}`}
                        alt="avatar"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-800"
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/community/details/${community.community_name.replace(/\s+/g, '_')}`}>
                      <button className="bg-[#AAD977] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-[#83AB55] transition whitespace-nowrap dark:bg-[#BBE48E]">
                        <FaEye className="inline-block mr-1 text-xs sm:text-sm" /> View
                      </button>
                    </Link>
                    {isOwner(community) ? (
                      <button
                        onClick={() => handleDelete(community.community_name, community.community_id)}
                        className="bg-[#FE9B90] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition whitespace-nowrap"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => leaveCommunity(community.community_id)}
                        className="bg-[#FE9B90] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition whitespace-nowrap"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discover Communities Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-2 dark:text-gray-200">
            <FaUsers className="text-[#72C1F5] text-lg sm:text-xl" />
            Discover Communities
          </h2>
          
          {limitedRecommendations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              {searchTerm ? `No communities found matching "${searchTerm}"` : "No communities found."}
            </p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {limitedRecommendations.map((community, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-2xl px-4 py-4 sm:px-6 sm:py-4 dark:bg-gray-800">
                  {/* Left Section - Community Info */}
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto mb-3 sm:mb-0">
                    <img
                      src={`/assets/Images/${community.banner}`}
                      alt={community.community_name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1 sm:flex-none">
                      <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {community.community_name}
                      </p>

                      {community.description && (
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic mt-1 line-clamp-1 sm:line-clamp-2 max-w-xs">
                          {community.description}
                        </p>
                      )}

                      <div className="flex gap-1 sm:gap-2 mt-2 flex-wrap">
                        <span className="bg-[#E0F2FE] dark:bg-[#88D1FF] dark:text-[#065989] text-[#72C1F5] text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                          {community.member_count} Members
                        </span>
                        <span className="bg-[#E0F2FE] dark:bg-[#88D1FF] dark:text-[#065989] text-[#72C1F5] text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                          {community.challenge_count} Challenges
                        </span>
                        <span className="bg-[#FEF9C3] text-[#FBBF24] text-xs font-medium px-2 sm:px-3 py-1 rounded-full dark:bg-[#FFD18C] dark:text-[#CF6108]">
                          {Math.round(community.xp_total)} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Avatars and Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-4">
                    <div className="flex -space-x-2">
                      {community.preview_avatars?.slice(0, 3).map((src, index) => (
                        <img
                          key={index}
                          src={`/assets/Images/${src}`}
                          alt="avatar"
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/community/details/${community.community_name.replace(/\s+/g, '_')}`}>
                        <button className="bg-[#AAD977] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-[#83AB55] transition whitespace-nowrap dark:bg-[#BBE48E]">
                          <FaEye className="inline-block mr-1 text-xs sm:text-sm" /> View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityList;