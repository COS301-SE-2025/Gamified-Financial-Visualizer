import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaBell
} from 'react-icons/fa';

import image1 from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import image2 from '../../assets/Images/avatars/lilyAvatar.jpeg';
import image3 from '../../assets/Images/avatars/beachAvatar.jpeg';
import image4 from '../../assets/Images/avatars/sandAvatar.jpeg';
import image5 from '../../assets/Images/avatars/shoreAvatar.jpeg';

const mockNotifications = [
  {
    id: 1,
    type: 'achievement',
    message: "You completed your 'Laptop Fund' goal!",
    img: image1,
    completed: true,
  },
  {
    id: 2,
    type: 'goal',
    message: "Your 'Vacation' goal is 50% complete!",
    img: image2,
    completed: false,
  },
  {
    id: 3,
    type: 'friend_request',
    name: 'Lily Rose',
    img: image3,
  },
  {
    id: 4,
    type: 'friend_request',
    name: 'Sandy Shores',
    img: image4,
  },
  {
    id: 5,
    type: 'achievement',
    message: "You earned 100XP for completing a lesson!",
    img: image5,
    completed: true,
  },
];


const NotificationsPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`);
      const notes = await res.json();
      setNotifications(notes.data);
    }
    fetchNotifications();
  });

  const respondRequest = async (action, friend_id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/friends/update`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            friend_id: friend_id,
            action: action
          })
        }
      );
      if (!res.ok) throw new Error('Response failed');
      toast.success(action === 'accepted' ? 'Friend added' : 'Request declined');
    } catch (e) {
      toast.error(e.message);
    }
  };


  if (!notifications) {
    return (
      <div className="fixed top-0 right-0 w-[380px] h-full bg-white shadow-2xl z-50 rounded-l-3xl border-l border-gray-200 overflow-y-auto transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-[#E5794B] font-semibold text-xl flex items-center gap-2">
            <FaBell className="text-[#E5794B]" /> Notifications
          </h2>
          <FaTimes
            className="text-[#E5794B] text-xl cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[380px] h-full bg-white shadow-2xl z-50 rounded-l-3xl border-l border-gray-200 overflow-y-auto transition-all">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-[#E5794B] font-semibold text-xl flex items-center gap-2">
          <FaBell className="text-[#E5794B]" /> Notifications
        </h2>
        <FaTimes
          className="text-[#E5794B] text-xl cursor-pointer"
          onClick={onClose}
        />
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {notifications.map((note) => (
          <div
            key={note.payload.id}
            className="flex items-center justify-between p-3 rounded-xl shadow-sm border bg-white"
          >
            <img
              src={'../../assets/Images/' + note.payload.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />

            <div className="flex-1 mx-3">
              {note.type === 'friend_request' ? (
                <>
                  <p className="text-sm text-gray-700 font-semibold">{note.payload.username}</p>
                  <p className="text-xs text-gray-500">sent you a friend request</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => respondRequest('accepted', note.payload.from)}
                      className="bg-[#83AB55] text-white text-xs px-3 py-1 rounded-full hover:bg-green-600 transition">
                      Accept
                    </button>
                    <button onClick={() => respondRequest('declined', note.payload.from)}
                      className="bg-[#FB7272] text-white text-xs px-3 py-1 rounded-full hover:bg-red-600 transition">
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-700">{note.payload.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {note.payload.completed ? (
                      <FaCheckCircle className="text-[#83AB55] text-sm" />
                    ) : (
                      <FaTimesCircle className="text-[#FB7272] text-sm" />
                    )}
                  </div>
                </>
              )}
            </div>

            {note.type !== 'friend_request' && (
              <button className="bg-[#83AB55] text-white text-xs px-3 py-1 rounded-full">
                View
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;