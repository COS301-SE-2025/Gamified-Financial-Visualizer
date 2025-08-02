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
    iconColor: 'text-[#5FBFFF]', // Matches Leaderboard color
    textColor: 'text-[#2D3748]', // Dark text from performance score
    borderColor: 'border-[#D6EAFE]', // Community Performance bg
    bgColor: 'bg-[#E8F0FA]', // Circle bg color
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-[#5FBFFF]',
    gamification: (p) => (
      <div className="flex items-center mt-2 space-x-3">
        <div className="flex items-center px-3 py-1 rounded-full bg-white shadow text-xs font-semibold text-[#4A5568] border border-[#D6EAFE]">
          <FaMedal className="text-[#FFC541] mr-1.5" /> {/* Games Played color */}
          Lvl {p.tierStatus}
        </div>
        <div className="flex items-center px-3 py-1 rounded-full bg-white shadow text-xs font-semibold text-[#4A5568] border border-[#D6EAFE]">
          <FaFire className="text-[#F68D2B] mr-1.5" /> {/* Friends color */}
          {p.totalPoints} XP
        </div>
      </div>
    )
  },

  friend_request_accepted: {
    useAvatar: true,
    iconColor: 'text-[#FF7F9E]', // Social Post color
    textColor: 'text-[#2D3748]',
    borderColor: 'border-[#FFE4EC]',
    bgColor: 'bg-[#FFE4EC]', // Softened Social Post color
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-[#FF7F9E]',
    gamification: () => (
      <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-white shadow text-xs font-semibold text-[#4A5568] border border-[#D6EAFE]">
        <FaCoins className="text-[#FFC541] mr-1.5 animate-pulse" /> {/* Games Played color */}
        +10 Social Points
      </div>
    )
  },

  achievement: {
    icon: <FaTrophy />,
    iconColor: 'text-[#FFC541]', // Games Played color
    textColor: 'text-[#2D3748]',
    borderColor: 'border-[#FFF6E5]',
    bgColor: 'bg-[#FFF6E5]', // Lightened Games Played color
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-[#FFC541]',
    gamification: (p) => (
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center px-3 py-1 rounded-full bg-white shadow text-xs font-semibold text-[#4A5568] border border-[#D6EAFE]">
          <FaGem className="text-[#FFC541] mr-1.5" />
          +{p.reward} Coins
        </div>
        <span className="px-3 py-1 rounded-full bg-[#FFF6E5] text-[#F68D2B] text-xs font-bold shadow border border-[#FFE4B5]">
          {p.badge?.toUpperCase()} BADGE
        </span>
      </div>
    )
  },

  insight: {
    icon: <FaChartBar />,
    iconColor: 'text-[#7FDD53]', // Challenges color
    textColor: 'text-[#2D3748]',
    borderColor: 'border-[#E8F0FA]',
    bgColor: 'bg-[#E8F0FA]', // Circle bg color
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-[#7FDD53]',
    gamification: (p) => (
      <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-white shadow text-xs font-semibold text-[#4A5568] border border-[#D6EAFE]">
        <FaFire className="text-[#F68D2B] mr-1.5" /> {/* Friends color */}
        {p.streak}-day {p.category} streak
      </div>
    )
  },

  budget_due: {
    icon: <FaCalendarAlt />,
    iconColor: 'text-[#F68D2B]', // Friends color
    textColor: 'text-[#2D3748]',
    borderColor: 'border-[#FFF6E5]',
    bgColor: 'bg-[#FFF6E5]', // Lightened Friends color
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-[#F68D2B]'
  },

  budget_over: {
    icon: <FaExclamationTriangle />,
    iconColor: 'text-[#FF8A8A]', // Communities color
    textColor: 'text-[#2D3748]',
    borderColor: 'border-[#FFE4EC]',
    bgColor: 'bg-[#FFE4EC]', // Lightened Communities color
    className: 'rounded-2xl shadow-md animate-pulse hover:shadow-lg transition-all duration-200 border-l-4 border-[#FF8A8A]'
  },

  default: {
    icon: <FaBell />,
    iconColor: 'text-[#718096]', // Performance label color
    textColor: 'text-[#2D3748]',
    borderColor: 'border-[#E8F0FA]',
    bgColor: 'bg-[#E8F0FA]', // Circle bg color
    className: 'rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-[#718096]'
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
        } else toast.error('Failed to load notifications');
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

  const dismiss = async (timestamp) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${user.id}/${timestamp}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setNotes(ns => ns.filter(n => n.timestamp !== timestamp));
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
      <div key={note.timestamp} className={`bg-white border ${style.borderColor} rounded-lg p-4 shadow-sm`}>
        <div className="flex items-start">
          {/* Show avatar for friend-related notifications */}
          {style.useAvatar ? (
            <img
              src={avatarSrc}
              alt="user avatar"
              className="w-12 h-12 rounded-full object-cover border mr-3"
            />
          ) : (
            // Show icon for other notifications
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
                    className="bg-[#5FBFFF] hover:bg-[#4CA8E0] text-white text-xs px-3 py-1 rounded-full shadow-sm transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondRequest('declined', payload.from)}
                    className="border border-[#D6EAFE] hover:border-[#C4DDF5] text-[#4A5568] text-xs px-3 py-1 rounded-full shadow-sm transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </>
            )}

            {note.type === 'achievement' && (
              <>
                <p className={`font-medium ${style.textColor}`}>
                  Achievement unlocked: <span className="font-semibold">{payload.title}</span>
                </p>
                {style.gamification?.(payload)}
                <button
                  onClick={() => handleViewMore(payload.goalId)}
                 className="mt-2 border border-[#FFC541] bg-[#FFF6E5] hover:bg-[#FFC541] hover:text-white text-[#F68D2B] text-xs px-3 py-1 rounded-full shadow-sm transition-colors duration-200"
                >
                  View Goal
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
                <p className="text-xs text-[#FF8A8A] mt-1">Spent: R{payload.spent} / Limit: R{payload.limit}</p>
              </>
            )}
          </div>
          <button 
            onClick={() => dismiss(note.timestamp)} 
            className="ml-2 text-[#718096] hover:text-[#2D3748] transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-2xl z-50 rounded-l-3xl border-l border-gray-200 overflow-y-auto">
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <h2 className="text-[#E5794B] font-semibold text-xl flex items-center gap-2">
          <FaBell className="text-[#E5794B]" /> Notifications
        </h2>
        <FaTimes onClick={onClose} className="text-[#E5794B] text-xl cursor-pointer" />
      </div>
      <div className="p-4 space-y-4">
        {notes.length === 0 ? (
          <div className="text-center text-gray-400 mt-24">
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
