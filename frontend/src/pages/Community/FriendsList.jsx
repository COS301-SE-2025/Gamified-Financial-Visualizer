import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaUserPlus, FaEye, FaUserMinus, FaPaperPlane } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

// Image imports
import snowAvatar from '../../assets/Images/avatars/snakeAvatar.jpeg';
import beachAvatar from '../../assets/Images/avatars/beachAvatar.jpeg';
import smithAvatar from '../../assets/Images/avatars/windowAvatar.jpeg';
import meAvatar from '../../assets/Images/avatars/lilyAvatar.jpeg';
import jamesAvatar from '../../assets/Images/avatars/cottageAvatar.jpeg';
import kyleAvatar from '../../assets/Images/avatars/pinkskyAvatar.jpeg';
import randyAvatar from '../../assets/Images/avatars/stonesAvatar.jpeg';
import sunAvatar from '../../assets/Images/avatars/flowerAvatar.jpeg';
import zaneleAvatar from '../../assets/Images/avatars/carAvatar.jpeg';

const yourFriends = [
  { name: 'snow', level: 'Silver', avatar: snowAvatar },
  { name: 'beached_in', level: 'Gold', avatar: beachAvatar },
  { name: 'miss_smith', level: 'Gold', avatar: smithAvatar },
  { name: 'thats_me', level: 'Platinum', avatar: meAvatar },
  { name: 'james_link', level: 'Silver', avatar: jamesAvatar },
];

const someoneNew = [
  { name: 'kyle_guy', level: 'Wood', avatar: kyleAvatar },
  { name: 'randy', level: 'Silver', avatar: randyAvatar },
  { name: 'sunflower', level: 'Gold', avatar: sunAvatar },
  { name: 'zanele', level: 'Platinum', avatar: zaneleAvatar },
];

const FriendsList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalData, setModalData] = useState({ name: '', avatar: '' });
  const [onConfirm, setOnConfirm] = useState(() => () => { });

  const openModal = (message, user, action) => {
    setModalText(message);
    setModalData(user);
    setOnConfirm(() => action);
    setModalOpen(true);
  };

  const handleFriendRequest = (user) => {
    openModal(`Send a friend request to @${user.name}?`, user, () => {
      toast.success(`Friend request sent to @${user.name}`, {
        icon: <FaPaperPlane className="text-[#1E3A8A]" />,
        style: {
          borderRadius: '9999px',
          background: '#B1E1FF',
          color: '#1E3A8A',
        },
      });
      setModalOpen(false);
    });
  };

  const handleRemoveFriend = (user) => {
    openModal(`Remove @${user.name} from your friends list?`, user, () => {
      toast.success(`@${user.name} removed from your friends list`, {
        icon: <FaUserMinus className="text-[#7F1D1D]" />,
        style: {
          borderRadius: '9999px',
          background: '#FE9B90',
          color: '#FFFFFF',
        },
      });
      setModalOpen(false);
    });
  };


  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
         <CommunityHeader />
        <Toaster position="top-right" />

        {/* Your Friends */}
        <div>
          <h3 className="text-lg font-semibold text-[#333333] mb-3">Your Friends</h3>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 border border-[#E5E7EB]">
            {yourFriends.map((friend, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0">
                <div className="flex items-center gap-4">
                  <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">@{friend.name}</p>
                    <p className="text-xs text-[#6B7280]">{friend.level}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/community/member/${friend.name}`}>
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
            ))}
          </div>
        </div>

        {/* Someone New */}
        <div>
          <h3 className="text-lg font-semibold text-[#333333] mb-3">Someone New</h3>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 border border-[#E5E7EB]">
            {someoneNew.map((person, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6] last:border-0">
                <div className="flex items-center gap-4">
                  <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">@{person.name}</p>
                    <p className="text-xs text-[#6B7280]">{person.level}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/community/member/${person.name}`}>
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

      {/* Stylized Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center space-y-4 max-w-sm w-full">
            <img
              src={modalData.avatar}
              alt={modalData.name}
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
