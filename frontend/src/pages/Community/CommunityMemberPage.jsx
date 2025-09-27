import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';

import { FaChartLine, FaArrowLeft, FaCrown, FaEye, FaMedal, FaUserMinus, FaPaperPlane, FaTimes, FaCheck } from 'react-icons/fa';

const CommunityMemberPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const { username } = useParams();
  const [isFriend, setIsFriend] = useState(false);
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const [levelProgress, setLevelProgress] = useState(null);
  const [numComplete, setNumComplete] = useState(null);
  const [summary, setSummary] = useState(null);
  const [friendship, setFriendship] = useState(null);

  // Check if the current user is viewing their own profile
  const isViewingOwnProfile = user?.username === username;

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const r = await fetch(`http://localhost:5000/api/community/userID/${username}`);
        const { data } = await r.json();
        setUserID(data);
      } catch (e) {
        console.error(e);
        navigate('/community');
      }
    })();
  }, [username]);

  useEffect(() => {
    if (!userID) return;
    (async () => {
      try {
        const [bar, perf, learn, achs, recA, comms, lvl, stat] = await Promise.all([
          fetch(`http://localhost:5000/api/auth/top-bar/${userID}`),
          fetch(`http://localhost:5000/api/auth/profile/performance-stats/${userID}`),
          fetch(`http://localhost:5000/api/learning/summary/${userID}`),
          fetch(`http://localhost:5000/api/achievements/user/${userID}`),
          fetch(`http://localhost:5000/api/auth/profile/recent-achievements/${userID}`),
          fetch(`http://localhost:5000/api/auth/profile/communities/${userID}`),
          fetch(`http://localhost:5000/api/auth/profile/level-progress/${userID}`),
          fetch(`http://localhost:5000/api/community/friends/status/${user.id}/${userID}`)
        ]);
        const [barData, perfData, summaryData,
          achRes, recArch, commRes, lvlRes, statusRes] = await Promise.all([
            bar.json(), perf.json(), learn.json(),
            achs.json(), recA.json(), comms.json(), lvl.json(), stat.json()
          ]);
        setProfileData(barData.data);
        setPerformanceStats(perfData.data);
        setSummary(summaryData.data);
        setNumComplete(achRes.data.filter(a => a.achievement_status === 'complete').length);
        setRecentAchievements(recArch.data);
        setCommunityData(commRes.data);
        setLevelProgress(lvlRes.data);
        setFriendship(statusRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile data' + (err.message ? `: ${err.message}` : ''));
      }
    })();
  }, [userID]);

  const handleFriendRequest = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/friends/request/${user.id}/${userID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(`Friend request sent to ${username}`, {
          icon: <FaPaperPlane className="text-[#1E3A8A]" />,
          style: {
            borderRadius: '9999px',
            background: '#B1E1FF',
            color: '#1E3A8A',
          },
        });
        setIsFriend(true);
      } else {
        toast.error(result.message || 'Failed to send request.');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send request.');
      console.error(error.message || 'Failed to send request.')
    }
  };

  const respondRequest = async (action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/friends/update`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            friend_id: userID,
            action: action
          })
        }
      );
      if (!res.ok) throw new Error('Response failed');
      setFriendship({
        status: action === 'accepted' ? 'accepted' : null,
        isInitiator: false
      });
      toast.success(action === 'accepted' ? 'Friend added' : 'Request declined');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const cancelRequest = async () => {
    // Implement the cancel request functionality if needed
  }

  const removeFriend = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/community/friends/remove/${user.id}/${userID}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Remove failed');
      setFriendship({ status: null, isInitiator: false });
      toast.success('Friend removed');
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (!profileData || !communityData || !summary || !performanceStats || !levelProgress || numComplete === null) {
    return (
      <CommunityLayout>
      </CommunityLayout>
    );
  }

  let friendButtons;
  const statusF = friendship?.status;
  const isInitiator = friendship?.isInitiator;

  // Don't show friend buttons if viewing own profile or if already friends
  if (!isViewingOwnProfile && !statusF) {
    friendButtons = (
      <button onClick={handleFriendRequest}
        className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition whitespace-nowrap"
      >
        <FaPaperPlane size={12} className="sm:size-3" /> Request Friend
      </button>
    );
  } else if (statusF === 'pending') {
    friendButtons = isInitiator
      ? (
        <button onClick={cancelRequest}
          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition whitespace-nowrap"
        >
          <FaTimes size={12} className="sm:size-3" /> Cancel Request
        </button>
      )
      : (
        <div className="flex gap-2">
          <button onClick={() => respondRequest('accepted')}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition whitespace-nowrap"
          >
            <FaCheck size={12} className="sm:size-3" /> Accept
          </button>
          <button onClick={() => respondRequest('declined')}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-[#FA8B81] text-white shadow hover:bg-[#f56a5a] transition whitespace-nowrap"
          >
            <FaTimes size={12} className="sm:size-3" /> Decline
          </button>
        </div>
      );
  } else if (statusF === 'accepted' && !isViewingOwnProfile) {
    friendButtons = (
      <button onClick={removeFriend} className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-[#FA8B81] text-white shadow hover:bg-[#f56a5a] transition whitespace-nowrap">
        <FaUserMinus size={12} className="sm:size-3" /> Remove Friend
      </button>
    );
  }

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 dark:bg-gray-900">

        {/* Profile Banner */}
        <div className="relative">
          <img src={`/assets/Images/${profileData.banner_image_path}`} alt="banner" className="w-full h-32 sm:h-40 object-cover rounded-2xl" />
          <div className="absolute -bottom-8 sm:-bottom-10 left-3 mt-8 sm:left-6 flex items-center gap-2 sm:gap-4">
            <img
              src={`/assets/Images/${profileData.avatar_image_path}`}
              alt="avatar"
              className="w-16 h-16 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover"
            />
            <div className="bg-white dark:bg-gray-800 shadow-md px-3 py-1 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 sm:gap-3">
              <p className="text-sm sm:text-lg font-medium text-gray-800 dark:text-gray-200 truncate max-w-[120px] sm:max-w-none">{profileData?.username || '...'}</p>
              <p className="hidden xs:inline text-xs sm:text-sm italic text-[#F28B82] whitespace-nowrap">
                Joined: <span className="font-medium">{profileData && new Date(profileData.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute right-3 sm:right-6 -bottom-8 sm:-bottom-10 flex justify-end gap-2 sm:gap-3">
            {friendButtons}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 sm:gap-2 bg-[#E5E7EB] dark:bg-gray-700 text-[#374151] dark:text-gray-200 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-600 transition whitespace-nowrap"
            >
              <FaArrowLeft size={12} className="sm:size-3" /> Back
            </button>
          </div>
        </div>

        {/* XP Progress - Fixed for mobile */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow flex flex-col gap-3 sm:gap-4 mt-12 sm:mt-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-yellow-400 dark:border-[#FFD18C] dark:text-[#CF6108] font-bold flex items-center justify-center shadow-sm text-sm sm:text-base">
                {levelProgress?.level_number ?? '—'}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">Lv {levelProgress?.tier_status ?? '—'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{levelProgress
                  ? `${levelProgress.points_to_next_tier} points to next tier`
                  : 'Loading...'}</p>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f8e5b5] dark:text-[#CF6108] font-bold flex items-center justify-center shadow-sm text-sm sm:text-base">
              {levelProgress?.next_level ?? '—'}
            </div>
          </div>

          {/* Smaller progress bar for mobile only */}
          <div className="relative mt-1 sm:mt-2">
            <div className="w-full h-3 sm:h-6 bg-yellow-100 dark:bg-[#FFD18C] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-[#FFFD18C] rounded-full"
                style={{
                  width: levelProgress
                    ? `${Math.min(
                      (levelProgress.current_tier_xp / levelProgress.tier_xp_required) * 100,
                      100
                    ).toFixed(1)}%`
                    : '0%'
                }}
              />
            </div>
            <div className="absolute inset-0 flex justify-center items-center text-xs font-semibold text-yellow-700 dark:text-[#CF6108] sm:text-sm">
              {levelProgress
                ? `${levelProgress.current_tier_xp}/${levelProgress.tier_xp_required}`
                : '...'}
            </div>
          </div>
        </div>

        {/* Stats - Better spacing for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Performance stats - Improved spacing */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <FaChartLine className="text-[#88BC46] text-xl sm:text-2xl" />
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Performance Stats</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">User metrics overview</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { value: performanceStats ? `${performanceStats.accuracy}%` : '—', label: 'Accuracy', color: 'text-[#88BC46]' },
                { value: performanceStats ? `#${performanceStats.leaderboard_rank}` : '—', label: 'Leaderboard', color: 'text-[#72C1F5]' },
                { value: performanceStats ? performanceStats.challenges_joined : '—', label: 'Challenges', color: 'text-[#FF4080]' },
                {
                  value: performanceStats
                    ? `${performanceStats.goals_completed}/${performanceStats.goals_total}`
                    : '—', label: 'Goals', color: 'text-[#FFBF1A]'
                },
                { value: (summary.modules - summary.total_quizzes_left), label: 'Modules Learned', color: 'text-[#FF8C3C]' },
                { value: numComplete, label: 'Achievements', color: 'text-[#EF4444]' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements - Better spacing */}
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-[#1f2937] dark:text-gray-200 mb-4 flex items-center gap-2">
              <FaMedal className="text-[#FBBF24]" size={18} /> Recent Achievements
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {recentAchievements.length === 0 ? (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">No achievements yet.</p>
              ) : (
                recentAchievements.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 bg-[#FFFFFF] dark:bg-gray-700 p-3 sm:p-4 rounded-xl border-2 border-[#FFD18C]"
                  >
                    <img
                      src={`/assets/Images/${item.icon_image_path}`}
                      alt={item.achievement_title}
                      className="w-10 h-10 sm:w-16 sm:h-16 object-contain rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start mb-1 gap-1">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base truncate">{item.achievement_title}</h3>
                        <span className="text-xs bg-[#fef9c3] dark:bg-[#FFD18C] dark:text-[#CF6108] text-[#92400e] px-2 py-0.5 rounded-full border border-[#fde047] whitespace-nowrap self-start xs:self-auto">
                          +{item.xp_reward} XP
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic line-clamp-2 mt-1">{item.detail}</p>
                    </div>
                  </div>
                )))}
            </div>
          </div>
        </div>

        {/* Shared Communities - Better spacing */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-md">
          <h2 className="text-lg sm:text-xl font-bold text-[#1f2937] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
            <FaCrown className="text-[#fb923c]" size={18} /> Shared Communities
          </h2>

          <div className="space-y-4 sm:space-y-4">
            {communityData.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic text-center py-3">No communities yet.</p>
            ) : (
              communityData.map((community, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white dark:bg-gray-700 shadow-md rounded-2xl p-4 sm:p-4 gap-4 sm:gap-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={`/assets/Images/${community.banner}`}
                      alt={community.community_name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow dark:border dark:border-gray-600 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 truncate">{community.community_name}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-2 mt-2">
                        <span className="bg-[#E0F2FE] dark:bg-gray-600 text-[#72C1F5] dark:text-[#B1E1FF] text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                          {community.member_count} Members
                        </span>
                        <span className="bg-[#E0F2FE] dark:bg-gray-600 text-[#72C1F5] dark:text-[#B1E1FF] text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                          {community.challenge_count} Challenges
                        </span>
                        <span className="bg-[#FEF9C3] dark:bg-gray-600 text-yellow-500 dark:text-yellow-300 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                          {Math.round(community.xp_total)} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 mt-2 sm:mt-0">
                    <div className="flex -space-x-2">
                      {(community.preview_avatars || []).slice(0, 3).map((src, index) => (
                        <img
                          key={index}
                          src={`/assets/Images/${src}`}
                          alt="avatar"
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                    <Link to={`/community/details/${community.community_name.toLowerCase().replace(/\s+/g, '_')}`}>
                      <button className="flex items-center gap-1 bg-[#AAD977] text-white font-medium text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full hover:bg-[#83AB55] transition-all dark:bg-[#BBE48E] whitespace-nowrap">
                        <FaEye size={10} className="sm:size-3" /> View
                      </button>
                    </Link>
                  </div>
                </div>
              )))}
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default CommunityMemberPage;