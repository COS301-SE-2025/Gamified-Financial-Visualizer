import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './layouts/Layout';
import LandingPage from './pages/Landing/LandingPage';

import ProfilePage from './pages/Profile/ProfilePage';
import Dashboard from './pages/Dashboard/DashboardPage';
import GoalsPage from './pages/Goals/GoalsPage';
import GoalsDetailPage from './pages/Goals/GoalDetailPage';
import TransactionPage from './pages/Accounts/TransactionsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside shared Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path= "/transactions" element={<TransactionPage/>}/>
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/:id" element={<GoalsDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
