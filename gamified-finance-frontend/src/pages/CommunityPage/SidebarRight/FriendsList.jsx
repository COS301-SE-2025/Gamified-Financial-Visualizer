import React from 'react';
import user1 from '../../../assets/Images/pixelAllyway.jpeg';
import user2 from '../../../assets/Images/pixelDesk.jpeg';
import user3 from '../../../assets/Images/pixelPond.jpeg';
import user4 from '../../../assets/Images/pixelMoonLight.jpeg';
import user5 from '../../../assets/Images/pixelTown.jpeg';
import user6 from '../../../assets/Images/pixelBroken.jpeg';
import user7 from '../../../assets/Images/pixelVillage.jpeg';
import user8 from '../../../assets/Images/pixelWindow.gif';
import { useNavigate } from 'react-router-dom';


const friends = [
  { name: 'David', avatar: user1, note: 'Sunday Dinner update' },
  { name: 'Jordan', avatar: user2, note: 'Shared GTA 6 goal' },
  { name: 'Tumi', avatar: user3, note: 'Tagged you in a post' },
  { name: 'Alex', avatar: user4, note: 'New challenge' },
  { name: 'Zinhle', avatar: user5, note: 'Commented on your build' },
  { name: 'Neo', avatar: user6, note: 'Joined your trip' },
  { name: 'Keegan', avatar: user7, note: 'Updated progress' },
  { name: 'Fatima', avatar: user8, note: 'Invited you' },
];

const FriendsList = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3 border">
      <h4 className="text-lg font-semibold text-green-600">Friends</h4>
      {friends.map((friend, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-gray-100 hover:shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{friend.name}</p>
              <p className="text-xs text-gray-500">{friend.note}</p>
            </div>
          </div>
          <button 
          onClick={() => navigate('/friend-profile')}
          className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full hover:bg-green-300 transition">
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
