import React from 'react';
import { Link } from 'react-router-dom';

const CommunityCard = ({ title, image, badgeIcon }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex items-center justify-between p-3 hover:shadow-md transition">
      <div className="flex items-center space-x-4">
        <img src={image} alt={title} className="w-20 h-16 object-cover rounded-md" />
        <div>
          <h3 className="text-md font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-400">Community description goes here.</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Group Avatar / Members Indicator */}
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-blue-200 border-2 border-white"></div>
          <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white"></div>
          <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white"></div>
        </div>

        <Link to={`/manage-community/${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <button className="text-sm px-4 py-1 bg-orange-200 text-orange-800 rounded-full hover:bg-orange-300">
            Manage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CommunityCard;