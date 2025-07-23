import React from 'react';

const SidebarContainer = ({ title, children }) => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-200">
    <p className="text-sm font-semibold text-[#1A202C] bg-[#E0F2FE] px-4 py-1 rounded-full inline-block mb-4">
      {title}
    </p>
    {children}
  </div>
);

export default SidebarContainer;