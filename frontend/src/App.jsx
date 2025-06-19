import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// The Login Page Routes
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Layout and Landing Routes
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
import AccountInsights from './pages/Accounts/Insights';
import AccountBudget from './pages/Accounts/Budget';
import AccountsImport from './pages/Accounts/Import';

// The Learn Page Routes
import LearningPage from './pages/Learn/LearnModulesPage';

// The Support Page Routes
import FAQDetails from './pages/Support/FAQDetails';
import HelpViewLayout from './pages/Support/HelpViewLayout';
import HelpMain from './pages/Support/HelpMain';
import TutorialDetails from './pages/Support/TutorialDetails';

// The Achievements Page Routes
import AchievementsPage from './pages/Achievements/AchievementsPage';

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
          <Route path="/insights" element={<AccountInsights/>}/>
          <Route path="/budget" element={<AccountBudget/>}/>
          <Route path="/import" element={<AccountsImport/>}/>
          <Route path="/learn" element={<LearningPage/>}/>
          <Route path="/support" element={<SupportPage/>}/>
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/create" element={<GoalCreatePage />} />
          <Route path="/goals/details/:title" element={<GoalsDetailPage />} />

          {/* Routes for the profile page */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
