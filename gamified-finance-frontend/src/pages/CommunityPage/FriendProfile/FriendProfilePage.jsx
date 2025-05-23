import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../MainContent/SearchBar';
import ActionButtons from '../MainContent/ActionButtons';
import SidebarLeft from '../SidebarLeft/SidebarLeft';
import SidebarRight from '../SidebarRight/SidebarRight';
import communityBanner1 from '../../../assets/Images/pixelShop.gif';
import communityBanner2 from '../../../assets/Images/pixelNintendo.jpeg';
import communityBanner3 from '../../../assets/Images/pixelStore.jpeg';
import profileImage from '../../../assets/Images/pixelAllyway.jpeg';
import badge1 from '../../../assets/Images/awardIcon.png';
import badge2 from '../../../assets/Images/highFiveIcon.png';
import badge3 from '../../../assets/Images/moneyBagIcon.png';
import badge4 from '../../../assets/Images/notesIcon.png';
import badge5 from '../../../assets/Images/mountainIcon.png';
import badge6 from '../../../assets/Images/plantIocn.png';
import badge7 from '../../../assets/Images/scaleIcon.png';

const FriendProfilePage = () => {
   const navigate = useNavigate();
  const profile = {
    name: 'David',
    level: 'Gold',
    levelNum: 3,
    currentXP: 5200,
    nextXP: 6000,
    stats: {
      quizzes: 55,
      accuracy: 83,
      rank: 2,
    },
    badges: [
      badge1, badge2, badge3, badge4, badge5, badge6, badge7
    ],
    communities: [
      { name: 'New Business', image: communityBanner1 },
      { name: 'Retro Room', image: communityBanner2 },
      { name: 'Stargaze Night', image: communityBanner3 }
    ]
  };

  return (
    <div className="flex gap-4 p-6">
      <div className="w-1/4">
        <SidebarLeft />
      </div>

      <div className="flex-1 space-y-6">
        <SearchBar />
        <ActionButtons />
        {/* Header & XP */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={profileImage}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <div className="flex gap-2 mt-1">
                <button className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">Request</button>
                <button className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">Invite</button>
              </div>
            </div>
          </div>

          {/* XP / Level Progress */}
          <div className="bg-gray-100 p-3 rounded-xl w-96">
            <p className="text-sm font-semibold mb-1">Lv {profile.level}</p>
            <div className="bg-gray-300 rounded-full h-3">
              <div
                className="bg-orange-400 h-3 rounded-full"
                style={{ width: `${(profile.currentXP / profile.nextXP) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {profile.currentXP} / {profile.nextXP} Points to next level
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Badges</h4>
          <div className="flex gap-3">
            {profile.badges.map((badge, i) => (
              <div key={i} className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shadow">
                <img
                  src={badge}
                  alt={`badge-${i}`}
                  className="rounded-full w-18 h-18 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Statistics */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Profile Statistics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-pink-600">{profile.stats.quizzes}</p>
              <p className="text-xs text-gray-500">Quizzes</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{profile.stats.accuracy}%</p>
              <p className="text-xs text-gray-500">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">#{profile.stats.rank}</p>
              <p className="text-xs text-gray-500">Leaderboard</p>
            </div>
          </div>
        </div>

        {/* Community Participation */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Communities</h4>
          <div className="grid grid-cols-3 gap-4">
            {profile.communities.map((comm, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border shadow-sm bg-white">
                <img
                  src={comm.image}
                  alt={comm.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 text-center">
                  <p className="text-xs text-gray-600 mb-1">{comm.name}</p>
                  <button 
                  onClick={() => navigate('/community/bali-trip')}
                  className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full hover:bg-green-300">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/4">
        <SidebarRight />
      </div>
    </div>
  );
};

export default FriendProfilePage;
