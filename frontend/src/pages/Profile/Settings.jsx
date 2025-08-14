import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.id;
  const [theme, setTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [verified, setVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [avatarList, setAvatarList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Fetch user settings and avatars
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`);
        const data = await res.json();
        if (res.ok) {
          setUsername(data.username);
          setTheme(data.preferences?.theme === 'dark');
          setNotifications(data.preferences?.in_app_notifications_enabled ?? true);
          setSelectedAvatar(data.preferences?.avatar_id || 1);
          setVerified(data.twoFactorEnabled ?? false);
        }
      } catch (err) {
        console.error('Failed to load settings');
      }
    };

    const fetchAvatars = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/avatars');
        const data = await res.json();
        setAvatarList(data.data);
      } catch (err) {
        console.error('Failed to load avatars:', err);
      }
    };



    fetchSettings();
    fetchAvatars();
  }, [userId]);

  const handleUsernameChange = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const text = await res.text();
      console.log('Status:', res.status);
      console.log('Raw response:', text);

      try {
        const data = JSON.parse(text);
        if (res.ok) {
          alert('Username updated successfully!');
          setIsEditingUsername(false);

          const updatedUser = { ...user, username };
          localStorage.setItem('user', JSON.stringify(updatedUser));

        } else {
          alert(data.message || 'Failed to update username.');
        }
      } catch (parseError) {
        alert('Invalid server response. Check console.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to update username.');
    }
  };



  const handleAvatarChange = async (avatarId) => {
    try {
      setSelectedAvatar(avatarId); // Optimistic update
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_id: avatarId }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Failed to update avatar.');
      }
    } catch (err) {
      alert('Error updating avatar.');
    }
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new username"
              className="input flex-1"
            />
            <button
              onClick={handleUsernameChange}
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
              Current username: <span className="font-bold">{username || 'Not set'}</span>
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
          { label: 'Dark Mode', state: theme, setter: setTheme },
          { label: 'Enable In-App Notifications', state: notifications, setter: setNotifications },
          { label: 'Two Factor Verification', state: verified, setter: setVerified },
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
              key={avatar.avatar_id}
              onClick={() => handleAvatarChange(avatar.avatar_id)}
              className={`rounded-full overflow-hidden border-4 ${
                selectedAvatar === avatar.avatar_id ? 'border-[#88BC46]' : 'border-transparent'
              } transition-all duration-200`}
            >
              <img
                src={`/assets/Images/${avatar.avatar_image_path}`}
                alt={`avatar-${avatar.avatar_id}`}
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
        <button className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
        <button className="bg-[#AAD977] text-white px-4 py-2 rounded-md">Save</button>
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
