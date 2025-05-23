import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-4 px-6">
        <Outlet /> {/* renders the matched child route */}
      </main>
    </div>
  );
};

export default Layout;
