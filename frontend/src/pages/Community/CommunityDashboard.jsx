import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';

import { FaHeart, FaComment, FaVrCardboard, FaTrophy, FaBullseye, FaShare, FaPen, FaEye, FaGamepad, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/Images/avatars/totoroAvatar.jpeg';
import avatar2 from '../../assets/Images/avatars/beachAvatar.jpeg';
import postBanner1 from '../../assets/Images/banners/pixelStore.gif';
import postBanner2 from '../../assets/Images/banners/pixelApartment.gif';
import LeaderboardPanel from '../../components/community/LeaderboardPanel';

const initialPosts = [
  {
    id: 1,
    user: {
      name: 'satoshi_nak',
      level: 'Silver',
      avatar: avatar1,
    },
    banner: postBanner1,
    content: 'Just unlocked the Big Saver badge and earned 500 XP! 💰',
    communities: ['Cash Cows', 'Goal Setters'],
    likes: 42,
    comments: [
      { id: 1, user: 'finance_wiz', text: 'Congrats! That badge is tough to get!' },
      { id: 2, user: 'money_master', text: 'Welcome to the Big Savers club!' }
    ],
    image: postBanner2,
  },
  {
    id: 2,
    user: {
      name: 'snow',
      level: 'Platinum',
      avatar: avatar2,
    },
    banner: postBanner2,
    content: 'Won my first goal challenge today 🎯 feeling proud! #CashCows',
    communities: ['Cash Cows'],
    likes: 31,
    comments: [
      { id: 1, user: 'budget_boss', text: 'Great job! Keep it up!' }
    ],
    image: postBanner2,
  },
];

const CommunityDashboard = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [likedPosts, setLikedPosts] = useState([]);
  const [postType, setPostType] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error('Post cannot be empty');
      return;
    }

    toast.success(`Post shared as ${postType || 'General'}!`, {
      icon:
        postType === 'Achievement' ? <FaTrophy className="text-[#FFD18C]" /> :
          postType === 'Goal' ? <FaBullseye className="text-[#5FBFFF]" /> :
            postType === 'AR' ? <FaVrCardboard className="text-[#5FBFFF]" /> :
              '✅',
      style: {
        borderRadius: '9999px',
        background: '#FFFFFF',
        color: '#B4CB98',
      },
    });

    setNewPost('');
    setPostType('');
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = likedPosts.includes(postId);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));

    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleComment = (postId) => {
    if (!commentInputs[postId]?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              user: 'you',
              text: commentInputs[postId]
            }
          ]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <CommunityLayout>
      <div className="p-6 max-w-8xl mx-auto space-y-6 dark:bg-gray-900">
        <Toaster position="top-center" />

        {/* Game Banner - Full Width */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#B1E1FF] via-[#B4CB98] to-[#FFEFBD] p-6 rounded-3xl shadow-lg dark:from-[#1E3A8A] dark:via-[#166534] dark:to-[#854D0E]">
          <div className="absolute inset-0 opacity-20 bg-gray-700 dark:bg-gray-900"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaGamepad className="text-yellow-300" /> Financial Adventure Awaits!
              </h2>
              <p className="text-sm md:text-base text-white/90 mb-4 dark:text-white/80">
                Test your financial knowledge, compete with friends, and earn exclusive rewards!
              </p>
            </div>
            <Link
              to="/community/game"
              className="flex items-center gap-2 bg-white text-[#5FBFFF] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-gray-100 transition transform hover:scale-105 dark:bg-gray-800 dark:text-gray-200"
            >
              <FaGamepad /> Play Now
            </Link>
          </div>
        </div>

        {/* Main Content Grid: Posts + Leaderboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Section: Leaderboard */}
          <div className="col-span-1">
            <LeaderboardPanel />
          </div>

          {/* Right Section: Create Post + Feed */}
          <div className="md:col-span-2 space-y-6">
            {/* Create Post Button */}
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#AAD977] text-white rounded-full shadow hover:bg-[#83AB55] transition dark:bg-[#A1E358] dark:hover:bg-[#88BC46]"
            >
              <FaPen /> Create Post
            </button>

            {/* Posts */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl shadow-md p-6 space-y-4 border border-gray-100 hover:shadow-xl transition-all dark:bg-gray-800 dark:border-gray-700"
              >
                {/* Post Header */}
                <div className="flex items-center gap-3">
                  <img
                    src={post.user.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-white shadow object-cover"
                  />
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
                          key={i}
                          className="text-xs bg-[#E0F2FE] text-[#72C1F5] px-2 py-0.5 rounded-full dark:bg-[#88D1FF] dark:text-[#065989]"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed dark:text-gray-300">{post.content}</p>
                  {post.banner && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img
                        src={post.banner}
                        alt="post banner"
                        className="w-full h-52 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Post Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 transition ${likedPosts.includes(post.id)
                        ? 'text-red-500'
                        : 'hover:text-red-500 dark:hover:text-red-400'
                        }`}
                    >
                      <FaHeart />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#72C1F5] dark:hover:text-[#5FBFFF]">
                      <FaComment />
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#88BC46] dark:hover:text-[#4D7C0F]">
                      <FaShare />
                    </button>
                  </div>
                  <Link
                    to={`/community/member/${post.user.name}`}
                    className="text-xs bg-[#E0F2FE] text-[#72C1F5] px-3 py-1.5 rounded-full font-medium hover:bg-[#B1E1FF] flex items-center gap-1 dark:bg-[#88D1FF] dark:text-[#065989] dark:hover:bg-[#6BB7F5] "
                  >
                    <FaEye size={12} /> Profile
                  </Link>
                </div>

                {/* Comments */}
                <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {comment.user === 'you' ? 'Y' : comment.user.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-2 dark:bg-gray-700">
                        <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
                          {comment.user}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{comment.text}</p>
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
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 dark:bg-opacity-60">
          <div className="bg-white w-full max-w-2xl p-6 rounded-3xl shadow-xl border border-gray-100 relative space-y-4 dark:bg-gray-800 dark:border-gray-700">

            {/* Close Button */}
            <button
              onClick={() => setShowCreatePost(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-xl font-bold dark:hover:text-red-400"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 dark:text-gray-200">
              <FaPen className="text-[#88BC46] dark:text-[#4D7C0F]" /> Create a Post
            </h2>

            {/* Textarea */}
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
              placeholder="What's on your mind? Share a tip, a win, or a goal..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#88BC46] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-[#4D7C0F]"
            ></textarea>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Attach an Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E0F2FE] file:text-[#4B82A2] hover:file:bg-[#B1E1FF] dark:text-gray-300 dark:file:bg-[#1E3A8A] dark:file:text-[#93C5FD] dark:hover:file:bg-[#1E40AF]"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            {/* Post Type Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: "Share Achievement", icon: <FaTrophy />, type: "Achievement", color: "#FFD18C" },
                { label: "Share Goal", icon: <FaBullseye />, type: "Goal", color: "#5FBFFF" },
                { label: "Share in AR", icon: <FaVrCardboard />, type: "AR", color: "#FF907A" }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => setPostType(btn.type)}
                  className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-medium shadow transition ${postType === btn.type
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  style={postType === btn.type ? { backgroundColor: btn.color } : {}}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handlePost();
                  setShowCreatePost(false);
                }}
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