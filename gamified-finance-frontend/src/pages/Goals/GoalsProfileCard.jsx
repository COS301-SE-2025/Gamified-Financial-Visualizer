import React from 'react';
import Avatar from '../../assets/Images/pixelWindow.gif';
import Avatar2 from '../../assets/Images/pixelWindow.gif';

const GoalsProfileCard = () => {
    const user = {
        name: 'Lebo',
        avatar: Avatar,
        level: 3,
        xp: 5200,
        xpTarget: 6000,
        tier: 'Silver',
    };

    //const progressPercent = Math.min((user.xp / user.xpTarget) * 100, 100).toFixed(0);

    return (
        <div className="bg-white p-4 rounded-md shadow-md text-center relative">
            {/* Circular Progress Ring */}
            <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                    <circle
                        className="text-gray-200"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="44"
                        cx="56"
                        cy="56"
                    />
                    <circle
                        className="text-gradient-progress"
                        strokeWidth="6"
                        strokeDasharray="276"
                        strokeDashoffset={276 - (0.87 * 276)} // for 87%
                        strokeLinecap="round"
                        stroke="url(#gradientRing)"
                        fill="transparent"
                        r="44"
                        cx="56"
                        cy="56"
                    />
                    <defs>
                        <linearGradient id="gradientRing" x1="1" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#facc15" />
                            <stop offset="100%" stopColor="#fb923c" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 -translate-y-15 text-center">
                    <img
                        src={Avatar2}
                        alt="Lebo"
                        className="w-16 h-16 rounded-full border-2 border-white shadow"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-semibold"></p>
                </div>
            </div>

            {/* Name + Tier */}
            <h2 className="text-md font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-yellow-600 font-medium mb-1">Tier: {user.tier}</p>

            {/* Level + XP */}
            <div className="bg-gray-100 p-2 rounded-xl mb-3">
                <p className="text-xs text-gray-500">Level</p>
                <p className="text-lg font-bold text-gray-800">Lv {user.level}</p>
                <p className="text-xs text-green-600 mt-1">{user.xp} / {user.xpTarget} XP</p>
            </div>

            {/* Profile Settings Button */}
            <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => alert('Open profile settings')}
            >
                ⚙️ Profile Settings
            </button>
        </div>
    );
};

export default GoalsProfileCard;
