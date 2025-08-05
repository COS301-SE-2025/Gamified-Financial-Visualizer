import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const GoalCard = ({ goalId, title, image, progress, target, dueDate }) => {
    const navigate = useNavigate();
    
    if (!goalId || isNaN(Number(goalId))) {
        console.error('Invalid goalId:', goalId);
        return null;
    }

    const handleViewMore = () => {
        navigate(`/goals/details/${goalId}`);
    };

    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-xl">
            <img 
                src={image} 
                alt={title} 
                className="w-full h-32 object-cover"
            />
            <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Due: {dueDate}</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53]"
                        style={{ width: `${normalizedProgress}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    R{target} goal • {normalizedProgress}%
                </p>

                {/* View More Button */}
                <button
                    onClick={handleViewMore}
                    className="mt-4 px-4 py-2 bg-[#AAD977] dark:bg-[#7FDD53] text-white text-sm rounded-full shadow hover:bg-[#8BC34A] dark:hover:bg-[#6BC026] flex items-center gap-2 transition-colors"
                >
                    View More <FaArrowRight className="text-white text-xs" />
                </button>
            </div>
        </div>
    );
};

export default GoalCard;