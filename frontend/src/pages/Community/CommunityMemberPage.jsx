import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';

import { FaChartLine, FaArrowLeft, FaCrown, FaEye, FaMedal, FaUserMinus, FaPaperPlane, FaTimes, FaCheck } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

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

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const r = await fetch(`${BASE_URL}/api/community/userID/${username}`);
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
          fetch(`${BASE_URL}/api/auth/top-bar/${userID}`),
          fetch(`${BASE_URL}/api/auth/profile/performance-stats/${userID}`),
          fetch(`${BASE_URL}/api/learning/summary/${userID}`),
          fetch(`${BASE_URL}/api/achievements/user/${userID}`),
          fetch(`${BASE_URL}/api/auth/profile/recent-achievements/${userID}`),
          fetch(`${BASE_URL}/api/auth/profile/communities/${userID}`),
          fetch(`${BASE_URL}/api/auth/profile/level-progress/${userID}`),
          fetch(`${BASE_URL}/api/community/friends/status/${user.id}/${userID}`)
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
      const res = await fetch(`${BASE_URL}/api/community/friends/request/${user.id}/${userID}`, {
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
        `${BASE_URL}/api/community/friends/update`,
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
  }

  const removeFriend = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/community/friends/remove/${user.id}/${userID}`,
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

  if (!statusF) {
    friendButtons = (
      <button onClick={handleFriendRequest}
        className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition"
      >
        <FaPaperPlane /> Request Friend
      </button>
    );
  } else if (statusF === 'pending') {
    friendButtons = isInitiator
      ? (
        <button onClick={cancelRequest}
          className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition"        >
          <FaTimes /> Cancel Request
        </button>
      )
      : (
        <>
          <button onClick={() => respondRequest('accepted')}
            className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FFD18C] text-white shadow hover:bg-[#f9b54c] transition"          >
            <FaCheck /> Accept
          </button>
          <button onClick={() => respondRequest('declined')}
            className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FA8B81] text-white shadow hover:bg-[#f56a5a] transition"          >
            <FaTimes /> Decline
          </button>
        </>
      );
  } else /* accepted */ {
    friendButtons = (
      <button onClick={removeFriend} className="flex items-center gap-1 px-4 py-2 text-sm rounded-full bg-[#FA8B81] text-white shadow hover:bg-[#f56a5a] transition">
        <FaUserMinus /> Remove Friend
      </button>
    );
  }

  return (
    <CommunityLayout>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6 px-2 sm:px-4 dark:bg-gray-900">

        {/* Profile Banner */}
        <div className="relative">
          <img src={`/assets/Images/${profileData.banner_image_path}`} alt="banner" className="w-full h-40 object-cover rounded-2xl" />
          <div className="absolute -bottom-10 left-6 flex items-center gap-4">
            <img
              src={`/assets/Images/${profileData.avatar_image_path}`}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover"
            />
            <div className="bg-white dark:bg-gray-800 shadow-md px-4 py-2 rounded-full flex items-center gap-3">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{profileData?.username || '...'}</p>
              <p className="text-sm italic text-[#F28B82]">Joined: <span className="font-medium">{profileData && new Date(profileData.created_at).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}</span></p>
            </div>
          </div>

          {/* Action buttons moved to right side */}
          <div className="absolute right-6 -bottom-10 flex justify-end gap-3">
            {friendButtons}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#E5E7EB] dark:bg-gray-700 text-[#374151] dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-[#D1D5DB] dark:hover:bg-gray-600 transition"
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow flex flex-col gap-4 mt-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-yellow-400 dark:border-[#FFD18C] dark:bg-[#FFD18C] dark:text-[#CF6108] font-bold flex items-center justify-center shadow-sm">
                {levelProgress?.level_number ?? '—'}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Lv {levelProgress?.tier_status ?? '—'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{levelProgress
                  ? `${levelProgress.points_to_next_tier} points to next tier`
                  : 'Loading...'}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f8e5b5] dark:bg-[#FFD18C] dark:text-[#CF6108] font-bold flex items-center justify-center shadow-sm">
              {levelProgress?.next_level ?? '—'}
            </div>
          </div>

          <div className="relative mt-2">
            <div className="w-full h-6 bg-yellow-100 dark:bg-[#FFD18C] dark:text-[#CF6108] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-[#FFCE51] dark:bg-[#FFD18C] dark:text-[#CF6108] rounded-full"
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
            <div className="absolute inset-0 flex justify-center items-center text-sm font-semibold text-yellow-700 dark:bg-[#FFD18C] dark:text-[#CF6108]">
              {levelProgress
                ? `${levelProgress.current_tier_xp}/${levelProgress.tier_xp_required}`
                : '...'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Performance stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <FaChartLine className="text-[#88BC46] text-2xl" />
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Performance Stats</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">User metrics overview</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-[#1f2937] dark:text-gray-200 mb-4 flex items-center gap-2">
              <FaMedal className="text-[#FBBF24]" /> Recent Achievements
            </h2>

            <div className="space-y-4">
              {recentAchievements.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">No achievements yet.</p>
              ) : (
                recentAchievements.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-[#FFFFFF] dark:bg-gray-700 p-4 rounded-xl border-2 border-[#FFD18C]"
                  >
                    <img
                      src={`/assets/Images/${item.icon_image_path}`}
                      alt={item.achievement_title}
                      className="w-16 h-16 object-contain rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{item.achievement_title}</h3>
                        <span className="text-xs bg-[#fef9c3] dark:bg-[#FFD18C] dark:text-[#CF6108] text-[#92400e]  px-2 py-1 rounded-full border border-[#fde047]">
                          +{item.xp_reward} XP
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic">{item.detail}</p>
                    </div>
                  </div>
                )))}
            </div>
          </div>
        </div>

        {/* Shared Communities */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md">
          <h2 className="text-xl font-bold text-[#1f2937] dark:text-gray-200 mb-6 flex items-center gap-2">
            <FaCrown className="text-[#fb923c]" /> Shared Communities
          </h2>

          <div className="space-y-4">
            {communityData.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">No communities yet.</p>
            ) : (
              communityData.map((community, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white dark:bg-gray-700 shadow-md rounded-2xl px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`/assets/Images/${community.banner}`}
                      alt={community.community_name}
                      className="w-16 h-16 rounded-full object-cover shadow dark:border dark:border-gray-600"
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{community.community_name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="bg-[#E0F2FE] dark:bg-gray-600 text-[#72C1F5] dark:text-[#B1E1FF] text-xs font-medium px-3 py-1 rounded-full">
                          {community.member_count} Members
                        </span>
                        <span className="bg-[#E0F2FE] dark:bg-gray-600 text-[#72C1F5] dark:text-[#B1E1FF] text-xs font-medium px-3 py-1 rounded-full">
                          {community.challenge_count} Challenges
                        </span>
                        <span className="bg-[#FEF9C3] dark:bg-gray-600 text-yellow-500 dark:text-yellow-300 text-xs font-medium px-3 py-1 rounded-full">
                          {Math.round(community.xp_total)} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {(community.preview_avatars || []).map((src, index) => (
                        <img
                          key={index}
                          src={`/assets/Images/${src}`}
                          alt="avatar"
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                    <Link to={`/community/details/${community.community_name.toLowerCase().replace(/\s+/g, '_')}`}>
                      <button className="flex items-center gap-2 bg-[#AAD977] text-white font-medium text-sm px-4 py-1.5 rounded-full hover:bg-[#83AB55] transition-all">
                        <FaEye /> View
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