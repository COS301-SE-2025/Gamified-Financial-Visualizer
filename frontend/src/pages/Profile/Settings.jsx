// Settings.jsx
import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [theme, setTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [verified, setVerified] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  function importAll(r) {
    return r.keys().map(r);
  }

  const avatarImages = importAll(
    require.context('../../assets/Images/avatars', false, /\.(png|jpe?g|svg)$/)
  );
  const avatarList = avatarImages.map((src, i) => ({ id: i, src }));

  // Initialize state with user data
  const [settings, setSettings] = useState({
    username: user?.username || '',
    theme: 'light', // default to light
    notifications: true,
    verified: false,
    avatarId: user?.avatar_id || 1,
    outOfAppNotifications: true
  });


  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/${user.id}/settings`);
        const data = await response.json();
        if (response.ok) {
          setSettings({
            username: data.username || user.username,
            theme: data.theme || 'light',
            notifications: data.inAppNotifications !== false,
            verified: data.twoFactorEnabled || false,
            avatarId: data.avatar_id || 1,
            outOfAppNotifications: data.outOfAppEnabled !== false
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id,  user?.username]);

  // Handle saving settings
  const handleSaveSettings = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${user.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: isEditingUsername ? settings.username : undefined,
          theme: settings.theme === 'dark' ? 'dark' : 'light',
          avatar_id: settings.avatarId,
          inAppNotifications: settings.notifications,
          outOfAppEnabled: settings.outOfAppNotifications,
          twoFactorEnabled: settings.verified
        })
      });
      const data = await response.json();

      if (response.ok) {
        // Update local user data
        if (isEditingUsername) {
          const updatedUser = { ...user, username: settings.username };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setIsEditingUsername(false);
        }
      } else {
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Handle username change
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setSettings({ ...settings, username: newUsername });
  };

  // Handle toggle changes
  const handleToggleChange = (field) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  // Handle avatar selection
  const handleAvatarSelect = (id) => {
    setSettings({ ...settings, avatarId: id });
  };

  return (
    <div className="max-w-6xl mx-auto px-2 pb-2 space-y-6 overflow-y-auto">
      {/* Username */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-[#88BC46] text-lg mb-4">Change Username</h3>
        {isEditingUsername ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={settings.username}
              onChange={handleUsernameChange}
              placeholder="Enter new username"
              className="input flex-1"
            />
            <button
              onClick={() => {
                handleSaveSettings();
                setIsEditingUsername(true);
              }}
              className="bg-[#AAD977] text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditingUsername(false)}
              className="bg-gray-200 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Current username: <span className="font-bold">{user.username || 'Not set'}</span>
            </p>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="bg-[#AAD977] text-white px-4 py-2 rounded-md text-sm"
            >
              Change Username
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-[#88BC46] text-lg mb-4">Preferences</h3>
        {[
          {
            label: 'Dark Mode',
            field: 'theme',
            value: settings.theme === 'dark',
            toggle: () => setSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })
          },
          {
            label: 'Enable In-App Notifications',
            field: 'notifications',
            value: settings.notifications,
            toggle: () => handleToggleChange('notifications')
          },
          {
            label: 'Two Factor Verification',
            field: 'verified',
            value: settings.verified,
            toggle: () => handleToggleChange('verified')
          },
        ].map(({ label, field, value, toggle }, i) => (
          <div key={i} className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={toggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#88BC46] rounded-full transition-all duration-300"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300"></div>
            </label>
          </div>
        ))}
      </div>

      {/* Password */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-[#88BC46]">Change Password</h3>
        <div className="grid gap-4">
          <input type="password" placeholder="Current Password" className="input" />
          <input type="password" placeholder="New Password" className="input" />
          <input type="password" placeholder="Confirm New Password" className="input" />
        </div>
      </div>

      {/* Avatar */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-[#88BC46]">Change Avatar</h3>
        <div className="flex flex-wrap gap-3">
          {avatarList.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar.id)}
              className={`rounded-full overflow-hidden border-4 ${settings.avatarId === avatar.id ? 'border-[#88BC46]' : 'border-transparent'} transition-all duration-200`}
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

      {/* Danger Zone */}
      <div className="bg-white shadow rounded-xl p-6 border border-red-100">
        <h3 className="font-semibold text-red-500 mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Delete My Account
        </button>
      </div>

      {/* Save/Cancel */}
      <div className="bg-white shadow rounded-xl p-4 flex justify-start space-x-3">
        <button className="bg-gray-200 px-4 py-2 rounded-md"
          onClick={() => navigate(-1)}
        >Cancel</button>
        <button className="bg-[#AAD977] text-white px-4 py-2 rounded-md"
          onClick={handleSaveSettings}
        >Save</button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-red-500">Confirm Account Deletion</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/landing');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;