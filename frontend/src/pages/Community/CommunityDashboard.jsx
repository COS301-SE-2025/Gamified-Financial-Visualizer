// src/pages/Community/CommunityDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import LeaderboardPanel from '../../components/community/LeaderboardPanel';

import {
  FaBullseye,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaEye,
  FaGamepad,
  FaHeart,
  FaPaperPlane,
  FaPen,
  FaShare,
  FaTrophy,
  FaChevronDown,
  FaCheck
} from 'react-icons/fa';

// Avatars & banners (fallbacks)
import avatar1 from '../../assets/Images/avatars/Totoro.png';
import avatar2 from '../../assets/Images/avatars/BlueSky.png';
import banner1 from '../../assets/Images/achievements banners/1.png';
import banner2 from '../../assets/Images/achievements banners/17.png';
import banner3 from '../../assets/Images/achievements banners/25.png';
import banner4 from '../../assets/Images/achievements banners/14.png';

const initialPosts = [
  {
    id: 1,
    user: { name: 'satoshi_nak', level: 'Silver', avatar: avatar1 },
    banner: banner1,
    content: 'Just unlocked the Avid Scholar achievment!! 💰',
    communities: ['Cash Cows', 'Goal Setters'],
    likes: 42,
    comments: [
      { id: 11, user: 'finance_wiz', text: 'Congrats! That badge is tough to get!' },
      { id: 12, user: 'money_master', text: 'Welcome to the Cash Cows club!' }
    ]
  },
  {
    id: 2,
    user: { name: 'snow', level: 'Platinum', avatar: avatar2 },
    banner: banner2,
    content: 'Won another achievement today 🎯 #CashCows',
    communities: ['Cash Cows'],
    likes: 31,
    comments: [{ id: 21, user: 'budget_boss', text: 'Great job! Keep it up!' }]
  }
];

// Available tags user can add to a post (max 3)
const AVAILABLE_TAGS = ['Cash Cows', 'Goal Setters', 'Deal Hunters', 'AR Explorers', 'Debt Slayers'];

const CommunityDashboard = () => {
  const location = useLocation();

  // Feed state
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  // Create-post modal state
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postType, setPostType] = useState(''); // 'Achievement' | 'Goal' | 'General'
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [uploadImageFile, setUploadImageFile] = useState(null);

  // Recent achievement banners (image dropdown/gallery source)
  const [recentBanners, setRecentBanners] = useState([]);
  const [showBannerDropdown, setShowBannerDropdown] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  // Pagination
  const POSTS_PER_PAGE = 2;
  const [postPage, setPostPage] = useState(1);
  const totalPostPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const visiblePosts = useMemo(() => {
    const start = (postPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, postPage]);

  // Pagination for the banner dropdown: in create a post 
  const [bannerPage, setBannerPage] = useState(1);
  const BANNERS_PER_PAGE = 6;
  const totalBannerPages = Math.max(1, Math.ceil(recentBanners.length / BANNERS_PER_PAGE));

  const paginatedBanners = useMemo(() => {
    const start = (bannerPage - 1) * BANNERS_PER_PAGE;
    return recentBanners.slice(start, start + BANNERS_PER_PAGE);
  }, [recentBanners, bannerPage]);

  useEffect(() => {
    if (bannerPage > totalBannerPages) setBannerPage(totalBannerPages);
  }, [bannerPage, totalBannerPages, recentBanners.length]);


  // --- Fetch recent achievements (mocked fallback) ---
  useEffect(() => {
    // TODO wire real API: /api/auth/profile/recent-achievements/:userId
    setRecentBanners([banner1, banner2, banner3, banner4]);
  }, []);

  // --- Prefill from Achievements page handoff (optional) ---
  useEffect(() => {
    const state = location.state || {};
    const handoff = state.shareAchievement;
    if (handoff) {
      setShowCreatePost(true);
      setPostType('Achievement');
      setSelectedBanner(handoff.bannerUrl || null);
      setSelectedTags(Array.isArray(handoff.tags) ? handoff.tags.slice(0, 3) : []);
      setDescription(handoff.title ? `🏆 ${handoff.title}` : 'Just unlocked a new achievement!');
      // clear router state so it doesn't trigger again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // --- Actions ---
  // handle the like feature 
  const handleLike = (postId) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: likedPosts.includes(postId) ? p.likes - 1 : p.likes + 1 } : p))
    );
    setLikedPosts(prev => (prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]));
  };

  // hanlde the comment count 
  const handleComment = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), user: 'you', text }] } : p))
    );
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // communnity tag toggles
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  };

  const bannerPreview = useMemo(() => {
    if (selectedBanner) return selectedBanner;
    if (uploadImageFile) return URL.createObjectURL(uploadImageFile);
    return null;
  }, [selectedBanner, uploadImageFile]);

  const handlePost = () => {
    if (!description.trim()) {
      toast.error('Add a short description.');
      return;
    }
    if (postType === 'Achievement' && !bannerPreview) {
      toast.error('Select an achievement banner to share.');
      return;
    }

    const newPost = {
      id: Date.now(),
      user: { name: 'you', level: 'Gold', avatar: avatar1 },
      banner: bannerPreview,
      content: description,
      communities: selectedTags.length ? selectedTags : ['General'],
      likes: 0,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
    setPostPage(1);

    // reset form
    setPostType('');
    setDescription('');
    setSelectedTags([]);
    setUploadImageFile(null);
    setSelectedBanner(null);
    setShowBannerDropdown(false);

    toast.success(`Post shared${postType ? ` as ${postType}` : ''}!`, {
      icon: postType === 'Achievement' ? <FaTrophy /> : postType === 'Goal' ? <FaBullseye /> : '✅',
      style: { borderRadius: '9999px', background: '#fff', color: '#1f2937' }
    });
  };

  // keep page index valid when posts change
  useEffect(() => {
    if (postPage > totalPostPages) setPostPage(totalPostPages);
  }, [postPage, totalPostPages, posts.length]);

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

            {/* Buttons group */}
            <div className="flex items-center gap-3">
              {/* Play game button (brought back) */}
              <Link
                to="/community/game"
                className="flex items-center gap-2 bg-white text-[#5FBFFF] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#5FBFFF] hover:text-white transition transform hover:scale-105 dark:bg-gray-800 dark:text-gray-200"
              >
                <FaGamepad /> Play Now
              </Link>

              {/* Create post stays separate */}
              <button
                onClick={() => {
                  setPostType('Achievement');
                  setShowCreatePost(true);
                }}
                className="flex items-center gap-2 bg-white text-[#AAD977] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#83AB55] hover:text-white transition transform hover:scale-105 dark:bg-[#A1E358] dark:hover:bg-[#88BC46] dark:text-gray-200"
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
            {/* Feed */}
            {visiblePosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-3xl shadow-md p-6 space-y-4 border border-gray-100 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-gray-700"
              >
                {/* Header */}
                <div className="flex items-center gap-3">
                  <img src={post.user.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white shadow object-cover" />
                  <div>
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
                    <FaEye size={12} /> Profile
                  </Link>
                </div>

                {/* Comments */}
                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {post.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {c.user === 'you' ? 'Y' : c.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-2 dark:bg-gray-700">
                        <div className="font-medium text-sm text-gray-700 dark:text-gray-200">{c.user}</div>
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
                      onClick={() => handleComment(post.id)}
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
                  onClick={() => setPostPage(p => Math.max(1, p - 1))}
                  disabled={postPage === 1}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${postPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <FaChevronLeft /> Prev
                </button>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page {postPage} of {totalPostPages}
                </span>

                <button
                  onClick={() => setPostPage(p => Math.min(totalPostPages, p + 1))}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 dark:bg-opacity-60">
          <div className="bg-white w-full max-w-2xl p-6 rounded-3xl shadow-xl border border-gray-100 relative space-y-4 dark:bg-gray-800 dark:border-gray-700">
            
            {/* Close */}
            <button
              onClick={() => setShowCreatePost(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-xl font-bold dark:hover:text-red-400"
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
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${selectedTags.includes(tag)
                      ? 'bg-[#E0F2FE] text-[#065989] border-[#93C5FD]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                      }`}
                  >
                    {selectedTags.includes(tag) && <FaCheck className="inline mr-1" />} {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievement Banner picker (image dropdown/gallery) */}
            {postType === 'Achievement' && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Select achievement banner</div>

                <button
                  onClick={() => setShowBannerDropdown(!showBannerDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-xl border bg-white text-left text-sm dark:bg-gray-700 dark:border-gray-600"
                >
                  <span>{selectedBanner ? 'Change banner' : 'Choose from recent achievements'}</span>
                  <FaChevronDown className={`transition ${showBannerDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showBannerDropdown && (
                  <div className="mt-2 rounded-2xl border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    {/* Scrollable grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 max-h-[45vh] overflow-y-auto">
                      {paginatedBanners.map((src, idx) => (
                        <button
                          key={`rb-${(bannerPage - 1) * BANNERS_PER_PAGE + idx}`}
                          onClick={() => {
                            setSelectedBanner(src);
                            setShowBannerDropdown(false);
                            setUploadImageFile(null);
                          }}
                          className={`relative rounded-xl overflow-hidden border transition focus:outline-none ${selectedBanner === src
                              ? 'ring-2 ring-[#5FBFFF] border-[#5FBFFF]'
                              : 'border-gray-200 dark:border-gray-600 hover:opacity-90'
                            }`}
                        >
                          <img src={src} alt={`banner-${idx}`} className="w-full h-28 object-cover" />
                          {selectedBanner === src && (
                            <div className="absolute top-2 right-2 bg-white text-[#065989] rounded-full p-1 shadow">
                              <FaCheck />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Pagination controls */}
                    {totalBannerPages > 1 && (
                      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => setBannerPage(p => Math.max(1, p - 1))}
                          disabled={bannerPage === 1}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${bannerPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        >
                          <FaChevronLeft /> Prev
                        </button>

                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          Page {bannerPage} of {totalBannerPages}
                        </span>

                        <button
                          onClick={() => setBannerPage(p => Math.min(totalBannerPages, p + 1))}
                          disabled={bannerPage === totalBannerPages}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border dark:border-gray-600 ${bannerPage === totalBannerPages
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                        >
                          Next <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview */}
                {bannerPreview && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img src={bannerPreview} alt="preview" className="w-full h-40 object-cover" />
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handlePost}
                className="bg-gradient-to-r from-[#88BC46] to-[#AAD977] text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition shadow dark:from-[#4D7C0F] dark:to-[#3F6212]"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </CommunityLayout>
  );
};

export default CommunityDashboard;
