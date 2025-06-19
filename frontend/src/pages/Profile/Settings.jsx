// src/pages/Profile/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [verified, setVerified] = useState(false);

  // Change avatar configurations
  // Avatar list (add at top or inside component)
  function importAll(r) {
    return r.keys().map(r);
  }

  // Preload all avatars from folder
  const avatarImages = importAll(
    require.context('../../assets/Images/avatars', false, /\.(png|jpe?g|svg)$/)
  );

  const avatarList = avatarImages.map((src, i) => ({
    id: i,
    src,
  }));

  const [selectedAvatar, setSelectedAvatar] = useState(0);

  return (
    <div className="space-y-6">

      {/* Toggle Settings Area */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-[#88BC46] text-lg mb-4">Preferences</h3>
        {[
          {
            label: 'Dark Mode',
            state: theme,
            setter: setTheme,
          },
          {
            label: 'Enable Notifications',
            state: notifications,
            setter: setNotifications,
          },
          {
            label: 'Verified Account',
            state: verified,
            setter: setVerified,
          },
        ].map(({ label, state, setter }, i) => (
          <div key={i} className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={state}
                onChange={() => setter(!state)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#88BC46] rounded-full peer transition-all duration-300"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Password Change Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-[#88BC46]">Change Password</h3>
        <div className="grid gap-4">
          <input type="password" placeholder="Current Password" className="input" />
          <input type="password" placeholder="New Password" className="input" />
          <input type="password" placeholder="Confirm New Password" className="input" />
        </div>
      </div>

      {/* Change Avatar Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-[#88BC46]">Change Avatar</h3>
        <div className="flex flex-wrap gap-3">
          {avatarList.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`rounded-full overflow-hidden border-4 ${selectedAvatar === avatar.id
                ? 'border-[#88BC46]'
                : 'border-transparent'
                } transition-all duration-200`}
            >
              <img
                src={avatar.src}
                alt={`avatar-${avatar.id}`}
                className="w-14 h-14 object-cover rounded-full"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Save and cancel buttons */}
      <div className="bg-white shadow rounded-xl p-4 flex justify-end space-x-3">
        <button className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
        <button className="bg-[#AAD977] text-white px-4 py-2 rounded-md">Save</button>
      </div>
    </div>
  );
};

export default Settings;
