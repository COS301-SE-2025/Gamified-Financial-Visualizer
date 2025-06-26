import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaSearch } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = (communityName, communityId) => {
    toast.custom((t) => (
      <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3">
        <p className="text-sm font-semibold text-gray-800">
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
                  fetchCommunities(); // Refresh list
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

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

        <div className="flex justify-end mb-4">
          <Link to="/community/create">
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#AAD977] to-[#83AB55] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
              <FaEye /> Create Community
            </button>
          </Link>
        </div>

        <div className="flex items-center w-full max-w-6xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
          <FaSearch className="text-[#E5794B] mr-2" />
          <input
            type="text"
            placeholder="Search your communities..."
            className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {communities
          .filter(c => c.community_name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((community, i) => (
            <div key={i} className="flex justify-between items-center bg-white shadow-md rounded-2xl px-4 py-4">
              <div className="flex items-center gap-4">
                <img
                  src={`/assets/Images/${community.banner}`}
                  alt={community.community_name}
                  className="w-16 h-16 rounded-full object-cover shadow"
                />
                <div>
                  <p className="text-lg font-medium text-gray-800">{community.community_name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                      {community.member_count} Members
                    </span>
                    <span className="bg-[#E0F2FE] text-[#72C1F5] text-xs font-medium px-3 py-1 rounded-full">
                      {community.challenge_count} Challenges
                    </span>
                    <span className="bg-[#FEF9C3] text-[#FBBF24] text-xs font-medium px-3 py-1 rounded-full">
                      {Math.round(community.xp_total)} XP
                    </span>
                  </div>
                </div>
              </div>

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
                  <Link to={`/community/details/${community.community_name.toLowerCase().replace(/\s+/g, '_')}`}>
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
          ))}

        {communities.filter(c =>
          c.community_name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <div className="text-center text-gray-500 mt-6 text-sm">
            No matching communities found.
          </div>
        )}
      </div>
    </CommunityLayout>
  );
};

export default CommunityList;
