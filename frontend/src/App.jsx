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

// The Community Page Routes
import CommunityDashboard from './pages/Community/CommunityDashboard';
import FriendsList from './pages/Community/FriendsList';
import CommunityDetail from './pages/Community/CommunityDetail';
import ChallengesPage from './pages/Community/ChallengesPage';
import CommunityMemberPage from './pages/Community/CommunityMemberPage';

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
          {/* Routes for the home page */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionPage />} />
            
          {/* Routes for the learn page */}
          <Route path="/learn" element={<LearningPage />} />

          {/* Routes for the help page */}
          <Route path="/support" element={<HelpViewLayout />}>
            <Route index element={<HelpMain />} />
            <Route path="faqs" element={<FAQDetails />} />
            <Route path="tutorials" element={<TutorialDetails />} />
          </Route>

          {/* Routes for the Achievements page */}
          <Route path="/achievements" element={<AchievementsPage />} />

          {/* Routes for the Community pages */}
          <Route path="/community" element={<CommunityDashboard />} />
          <Route path="/community/friends" element={<FriendsList />} />
          <Route path="/community/details/:communityId" element={<CommunityDetail />} />
          <Route path="/community/challenges" element={<ChallengesPage />} />
          <Route path="/community/member/:username" element={<CommunityMemberPage />} />

          {/* Routes for the Accounts pages */}
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/insights" element={<AccountInsights/>}/>
          <Route path="/budget" element={<AccountBudget/>}/>
          <Route path="/import" element={<AccountsImport/>}/>

          {/* Routes for the goals page */}
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/create" element={<GoalCreatePage />} />
          <Route path="/goals/details/:goalId" element={<GoalsDetailPage />} />

          {/* Routes for the profile page */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
