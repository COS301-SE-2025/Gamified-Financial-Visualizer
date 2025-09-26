import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import { FaPlus, FaArrowLeft, FaEye, FaUserPlus, FaEdit, FaSave, FaTimes, FaTrophy } from 'react-icons/fa';

import banner from '../../assets/Images/banners/pixelStudents.jpeg';
import banner1 from '../../assets/Images/banners/pixelGirlAlly.gif';
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelStore.gif';

const bannerOptions = [
  { id: 1, label: 'Pixel Students', src: banner },
  { id: 2, label: 'Pixel Ally', src: banner1 },
  { id: 3, label: 'Pixel Apartment', src: banner2 },
  { id: 4, label: 'Pixel Store', src: banner3 },
];

const CommunityDetail = () => {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const title = communityId;
  const [isEditing, setIsEditing] = useState(false);
  const [communityData, setCommunityData] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [challengeData, setChallengeData] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [contributionScores, setContributionScores] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const updateMedia = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/community/${title}`);
        if (!response.ok) {
          throw new Error('Failed to fetch community data');
        }
        const data = await response.json();
        const community = data.data;
        setCommunityData(community);
        setMembers(community.members || []);
        setContributionScores(community.contributions || []);
        setChallengeData(community.challenges || []);
      } catch (error) {
        console.error('Error fetching community data:', error);
        navigate('/community');
      }
    }

    const fetchPendingInvites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/community/membership/requests/${communityId}`);
        if (!response.ok) throw new Error('Failed to fetch pending invites');
        const data = await response.json();
        setPendingInvites(data.data || []);
      } catch (error) {
        console.error(error);
        setPendingInvites([]);
      }
    };

    fetchPendingInvites();
    fetchCommunityData();
  }, [title, navigate, communityId]);

  const [friends, setFriends] = useState([]);
  const [searchFriend, setSearchFriend] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  const enrichedScores = contributionScores.map(score => {
    const matchingMember = members.find(m => m.id === score.id);
    return {
      ...score,
      avatar: matchingMember?.avatar || '/default-avatar.png',
    };
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(enrichedScores.length / itemsPerPage);
  const paginatedScores = enrichedScores
    .sort((a, b) => b.score - a.score)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isMember = (userId) => {
    return members.some(member => member.user_id === userId);
  };

  useEffect(() => {
    if (!isEditing) return;
    fetch(`http://localhost:5000/api/community/friends/${currentUser.id}`)
      .then(r => r.json())
      .then(json => setFriends(json.data || []))
      .catch(console.error);
  }, [isEditing, currentUser.id]);

  const eligible = useMemo(() => {
    const memberIds = new Set(members.map(m => m.user_id));
    return friends
      .filter(f => !memberIds.has(f.user_id))
      .filter(f => f.username.toLowerCase().includes(searchFriend.toLowerCase()));
  }, [members, friends, searchFriend]);

  const handleAddMember = async (friend) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/${communityData.community_id}/members/${friend.user_id}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add member');
      toast.success(`Added ${friend.username}`);
      setMembers(m => [...m, friend]);
      setShowAddMember(false);
      setSearchFriend('');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  if (!communityData) {
    return (
      <CommunityLayout>
        <div className="max-w-6xl mx-auto p-6 text-center text-gray-500 dark:text-gray-400">
          Loading community data...
        </div>
      </CommunityLayout>
    );
  }

  const deleteChallenge = async (challengeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(`Deleted challenge`);
        setChallengeData(challenges => challenges.filter(c => c.id !== challengeId));
      } else {
        toast.error(json.message || 'Failed to delete challenge');
      }
    } catch (err) {
      toast.error('Error deleting challenge');
      console.error(err);
    }
  };

  const handleDelete = (challengeId) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-lg max-w-sm w-full space-y-3 mx-4 sm:mx-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Delete this challenge?
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteChallenge(challengeId);
            }}
            className="bg-[#ED5E52] hover:bg-[#FE9B90] text-white px-4 py-1.5 text-sm rounded-full font-medium"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-1.5 text-sm rounded-full font-medium"
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
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Send friend request to <strong>all members</strong>?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                await Promise.all(
                  members.map((m) =>
                    fetch(`http://localhost:5000/api/community/friends/request/${currentUser.id}/${m.user_id}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' }
                    })
                  )
                );
                toast.success('Friend requests sent to all community members!');
              } catch (err) {
                console.error(err);
                toast.error('Failed to send some requests.');
              }
            }}
            className="px-4 py-1 text-sm font-semibold text-white bg-[#5FBFFF] rounded-full hover:bg-[#3297E6] dark:bg-[#88D1FF] dark:hover:bg-[#6BB7F5]"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1 text-sm font-medium text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommunityData({ ...communityData, [name]: value });
  };

  const removeMember = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/${communityData.community_id}/members/${userId}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Remove failed');
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      toast.success('Member removed successfully');
    } catch (err) {
      toast.error('Failed to remove member');
      console.error(err);
    }
  };

  const handleSave = async () => {
    const payload = {
      community_name: communityData.community_name,
      description: communityData.description,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/community/${communityData.community_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Update failed');
      const json = await res.json();
      setCommunityData(json.data);
      toast.success('Community updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update community');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const selectedBanner = bannerOptions.find(b => b.id === communityData.bannerId)?.src || banner;

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow border dark:border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <img src={selectedBanner} className="w-12 h-12 rounded-full object-cover border dark:border-gray-600" />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              name="community_name"
              value={communityData.community_name}
              onChange={handleChange}
              className="text-lg font-bold border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-[#66BFBF] dark:focus:border-[#4D7C0F] bg-transparent dark:text-white w-full"
            />
          ) : (
            <div>
              <h2 className="text-lg font-bold text-[#66BFBF] dark:text-[#618A54] truncate">
                {communityData.community_name}
              </h2>
              <p className="text-xs text-gray-500 truncate">{communityData.description}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 bg-[#AAD977] dark:bg-[#A0E555] text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-[#83AB55] dark:hover:bg-[#88BC46] transition flex-1 justify-center"
            >
              <FaSave size={12} /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition flex-1 justify-center"
            >
              <FaTimes size={12} /> Cancel
            </button>
          </>
        ) : (
          <>
            {!isMember(currentUser.id) && (
              <button
                onClick={handleRequestMembers}
                className="flex items-center gap-1 bg-[#B1E1FF] dark:bg-[#88D1FF] text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#4BA5E6] dark:hover:bg-[#6BB7F5] transition flex-1 justify-center"
              >
                <FaUserPlus size={12} /> Request
              </button>
            )}
            {isMember(currentUser.id) && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 bg-[#B1E1FF] dark:bg-[#88D1FF] hover:bg-[#4BA5E6] dark:hover:bg-[#6BB7F5] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex-1 justify-center"
                >
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={() => removeMember(currentUser.id)}
                  className="flex items-center gap-1 bg-red-100 dark:bg-[#FE9B90] text-red-600 dark:text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-200 dark:hover:bg-red-800 transition flex-1 justify-center"
                >
                  <FaUserPlus size={12} /> Leave
                </button>
              </>
            )}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 bg-[#E5E7EB] dark:bg-gray-600 text-[#374151] dark:text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-500 transition flex-1 justify-center"
            >
              <FaArrowLeft size={12} /> Back
            </button>
          </>
        )}
      </div>
    </div>
  );

  // Desktop Header Component
  const DesktopHeader = () => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex justify-between items-center border dark:border-gray-700">
      <div className="flex items-center gap-4">
        <img src={selectedBanner} className="w-16 h-16 rounded-full object-cover border dark:border-gray-600" />
        {isEditing ? (
          <input
            type="text"
            name="community_name"
            value={communityData.community_name}
            onChange={handleChange}
            className="text-2xl font-bold border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-[#66BFBF] dark:focus:border-[#4D7C0F] bg-transparent dark:text-white"
          />
        ) : (
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#66BFBF] dark:text-[#618A54]">{communityData.community_name}</h2>
            <p className="text-sm text-gray-500">{communityData.description}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="pt-2 flex justify-end">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#AAD977] dark:bg-[#A0E555] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#83AB55] dark:hover:bg-[#88BC46] transition"
              >
                <FaSave /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition ml-2"
              >
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <>
              {!isMember(currentUser.id) && (
                <button
                  onClick={handleRequestMembers}
                  className="flex items-center gap-2 bg-[#B1E1FF] dark:bg-[#88D1FF] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#4BA5E6] dark:hover:bg-[#6BB7F5] transition"
                >
                  <FaUserPlus /> Request
                </button>
              )}
              {isMember(currentUser.id) && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-[#B1E1FF] dark:bg-[#88D1FF] hover:bg-[#4BA5E6] dark:hover:bg-[#6BB7F5] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => removeMember(currentUser.id)}
                    className="flex items-center gap-2 bg-red-100 dark:bg-[#FE9B90] text-red-600 dark:text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition"
                  >
                    <FaUserPlus /> Leave
                  </button>
                </>
              )}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-[#E5E7EB] dark:bg-gray-600 text-[#374151] dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-500 transition"
              >
                <FaArrowLeft /> Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 md:px-6 py-4 dark:bg-gray-900">
        {/* Header */}
        {isMobile ? <MobileHeader /> : <DesktopHeader />}

        {/* Edit Mode Content */}
        {isEditing && (
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow border dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-[#4B5563] dark:text-gray-300">Edit Community Details</h3>

            {/* Banner Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Change Banner</label>
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2">
                {bannerOptions.map((banner) => (
                  <div
                    key={banner.id}
                    className={`cursor-pointer border-2 rounded-xl p-1 flex-shrink-0 ${communityData.bannerId === banner.id ? 'border-[#66BFBF] dark:border-[#4D7C0F]' : 'border-gray-300 dark:border-gray-600'}`}
                    onClick={() => setCommunityData({ ...communityData, bannerId: banner.id })}
                  >
                    <img src={banner.src} alt={banner.label} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover" />
                    <p className="text-xs text-center mt-1 dark:text-gray-300">{banner.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={communityData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-gray-300"
                placeholder="Enter a description for your community"
              />
            </div>

            {/* Member Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manage Members</label>
              <div className="mb-6">
                <button
                  onClick={() => setShowAddMember(v => !v)}
                  className="mb-2 inline-flex items-center gap-1 text-xs sm:text-sm text-white bg-[#5FBFFF] dark:bg-[#88D1FF] px-3 py-1.5 rounded-full hover:bg-[#3297E6] dark:hover:bg-[#6BB7F5]"
                >
                  <FaPlus size={12} /> Add Member
                </button>
                {showAddMember && (
                  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <input
                      type="text"
                      placeholder="Search friends…"
                      value={searchFriend}
                      onChange={e => setSearchFriend(e.target.value)}
                      className="w-full mb-2 px-3 py-1.5 text-sm border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    />
                    <div className="max-h-32 overflow-y-auto">
                      {eligible.length ? eligible.map((f) => (
                        <div
                          key={f.user_id}
                          className="flex justify-between items-center py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer px-2"
                          onClick={() => handleAddMember(f)}
                        >
                          <span className="text-sm dark:text-gray-300">{f.username}</span>
                          <FaUserPlus className="text-green-500 text-xs" />
                        </div>
                      )) : <p className="text-sm text-gray-500 dark:text-gray-400 px-2">No friends to add.</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {members.map((member, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-700 p-3 rounded-2xl shadow-sm border dark:border-gray-600 relative">
                    <img src={member.avatar} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border dark:border-gray-500 object-cover" alt={member.username} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#374151] dark:text-gray-200 truncate">{member.username}</p>
                      <p className="text-xs text-[#6B7280] dark:text-gray-400">{member.level}</p>
                    </div>
                    <button
                      onClick={() => removeMember(member.user_id)}
                      className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full px-2 py-1 hover:bg-red-200 dark:hover:bg-red-800"
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
          <h3 className="text-base sm:text-lg font-semibold mb-3 text-[#4B5563] dark:text-gray-300">Community Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {members.map((member, i) => (
              <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border hover:shadow-md transition dark:border-gray-700">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={member.avatar} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border object-cover" alt={member.username} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#374151] dark:text-gray-200 truncate">{member.username}</p>
                    <p className="text-xs text-[#6B7280] dark:text-gray-400">{member.level}</p>
                  </div>
                  <Link to={`/community/member/${member.username}`}>
                    <button className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-[#AAD977] text-white hover:bg-[#94c867] transition whitespace-nowrap">
                      <FaEye size={12} /> View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        {isMember(currentUser?.id) && pendingInvites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-[#4B5563] dark:text-gray-300">Pending Invitations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {pendingInvites.map((invite, i) => (
                <div key={i} className="flex flex-col justify-between bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-sm border dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={invite.avatar} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border object-cover" alt={invite.username} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#374151] dark:text-gray-200 truncate">{invite.username}</p>
                      <p className="text-xs text-[#6B7280] dark:text-gray-400">{invite.level}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/community/member/${invite.username}`}>
                      <button className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-[#AAD977] text-white hover:bg-[#94c867] transition">
                        <FaEye size={12} /> View
                      </button>
                    </Link>
                    <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-500 text-white rounded-full hover:bg-green-600 transition">
                      Accept
                    </button>
                    <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Challenges */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base sm:text-lg font-semibold text-[#4B5563] dark:text-gray-300">
              Community Challenges
            </h3>
            {isMember(currentUser?.id) && (
              <Link to="/community/challenges/create">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow hover:shadow-md transition whitespace-nowrap">
                  <FaTrophy size={12} /> Create Challenge
                </button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {challengeData.map((challenge, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 pt-12 sm:pt-10 rounded-3xl shadow-md border dark:border-gray-700 relative">
                {/* Mobile: Smaller banner, Desktop: Original size */}
                <img src={banner1} alt="Challenge" className="absolute -top-6 left-4 w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow" />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Mobile: Smaller text, Desktop: Original size */}
                    <h4 className="text-sm sm:text-lg font-semibold text-[#111827] dark:text-gray-200 truncate">{challenge.title}</h4>
                    <p className={`text-xs sm:text-sm font-medium mt-1 ${challenge.current_amount >= challenge.target_amount ? 'text-green-400' : 'text-[#ED5E52]'}`}>
                      {challenge.current_amount}/{challenge.target_amount} ZAR
                    </p>
                    <p className="text-xs sm:text-sm text-[#374151] dark:text-gray-300">
                      {Math.max(0, challenge.target_amount - challenge.current_amount)} ZAR Left
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-1">
                      Goal by <span className="text-[#E99470] font-semibold">{challenge.deadline}</span>
                    </p>
                  </div>

                  {/* Mobile: Horizontal badges, Desktop: Vertical badges */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 sm:flex-col sm:items-end">
                    <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-[#B1E1FF] dark:bg-[#88D1FF] text-[#4B82A2] dark:text-[#1E3A8A] font-medium">{challenge.challenge_status}</span>
                    <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-[#FFD18C] text-white font-medium">{challenge.challenge_type}</span>
                    <span className="text-xs px-2 sm:px-3 py-1 rounded-full bg-[#FFD18C] text-white font-semibold">{challenge.xp} XP</span>
                  </div>
                </div>

                {/* Mobile: Hide avatar group, Desktop: Show */}
                <div className="hidden sm:flex gap-1 mt-3">
                  {challenge.avatarGroup?.slice(0, 3).map((src, j) => (
                    <img key={j} src={src} alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm" />
                  ))}
                </div>

                {/* Mobile: Smaller buttons, Desktop: Original size */}
                <div className="flex gap-2 mt-3">
                  <Link to={`/community/challenges/${challenge.id}`} className="flex-1">
                    <button className="w-full bg-[#AAD977] dark:bg-[#A0E555] text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-full font-semibold hover:bg-[#83AB55] dark:hover:bg-[#88BC46] transition">
                      View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(challenge.id)}
                    className="flex-1 bg-[#FE9B90] dark:bg-[#FE9B90] text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-full font-semibold hover:bg-[#ED5E52] dark:hover:bg-[#E55C4C] transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        {/* Community Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Community Progress Card */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow border dark:border-gray-700">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-[#1F2937] dark:text-gray-200">Community Progress</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-[#374151] dark:text-gray-300">XP Collected</span>
                  <span className="text-sm font-semibold text-[#F97316] dark:text-[#E99470]">{communityData.xpCollected} XP</span>
                </div>
                <div className="w-full h-3 sm:h-4 rounded-full overflow-hidden bg-white border border-[#5FBFFF] dark:bg-gray-800">
                  <div className="h-full" style={{ width: `${(communityData.xpCollected / communityData.xpGoal) * 100}%`, background: 'linear-gradient(to right, #5FBFFF, #7FDD53)', borderRadius: '9999px' }} />
                </div>
                <p className="text-xs mt-2 text-right text-[#6B7280] dark:text-gray-300">Out of {communityData.xpGoal} XP Goal</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-[#374151] dark:text-gray-300">Challenges Completed</span>
                  <span className="text-sm font-semibold text-[#F97316] dark:text-[#E99470]">{communityData.goalsCompleted} / {communityData.goalsTotal}</span>
                </div>
                <div className="w-full h-3 sm:h-4 rounded-full overflow-hidden bg-white border border-[#5FBFFF] dark:bg-gray-800">
                  <div className="h-full" style={{ width: `${(communityData.goalsCompleted / communityData.goalsTotal) * 100}%`, background: 'linear-gradient(to right, #5FBFFF, #7FDD53)', borderRadius: '9999px' }} />
                </div>
                <p className="text-xs mt-2 text-right text-[#6B7280] dark:text-gray-300">Goals Completed</p>
              </div>
            </div>
          </div>

          {/* Contribution Score Card */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow border dark:border-gray-700">
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-[#1F2937] dark:text-gray-200">Top Contributors</h4>
            <div className="space-y-3">
              {paginatedScores.map((member, index) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img src={member.avatar} alt={member.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-300" />
                    <span className="text-xs sm:text-sm font-medium text-[#374151] truncate">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-full h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full" style={{ width: `${member.score}%`, background: 'linear-gradient(to right, #34D399, #3B82F6)', borderRadius: '9999px' }} />
                    </div>
                    <span className="text-xs font-semibold text-[#10B981] whitespace-nowrap">{member.score}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityDetail;