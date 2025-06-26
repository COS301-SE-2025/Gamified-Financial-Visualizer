import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileViewLayout from './ProfileViewLayout';
import Overview from './Overview';
import Settings from './Settings';

const ProfilePage = () => {
  const location = useLocation();

  return (
    <ProfileViewLayout>
      {location.pathname === '/settings' ? <Settings /> : <Overview />}
    </ProfileViewLayout>
  );
};

export default ProfilePage;
