import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CommunityPage from './pages/CommunityPage/CommunityPage';
import CommunityDetailPage from './pages/CommunityPage/CommunityDetail/CommunityDetailPage';

import Layout from './layouts/layout';
function App() {
  return (
    <Router>
      <Layout>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
        </Routes>
      </div>
      </Layout>
    </Router>

  );
}

export default App;
