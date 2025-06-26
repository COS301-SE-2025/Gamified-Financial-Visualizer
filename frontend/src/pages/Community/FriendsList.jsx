import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaSearch, FaEye, FaUserMinus, FaPaperPlane } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

const FriendsList = () => {
  const [yourFriends, setYourFriends] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalData, setModalData] = useState({ username: '', avatar_image_path: '' });
  const [onConfirm, setOnConfirm] = useState(() => () => { });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    const fetchFriendsAndRecommendations = async () => {
      try {
        const [friendsRes, recsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/community/friends/${user.id}`),
          fetch(`http://localhost:5000/api/community/friends/recommendations/${user.id}`) // ← fixed
        ]);


        const friendsData = await friendsRes.json();
        const recsData = await recsRes.json();

        setYourFriends(friendsData.data || []);
        setRecommended(recsData.data || []);
      } catch (err) {
        toast.error('Failed to fetch friends or recommendations.');
        console.error(err);
      }
    };

    fetchFriendsAndRecommendations();
  }, []);

  const openModal = (message, user, action) => {
    setModalText(message);
    setModalData(user);
    setOnConfirm(() => action);
    setModalOpen(true);
  };

  const handleFriendRequest = (user) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    openModal(`Send a friend request to @${user.username}?`, user, async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/community/friends/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: currentUser.id,
            receiver_id: user.user_id,
          }),
        });

        const result = await res.json();
        if (res.ok) {
          toast.success(`Friend request sent to @${user.username}`, {
            icon: <FaPaperPlane className="text-[#1E3A8A]" />,
            style: {
              borderRadius: '9999px',
              background: '#B1E1FF',
              color: '#1E3A8A',
            },
          });
        } else {
          toast.error(result.message || 'Failed to send request.');
        }
      } catch (err) {
        toast.error('Could not send friend request.');
      } finally {
        setModalOpen(false);
      }
    });
  };

  const handleRemoveFriend = (user) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    openModal(`Remove @${user.username} from your friends list?`, user, async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/community/friends`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUser.id,
            friend_id: user.user_id,
          }),
        });

        const result = await res.json();
        if (res.ok) {
          toast.success(`@${user.username} removed from your friends list`, {
            icon: <FaUserMinus className="text-[#7F1D1D]" />,
            style: {
              borderRadius: '9999px',
              background: '#FE9B90',
              color: '#FFFFFF',
            },
          });

          // Refresh friends list
          setYourFriends(prev => prev.filter(f => f.user_id !== user.user_id));
        } else {
          toast.error(result.message || 'Failed to remove friend.');
        }
      } catch (err) {
        toast.error('Could not remove friend.');
      } finally {
        setModalOpen(false);
      }
    });
  };

  const filteredFriends = yourFriends.filter(f =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />
        <Toaster position="top-right" />

        <div className="flex items-center w-full max-w-4xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
          <FaSearch className="text-[#E5794B] mr-2" />
          <input
            type="text"
            placeholder="Search your friends..."
            className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Your Friends */}
        <div>
          <h3 className="text-lg font-semibold text-[#333333] mb-3">Your Friends</h3>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 border border-[#E5E7EB]">
            {filteredFriends.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                {search ? `No friends found matching "${search}"` : "You have no friends yet."}
              </p>
            ) : (
              filteredFriends.map((friend, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={`/assets/Images/${friend.avatar_image_path}`} alt={friend.username} className="w-10 h-10 rounded-full object-cover border" />
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">@{friend.username}</p>
                      <p className="text-xs text-[#6B7280]">{friend.tier_status || 'Unranked'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/community/member/${friend.username}`}>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-[#AAD977] text-white">
                        <FaEye /> View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemoveFriend(friend)}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-[#FA8B81] text-white"
                    >
                      <FaUserMinus /> Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Someone New */}
        <div>
          <h3 className="text-lg font-semibold text-[#333333] mb-3">Someone New</h3>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 border border-[#E5E7EB]">
            {recommended.map((person, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0">
                <div className="flex items-center gap-4">
                  <img src={`/assets/Images/${person.avatar_image_path}`} alt={person.username} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">@{person.username}</p>
                    <p className="text-xs text-[#6B7280]">{person.tier_status || 'Unranked'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/community/member/${person.username}`}>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-[#AAD977] text-white">
                      <FaEye /> View
                    </button>
                  </Link>
                  <button
                    onClick={() => handleFriendRequest(person)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-[#FFD18C] text-white"
                  >
                    <FaPaperPlane /> Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center space-y-4 max-w-sm w-full">
            <img
              src={`/assets/Images/${modalData.avatar_image_path}`}
              alt={modalData.username}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-white shadow-md"
            />
            <p className="text-gray-800 font-semibold">{modalText}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                className="bg-[#AAD977] hover:bg-[#83AB55] text-white px-4 py-2 rounded-full font-medium"
              >
                Yes
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </CommunityLayout>
  );
};

export default FriendsList;