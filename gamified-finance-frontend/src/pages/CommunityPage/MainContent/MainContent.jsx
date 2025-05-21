import React from 'react';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import CommunityPost from './CommunityPost';

const MainContent = () => {
  return (
    <div className="space-y-4">
      <SearchBar />
      <ActionButtons />
      <CommunityPost />
      <CommunityPost />
    </div>
  );
};

export default MainContent;
