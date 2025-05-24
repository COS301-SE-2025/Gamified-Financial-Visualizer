import React from 'react';

const SearchBar = () => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search goals, trips, or rewards..."
        className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;
