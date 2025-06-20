import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaEye, FaUserMinus, FaPaperPlane } from 'react-icons/fa';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

// Image imports (replace with correct local paths if needed)
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
  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4">
        <CommunityHeader />

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
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                      style={{ backgroundColor: '#AAD977', color: '#FFFFFF' }}
                    >
                      <FaEye /> View
                    </button>
                  </Link>
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ backgroundColor: '#FA8B81', color: '#FFFFFF' }}
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
                    <button
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                      style={{ backgroundColor: '#AAD977', color: '#FFFFFF' }}
                    >
                      <FaEye /> View
                    </button>
                  </Link>
                  <button
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ backgroundColor: '#FFD18C', color: '#FFFFFF' }}
                  >
                    <FaPaperPlane /> Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default FriendsList;
