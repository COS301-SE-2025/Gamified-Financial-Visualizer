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
// import achievement from '../../assets/Images/banners/pixelOffice.gif';

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
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <CommunityHeader />
        <Toaster position="top-center" />

        {/* Enhanced Game Feature Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#B1E1FF] via-[#AAD977] to-[#FFD18C] p-6 rounded-3xl shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-gray-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaGamepad className="text-yellow-300" /> Financial Adventure Awaits!
              </h2>
              <p className="text-sm md:text-base text-white/90 mb-4">
                Test your financial knowledge, compete with friends, and earn exclusive rewards!
              </p>
            </div>
            <Link
              to="/community/game"
              className="flex items-center gap-2 bg-white text-[#5FBFFF] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              <FaGamepad /> Play Now
            </Link>
          </div>
        </div>

        {/* Create Post */}
        <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaPen className="text-[#88BC46]" /> Create a Post
          </h2>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            placeholder="Share your progress or achievement..."
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#88BC46] focus:border-transparent"
          ></textarea>

          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setPostType('Achievement')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-medium shadow-md ${postType === 'Achievement' ? 'bg-[#FFD18C] text-[#FFFFFF]' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaTrophy /> Share Achievement
            </button>
            <button
              onClick={() => setPostType('Goal')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-medium shadow-md ${postType === 'Goal' ? 'bg-[#5FBFFF] text-[#FFFFFF]' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaBullseye /> Share Goal
            </button>
            <button
              onClick={() => setPostType('AR')}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full font-medium shadow-md ${postType === 'AR' ? 'bg-[#FF907A] text-[#FFFFFF]' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaVrCardboard /> Share in AR
            </button>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handlePost}
              className="bg-gradient-to-r from-[#88BC46] to-[#AAD977] text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition shadow-md"
            >
              Post
            </button>
          </div>
        </div>

        {/* Feed */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl shadow-lg p-5 space-y-4 border border-gray-100 hover:shadow-xl transition"
          >
            {/* Compact Post Header */}
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
                    className="font-medium text-gray-800 hover:text-[#72C1F5]"
                  >
                    {post.user.name}
                  </Link>
                  <span className="text-xs bg-[#fef9c3] text-[#92400e] px-2 py-0.5 rounded-full">
                    Lv {post.user.level}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {post.communities.map((name, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#E0F2FE] text-[#72C1F5] px-2 py-0.5 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="space-y-3">
              <p className="text-gray-700">{post.content}</p>

              {/* Compact Banner */}
              {post.banner && (
                <div className="relative h-32 overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={post.banner}
                    alt="post banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Achievement Image - Only show if image exists */}

            </div>

            {/* Post Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 ${likedPosts.includes(post.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                  <FaHeart className="text-lg" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>

                <button className="flex items-center gap-1 text-gray-500 hover:text-[#72C1F5]">
                  <FaComment className="text-lg" />
                  <span className="text-sm font-medium">{post.comments.length}</span>
                </button>

                <button className="flex items-center gap-1 text-gray-500 hover:text-[#88BC46]">
                  <FaShare className="text-lg" />
                </button>
              </div>

              <Link
                to={`/community/member/${post.user.name}`}
                className="text-xs bg-[#E0F2FE] text-[#72C1F5] px-3 py-1.5 rounded-full font-medium hover:bg-[#B1E1FF] flex items-center gap-1"
              >
                <FaEye size={12} /> Profile
              </Link>
            </div>

            {/* Comments Section */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                    {comment.user === 'you' ? 'Y' : comment.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-2">
                    <div className="font-medium text-sm text-gray-700">
                      {comment.user}
                    </div>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  placeholder="Add a comment..."
                  className="flex-1 text-sm p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#72C1F5]"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="w-8 h-8 rounded-full bg-[#72C1F5] text-white flex items-center justify-center hover:bg-[#5CA8D8]"
                >
                  <FaPaperPlane size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CommunityLayout>
  );
};

export default CommunityDashboard;