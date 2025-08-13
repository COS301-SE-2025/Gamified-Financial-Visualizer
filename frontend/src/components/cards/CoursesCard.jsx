import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegImage, FaArrowRight } from 'react-icons/fa';

const CourseCard = ({ moduleId, title, lessons, image, difficulty }) => {
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  
  // Difficulty colors for both light and dark modes
  const color = {
    beginner: {
      light: 'bg-lime-200 text-gray-700',
      dark: 'bg-lime-800 text-lime-100'
    },
    intermediate: {
      light: 'bg-cyan-200 text-gray-700',
      dark: 'bg-cyan-800 text-cyan-100'
    },
    advanced: {
      light: 'bg-orange-400 text-gray-700',
      dark: 'bg-orange-700 text-orange-100'
    }
  };

  const difficultyColor = color[difficulty] || color.beginner;

  return (
    <Link to={`/learning/${slug}/${moduleId}/lessons`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg overflow-hidden w-64 h-72 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-32 object-cover" 
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Learn more about {title.toLowerCase()} for your finances
          </p>
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
            <div className="grid grid-rows-2 gap-2">
              <span className="flex items-center gap-1">
                <FaRegImage className="text-gray-400 dark:text-gray-500" />
                {lessons} lessons
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColor.light} dark:${difficultyColor.dark}`}>
                {difficulty}
              </span>
            </div>
            <button className="mt-4 px-4 py-2 bg-[#AAD977] dark:bg-[#7FDD53] text-white text-sm rounded-full shadow hover:bg-[#8BC34A] dark:hover:bg-[#6BC026] flex items-center gap-2 transition-colors">
              View More <FaArrowRight className="text-white text-xs" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;