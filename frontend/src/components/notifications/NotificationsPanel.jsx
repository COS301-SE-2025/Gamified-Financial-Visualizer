import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaTimes, FaUserPlus, FaCheckCircle, FaTrophy, FaBell, FaChartBar,
  FaCalendarAlt, FaExclamationTriangle, FaCoins, FaMedal, FaFire, FaHeart, FaGem
} from 'react-icons/fa';

const notificationStyles = {
  friend_request: {
    useAvatar: true,
    iconColor: 'text-blue-500 dark:text-blue-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-blue-100 dark:border-blue-900',
    bgColor: 'bg-blue-50 dark:bg-gray-800',
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-blue-500 dark:border-blue-400',
    gamification: (p) => (
      <div className="flex items-center mt-2 space-x-3">
        <div className="flex items-center px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow text-xs font-semibold text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-gray-600">
          <FaMedal className="text-yellow-500 dark:text-yellow-400 mr-1.5" />
          Lvl {p.tierStatus}
        </div>
        <div className="flex items-center px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow text-xs font-semibold text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-gray-600">
          <FaFire className="text-orange-500 dark:text-orange-400 mr-1.5" />
          {p.totalPoints} XP
        </div>
      </div>
    )
  },

  friend_request_accepted: {
    useAvatar: true,
    iconColor: 'text-pink-500 dark:text-pink-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-pink-100 dark:border-pink-900',
    bgColor: 'bg-pink-50 dark:bg-gray-800',
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-pink-500 dark:border-pink-400',
    gamification: () => (
      <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow text-xs font-semibold text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-gray-600">
        <FaCoins className="text-yellow-500 dark:text-yellow-400 mr-1.5 animate-pulse" />
        +10 Social Points
      </div>
    )
  },

  achievement: {
    icon: <FaTrophy />,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-yellow-100 dark:border-yellow-900',
    bgColor:
      'bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900',
    className:
      'rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-yellow-500 dark:border-yellow-400 relative overflow-hidden',
    gamification: (p) => (
      <div className="flex items-center gap-2 mt-2">
        {p?.reward ? (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-700 shadow text-[11px] font-semibold text-yellow-700 dark:text-yellow-300 border border-yellow-200/70 dark:border-gray-600">
            <FaMedal className="mr-1.5" />
            +{p.reward} XP
          </div>
        ) : null}
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-gray-700 shadow text-[11px] font-semibold text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-gray-600">
          <FaTrophy className="mr-1.5" />
          Achievement
        </div>
      </div>
    ),
  },

  challenge_invite: {
    icon: <FaMedal />,
    iconColor: 'text-purple-500 dark:text-purple-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-purple-100 dark:border-purple-900',
    bgColor:
      'bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900',
    className:
      'rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-purple-500 dark:border-purple-400 relative overflow-hidden',
    gamification: (p) => (
      <div className="flex items-center gap-2 mt-2">
        {p?.reward ? (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-700 shadow text-[11px] font-semibold text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-gray-600">
            <FaFire className="mr-1.5" />
            +{p.reward} XP
          </div>
        ) : null}
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 dark:bg-gray-700 shadow text-[11px] font-semibold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-gray-600">
          <FaMedal className="mr-1.5" />
          New Challenge
        </div>
      </div>
    ),
  },

  insight: {
    icon: <FaChartBar />,
    iconColor: 'text-green-500 dark:text-green-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-blue-100 dark:border-blue-900',
    bgColor: 'bg-blue-50 dark:bg-gray-800',
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-green-500 dark:border-green-400',
    gamification: (p) => (
      <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-white dark:bg-gray-700 shadow text-xs font-semibold text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-gray-600">
        <FaFire className="text-orange-500 dark:text-orange-400 mr-1.5" />
        {p.streak}-day {p.category} streak
      </div>
    )
  },

  budget_due: {
    icon: <FaCalendarAlt />,
    iconColor: 'text-orange-500 dark:text-orange-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-yellow-100 dark:border-yellow-900',
    bgColor: 'bg-yellow-50 dark:bg-gray-800',
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-orange-500 dark:border-orange-400'
  },

  budget_over: {
    icon: <FaExclamationTriangle />,
    iconColor: 'text-red-500 dark:text-red-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-red-100 dark:border-red-900',
    bgColor: 'bg-red-50 dark:bg-gray-800',
    className: 'rounded-2xl shadow-md animate-pulse hover:shadow-lg transition-all duration-200 border-l-4 border-red-500 dark:border-red-400'
  },

  default: {
    icon: <FaBell />,
    iconColor: 'text-gray-500 dark:text-gray-400',
    textColor: 'text-gray-800 dark:text-gray-100',
    borderColor: 'border-gray-100 dark:border-gray-700',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-gray-500 dark:border-gray-400'
  }
};

const NotificationsPanel = ({ onClose }) => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications/${user.id}`);
        const json = await res.json();
        if (json.status === 'success') {
          const sorted = json.data.sort((a, b) => a.priority - b.priority || b.timestamp - a.timestamp);
          setNotes(sorted);

          // fire-and-forget "viewed" mark
          const stamps = sorted.map(n => n.timestamp);
          fetch(`http://localhost:5000/api/notifications/${user.id}/viewed`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timestamps: stamps }),
          }).catch(() => { });
        } else {
          toast.error('Failed to load notifications');
        }
      } catch (err) {
        toast.error('Error fetching notifications');
      }
    })();
  }, [user.id]);


  const respondRequest = async (action, friendId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/friends/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, friend_id: friendId, action })
      });
      if (!res.ok) throw new Error('Server error');
      toast.success(action === 'accepted' ? 'Friend added!' : 'Request declined');
      setNotes(prev => prev.filter(n => !(n.type === 'friend_request' && n.payload.from === friendId)));
    } catch (e) {
      toast.error(e.message || 'Could not respond');
    }
  };

const dismiss = async (key, timestamp) => {
  try {
    let res;
    if (key) {
      res = await fetch(`http://localhost:5000/api/notifications/${user.id}/key/${encodeURIComponent(key)}`, {
        method: 'DELETE'
      });
    } else {
      res = await fetch(`http://localhost:5000/api/notifications/${user.id}/${timestamp}`, { method: 'DELETE' });
    }
    if (!res.ok) throw new Error();
    setNotes(ns => ns.filter(n => n.timestamp !== timestamp)); // optimistic remove
  } catch {
    toast.error('Could not dismiss notification');
  }
};


  const handleViewMore = (goalId) => navigate(`/goals/details/${goalId}`);
  const handleViewUser = (username) => navigate(`/community/member/${username}`);

  const renderNotification = (note) => {
    const style = notificationStyles[note.type] || notificationStyles.default;
    const payload = note.payload;
    const avatarSrc = payload?.avatar ? `/assets/Images/${payload.avatar}` : '/default-avatar.png';

    return (
      <div key={note.timestamp} className={`${style.bgColor} border ${style.borderColor} rounded-lg p-4 shadow-sm dark:shadow-md dark:shadow-gray-800`}>
        <div className="flex items-start">
          {style.useAvatar ? (
            <img
              src={avatarSrc}
              alt="user avatar"
              className="w-12 h-12 rounded-full object-cover border mr-3 border-gray-200 dark:border-gray-600"
            />
          ) : (
            <div className="mr-3 mt-0.5">
              {React.cloneElement(style.icon, { className: `${style.iconColor} text-xl` })}
            </div>
          )}

          <div className="flex-1">
            {note.type === 'friend_request' && (
              <>
                <p className={`font-medium ${style.textColor}`}>
                  <span className="font-semibold">{payload.username}</span> wants to connect
                </p>
                {style.gamification?.(payload)}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => respondRequest('accepted', payload.from)}
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow-sm transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondRequest('declined', payload.from)}
                    className="border border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full shadow-sm transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </>
            )}

            {note.type === 'achievement' && (
              <>
                <div className="flex items-start gap-3">
                  {/* Left: banner or trophy */}
                  {payload?.banner ? (
                    <div className="relative">
                      <img
                        src={`/assets/Images/${payload.banner}`}
                        alt={`${payload.title} banner`}
                        className="w-16 h-16 rounded-xl object-cover border border-yellow-200 dark:border-yellow-700 shadow-sm"
                      />
                      <span className="pointer-events-none absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-yellow-200/30 to-transparent blur-[6px]"></span>
                    </div>
                  ) : (
                    <div className="mt-0.5">
                      {React.cloneElement(notificationStyles.achievement.icon, {
                        className: `${notificationStyles.achievement.iconColor} text-2xl`,
                      })}
                    </div>
                  )}

                  {/* Right: content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`mt-2 font-semibold ${notificationStyles.achievement.textColor} text-sm leading-snug break-words`}
                    >
                      <span
                        className="block max-w-full"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        title={note.message || 'Achievement unlocked'}
                      >
                        {note.message || 'Achievement unlocked'}
                      </span>
                    </p>


                    {notificationStyles.achievement.gamification?.(payload)}

                    <button
                      onClick={() => handleViewMore(payload.goalId)}
                      className="mt-3 inline-flex items-center gap-2 border border-yellow-500 bg-yellow-50 hover:bg-yellow-500 hover:text-white text-yellow-600 dark:text-yellow-300 dark:bg-gray-800 dark:hover:bg-yellow-600 text-xs px-3 py-1.5 rounded-full shadow-sm transition-colors duration-200"
                    >
                      View Goal
                    </button>
                  </div>
                </div>
              </>
            )}


            {note.type === 'goal_reminder' && (
              <>
                <p className={`font-medium ${style.textColor}`}>
                  {payload.title} is due on {new Date(payload.dueDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleViewMore(payload.goalId)}
                  className="mt-2 border border-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white text-blue-500 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-blue-600 text-xs px-3 py-1 rounded-full shadow-sm transition-colors duration-200"
                >
                  View Goal
                </button>
              </>
            )}

            {note.type === 'challenge_invite' && (
              <>
                <p className={`font-medium ${style.textColor}`}>
                  {note.message || `You joined “${payload.title}”`}
                </p>
                {style.gamification?.(payload)}
                <button
                  onClick={() => navigate(`/community/challenges/${payload.challengeId}`)}
                  className="mt-2 border border-purple-500 bg-purple-50 hover:bg-purple-500 hover:text-white text-purple-500 dark:text-purple-400 dark:bg-gray-700 dark:hover:bg-purple-600 text-xs px-3 py-1 rounded-full shadow-sm transition-colors duration-200"
                >
                  View Challenge
                </button>
              </>
            )}
            {note.type === 'insight' && (
              <>
                <p className={`font-medium ${style.textColor}`}>
                  {payload.message}
                </p>
                {style.gamification?.(payload)}
              </>
            )}

            {note.type === 'budget_due' && (
              <p className={`font-medium ${style.textColor}`}>
                Budget due: {payload.category} - R{payload.amount} due {payload.dueDate}
              </p>
            )}

            {note.type === 'budget_over' && (
              <>
                <p className={`font-medium ${style.textColor}`}>
                  Budget exceeded in {payload.category}
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">Spent: R{payload.spent} / Limit: R{payload.limit}</p>
              </>
            )}
          </div>
          <button
            onClick={() => dismiss(note.key, note.timestamp)}
            className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white dark:bg-gray-900 shadow-2xl z-50 rounded-l-3xl border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-orange-500 dark:text-orange-400 font-semibold text-xl flex items-center gap-2">
          <FaBell className="text-orange-500 dark:text-orange-400" /> Notifications
        </h2>
        <FaTimes
          onClick={onClose}
          className="text-orange-500 dark:text-orange-400 text-xl cursor-pointer hover:text-orange-600 dark:hover:text-orange-300"
        />
      </div>
      <div className="p-4 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 mt-24">
            <FaBell className="text-3xl mx-auto mb-2" />
            <p>No notifications</p>
          </div>
        ) : (
          notes.map(renderNotification)
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;