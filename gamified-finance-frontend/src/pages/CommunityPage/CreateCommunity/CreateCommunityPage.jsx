// ✅ src/pages/CommunityPage/CreateCommunity/CreateCommunityPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../MainContent/SearchBar';
import ActionButtons from '../MainContent/ActionButtons';
import SidebarLeft from '../SidebarLeft/SidebarLeft';
import SidebarRight from '../SidebarRight/SidebarRight';
import defaultAvatar1 from '../../../assets/Images/pixelDesk.jpeg';
import defaultAvatar2 from '../../../assets/Images/pixelPond.jpeg';
import defaultAvatar3 from '../../../assets/Images/pixelPorch.gif';
import defaultAvatar4 from '../../../assets/Images/pixelAllyway.jpeg';
import defaultAvatar5 from '../../../assets/Images/pixelToy.gif';
import banner1 from '../../../assets/Images/pixelShop.gif';
import banner2 from '../../../assets/Images/pixelStore.jpeg';
import banner3 from '../../../assets/Images/pixelNintendo.jpeg';
import banner4 from '../../../assets/Images/pixelBar.jpeg';
import banner5 from '../../../assets/Images/pixelMoonLight.jpeg';
import banner6 from '../../../assets/Images/pixelPorch.gif';

const CreateCommunityPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const banners = [
    banner1,
    banner2,
    banner3,
    banner4,
    banner5,
    banner6
  ];

  const friends = [
    { name: 'Nobuhle', avatar: defaultAvatar1 },
    { name: 'Matt', avatar: defaultAvatar2 },
    { name: 'Andre', avatar: defaultAvatar3 },
    { name: 'Matthew', avatar: defaultAvatar4 },
    { name: 'Lillian', avatar: defaultAvatar5 },
  ];

  const handleCreate = () => {
    // Simulate community creation logic
    navigate('/communities');
  };

  return (
    <div className="flex gap-4 p-6">
      <div className="w-1/4">
        <SidebarLeft />
      </div>

      <div className="flex-1 space-y-6">
        <SearchBar />
          <ActionButtons />
        <div className="bg-white p-6 rounded-xl shadow-sm">
          
          {/* Title Input */}
          <input
            type="text"
            placeholder="Compose a title"
            className="w-full mb-3 p-2 border rounded-lg bg-blue-50 placeholder:text-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description Input */}
          <textarea
            placeholder="Description"
            className="w-full mb-4 p-2 border rounded-lg h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          {/* Banners */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Banners</h4>
              <button className="text-xs text-blue-500 hover:underline">Insert Image</button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {banners.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`banner-${idx}`}
                  onClick={() => setSelectedBanner(src)}
                  className={`w-28 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedBanner === src ? 'border-blue-500' : 'border-transparent'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Friends */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Friends</h4>
            <div className="flex gap-3 overflow-x-auto">
              {friends.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  <p className="text-xs text-gray-500 mt-1">{f.name}</p>
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border text-2xl flex items-center justify-center text-gray-400 hover:text-black cursor-pointer">
                +
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="px-4 py-1 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-1 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/4">
        <SidebarRight />
      </div>
    </div>
  );
};

export default CreateCommunityPage;
