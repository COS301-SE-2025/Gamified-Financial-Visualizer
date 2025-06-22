import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const pageToHelpMap = {
    '/dashboard': 'dashboard',
    '/transactions': 'transactions',
    '/transactions/insights': 'transactions',
    '/transactions/budget': 'transactions',
    '/transactions/import': 'transactions',
    '/goals': 'goals',
    '/goals/create': 'goals',
    '/goals/details': 'goals',
    '/learn': 'learning',
    '/achievements': 'achievements',
    '/profile': 'profile',
    '/community': 'community',
};

const FloatingHelpButton = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const helpTopic = Object.entries(pageToHelpMap).find(([path]) =>
        location.pathname.startsWith(path)
    )?.[1];

    const handleClick = () => {
        if (helpTopic) {
            navigate(`/support/overview/${helpTopic}`);
        } else {
            navigate(`/support`);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="absolute inset-0 animate-ping bg-[#88BC46] rounded-full opacity-20 scale-125"></div>
            <button
                onClick={handleClick}
                className="relative bg-[#0B8A8F] hover:bg-[#78E6EA] text-white p-5 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center scale-110 hover:scale-125"
                aria-label="Help"
            >
                <FaQuestionCircle size={24} />
            </button>
        </div>

    );
};

export default FloatingHelpButton;
