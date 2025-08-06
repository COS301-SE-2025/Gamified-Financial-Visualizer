import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaPlus, FaSearch, FaUsers } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserCommunities = async () => {
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

  const fetchRecommendations = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/community/recommended/${user.id}`);
      const data = await res.json();
      setRecommendations(data.data || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  useEffect(() => {
    fetchUserCommunities();
    fetchRecommendations();
  }, []);

  const handleDelete = (communityName, communityId) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Delete <span className="text-[#ED5E52]">"{communityName}"</span> community?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`http://localhost:5000/api/community/${communityId}`, {
                  method: 'DELETE',
                });

                const result = await res.json();

                if (res.ok) {
                  toast.success(result.message || `Deleted "${communityName}"`);
                  fetchUserCommunities(); // Refresh list
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
// limit the number of recommendations displayed and randomize them
  const limitedRecommendations = recommendationsList.slice(0, 10).sort(() => Math.random() - 0.5);

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 dark:bg-gray-900">
        {/* Search bar */}
        <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white shadow-sm dark:bg-gray-900">
          <FaSearch className="text-[#76B947] mr-2" />
          <input
            type="text"
            placeholder="Search your communities..."
            className="w-full outline-none bg-transparent text-sm text-[#76B947] placeholder-[#76B947]/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Create community button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-gray-300 flex items-center gap-2">
            <FaUsers className="text-[#72C1F5]" />
            My Communities
          </h2>

          <Link to="/community/create">
            <button className="inline-flex items-center gap-2 bg-[#AAD977] hover:bg-[#83AB55] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow transition-all">
              <FaPlus className="text-base" />
              Create Community
            </button>
          </Link>
        </div>

        {/* Community details */}
        {communityList.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchTerm ? `No communities found matching "${searchTerm}"` : "You haven't joined any communities yet."}
          </p>
        ) : (
          communityList
            .filter(c => c.community_name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((community, i) => (
              <div key={i} className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-4 dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  <img
                    src={`/assets/Images/${community.banner}`}
                    alt={community.community_name}
                    className="w-16 h-16 rounded-full object-cover shadow"
                  />

                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{community.community_name}</p>

                  {/* DESCRIPTION BLOCK */}
                  {community.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1 max-w-xs line-clamp-2">
                      {community.description}
                    </p>
                  )}

                    <div className="flex gap-2 mt-2">
                      <span className="bg-[#E0F2FE] dark:bg-[#88D1FF]  dark:text-[#065989] text-[#72C1F5]  text-xs font-medium px-3 py-1 rounded-full">
                        {community.member_count} Members
                      </span>
                      <span className="bg-[#E0F2FE] dark:bg-[#88D1FF]  dark:text-[#065989] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                        {community.challenge_count} Challenges
                      </span>
                      <span className="bg-[#FEF9C3] text-[#FBBF24] text-xs font-medium px-3 py-1 rounded-full dark:bg-[#FFD18C] dark:text-[#CF6108]">
                        {Math.round(community.xp_total)} XP
                      </span>
                    </div>
                  </div>
                </div>

              {/* Card Avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {community.preview_avatars?.map((src, index) => (
                    <img
                      key={index}
                      src={`/assets/Images/${src}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link to={`/community/details/${community.community_name.replace(/\s+/g, '_')}`}>
                      <button className="bg-[#AAD977] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#83AB55] transition whitespace-nowrap">
                        <FaEye className="inline-block mr-1" /> View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(community.community_name, community.community_id)}
                      className="bg-[#FE9B90] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#ED5E52] transition whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )))}


        {/* Discover communities */}
        <h2 className="text-2xl font-bold text-[#1F2937] mb-4 flex items-center gap-2 dark:text-gray-200">
          <FaUsers className="text-[#72C1F5] " />
          Discover Communities
        </h2>
        {limitedRecommendations.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchTerm ? `No communities found matching "${searchTerm}"` : "No communities found."}
          </p>
        ) : (
          limitedRecommendations.map((community, i) => (
            <div key={i} className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-4 dark:bg-gray-800">
              <div className="flex items-center gap-4 ">
                <img
                  src={`/assets/Images/${community.banner}`}
                  alt={community.community_name}
                  className="w-16 h-16 rounded-full object-cover shadow"
                />

                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{community.community_name}</p>

                  {/* DESCRIPTION BLOCK */}
                  {community.description && (
                    <p className="text-sm text-gray-500 italic mt-1 max-w-xs line-clamp-2 dark:text-gray-400">
                      {community.description}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2">
                    <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full dark:bg-[#88D1FF]  dark:text-[#065989] ">
                      {community.member_count} Members
                    </span>
                    <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full dark:bg-[#88D1FF]  dark:text-[#065989] ">
                      {community.challenge_count} Challenges
                    </span>
                    <span className="bg-[#FEF9C3] text-[#FBBF24] text-xs font-medium px-3 py-1 rounded-full dark:bg-[#FFD18C] dark:text-[#CF6108]">
                      {Math.round(community.xp_total)} XP
                    </span>
                  </div>
                </div>
              </div>


              {/* Card Avatars */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {community.preview_avatars?.map((src, index) => (
                    <img
                      key={index}
                      src={`/assets/Images/${src}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Link to={`/community/details/${community.community_name.replace(/\s+/g, '_')}`}>
                    <button className="bg-[#AAD977] text-white text-sm px-4 py-2 rounded-full font-semibold hover:bg-[#83AB55] transition whitespace-nowrap">
                      <FaEye className="inline-block mr-1" /> View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
    </CommunityLayout>
  );
};

export default CommunityList;