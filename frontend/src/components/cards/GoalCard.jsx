// components/cards/GoalCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';


const GoalCard = ({ goalId, title, image, progress, target, dueDate }) => {
    const navigate = useNavigate();
    if (!goalId || isNaN(Number(goalId))) {
            console.error('Invalid goalId:', goalId);
            return;
        }
    const handleViewMore = () => {
        navigate(`/goals/details/${goalId}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
            <img src={image} alt={title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800">{title}</h4>
                <p className="text-sm text-gray-500 mb-2">Due: {dueDate}</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-600 mt-1">R{target} goal • {progress}%</p>

                {/* View More Button */}
                <button
                    onClick={handleViewMore}
                    className="mt-4 px-4 py-2 bg-[#AAD977] text-white text-sm rounded-full shadow hover:from-green-500 flex items-center gap-2"
                >
                    View More <FaArrowRight className="text-white text-xs" />
                </button>
            </div>
        </div>
    );
};

export default GoalCard;