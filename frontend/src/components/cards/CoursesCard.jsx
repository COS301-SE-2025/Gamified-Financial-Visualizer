import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegImage, FaArrowRight } from 'react-icons/fa';

const CourseCard = ({ moduleId, title, lessons, image, difficulty }) => {
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const color = difficulty === 'beginner' ? 'bg-lime-200' : difficulty === 'intermediate' ? 'bg-cyan-200' : 'bg-orange-400';
  return (
    <Link to={`/learning/${slug}/${moduleId}/lessons`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden w-64 h-72 hover:shadow-lg transition">
        <img src={image} alt={title} className="w-full h-32 object-cover" />
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">Learn more about {title.toLowerCase()} for your finances</p>
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div className="grid grid-rows-2 gap-2">
              <span className="flex items-center gap-1">
                <FaRegImage className="text-gray-400" />
                {lessons} lessons
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${color} text-gray-700`}>{difficulty}</span>
            </div>
            <button className="mt-4 px-4 py-2 bg-[#AAD977] text-white text-sm rounded-full shadow hover:from-green-500 flex items-center gap-2">
              View More <FaArrowRight className="text-white text-xs" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
