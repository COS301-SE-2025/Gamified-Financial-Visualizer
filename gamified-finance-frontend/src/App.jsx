import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './layouts/layout';

import CommunityPage from './pages/CommunityPage/CommunityPage';
// import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';
// import CommunityListPage from './pages/CommunityPage/MyCommunities/CommunityListPage';
// import FriendProfilePage from './pages/CommunityPage/FriendProfile/FriendProfilePage';
// import ManageCommunityPage from './pages/CommunityPage/CommyunityManage/ManageCommunityPage';
// import CreateCommunityPage from './pages/CommunityPage/CreateCommunity/CreateCommunityPage';
import HomePage from './pages/Dashboard/Home';
import Transaction from './pages/Transactions/Transactions';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
