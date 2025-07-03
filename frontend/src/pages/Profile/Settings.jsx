import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const [theme, setTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [outAppNotifications, setOutAppNotifications] = useState(true);
  const [verified, setVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [avatarList, setAvatarList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
 
  const passwordCriteria = {
    length: /^.{8,}$/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    special: /[\W_]/,
  };

  const usernameCriteria = {
    length: username.length >= 3 && username.length <= 15,
    pattern: /^[a-z0-9._]+$/.test(username),
  };

  const validatePassword = (pwd) => ({
    length: passwordCriteria.length.test(pwd),
    lowercase: passwordCriteria.lowercase.test(pwd),
    uppercase: passwordCriteria.uppercase.test(pwd),
    number: passwordCriteria.number.test(pwd),
    special: passwordCriteria.special.test(pwd),
  });

  const passwordStatus = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  const fetchSettings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`);
      const data = await res.json();
      if (res.ok) {
        setUsername(data.username);
        setTheme(data.preferences?.theme === 'dark');
        setNotifications(data.preferences?.in_app_notifications_enabled ?? true);
        setOutAppNotifications(data.outOfAppEnabled ?? false);
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

  useEffect(() => {
    fetchSettings();
    fetchAvatars();
  }, [userId]);

  const handleUsernameChange = async () => {
    if (!usernameCriteria.length || !usernameCriteria.pattern) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (res.ok) {
        setIsEditingUsername(false);
        await fetchSettings();
        const updatedUser = { ...user, username };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userUpdated'));
        toast.success('Username updated successfully');
      } else {
        const data = await res.json();
        if (data.message.includes('already in use')) {
          toast.error('Username already in use');
        } else {
          toast.error('Failed to update username');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to update username');
    }
  };

  const handleAvatarChange = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleSavePreferences = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: theme ? 'dark' : 'light',
          inAppNotifications: notifications,
          outOfAppEnabled: outAppNotifications,
          twoFactorEnabled: verified,
          avatar_id: selectedAvatar,
        }),
      });

      if (res.ok) {
        await fetchSettings();
        window.dispatchEvent(new Event('userUpdated'));
        toast.success('Preferences saved successfully');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      toast.error('Failed to save preferences');
    }
  };

  const handlePasswordChange = async () => {
    if (!Object.values(passwordStatus).every(Boolean)) return;
    if (!passwordsMatch) return;

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${userId}/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (res.ok) {
        setPasswordChanged(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Password updated successfully');
      } else {
        const data = await res.json();
        if (data.message.includes('Current password is incorrect')) {
          toast.error('Current password is wrong');
        } else {
          toast.error('Failed to change password');
        }
      }
    } catch (err) {
      console.error('Error updating password:', err);
      toast.error('Failed to change password');
    }
  };

  const renderCheck = (isValid) =>
    isValid ? <FaCheckCircle className="text-green-500 inline" /> : <FaTimesCircle className="text-red-500 inline" />;

  return (
    <div className="max-w-6xl mx-auto px-2 pb-2 space-y-6 overflow-y-auto">
      {/* Username Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-[#88BC46] text-lg mb-4">Change Username</h3>
        {isEditingUsername ? (
          <div className="w-full">
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
                disabled={!usernameCriteria.length || !usernameCriteria.pattern}
                className={`px-4 py-2 rounded-md text-white ${
                  !usernameCriteria.length || !usernameCriteria.pattern
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#AAD977]'
                }`}
              >
                Save
              </button>
              <button onClick={() => setIsEditingUsername(false)} className="bg-gray-200 px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
            {username.length > 0 && (
              <div className="text-xs text-gray-600 space-y-1 mt-1">
                <p>{renderCheck(usernameCriteria.length)} Between 3–15 characters</p>
                <p>{renderCheck(usernameCriteria.pattern)} Only lowercase letters, numbers, dots, and underscores</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Current username: <span className="font-bold">{username || 'Not set'}</span>
            </p>
            <button onClick={() => setIsEditingUsername(true)} className="bg-[#AAD977] text-white px-4 py-2 rounded-md text-sm">
              Change Username
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-[#88BC46] text-lg mb-4">Preferences</h3>
        {[{ label: 'Dark Mode', state: theme, setter: setTheme },
          { label: 'Enable In-App Notifications', state: notifications, setter: setNotifications },
          { label: 'Enable Out-of-App Notifications', state: outAppNotifications, setter: setOutAppNotifications },
          { label: 'Two Factor Verification', state: verified, setter: setVerified }].map(({ label, state, setter }, i) => (
            <div key={i} className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={state} onChange={() => setter(!state)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-[#88BC46] rounded-full transition-all duration-300"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform peer-checked:translate-x-5 transition-transform duration-300"></div>
              </label>
            </div>
        ))}
      </div>

      {/* Password Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-[#88BC46]">Change Password</h3>
        <div className="grid gap-4 mb-3">
          <div className="relative">
            <input 
              type={showCurrentPassword ? "text" : "password"} 
              placeholder="Current Password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
              className="input w-full" 
            />
            <button 
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"} 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="input w-full" 
            />
            <button 
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm New Password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="input w-full" 
            />
            <button 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {(currentPassword || newPassword || confirmPassword) && (
          <div className="text-xs space-y-1 mb-2">
            <p>{renderCheck(passwordStatus.length)} At least 8 characters</p>
            <p>{renderCheck(passwordStatus.lowercase)} One lowercase letter</p>
            <p>{renderCheck(passwordStatus.uppercase)} One uppercase letter</p>
            <p>{renderCheck(passwordStatus.number)} One number</p>
            <p>{renderCheck(passwordStatus.special)} One special character</p>
            <p>{renderCheck(passwordsMatch)} Passwords match</p>
          </div>
        )}
        <button
          onClick={handlePasswordChange}
          disabled={
            !currentPassword.length ||
            !Object.values(passwordStatus).every(Boolean) ||
            !passwordsMatch
          }
          className={`px-4 py-2 rounded-md mt-2 text-white ${
            !currentPassword.length ||
            !Object.values(passwordStatus).every(Boolean) ||
            !passwordsMatch
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#AAD977]'
          }`}
        >
          Update Password
        </button>
      </div>

      {/* Avatar */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4 text-[#88BC46]">Change Avatar</h3>
        <div className="flex flex-wrap gap-3">
          {avatarList.map((avatar) => (
            <button key={avatar.avatar_id} onClick={() => handleAvatarChange(avatar.avatar_id)}
              className={`rounded-full overflow-hidden border-4 ${
                selectedAvatar === avatar.avatar_id ? 'border-[#88BC46]' : 'border-transparent'
              } transition-all duration-200`}>
              <img src={`/assets/Images/${avatar.avatar_image_path}`} alt={`avatar-${avatar.avatar_id}`}
                className="w-14 h-14 object-cover rounded-full" />
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white shadow rounded-xl p-6 border border-red-100">
        <h3 className="font-semibold text-red-500 mb-4">Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">Deleting your account is permanent and cannot be undone.</p>
        <button onClick={() => setShowConfirm(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
          Delete My Account
        </button>
      </div>

      {/* Save Preferences */}
      <div className="bg-white shadow rounded-xl p-4 flex justify-start space-x-3">
        <button className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
        <button onClick={handleSavePreferences} className="bg-[#AAD977] text-white px-4 py-2 rounded-md">Save</button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-red-500">Confirm Account Deletion</h2>
            <p className="text-sm text-gray-600">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowConfirm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
              <button onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:5000/api/auth/${userId}`, { method: 'DELETE' });
                  if (res.ok) {
                    localStorage.clear();
                    navigate('/landing');
                  } else {
                    const data = await res.json();
                    console.error(data.message || 'Account deletion failed');
                  }
                } catch (err) {
                  console.error('Error deleting account:', err);
                }
              }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
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