import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBook } from 'react-icons/fa';

const CourseCard = ({ moduleId, title, lessons, image, difficulty, topic }) => {
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  // Difficulty colors for both light and dark modes
  const color = {
    beginner: {
      light: 'bg-[#95cdf0] text-white',
      dark: 'bg-lime-800 text-lime-100'
    },
    intermediate: {
      light: 'bg-[#FFD18C] text-white',
      dark: 'bg-cyan-800 text-cyan-100'
    },
    advanced: {
      light: 'bg-[#FE9B90] text-white',
      dark: 'bg-red-700 text-orange-100'
    }
  };

  const difficultyColor = color[difficulty] || color.beginner;

  return (
    <>
      {/* Mobile Layout (below md breakpoint) - Side-by-side layout */}
      <div className="md:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="flex">
          {/* Image on the left */}
          <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content on the right */}
          <div className="p-3 flex-1 flex flex-col justify-between min-h-28"> {/* Changed to min-height */}
            <div className="flex-1"> {/* Added flex-1 for title/description area */}
              {/* Title */}
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                {title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                Learn more about {title.toLowerCase()} for your finances
              </p>
            </div>
            
            {/* Bottom section with lessons, difficulty, and button */}
            <div className="flex items-center justify-between mt-auto"> {/* Added mt-auto */}
              <div className="flex flex-col gap-1">
                {/* Lessons count */}
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                  <FaBook className="text-gray-400 dark:text-gray-500" />
                  {lessons} lessons
                </span>
                
                {/* Difficulty badge underneath lessons */}
                <div className={`px-2 py-1 rounded-full ${difficultyColor.light} dark:${difficultyColor.dark} text-xs font-medium w-fit`}>
                  {difficulty}
                </div>
              </div>
              
              <Link to={`/learning/${slug}/${moduleId}/lessons`} className="flex items-center gap-1 text-[#AAD977] dark:text-[#7FDD53] text-sm font-medium hover:text-[#8BC34A] dark:hover:text-[#6BC026] transition-colors">
                View
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (md and above) - Keep existing vertical design */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg overflow-hidden w-68 h-80 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="w-full h-32 flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white line-clamp-2">{title}</h3>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            Learn more about {title.toLowerCase()} for your finances
          </p>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                <FaBook className="text-gray-400 dark:text-gray-500" />
                {lessons} lessons
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColor.light} dark:${difficultyColor.dark}`}>
                {difficulty}
              </span>
            </div>

            <Link to={`/learning/${slug}/${moduleId}/lessons`}>
              <button className="px-4 py-2 bg-[#AAD977] dark:bg-[#7FDD53] text-white text-sm rounded-full shadow hover:bg-[#8BC34A] dark:hover:bg-[#6BC026] flex items-center gap-2 transition-colors">
                View More <FaArrowRight className="text-white text-xs" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseCard;