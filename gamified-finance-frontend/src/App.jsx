import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CommunityPage from './pages/CommunityPage/CommunityPage';
import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';
import CommunityListPage from './pages/CommunityPage/MyCommunities/CommunityListPage';
import FriendProfilePage from './pages/CommunityPage/FriendProfile/FriendProfilePage';
import ManageCommunityPage from './pages/CommunityPage/CommyunityManage/ManageCommunityPage';
import CreateCommunityPage from './pages/CommunityPage/CreateCommunity/CreateCommunityPage';

import Layout from './layouts/layout';
function App() {
  return (
    <Router>
      <Layout>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/communities" element={<CommunityListPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/manage-community/:id" element={<ManageCommunityPage />} />
          <Route path="/friend-profile" element={<FriendProfilePage />} />
          <Route path="/create-community" element={<CreateCommunityPage />} />
        </Routes>
      </div>
      </Layout>
    </Router>

  );
}

export default App;
