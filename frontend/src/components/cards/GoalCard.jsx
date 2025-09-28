import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const GoalCard = ({ goalId, title, image, progress, target, dueDate, savedAmount }) => {
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
    
    // Format numbers with proper decimal places
    const formatAmount = (amount) => {
        return parseFloat(amount).toFixed(2);
    };

    // Use savedAmount if provided, otherwise calculate from progress
    const displaySavedAmount = savedAmount !== undefined ? savedAmount : (normalizedProgress / 100) * target;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow dark:shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-xl">
            {/* Mobile Layout - Hidden on desktop */}
            <div className="lg:hidden">
                <div className="flex p-4">
                    {/* Fixed image container */}
                    <div className="w-20 h-20 flex-shrink-0 mr-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img 
                            src={image} 
                            alt={title} 
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.style.backgroundColor = '#f3f4f6';
                            }}
                        />
                    </div>
                    
                    {/* Content on the right */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {/* Top section */}
                        <div>
                            {/* Title */}
                            <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">{title}</h4>
                            
                            {/* Amount display */}
                            <div className="mb-3">
                                <div className="text-base font-bold text-gray-800 dark:text-white">
                                    {formatAmount(displaySavedAmount)}/{formatAmount(target)} ZAR
                                </div>
                            </div>
                        </div>

                        {/* Bottom section */}
                        <div>
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-3">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53]"
                                    style={{ width: `${normalizedProgress}%` }}
                                ></div>
                            </div>

                            {/* Due date and button */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Due {dueDate}
                                </span>
                                <button
                                    onClick={handleViewMore}
                                    className="px-4 py-2 bg-[#AAD977] dark:bg-[#7FDD53] text-white text-sm rounded-full shadow hover:bg-[#8BC34A] dark:hover:bg-[#6BC026] flex items-center gap-2 transition-colors"
                                >
                                    View <FaArrowRight className="text-white text-xs" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout - Hidden on mobile */}
            <div className="hidden lg:block">
                <div className="w-full h-40 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                        src={image} 
                        alt={title} 
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.backgroundColor = '#f3f4f6';
                        }}
                    />
                </div>
                <div className="p-5">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h4>
                    <p className="text-base text-gray-500 dark:text-gray-400 mb-3">Due: {dueDate}</p>

                    {/* Amount display */}
                    <div className="mb-3">
                        <div className="text-lg font-bold text-gray-800 dark:text-white">
                            {formatAmount(displaySavedAmount)}/{formatAmount(target)} ZAR
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-3 rounded-full bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53]"
                            style={{ width: `${normalizedProgress}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {normalizedProgress}% Complete
                    </p>

                    {/* View More Button */}
                    <button
                        onClick={handleViewMore}
                        className="w-full px-4 py-3 bg-[#AAD977] dark:bg-[#7FDD53] text-white text-base rounded-full shadow hover:bg-[#8BC34A] dark:hover:bg-[#6BC026] flex items-center justify-center gap-2 transition-colors"
                    >
                        View More <FaArrowRight className="text-white text-sm" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalCard;