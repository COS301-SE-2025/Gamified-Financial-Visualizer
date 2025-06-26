import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// The Login Page Routes
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Layout and Landing Routes
import Layout from './layouts/Layout';
import LandingPage from './pages/Landing/LandingPage';
import LandingAchievements from './pages/Landing/LandingAchievements';
import AboutPage from './pages/Landing/about';
import ContactPage from './pages/Landing/contact';

// The Dashboard-home Routes
import Dashboard from './pages/Dashboard/DashboardPage';

// The Profile Page Routes
import Overview from './pages/Profile/Overview';
import Settings from './pages/Profile/Settings';
import ProfileViewLayout from './pages/Profile/ProfileViewLayout'

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
import IncompleteCourses from './pages/Learn/Incomplete';
import CompleteCourses from './pages/Learn/Complete';
import LessonsModulesDetailPage from './pages/Learn/LessonDetailPage';

// The Support Page Routes
import FAQDetails from './pages/Support/FAQDetails';
import HelpViewLayout from './pages/Support/HelpViewLayout';
import HelpMain from './pages/Support/HelpMain';
import HelpOverview from './pages/Support/OverviewLanding';
import TutorialDetails from './pages/Support/TutorialDetails';
import SectionDetail from './pages/Support/SectionDetail';

// The Community Page Routes
import CommunityDashboard from './pages/Community/CommunityDashboard';
import FriendsList from './pages/Community/FriendsList';
import CommunityDetail from './pages/Community/CommunityDetail';
import CommunityList from './pages/Community/CommunityList';
import ChallengeDetail from './pages/Community/ChallengeDetail';
import ChallengesPage from './pages/Community/ChallengesPage';
import CommunityMemberPage from './pages/Community/CommunityMemberPage';
import CommunityCreate from './pages/Community/CommunityCreate';
import ChallengeCreate from './pages/Community/ChallengeCreate';
import CommunityGameRoom from './pages/Community/CommunityGameRoom';

// The Achievements Page Routes
import AchievementsPage from './pages/Achievements/AchievementsPage';
import AchievementDetailPage from './pages/Achievements/AchievementDetailPage';
import IncompleteAchievements from './pages/Achievements/IncompleteAchievement';
import CompleteAchievements from './pages/Achievements/CompleteAchievement';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/landingAchievements" element={<LandingAchievements />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside shared Layout */}
        <Route element={<Layout />}>
          {/* Routes for the home page */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionPage />} />

          {/* Routes for the learn page */}
          {/* Routes for the learn page */}
          <Route path="/learn" element={<LearningPage />} />

          <Route path="/learn/complete" element={<CompleteCourses />} />
          <Route path="/learn/incomplete" element={<IncompleteCourses />} />
          <Route path="/modules/:moduleId/lessons" element={<LessonsModulesDetailPage />} />

          <Route path="/learn/complete" element={<CompleteCourses />} />
          <Route path="/learn/incomplete" element={<IncompleteCourses />} />
          <Route path="/modules/:moduleId/lessons" element={<LessonsModulesDetailPage />} />
          <Route path="/learning/:moduleSlug/:moduleId/lessons" element={<LessonsModulesDetailPage />} />

          {/* Routes for the help page */}
          <Route path="/support" element={<HelpViewLayout />}>
            <Route index element={<HelpMain />} />
            <Route path="faqs" element={<FAQDetails />} />
            <Route path="overview">
              <Route index element={<HelpOverview />} />
              <Route path=":section" element={<SectionDetail />} />
            </Route>
            <Route path="tutorials" element={<TutorialDetails />} />
          </Route>

          {/* Routes for the Achievements page */}
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/achievements/:id" element={<AchievementDetailPage />} />
          <Route path="/achievements/complete" element={<CompleteAchievements />} />
          <Route path="/achievements/incomplete" element={<IncompleteAchievements />} />

          {/* Routes for the Community pages */}
          <Route path="/community" element={<CommunityDashboard />} />
          <Route path="/community/list" element={<CommunityList />} />
          <Route path="/community/friends" element={<FriendsList />} />
          <Route path="/community/details/:communityId" element={<CommunityDetail />} />
          <Route path="/community/challenges" element={<ChallengesPage />} />
          <Route path="/community/member/:username" element={<CommunityMemberPage />} />
          <Route path="/community/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/community/create" element={<CommunityCreate />} />
          <Route path="/community/challenges/create" element={<ChallengeCreate />} />
          <Route path="/community/game" element={<CommunityGameRoom />} />

          {/* Routes for the Accounts pages */}
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/transactions/insights" element={<AccountInsights />} />
          <Route path="/transactions/budget" element={<AccountBudget />} />
          <Route path="/transactions/import" element={<AccountsImport />} />

          {/* Routes for the goals page */}
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/goals/create" element={<GoalCreatePage />} />
          <Route path="/goals/details/:goalId" element={<GoalsDetailPage />} />

          {/* Routes for the profile page */}
          <Route path="/profile" element={<ProfileViewLayout />}>
            <Route index element={<Overview />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
