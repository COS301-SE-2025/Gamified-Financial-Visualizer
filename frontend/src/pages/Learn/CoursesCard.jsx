import React from 'react';
import { FaRegImage } from 'react-icons/fa';

const CourseCard = ({ title, lessons, image, progress }) => {
  const hasProgress = typeof progress === 'number';

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden w-60">
      {/* Top image */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-28 object-cover"
        />
        {hasProgress && (
          <div className="absolute bottom-0 left-0 w-full h-[8px] bg-gray-200">
            <div
              className="h-full rounded-r-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(to right, #FF6A3D, #FFD86F)',
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {hasProgress && (
            <span className="text-xs font-medium text-orange-400">
              {progress}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600">
          <FaRegImage className="text-gray-400" />
          {lessons} lessons
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
