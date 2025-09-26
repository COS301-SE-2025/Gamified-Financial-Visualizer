import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegImage, FaArrowRight, FaBook } from 'react-icons/fa';

const CourseCard = ({ moduleId, title, lessons, image, difficulty }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg overflow-hidden w-68 h-80 hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 flex flex-col">
      <img
        src={image}
        alt={title}
        className="w-full h-32 object-cover flex-shrink-0"
      />

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
  );
};

export default CourseCard;