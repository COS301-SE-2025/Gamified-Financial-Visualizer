import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './layouts/Layout';
import LandingPage from './pages/Landing/LandingPage';

// ✅ Only loading ProfilePage for now
import ProfilePage from './pages/Profile/ProfilePage';

// 🔻 Commented out until the pages are ready
import Dashboard from './pages/Dashboard/DashboardPage';
// import Transaction from './pages/Transactions/Transactions';
import GoalsPage from './pages/Goals/GoalsPage';
import GoalsDetailPage from './pages/Goals/GoalDetailPage';
// import CommunityPage from './pages/CommunityPage/CommunityPage';
// import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';
// import CommunityListPage from './pages/CommunityPage/MyCommunities/CommunityListPage';
// import FriendProfilePage from './pages/CommunityPage/FriendProfile/FriendProfilePage';
// import ManageCommunityPage from './pages/CommunityPage/CommunityManage/ManageCommunityPage';
// import CreateCommunityPage from './pages/CommunityPage/CreateCommunity/CreateCommunityPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<LandingPage />}>
          {/* Uncomment when components are ready */}
          <Route path="Dashboard" element={<Dashboard />} />
          {/* <Route path="transactions" element={<Transaction />} /> */}
          <Route path="goals" element={<GoalsPage />} />
          <Route path="goals/:id" element={<GoalsDetailPage />} />
          {/* 
          <Route path="community" element={<CommunityPage />} />
          <Route path="communities" element={<CommunityListPage />} />
          <Route path="community/:id" element={<CommunityDetailPage />} />
          <Route path="manage-community/:id" element={<ManageCommunityPage />} />
          <Route path="friend-profile" element={<FriendProfilePage />} />
          <Route path="create-community" element={<CreateCommunityPage />} /> */}

          {/* ✅ Profile Page (works now) */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
