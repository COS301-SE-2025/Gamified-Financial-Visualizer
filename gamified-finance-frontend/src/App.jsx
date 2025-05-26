import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './layouts/layout';

import CommunityPage from './pages/CommunityPage/CommunityPage';
import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';
import CommunityListPage from './pages/CommunityPage/MyCommunities/CommunityListPage';
import FriendProfilePage from './pages/CommunityPage/FriendProfile/FriendProfilePage';
import ManageCommunityPage from './pages/CommunityPage/CommyunityManage/ManageCommunityPage';
import CreateCommunityPage from './pages/CommunityPage/CreateCommunity/CreateCommunityPage';
import HomePage from './pages/Dashboard/Home';
import Transaction from './pages/Transactions/Transactions';
import GoalsPage from './pages/GoalsPage/GoalPage';
import GoalsDetailPage from './pages/GoalsPage/GoalsDetailPage/GoalsDetailPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="communities" element={<CommunityListPage />} />
          <Route path="community/:id" element={<CommunityDetailPage />} />
          <Route path="manage-community/:id" element={<ManageCommunityPage />} />
          <Route path="friend-profile" element={<FriendProfilePage />} />
          <Route path="create-community" element={<CreateCommunityPage />} />
          <Route path="goals" element={<GoalsPage />}>
            <Route path=":id" element={<GoalsDetailPage />} />
        </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
