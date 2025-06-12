import React from 'react';
import bannerImg from '../../assets/Images/banners/pixelStore.gif'; // replace with actual
import avatarImg from '../../assets/Images/avatars/totoroAvatar.jpeg'; // replace with user's avatar

const Overview = () => {
  return (
    <div className="space-y-6">
      {/* 🎨 Banner + Avatar + User Info */}
      <div className="relative bg-white rounded-xl shadow overflow-hidden">
        <img src={bannerImg} alt="banner" className="w-full h-40 object-cover" />
        <div className="absolute left-6 -bottom-10">
          <img src={avatarImg} alt="avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
        </div>
        <div className="mt-12 p-4 pl-28">
          <h2 className="text-xl font-bold">satoshi_nak</h2>
          <p className="text-sm text-gray-500">Joined: 21/07/2027</p>
        </div>
      </div>

      {/* 🧪 XP Bar */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Lv Silver</p>
          <p className="text-sm text-gray-600">500 Points to next level</p>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-4">
          <div className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-yellow-300 to-orange-500" style={{ width: '85%' }}></div>
        </div>
        <p className="text-sm text-right mt-1">5200 / 6000</p>
      </div>

      {/* 🏅 Badges */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-md font-semibold mb-2">Badges</h3>
        <div className="flex space-x-4">
          <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center border">
            <img src="/badges/CoinStack.png" alt="badge1" className="w-8" />
          </div>
          <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center border">
            <img src="/icons/badge-plant.png" alt="badge2" className="w-8" />
          </div>
          <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center border">
            <img src="/icons/badge-hands.png" alt="badge3" className="w-8" />
          </div>
        </div>
      </div>

      {/* 📊 Statistics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h4 className="text-xs text-gray-500 mb-1">Quizzes</h4>
          <p className="text-xl font-bold">55</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h4 className="text-xs text-gray-500 mb-1">Accuracy</h4>
          <p className="text-xl font-bold">83%</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h4 className="text-xs text-gray-500 mb-1">Goals</h4>
          <p className="text-xl font-bold">14</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
          <h4 className="text-xs text-gray-500 mb-1">Leaderboard</h4>
          <p className="text-xl font-bold">#2</p>
        </div>
      </div>

      {/* 🌐 Active Communities */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-md font-semibold mb-4">Active Communities</h3>
        <div className="space-y-3">
          {['Frugal Warriors', 'Community 2', 'Community 3'].map((name, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={`/images/community${i + 1}.png`} // placeholder
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-gray-500">8 Members • 9 Goals</p>
                </div>
              </div>
              <button className="text-green-600 text-sm font-semibold hover:underline">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
