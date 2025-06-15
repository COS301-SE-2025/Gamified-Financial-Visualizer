import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// The Login Page Routes
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import Layout from './layouts/Layout';
import LandingPage from './pages/Landing/LandingPage';

// The Profile Page Routes
import ProfilePage from './pages/Profile/ProfilePage';
import Dashboard from './pages/Dashboard/DashboardPage';

// The Goals Page Routes
import GoalsPage from './pages/Goals/GoalsPage';
import GoalCreatePage from './pages/Goals/GoalCreatePage';
import GoalsDetailPage from './pages/Goals/GoalDetailPage';

// The Transactions Page Routes
import TransactionPage from './pages/Accounts/TransactionsPage';

// The Learn Page Routes
import LearningPage from './pages/Learn/LearnModulesPage';

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
          <Route path="/learn" element={<LearningPage/>}/>
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/create" element={<GoalCreatePage />} />
          <Route path="/goals/details/:title" element={<GoalsDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
