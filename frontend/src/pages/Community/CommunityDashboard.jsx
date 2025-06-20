// src/pages/Community/CommunityDashboard.jsx
import React, { useState } from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaHeart, FaCoins, FaSeedling, FaPrayingHands, FaTrophy, FaPen, FaEye, FaGamepad } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import avatar1 from '../../assets/Images/avatars/totoroAvatar.jpeg';
import avatar2 from '../../assets/Images/avatars/beachAvatar.jpeg';
import postBanner1 from '../../assets/Images/banners/pixelStore.gif';
import postBanner2 from '../../assets/Images/banners/pixelApartment.gif';
import achievement from '../../assets/Images/banners/pixelOffice.gif';

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
    image: achievement,
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
    image: achievement,
  },
];

const CommunityDashboard = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');

  const handlePost = () => {
    if (!newPost.trim()) return;
    const updated = [
      {
        id: Date.now(),
        user: {
          name: 'you',
          level: 'Silver',
          avatar: avatar1,
        },
        banner: postBanner1,
        content: newPost,
        communities: ['Cash Cows'],
        likes: 0,
        image: achievement,
      },
      ...posts,
    ];
    setPosts(updated);
    setNewPost('');
  };

  return (
    <CommunityLayout>
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <CommunityHeader />

        {/* Game Feature Banner */}
        <div className="flex-1 bg-gradient-to-r from-[#B1E1FF] via-[#AAD977] to-[#FBD38D] p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            <FaGamepad /> Join the Financial Quiz Challenge!
          </h2>
          <p className="text-sm md:text-base text-gray-700 mb-4">
            Compete solo or with friends in our interactive finance game. Test your knowledge, earn XP,
            and climb the leaderboard. Let’s see who the true finance master is!
          </p>
          <div className="flex justify-end">
            <Link
              to="/community/game"
              className="flex items-center gap-2 bg-gradient-to-r from-[#88BC46] to-[#AAD977] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition"
            >
              <FaGamepad /> Play Quiz Game
            </Link>
          </div>
        </div>

        {/* Create Post */}
        <div className="bg-white p-5 rounded-3xl shadow-md border">
          <h2 className="text-lg font-bold text-gray-700 mb-2 flex items-center gap-2">
            <FaPen className="text-[#88BC46]" /> Create a Post
          </h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
            placeholder="Share your progress or achievement..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#88BC46]"
          ></textarea>
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePost}
              className="bg-[#AAD977] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#83AB55] transition"
            >
              Post
            </button>
          </div>
        </div>

        {/* Feed */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl shadow p-5 space-y-4 border border-gray-100"
          >
            {/* Banner */}
            <div className="relative">
              <img
                src={post.banner}
                alt="banner"
                className="w-full h-48 object-cover rounded-2xl"
              />
              <div className="absolute -bottom-8 left-6 flex items-center gap-4">
                <img
                  src={post.user.avatar}
                  alt="avatar"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                />
                <div className="bg-white shadow-md px-4 py-2 rounded-full flex items-center gap-3">
                  <p className="text-md font-medium text-gray-800">@{post.user.name}</p>
                  <p className="text-sm italic text-[#F28B82]">Lv {post.user.level}</p>
                </div>
              </div>
            </div>

            <div className="h-8" />

            {/* Post Content */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full max-h-60 object-cover rounded-xl border"
                />
              )}
            </div>

            {/* Communities */}
            <div className="flex flex-wrap gap-2 text-xs text-[#72C1F5]">
              {post.communities.map((name, i) => (
                <span
                  key={i}
                  className="bg-[#E0F2FE] text-[#72C1F5] px-2 py-1 rounded-full border border-[#B1E1FF]"
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1 text-[#ED5E52]">
                <FaHeart />
                <span className="text-sm font-medium">{post.likes}</span>
              </div>
              <Link
                to={`/community/member/${post.user.name}`}
                className="bg-[#AAD977] hover:bg-[#83AB55] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1"
              >
                <FaEye /> View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </CommunityLayout>
  );
};

export default CommunityDashboard;
