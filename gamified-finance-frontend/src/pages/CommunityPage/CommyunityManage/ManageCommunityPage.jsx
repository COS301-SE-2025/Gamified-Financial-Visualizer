import React from 'react';
import SidebarLeft from '../SidebarLeft/SidebarLeft';
import SearchBar from '../MainContent/SearchBar';
import ActionButtons from '../MainContent/ActionButtons';
import SidebarRight from '../SidebarRight/SidebarRight';
import CommunityFriendsList from '../CommunityDetail/CommunityFriendsList';
import bannerImage from '../../../assets/Images/pixelBar.jpeg';
import profile from '../../../assets/Images/pixelWindow.gif';
import coin from '../../../assets/Images/CoinStack.png';

const ManageCommunityPage = () => {
  const community = {
    name: 'Bali Trip',
    year: 2027,
    banner: bannerImage,
    description: 'Community Description',
    progress: 95,
  };

  return (
    <div className="flex gap-4 p-6">
      <div className="w-1/4">
        <SidebarLeft />
      </div>

      <div className="flex-1 space-y-6">
        <SearchBar />
        <ActionButtons />
        {/* Header Section */}
        <div className="rounded-xl overflow-hidden border shadow-md">
          <div className="flex items-center space-x-3 px-4 py-2 bg-green-700 text-white">
            <img
              src={profile}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold text-lg leading-tight">{community.name}</h2>
              <p className="text-xs">{community.year}</p>
            </div>
          </div>
          <img
            src={community.banner}
            alt="Banner"
            className="w-full h-52 object-cover"
          />
        </div>

        {/* Description + Progress */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3 relative">
          <p className="text-sm font-semibold text-gray-600 mb-1">{community.description}</p>

          <div className="flex items-center justify-between">
            <div className="w-full">
              <p className="text-xs text-gray-500 mb-1">Community Progress</p>
              <div className="bg-gray-200 h-3 rounded-full w-full">
                <div
                  className="bg-lime-400 h-3 rounded-full"
                  style={{ width: `${community.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-xs text-gray-400 mt-1">{community.progress}% Complete</p>
            </div>

            {/* Coins icon */}
            <img
              src={coin}
              alt="coins"
              className="absolute right-3 -top-14 w-20 h-20 rounded-full border-2 border-white shadow-md object-contain bg-white"
            />

          </div>

          {/* Edit & Delete */}
          <div className="flex justify-end gap-2 pt-3">
            <button className="flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-4 py-1 rounded-full">
              ✎ Edit
            </button>
            <button className="flex items-center gap-1 text-sm bg-red-100 text-red-700 px-4 py-1 rounded-full">
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Friends List */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Community Friends</h4>
            <button className="w-8 h-8 rounded-full border text-2xl text-gray-400 hover:text-black">+</button>
          </div>
          <CommunityFriendsList />
        </div>
      </div>

      <div className="w-1/4">
        <SidebarRight />
      </div>
    </div>
  );
};

export default ManageCommunityPage;
