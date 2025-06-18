// src/pages/Profile/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [verified, setVerified] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4">Preferences</h3>
        <div className="flex items-center justify-between mb-2">
          <label className="font-medium">Dark Mode</label>
          <input type="checkbox" checked={theme} onChange={() => setTheme(!theme)} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-medium">Enable Notifications</label>
          <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
        </div>
        <div className="flex items-center justify-between">
          <label className="font-medium">Verified Account</label>
          <input type="checkbox" checked={verified} onChange={() => setVerified(!verified)} />
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold mb-4">Change Password</h3>
        <div className="grid gap-4">
          <input type="password" placeholder="Current Password" className="input" />
          <input type="password" placeholder="New Password" className="input" />
          <input type="password" placeholder="Confirm New Password" className="input" />
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-4 flex justify-end space-x-3">
        <button className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">Save</button>
      </div>
    </div>
  );
};

export default Settings;
