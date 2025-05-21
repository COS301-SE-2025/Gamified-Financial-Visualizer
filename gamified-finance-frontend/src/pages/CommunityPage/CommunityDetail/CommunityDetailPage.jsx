import React from 'react';
import { useParams } from 'react-router-dom';

const CommunityDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Viewing community: {id}</h1>
    </div>
  );
};

export default CommunityDetailPage;
