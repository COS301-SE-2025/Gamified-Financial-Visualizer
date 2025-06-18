import React from 'react';
import bannerImg from '../../assets/Images/banners/pixelStore.gif';
import avatarImg from '../../assets/Images/avatars/totoroAvatar.jpeg';

// Charts 
import XPProgressRing from '../../components/charts/XPProgressRing';
import MonthlyBarChart from '../../components/charts/MonthlyBarChart';

// Community Icons 
import community1 from '../../assets/Images/banners/pixelHouse.gif';
import community2 from '../../assets/Images/banners/pixelBalcony.gif';
import community3 from '../../assets/Images/banners/pixelApartment.gif';
import community4 from '../../assets/Images/banners/pixelStudents.jpeg';

// Community Member Icons 
import av1 from '../../assets/Images/avatars/catAvatar.jpeg';
import av2 from '../../assets/Images/avatars/flowerAvatar.jpeg';
import av3 from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import av4 from '../../assets/Images/avatars/totoroAvatar.jpeg';
import av5 from '../../assets/Images/avatars/pinkskyAvatar.jpeg';
import av6 from '../../assets/Images/avatars/carAvatar.jpeg';
import av7 from '../../assets/Images/avatars/cottageAvatar.jpeg';
import av8 from '../../assets/Images/avatars/ghostAvatar.jpeg';

const Overview = () => {
  const communityCards = [
    { name: 'Community 1', image: community1, xp: 4504, avatars: [av1, av2, av3] },
    { name: 'Community 2', image: community2, xp: 4524, avatars: [av3, av4, av1] },
    { name: 'Community 3', image: community3, xp: 7806, avatars: [av5, av6, av2, av3] },
    { name: 'Community 4', image: community4, xp: 2581, avatars: [av7, av8] },
  ];
  return (
    <div className="space-y-6">
      {/* 📸 Pixel Banner & Avatar */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow border border-gray-200">
        {/* Banner Image */}
        <img
          src={bannerImg}
          alt="Banner"
          className="w-full h-48 object-cover rounded-t-2xl"
        />

        {/* Floating Avatar and User Info Side-by-Side */}
        <div className="absolute left-6 -bottom-12 flex items-end space-x-4">
          {/* Avatar Circle */}
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
            <img
              src={avatarImg}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Username Box */}
          <div className="bg-white px-5 py-3 rounded-xl shadow-md border border-gray-200">
            <p className="text-md font-bold text-gray-800">satoshi_nak</p>
            <p className="text-xs text-red-400 font-semibold">Joined: 21/07/2027</p>
          </div>
        </div>

        {/* Spacer so content doesn't overlap */}
        <div className="h-16" />
      </div>

      {/* 🧪 XP Bar */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Lv Silver</p>
          <p className="text-sm text-gray-600">500 Points to next level</p>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-4">
          <div
            className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-yellow-300 to-orange-500"
            style={{ width: '85%' }}
          ></div>
        </div>
        <p className="text-sm text-right mt-1">5200 / 6000</p>
      </div>

      {/* 📊 Overall Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <XPProgressRing xp={350} total={1000} />
        <MonthlyBarChart />
      </div>

      {/* 🌐 Active Communities */}
      <div className="space-y-3">
        {communityCards.map((comm, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center gap-4">
              <img
                src={comm.image}
                alt={comm.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-gray-800">{comm.name}</p>
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    8 Members
                  </span>
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    9 Goals
                  </span>
                </div>
                <p className="text-xs text-orange-500 mt-1 font-semibold">
                  {comm.xp} XP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {comm.avatars.map((av, j) => (
                  <img
                    key={j}
                    src={av}
                    alt="user"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <button className="text-white text-sm bg-[#88BC46] px-4 py-1 rounded-full shadow hover:brightness-110 transition">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Overview;
