import React, { useState } from 'react';
import ProfileViewLayout from './ProfileViewLayout';
import Overview from './Overview';
import Settings from './Settings';


const ProfilePage = () => {
  const [tab, setTab] = useState('main'); // 'main' or 'settings'

  return (
    <ProfileViewLayout tab={tab} setTab={setTab}>
      <div className="flex flex-col gap-6 px-6 py-6">
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {tab === 'main' ? <Overview /> : <Settings />}
        </main>
      </div>
    </ ProfileViewLayout>
  );
};

export default ProfilePage;
