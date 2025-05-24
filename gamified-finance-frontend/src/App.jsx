import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './layouts/layout';
// Community Pages
import CommunityPage from './pages/CommunityPage/CommunityPage';
import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';
import CommunityListPage from './pages/CommunityPage/MyCommunities/CommunityListPage';
import FriendProfilePage from './pages/CommunityPage/FriendProfile/FriendProfilePage';
import ManageCommunityPage from './pages/CommunityPage/CommyunityManage/ManageCommunityPage';
import CreateCommunityPage from './pages/CommunityPage/CreateCommunity/CreateCommunityPage';
import GoalsPage from './pages/GoalsPage/GoalPage';
import GoalsDetailPage from './pages/GoalsPage/GoalsDetailPage/GoalsDetailPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="community" element={<CommunityPage />} />
        <Route path="communities" element={<CommunityListPage />} />
        <Route path="community/:id" element={<CommunityDetailPage />} />
        <Route path="manage-community/:id" element={<ManageCommunityPage />} />
        <Route path="friend-profile" element={<FriendProfilePage />} />
        <Route path="create-community" element={<CreateCommunityPage />} />
        <Route path="goals" element={<GoalsPage />}>
          <Route path="/goals/:id" element={<GoalsDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
