import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import FloatingHelpButton from '../components/ui/FloatingHelpButton';

const Layout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content below */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>

      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
};

export default Layout;
