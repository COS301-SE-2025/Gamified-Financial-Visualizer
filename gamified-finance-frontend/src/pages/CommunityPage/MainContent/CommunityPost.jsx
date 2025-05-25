import React from 'react';
import { Link } from 'react-router-dom';

const CommunityPost = ({ title, year, avatar, bannerImage, themeColors, headerColor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center space-x-2 text-white px-4 py-2"
        style={{ backgroundColor: headerColor }}
      >
        <img
          src={avatar}
          alt="avatar"
          className="rounded-full w-8 h-8 object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
          <p className="text-xs">{year}</p>
        </div>
      </div>

      {/* Banner */}
      <div className="relative">
        <img src={bannerImage} alt={title} className="w-full h-48 object-cover" />

        {/* Color bubbles */}
        <div className="absolute -bottom-5 right-4 flex">
          {themeColors.map((color, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full border-2 border-white shadow -ml-2 first:ml-0`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>

      </div>

      {/* Body */}
      <div className="px-4 pt-6 pb-4 space-y-2">
        <div className="space-y-1">
          <div className="w-3/4 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2/3 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-1/2 h-2 bg-gray-300 rounded-full"></div>
        </div>

        {/* View Button */}
        <Link to={`/community/${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <button className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md hover:from-green-500 hover:to-emerald-600 transition duration-200">
            View
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CommunityPost;
