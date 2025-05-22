import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CommunityPage from './pages/CommunityPage/CommunityPage';
import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';
import Dashboard from './pages/Dashboard/Dashboard';

import Layout from './layouts/layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public (unauthenticated) routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected (authenticated) routes with layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <div className="min-h-screen bg-gray-100">
                <Dashboard />
              </div>
            </Layout>
          }
        />

        <Route
          path="/community"
          element={
            <Layout>
              <div className="min-h-screen bg-gray-100">
                <CommunityPage />
              </div>
            </Layout>
          }
        />
        <Route
          path="/community/:id"
          element={
            <Layout>
              <div className="min-h-screen bg-gray-100">
                <CommunityDetailPage />
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
