// src/pages/Community/CommunityDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import LeaderboardPanel from '../../components/community/LeaderboardPanel';

import {
  FaBullseye,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaEye as EyeIcon,
  FaGamepad,
  FaHeart,
  FaPaperPlane,
  FaPen,
  FaTrophy,
  FaChevronDown,
  FaCheck,
  FaTrash,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';

// Fallbacks
import avatarFallback from '../../assets/Images/avatars/Totoro.png';
import bannerFallback from '../../assets/Images/achievements banners/1.png';

// ---------- Config ----------
const API_BASE = 'http://localhost:5000/api/community';
const AUTH_BASE = 'http://localhost:5000/api/auth';

// Helper to read user once
function getUser() {
  try {
    const u = JSON.parse(localStorage.getItem('user'));
    return u || null;
  } catch {
    return null;
  }
}

// Optional tiny utility
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// Always sort by createdAt ASC (oldest top, newest bottom)
const sortCommentsAsc = (arr = []) =>
  [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

export default function CommunityDashboard() {
  const location = useLocation();
  const user = getUser();
  const userId = user?.id ?? null;

  // --- Who am I? (for optimistic UI) ---
  const [me, setMe] = useState({
    username: user?.username || null,
    avatarUrl: null,
  });

  useEffect(() => {
    if (!userId) return;
    // Get display username + avatar so optimistic comments look correct
    fetch(`${AUTH_BASE}/top-bar/${userId}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(json => {
        const d = json?.data || {};
        setMe({
          username: d.username || user?.username || 'You',
          avatarUrl: d.avatar_image_path ? `/assets/Images/${d.avatar_image_path}` : avatarFallback,
        });
      })
      .catch(() => {
        setMe({
          username: user?.username || 'You',
          avatarUrl: avatarFallback,
        });
      });
  }, [userId]);

  // Feed state (from backend)
  const [posts, setPosts] = useState([]); // array of posts from /social/feed/:userId
  const [likedPosts, setLikedPosts] = useState([]); // local highlight
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Create-post modal
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postType, setPostType] = useState(''); // 'Achievement' | 'Goal' | 'General'
  const [description, setDescription] = useState('');

  // Community tags (from API)
  const [communityOptions, setCommunityOptions] = useState([]); // [{community_id, community_name}]
  const [selectedCommunityIds, setSelectedCommunityIds] = useState([]); // number[]

  // Achievement picker
  const [selectedAchievementId, setSelectedAchievementId] = useState(null); // what you send to backend
  const [recentBanners, setRecentBanners] = useState([]); // [{achievementId, title, bannerPath}]
  const [showBannerDropdown, setShowBannerDropdown] = useState(false);
  const [selectedBannerPreview, setSelectedBannerPreview] = useState(null);

  // Comments input
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: "text" }

  // Pagination (feed – client-side)
  const POSTS_PER_PAGE = 2;
  const [postPage, setPostPage] = useState(1);
  const totalPostPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visiblePosts = useMemo(() => {
    const start = (postPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, postPage]);

  // Banner dropdown pagination
  const BANNERS_PER_PAGE = 6;
  const [bannerPage, setBannerPage] = useState(1);
  const totalBannerPages = Math.max(1, Math.ceil(recentBanners.length / BANNERS_PER_PAGE));
  const paginatedBanners = useMemo(() => {
    const start = (bannerPage - 1) * BANNERS_PER_PAGE;
    return recentBanners.slice(start, start + BANNERS_PER_PAGE);
  }, [recentBanners, bannerPage]);

  useEffect(() => {
    if (bannerPage > totalBannerPages) setBannerPage(totalBannerPages);
  }, [bannerPage, totalBannerPages, recentBanners.length]);

  // ----------- API: Load achievements for picker -----------
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/social/achievements/${userId}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(json => {
        const list = Array.isArray(json?.data) ? json.data : [];
        setRecentBanners(list); // [{achievementId, title, bannerPath}]
      })
      .catch(() => {
        // fallback to keep UI functional
        setRecentBanners([{ achievementId: 1, title: 'Sample', bannerPath: 'achievements banners/1.png' }]);
      });
  }, [userId]);

  // ----------- API: Load communities for tag chips -----------
  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/social/communities/${userId}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(json => {
        const list = Array.isArray(json?.data) ? json.data : [];
        setCommunityOptions(list); // [{community_id, community_name}]
        // Map router handoff tags -> ids
        if (location.state?.shareAchievement?.tags?.length) {
          const names = location.state.shareAchievement.tags.slice(0, 3);
          const mappedIds = list
            .filter(c => names.includes(c.community_name))
            .map(c => c.community_id);
          if (mappedIds.length) setSelectedCommunityIds(mappedIds);
        }
      })
      .catch(() => setCommunityOptions([]));
  }, [userId, location.state]);

  // ----------- API: Load feed -----------
  const loadFeed = useCallback(() => {
    if (!userId) return;
    setLoadingFeed(true);
    fetch(`${API_BASE}/social/feed/${userId}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(json => {
        const data = Array.isArray(json?.data) ? json.data : [];
        const mapped = data.map(row => ({
          id: row.post_id,
          createdAt: row.created_at,
          user: {
            id: row.user_id,
            name: row.username,
            avatar: row.avatar_id ? `/assets/Images/avatars/${row.avatar_id}` : avatarFallback,
            level: row.tier_status || '—',
          },
          banner: row.banner_image_path ? `/assets/Images/${row.banner_image_path}` : bannerFallback,
          content: row.caption,
          communities: Array.isArray(row.community_tags) ? row.community_tags : [],
          likes: Number(row.like_count || 0),
          comments: sortCommentsAsc(
            Array.isArray(row.comments)
              ? row.comments.map(c => ({
                  id: c.comment_id,
                  userId: c.user_id,
                  user: c.username,
                  avatar: c.avatar_id ? `/assets/Images/avatars/${c.avatar_id}` : null,
                  text: c.comment,
                  createdAt: c.created_at
                }))
              : []
          )
        }));
        setPosts(mapped);
      })
      .catch(err => {
        console.error('Feed error', err);
        toast.error('Failed to load feed');
      })
      .finally(() => setLoadingFeed(false));
  }, [userId]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // ----------- Prefill from Achievements page handoff -----------
  useEffect(() => {
    const state = location.state || {};
    const handoff = state.shareAchievement;
    if (handoff) {
      setShowCreatePost(true);
      setPostType('Achievement');
      setSelectedAchievementId(handoff.achievementId || null);
      setSelectedBannerPreview(handoff.bannerUrl || null);
      setDescription(handoff.title ? `🏆 ${handoff.title}` : 'Just unlocked a new achievement!');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ----------- UI actions (like/unlike, comment, post) -----------
  const handleLike = (postId) => {
    if (!userId) return;
    const liked = likedPosts.includes(postId);

    // optimistic update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + (liked ? -1 : 1) } : p));
    setLikedPosts(prev => liked ? prev.filter(id => id !== postId) : [...prev, postId]);

    const url = `${API_BASE}/social/posts/${postId}/${liked ? 'unlike' : 'like'}`;
    const method = liked ? 'DELETE' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .catch(() => {
        // revert
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + (liked ? 1 : -1) } : p));
        setLikedPosts(prev => liked ? [...prev, postId] : prev.filter(id => id !== postId));
        toast.error('Failed to update like');
      });
  };

  const handleAddComment = (postId) => {
    if (!userId) return;
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    // --- optimistic comment uses REAL username/avatar immediately ---
    const tempId = `temp-${Date.now()}`;
    const displayName = me.username || 'You';
    const avatarUrl = me.avatarUrl || avatarFallback;
    const createdAtISO = new Date().toISOString();

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: sortCommentsAsc([
                ...p.comments,
                {
                  id: tempId,
                  userId,
                  user: displayName,
                  avatar: avatarUrl,
                  text,
                  createdAt: createdAtISO
                }
              ])
            }
          : p
      )
    );
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    fetch(`${API_BASE}/social/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comment: text })
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(json => {
        const newComment = json?.comment;
        // Swap temp id for real id/timestamp (keep username/avatar already correct)
        setPosts(prev =>
          prev.map(p =>
            p.id === postId
              ? {
                  ...p,
                  comments: sortCommentsAsc(
                    p.comments.map(c =>
                      c.id === tempId
                        ? { ...c, id: newComment.comment_id, createdAt: newComment.created_at }
                        : c
                    )
                  )
                }
              : p
          )
        );
      })
      .catch(() => {
        // revert on failure
        setPosts(prev =>
          prev.map(p =>
            p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== tempId) } : p
          )
        );
        toast.error('Failed to comment');
      });
  };

  const handleCreatePost = () => {
    if (!userId) {
      toast.error('Please log in.');
      return;
    }
    if (!description.trim()) {
      toast.error('Add a short description.');
      return;
    }
    if (postType === 'Achievement' && !selectedAchievementId) {
      toast.error('Select an achievement to share.');
      return;
    }

    fetch(`${API_BASE}/social/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        achievementId: selectedAchievementId,
        caption: description,
        communityTagIds: selectedCommunityIds
      })
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => {
        toast.success(`Post shared${postType ? ` as ${postType}` : ''}!`);
        setShowCreatePost(false);
        setPostType('');
        setDescription('');
        setSelectedCommunityIds([]);
        setSelectedAchievementId(null);
        setSelectedBannerPreview(null);
        setShowBannerDropdown(false);
        setPostPage(1);
        loadFeed();
      })
      .catch(() => toast.error('Failed to create post'));
  };

  // ----------- Deletes + confirm modal -----------
  const [confirm, setConfirm] = useState({ open: false, type: null, postId: null, commentId: null });

  const openConfirmDeletePost = (postId) => setConfirm({ open: true, type: 'post', postId, commentId: null });
  const openConfirmDeleteComment = (postId, commentId) => setConfirm({ open: true, type: 'comment', postId, commentId });
  const closeConfirm = useCallback(() => setConfirm({ open: false, type: null, postId: null, commentId: null }), []);

  const handleDeletePost = async (postId) => {
    if (!userId) return;
    const prev = posts;
    setPosts(prev.filter(p => p.id !== postId));

    try {
      const r = await fetch(`${API_BASE}/social/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!r.ok) throw new Error('Failed');
      toast.success('Post deleted');
    } catch {
      setPosts(prev); // revert
      toast.error('Could not delete post');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!userId) return;
    const prev = posts;
    setPosts(prev =>
      prev.map(p =>
        p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p
      )
    );

    try {
      const r = await fetch(`${API_BASE}/social/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!r.ok) throw new Error('Failed');
      toast.success('Comment deleted');
    } catch {
      setPosts(prev); // revert
      toast.error('Could not delete comment');
    }
  };

  const confirmDelete = async () => {
    const { type, postId, commentId } = confirm;
    if (type === 'post' && postId) {
      await handleDeletePost(postId);
    } else if (type === 'comment' && postId && commentId) {
      await handleDeleteComment(postId, commentId);
    }
    closeConfirm();
  };

  // keep page index valid when posts change
  useEffect(() => {
    if (postPage > totalPostPages) setPostPage(totalPostPages);
  }, [postPage, totalPostPages, posts.length]);

  // --------------- Render ---------------
  return (
    <CommunityLayout>
      <div className="p-6 max-w-8xl mx-auto space-y-6 dark:bg-gray-900">
        <Toaster position="top-center" />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#B1E1FF] via-[#B4CB98] to-[#FFEFBD] p-6 rounded-3xl shadow-lg dark:from-[#1E3A8A] dark:via-[#166534] dark:to-[#854D0E]">
          <div className="absolute inset-0 opacity-20 bg-gray-700 dark:bg-gray-900"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaGamepad className="text-yellow-300" /> Financial Adventure Awaits!
              </h2>
              <p className="text-sm md:text-base text-white/90 mb-4 dark:text-white/80">
                Share achievements, celebrate goals, and level up together.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/community/game"
                className="flex items-center gap-2 bg-white text-[#5FBFFF] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#5FBFFF] hover:text-white transition transform hover:scale-105 dark:bg-gray-800 dark:text-gray-200"
              >
                <FaGamepad /> Play Now
              </Link>

              <button
                onClick={() => { setPostType('Achievement'); setShowCreatePost(true); }}
                className="flex items-center gap-2 bg-white text-[#AAD977] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#83AB55] hover:text-white transition transform hover:scale-105 dark:bg-gray-800 dark:text-gray-200"
              >
                <FaPen /> Create Post
              </button>
            </div>
          </div>
        </div>

        {/* Grid: Leaderboard + Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <LeaderboardPanel />
          </div>

          <div className="md:col-span-2 space-y-6">
            {loadingFeed && (
              <div className="text-sm text-gray-500 dark:text-gray-400">Loading feed…</div>
            )}

            {/* Feed */}
            {visiblePosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-3xl shadow-md p-6 space-y-4 border border-gray-100 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-gray-700"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <img src={post.user.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white shadow object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/community/member/${post.user.name}`}
                        className="font-semibold text-gray-800 hover:text-[#72C1F5] dark:text-gray-200 dark:hover:text-[#5FBFFF]"
                      >
                        {post.user.name}
                      </Link>
                      <span className="text-xs bg-[#fef9c3] text-[#92400e] px-2 py-0.5 rounded-full dark:bg-[#FFD18C] dark:text-[#FD8524]">
                        Lv {post.user.level}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.communities.map((name, i) => (
                        <span
                          key={`${name}-${i}`}
                          className="text-xs bg-[#E0F2FE] text-[#72C1F5] px-2 py-0.5 rounded-full dark:bg-[#88D1FF] dark:text-[#065989]"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Delete Post (owner only) */}
                  {post.user.id === userId && (
                    <button
                      onClick={() => openConfirmDeletePost(post.id)}
                      className="p-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                      title="Delete post"
                      aria-label="Delete post"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">{post.content}</p>
                  {post.banner && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={post.banner} alt="post banner" className="w-full h-52 object-cover" />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 transition ${likedPosts.includes(post.id) ? 'text-red-500' : 'hover:text-red-500 dark:hover:text-red-400'}`}
                    >
                      <FaHeart />
                      <span>{post.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <FaComment />
                      <span>{post.comments.length}</span>
                    </div>
                  </div>
                  <Link
                    to={`/community/member/${post.user.name}`}
                    className="text-xs bg-[#E0F2FE] text-[#72C1F5] px-3 py-1.5 rounded-full font-medium hover:bg-[#B1E1FF] flex items-center gap-1 dark:bg-[#88D1FF] dark:text-[#065989] dark:hover:bg-[#6BB7F5]"
                  >
                    <EyeIcon size={12} /> Profile
                  </Link>
                </div>

                {/* Comments */}
                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {post.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {c.user ? c.user.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-2 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm text-gray-700 dark:text-gray-200">{c.user}</div>
                          {c.userId === userId && (
                            <button
                              onClick={() => openConfirmDeleteComment(post.id, c.id)}
                              className="p-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                              title="Delete comment"
                              aria-label="Delete comment"
                            >
                              <FaTrash size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Add a comment..."
                      className="flex-1 text-sm p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#72C1F5] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-[#5FBFFF]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="w-8 h-8 rounded-full bg-[#72C1F5] text-white flex items-center justify-center hover:bg-[#5CA8D8] dark:bg-[#88D1FF] dark:hover:bg-[#1E3A8A]"
                    >
                      <FaPaperPlane size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {posts.length > POSTS_PER_PAGE && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPostPage(p => clamp(p - 1, 1, totalPostPages))}
                  disabled={postPage === 1}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${postPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <FaChevronLeft /> Prev
                </button>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {postPage} of {totalPostPages}
                </span>

                <button
                  onClick={() => setPostPage(p => clamp(p + 1, 1, totalPostPages))}
                  disabled={postPage === totalPostPages}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${postPage === totalPostPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 dark:bg-black/60">
          <div className="bg-white w-full max-w-2xl p-6 rounded-3xl shadow-xl border border-gray-100 relative space-y-4 dark:bg-gray-800 dark:border-gray-700">
            {/* Close */}
            <button
              onClick={() => setShowCreatePost(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-xl font-bold dark:hover:text-red-400"
              aria-label="Close create post"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-gray-200">
              <FaPen className="text-[#88BC46] dark:text-[#4D7C0F]" /> Create a Post
            </h2>

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Write a short description…"
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#88BC46] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-[#4D7C0F]"
            />

            {/* Tags (max 3) */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Add community tags (max 3)</div>
              <div className="flex flex-wrap gap-2">
                {communityOptions.length === 0 && (
                  <span className="text-xs text-gray-500">No communities.</span>
                )}

                {communityOptions.map(c => {
                  const selected = selectedCommunityIds.includes(c.community_id);
                  return (
                    <button
                      key={c.community_id}
                      onClick={() => {
                        setSelectedCommunityIds(prev => {
                          if (selected) return prev.filter(id => id !== c.community_id);
                          if (prev.length >= 3) return prev; // cap 3
                          return [...prev, c.community_id];
                        });
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition ${
                        selected
                          ? 'bg-[#E0F2FE] text-[#065989] border-[#93C5FD]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {selected && <FaCheck className="inline mr-1" />} {c.community_name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Achievement Banner picker */}
            {postType === 'Achievement' && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Select achievement banner</div>

                <button
                  onClick={() => setShowBannerDropdown(!showBannerDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-xl border bg-white text-left text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                  <span>{selectedBannerPreview ? 'Change banner' : 'Choose from recent achievements'}</span>
                  <FaChevronDown className={`transition ${showBannerDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showBannerDropdown && (
                  <div className="mt-2 rounded-2xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 max-h-[45vh] overflow-y-auto">
                      {paginatedBanners.map((b, idx) => (
                        <button
                          key={`ach-${(bannerPage - 1) * BANNERS_PER_PAGE + idx}`}
                          onClick={() => {
                            setSelectedAchievementId(b.achievementId);
                            setSelectedBannerPreview(b.bannerPath ? `/assets/Images/${b.bannerPath}` : null);
                            setShowBannerDropdown(false);
                          }}
                          className={`relative rounded-xl overflow-hidden border transition focus:outline-none ${
                            selectedAchievementId === b.achievementId
                              ? 'ring-2 ring-[#5FBFFF] border-[#5FBFFF]'
                              : 'border-gray-200 dark:border-gray-600 hover:opacity-90'
                          }`}
                        >
                          <img
                            src={b.bannerPath ? `/assets/Images/${b.bannerPath}` : bannerFallback}
                            alt={b.title || 'achievement'}
                            className="w-full h-28 object-cover"
                          />
                          {selectedAchievementId === b.achievementId && (
                            <div className="absolute top-2 right-2 bg-white text-[#065989] rounded-full p-1 shadow">
                              <FaCheck />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {totalBannerPages > 1 && (
                      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => setBannerPage(p => clamp(p - 1, 1, totalBannerPages))}
                          disabled={bannerPage === 1}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${
                            bannerPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FaChevronLeft /> Prev
                        </button>

                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Page {bannerPage} of {totalBannerPages}
                        </span>

                        <button
                          onClick={() => setBannerPage(p => clamp(p + 1, 1, totalBannerPages))}
                          disabled={bannerPage === totalBannerPages}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${
                            bannerPage === totalBannerPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          Next <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {selectedBannerPreview && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img src={selectedBannerPreview} alt="preview" className="w-full h-40 object-cover" />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-[#88BC46] to-[#AAD977] text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition shadow dark:from-[#4D7C0F] dark:to-[#3F6212]"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled Confirm Dialog */}
      {confirm.open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeConfirm();
            if (e.key === 'Enter') confirmDelete();
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 dark:bg-red-900/30 dark:text-red-300">
                  <FaExclamationTriangle />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  {confirm.type === 'post' ? 'Delete this post?' : 'Delete this comment?'}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  This action can’t be undone.
                </p>
              </div>
              <button
                onClick={closeConfirm}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close confirm"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </CommunityLayout>
  );
}
