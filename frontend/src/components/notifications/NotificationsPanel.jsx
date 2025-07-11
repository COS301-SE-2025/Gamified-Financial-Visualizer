import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaCalendarAlt,
  FaBell,
  FaChartBar,
  FaExclamationTriangle,
  FaTrophy
} from 'react-icons/fa';

/**
 * Expects items like:
 * {
 *   type: "friend_request" | "friend_request_accepted" | "achievement" | "insight" | …,
 *   payload: { from, username, avatar, …, message?, goalId?, title? },
 *   timestamp: number,
 *   message?: string,
 *   priority: number
 * }
 */

const NotificationsPanel = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`);
        const json = await res.json();
        if (json.status === 'success') {
          const sorted = json.data
            .sort((a, b) =>
              a.priority - b.priority || b.timestamp - a.timestamp
            );
          setNotes(sorted);
        } else {
          toast.error('Failed to load notifications');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching notifications');
      }
    })();
  }, [user.id]);

  const respondRequest = async (action, friendId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/friends/update`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            friend_id: friendId,
            action
          })
        }
      );
      if (!res.ok) throw new Error('Server error');
      toast.success(action === 'accepted' ? 'Friend added' : 'Request declined');
      // optionally remove that notification from the UI:
      setNotes((prev) => prev.filter(n => !(n.type === 'friend_request' && n.payload.from === friendId)));
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Could not respond');
    }
  };

  const dismiss = async (timestamp) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/notifications/${user.id}/${timestamp}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error();
      // remove from UI
      setNotes(ns => ns.filter(n => n.timestamp !== timestamp));
    } catch {
      toast.error('Could not dismiss notification');
    }
  };
  const handleViewMore = (goalId) => {
    navigate(`/goals/details/${goalId}`);
  };

  const handleViewUser = (username) => {
    navigate(`community/member/${username}`);
  };


  return (
    <div className="fixed top-0 right-0 w-[380px] h-full bg-white shadow-2xl z-50 rounded-l-3xl border-l border-gray-200 overflow-y-auto">
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
        {notes.length === 0 && (
          <p className="text-gray-500 text-center">No notifications</p>
        )}

        {notes.map((note) => {
          const key = note.timestamp; // hopefully unique
          const avatarSrc = note.payload.avatar
            ? `/assets/Images/${note.payload.avatar}`
            : null;

          return (
            <div
              key={key}
              className="flex items-center justify-between p-3 rounded-xl shadow-sm border bg-white"
            >
              {avatarSrc && (
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border"
                />
              )}

              <div className="flex-1 mx-3">
                {note.type === 'friend_request' && (
                  <>
                    <p className="text-sm font-semibold text-gray-700">
                      {note.payload.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      sent you a friend request
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          respondRequest('accepted', note.payload.from)
                        }
                        className="bg-[#83AB55] text-white text-xs px-3 py-1 rounded-full hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          respondRequest('declined', note.payload.from)
                        }
                        className="bg-[#FB7272] text-white text-xs px-3 py-1 rounded-full hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}

                {note.type === 'achievement' && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border-l-4 border-green-400 animate-pulse">
                    <FaTrophy className="text-green-500 text-2xl" />
                    <p className="text-green-700 font-medium">
                      {note.message || `You completed "${note.payload.title}"!`}
                    </p>
                  </div>
                )}

                {note.type === 'insight' && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                    <FaChartBar className="text-blue-500 text-2xl animate-bounce" />
                    <p className="text-blue-700 font-medium">{note.payload.message}</p>
                  </div>
                )}

                {note.type === 'budget_due' && (
                  <div
                    key={note.timestamp}
                    className={"flex items-center gap-3 p-3 rounded-lg shadow-sm bg-orange-50 border-l-4 border-orange-400"}
                  >
                    <FaCalendarAlt className="text-orange-500 text-2xl animate-bounce" />
                    <p className="text-orange-700 font-medium">
                      📅 {note.message}
                    </p>
                  </div>
                )}

                {note.type === 'budget_over' && (
                  <div
                    key={note.timestamp}
                    className={`flex items-center gap-3 p-3 rounded-lg shadow-sm bg-red-50 border-l-4 border-red-400 animate-pulse`}
                  >
                    <FaExclamationTriangle className="text-red-500 text-2xl" />
                    <div>
                      <p className="text-red-700 font-medium">
                        🚨 {note.message}
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Spent: {note.payload.spent} / {note.payload.limit}
                      </p>
                    </div>
                  </div>
                )}

                {note.type === 'friend_request_accepted' && (
                  <div
                    key={note.timestamp}
                    className="
                    flex items-center gap-3 p-3 rounded-lg bg-green-50 border-l-4 border-green-400 animate-pulse"
                  >
                    <FaUserPlus className="text-green-500 text-2xl animate-bounce" />

                    <div className="flex-1">
                      <p className="text-green-800 font-semibold">
                        {note.payload.username || 'Someone'} accepted your friend request!
                      </p>
                    </div>
                  </div>
                )}

                {/* add more types here… */}
              </div>

              {/* optional action button for non-friend-request */}
              {note.type === 'achievement' && note.payload.goalId && (
                <button onClick={() => handleViewMore(note.payload.goalId)}
                  className="bg-[#83AB55] text-white text-xs px-3 py-1 rounded-full">
                  View
                </button>
              )}

              {note.type === 'friend_request_accepted' && note.payload.user_id && (
                <button onClick={() => handleViewUser(note.payload.username)}
                  className="bg-[#83AB55] text-white text-xs px-3 py-1 rounded-full">
                  View
                </button>
              )}
                 <button
              onClick={() => dismiss(note.timestamp)}
              className="text-gray-400 hover:text-gray-600 ml-2"
              title="Dismiss"
            >
              <FaTimes />
            </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPanel;