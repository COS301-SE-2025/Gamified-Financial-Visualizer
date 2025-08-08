import React, { useState, useEffect, useMemo, use } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

import { FaChartLine, FaStar, FaPlus, FaArrowLeft, FaCrown, FaEye, FaMedal, FaUserPlus, FaEdit, FaSave, FaTimes } from 'react-icons/fa';


import banner from '../../assets/Images/banners/pixelStudents.jpeg';
import banner1 from '../../assets/Images/banners/pixelGirlAlly.gif';
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelStore.gif';
import { FaTrophy } from 'react-icons/fa';


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
  const [challengeData, setChallengeData] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [contributionScores, setContributionScores] = useState([]);

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
        setMembers(community.members);
        setContributionScores(community.contributions);
        setChallengeData(community.challenges);
      } catch (error) {
        console.error('Error fetching community data:', error);
        navigate('/community'); // Redirect if community not found
      }
    }

    const fetchPendingInvites = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/community/membership/requests/${communityId}`);
        if (!response.ok) throw new Error('Failed to fetch pending invites');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    fetchPendingInvites()
    fetchCommunityData();
  }, [title, navigate]);

  const [friends, setFriends] = useState([]);               // all your friends
  const [searchFriend, setSearchFriend] = useState('');     // for filtering
  const [showAddMember, setShowAddMember] = useState(false);


  const enrichedScores = contributionScores.map(score => {
    const matchingMember = members.find(m => m.id === score.id);
    return {
      ...score,
      avatar: matchingMember?.avatar || '/default-avatar.png', // fallback if missing
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
  // 1) when entering edit‐mode, fetch your friends
  useEffect(() => {
    if (!isEditing) return;
    fetch(`http://localhost:5000/api/community/friends/${currentUser.id}`)
      .then(r => r.json())
      .then(json => setFriends(json.data || []))
      .catch(console.error);
  }, [isEditing]);

  // 2) build list of “eligible” friends: those not already members
  const eligible = useMemo(() => {
    const memberIds = new Set(members.map(m => m.user_id));
    return friends
      .filter(f => !memberIds.has(f.user_id))
      .filter(f => f.username.toLowerCase().includes(searchFriend.toLowerCase()));
  }, [members, friends, searchFriend]);

  // 3) handler to actually add a friend to the community
  const handleAddMember = async (friend) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/${communityData.community_id}/members/${friend.user_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add member');
      toast.success(`Added ${friend.username}`);
      setMembers(m => [...m, friend]);      // append locally
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
        <div className="max-w-6xl mx-auto p-6 text-center text-gray-500">
          Loading community data...
        </div>
      </CommunityLayout>
    );
  }

  const deleteChallenge = async (challengeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(`Deleted challenge "${json.data.title}"`);
      }
      else {
        toast.error(json.message || 'Failed to delete challenge');
      }
    } catch (err) {
      toast.error('Error deleting challenge');
      console.error(err);
    }
  };

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
              deleteChallenge(itemName);
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
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                // Kick off all requests in parallel:
                await Promise.all(
                  members.map((m) =>
                    fetch(
                      `http://localhost:5000/api/community/friends/request/${currentUser.id}/${m.user_id}`,
                      {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      }
                    )
                  )
                  ,
                  fetch(`http://localhost:5000/api/community/membership/request`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      community_id: communityData.community_id,
                      user_id: currentUser.id,
                    }),
                  })
                );
                toast.success('Friend requests sent to all community members!');
              } catch (err) {
                console.error(err);
                toast.error('Failed to send some requests.');
              }
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

  const removeMember = async (userId) => {
    const res = await fetch(
      `http://localhost:5000/api/community/${communityData.community_id}/members/${userId}`,
      { method: 'DELETE' }
    );
    if (!res.ok) throw new Error('Remove failed');
    // locally filter them out
    setMembers((prev) => prev.filter((m) => m.user_id !== userId));
  };

  const handleSave = async () => {
    const payload = {
      community_name: communityData.community_name,
      description: communityData.description,
    };

    const res = await fetch(
      `http://localhost:5000/api/community/${communityData.community_id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) throw new Error('Update failed');
    const json = await res.json();
    setCommunityData(json.data);
    toast.success('Community updated successfully!');
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const handleAccept = async (userId) => {

    try {
      const response = await fetch(`http://localhost:5000/api/community/membership/respond/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: communityData.community_id, user_id: userId, response: 'accept' }),
      });
      if (!response.ok) throw new Error('Failed to accept invite');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/community/membership/respond/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_id: communityId, user_id: userId, response: 'reject' }),
      });
      if (!response.ok) throw new Error('Failed to reject invite');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const selectedBanner = bannerOptions.find(b => b.id === communityData.bannerId)?.src || banner;

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <div className="bg-white p-4 rounded-2xl shadow flex justify-between items-center border" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-4">
            <img src={selectedBanner} className="w-16 h-16 rounded-full object-cover border" />
            {isEditing ? (
              <input
                type="text"
                name="community_name"
                value={communityData.community_name}
                onChange={handleChange}
                className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-[#66BFBF]"
                style={{ color: '#66BFBF' }}
              />
            ) : (
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold" style={{ color: '#66BFBF' }}>{communityData.community_name}</h2>
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
                  {!isMember(currentUser.id) && (
                    <button
                      onClick={handleRequestMembers}
                      className="flex items-center gap-2 bg-[#B1E1FF] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#4BA5E6] transition"
                    >
                      <FaUserPlus /> Request
                    </button>
                  )}
                  {isMember(currentUser.id) && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-[#B1E1FF] hover:bg-[#4BA5E6] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => removeMember(currentUser.id)}
                        className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-200 transition"
                      >
                        <FaUserPlus /> Leave
                      </button>
                    </>
                  )}
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
                    onClick={() => setCommunityData({ ...communityData, bannerId: banner.id })}
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
              {/* === NEW Add‐Member UI === */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAddMember(v => !v)}
                  className="mb-2 inline-flex items-center gap-2 text-sm text-white bg-[#5FBFFF] px-3 py-1 rounded-full hover:bg-[#3297E6]"
                >
                  <FaPlus /> Add Member
                </button>
                {showAddMember && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      placeholder="Search friends…"
                      value={searchFriend}
                      onChange={e => setSearchFriend(e.target.value)}
                      className="w-full mb-2 px-3 py-1 border rounded"
                    />
                    <div className="max-h-40 overflow-y-auto">
                      {eligible.length
                        ? eligible.map((f) => (
                          <div
                            key={f.user_id}
                            className="flex justify-between items-center py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAddMember(f)}
                          >
                            <span>{f.username}</span>
                            <FaUserPlus className="text-green-500" />
                          </div>
                        ))
                        : <p className="text-sm text-gray-500">No friends to add.</p>
                      }
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {members.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border relative"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <img
                      src={member.avatar}
                      className="w-12 h-12 rounded-full border object-cover"
                      alt={member.username}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#374151' }}>{member.username}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{member.level}</p>
                    </div>
                    <button
                      onClick={() => removeMember(member.username)}
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
          <h3 className="text-sm font-semibold mb-3 text-[#4B5563]">Community Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
                    className="w-12 h-12 rounded-full border object-cover"
                    alt={member.username}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#374151]">{member.username}</p>
                    <p className="text-xs text-[#6B7280]">{member.level}</p>
                  </div>



                  <Link to={`/community/member/${member.username}`}>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-[#AAD977] text-white hover:bg-[#94c867] transition">
                      <FaEye className="text-white" /> View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Community invitations */}
        {isMember(currentUser.id) && pendingInvites.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold mb-3 text-[#4B5563]">Community Invitations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pendingInvites.map((invite, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between bg-white p-4 rounded-2xl shadow-sm border border-[#E5E7EB] hover:shadow-md transition"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={invite.avatar}
                      className="w-12 h-12 rounded-full border object-cover"
                      alt={invite.username}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#374151]">{invite.username}</p>
                      <p className="text-xs text-[#6B7280]">{invite.level}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/community/member/${invite.username}`}>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-[#AAD977] text-white hover:bg-[#94c867] transition">
                        <FaEye /> View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleAccept(invite.user_id)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(invite.user_id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
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
          <h3 className="text-sm font-semibold" style={{ color: '#4B5563' }}>
            Community Challenges
          </h3>
          {isMember(currentUser.id) && (
            <Link to="/community/challenges/create">
              <button className="flex items-center gap-2 bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
                <FaTrophy /> Create Challenge
              </button>
            </Link>
          )}
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {challengeData.map((challenge, i) => (
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

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-[#111827]">{challenge.title}</h4>
                    <p
                      className={`text-sm font-medium mt-1 ${challenge.current_amount >= challenge.target_amount
                        ? 'text-green-400'
                        : 'text-[#ED5E52]'
                        }`}
                    >
                      {challenge.current_amount}/{challenge.target_amount} ZAR
                    </p>
                    <p className="text-sm text-[#374151]">
                      {(challenge.target_amount - challenge.current_amount) < 0
                        ? 0
                        : (challenge.target_amount - challenge.current_amount)}{' '}
                      ZAR Left
                    </p>
                    <p className="text-sm text-[#6B7280] mt-1">
                      Goal should be accomplished on{' '}
                      <span className="text-[#ED5E52] font-semibold">{challenge.deadline}</span>
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs px-4 py-1 rounded-full bg-[#B1E1FF] text-[#4B82A2] font-medium">{challenge.challenge_status}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#FFD18C] text-[#FFFFFF] font-medium">{challenge.challenge_type}</span>
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
                      onClick={() => handleDelete(challenge.id)}
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
          {/* Community Progress Card */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#E5E7EB]">
            <h4 className="text-sm font-semibold mb-4 text-[#1F2937]">Community Progress</h4>

            {/* XP Collected */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#374151]">XP Collected</span>
                <span className="text-sm font-semibold text-[#F97316]">
                  {communityData.xpCollected} XP
                </span>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden bg-white border border-[#5FBFFF]">
                <div
                  className="h-full"
                  style={{
                    width: `${(communityData.xpCollected / communityData.xpGoal) * 100}%`,
                    background: 'linear-gradient(to right, #5FBFFF, #7FDD53)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <p className="text-xs mt-2 text-right text-[#6B7280]">
                Out of {communityData.xpGoal} XP Goal
              </p>
            </div>

            {/* Goals Completed */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[#374151]">Challenges Completed</span>
                <span className="text-sm font-semibold text-[#F97316]">
                  {communityData.goalsCompleted} / {communityData.goalsTotal}
                </span>
              </div>
              <div className="w-full h-4 rounded-full overflow-hidden bg-white border border-[#5FBFFF]">
                <div
                  className="h-full"
                  style={{
                    width: `${(communityData.goalsCompleted / communityData.goalsTotal) * 100}%`,
                    background: 'linear-gradient(to right, #5FBFFF, #7FDD53)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <p className="text-xs mt-2 text-right text-[#6B7280]">Goals Completed</p>
            </div>
          </div>

          {/* Contribution Score Card */}
          <div className="bg-white p-6 rounded-2xl shadow border border-[#E5E7EB]">
            <h4 className="text-sm font-semibold mb-4 text-[#1F2937]">Top Contributors</h4>
            {paginatedScores.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between mb-4">
                {/* Avatar & Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-sm font-medium text-[#374151]">{member.name}</span>
                </div>

                {/* Score Bar */}
                <div className="flex items-center gap-2 w-2/3">
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${member.score}%`,
                        background: 'linear-gradient(to right, #34D399, #3B82F6)',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#10B981]">{member.score}</span>
                </div>
              </div>
            ))}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>)}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityDetail;