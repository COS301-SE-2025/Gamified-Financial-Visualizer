import React from "react";
import { FaArrowLeft, FaCoins, FaTrophy, FaChartLine, FaUsers, FaBullseye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// badge icons
import badge1 from '../../assets/Images/badges/CoinStack.png';
import badge2 from '../../assets/Images/badges/awardIcon.png';
import badge3 from '../../assets/Images/badges/highFiveIcon.png';
import badge4 from '../../assets/Images/badges/moneyBagIcon.png';
import badge5 from '../../assets/Images/badges/moneyGrowIcon.png';
import badge6 from '../../assets/Images/badges/mountainIcon.png';
import badge7 from '../../assets/Images/badges/notesIcon.png';
import badge8 from '../../assets/Images/badges/scaleIcon.png';
import badge9 from '../../assets/Images/badges/plantIocn.png';
import badge10 from '../../assets/Images/badges/targetIcon.png';

const achievements = [
    {
        title: "Cash Hoarder",
        reward: 500,
        image: badge1,
        color: "bg-[#FFC857]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaCoins className="text-[#FFC857]" />,
        effect: "animate-bounce",
        unlockCondition: "Save R1,000"
    },
    {
        title: "OverAchiever Pro",
        reward: 600,
        image: badge2,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaTrophy className="text-[#5FBFFF]" />,
        effect: "animate-pulse",
        unlockCondition: "Complete 10 goals"
    },
    {
        title: "Grow Champion",
        reward: 450,
        image: badge3,
        color: "bg-[#88BC46]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaChartLine className="text-[#88BC46]" />,
        effect: "animate-wiggle",
        unlockCondition: "Grow savings by 20%"
    },
    {
        title: "Money Master",
        reward: 50,
        image: badge4,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaCoins className="text-[#ED5E52]" />,
        effect: "animate-float",
        unlockCondition: "Make first investment"
    },
    {
        title: "Banking Expert",
        reward: 900,
        image: badge5,
        color: "bg-[#FFC857]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaTrophy className="text-[#5FBFFF]" />,
        effect: "animate-spin-slow",
        unlockCondition: "Link 3 bank accounts"
    },
    {
        title: "Stack King",
        reward: 650,
        image: badge6,
        color: "bg-[#5FBFFF]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaChartLine className="text-[#88BC46]" />,
        effect: "animate-float",
        unlockCondition: "Save 3 months salary"
    },
    {
        title: "Social Saver",
        reward: 150,
        image: badge7,
        color: "bg-[#88BC46]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaUsers className="text-[#88BC46]" />,
        effect: "animate-bounce",
        unlockCondition: "Invite 5 friends"
    },
    {
        title: "Target Hunter",
        reward: 5000,
        image: badge8,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaBullseye className="text-[#ED5E52]" />,
        effect: "animate-ping",
        unlockCondition: "Hit yearly savings goal"
    },
    {
        title: "Wealth Builder",
        reward: 30,
        image: badge9,
        color: "bg-[#FFC857]",
        border: "border-[#FFC857]",
        text: "text-[#FFC857]",
        icon: <FaChartLine className="text-[#FFC857]" />,
        effect: "animate-wiggle",
        unlockCondition: "Track net worth monthly"
    },
    {
        title: "Top Investor",
        reward: 850,
        image: badge10,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#ED5E52]",
        icon: <FaCoins className="text-[#5FBFFF]" />,
        effect: "animate-spin-slow",
        unlockCondition: "Diversify investments"
    },
    {
        title: "Treasure Keeper",
        reward: 500,
        image: badge1,
        color: "bg-[#88BC46]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaCoins className="text-[#88BC46]" />,
        effect: "animate-bounce",
        unlockCondition: "Save for 6 months straight"
    },
    {
        title: "Goal Crusher",
        reward: 600,
        image: badge2,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaTrophy className="text-[#ED5E52]" />,
        effect: "animate-pulse",
        unlockCondition: "Create 5 weekly goals"
    },
    {
        title: "Green Thumb",
        reward: 450,
        image: badge3,
        color: "bg-[#FFC857]",
        border: "border-[#FFC857]",
        text: "text-[#88BC46]",
        icon: <FaChartLine className="text-[#FFC857]" />,
        effect: "animate-wiggle",
        unlockCondition: "Grow emergency fund"
    },
    {
        title: "Finance Wizard",
        reward: 50,
        image: badge4,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaCoins className="text-[#5FBFFF]" />,
        effect: "animate-float",
        unlockCondition: "Learn 5 financial terms"
    },
    {
        title: "Vault Guardian",
        reward: 900,
        image: badge5,
        color: "bg-[#88BC46]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaTrophy className="text-[#88BC46]" />,
        effect: "animate-spin-slow",
        unlockCondition: "Secure all accounts with 2FA"
    },
    {
        title: "Pile Maker",
        reward: 650,
        image: badge6,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaChartLine className="text-[#ED5E52]" />,
        effect: "animate-float",
        unlockCondition: "Save $5 daily for month"
    },
    {
        title: "Team Player",
        reward: 150,
        image: badge7,
        color: "bg-[#FFC857]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaUsers className="text-[#ED5E52]" />,
        effect: "animate-bounce",
        unlockCondition: "Join a savings challenge"
    },
    {
        title: "Bullseye Master",
        reward: 5000,
        image: badge8,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaBullseye className="text-[#5FBFFF]" />,
        effect: "animate-ping",
        unlockCondition: "Achieve perfect budget score"
    },
    {
        title: "Fortune Architect",
        reward: 30,
        image: badge9,
        color: "bg-[#88BC46]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaChartLine className="text-[#88BC46]" />,
        effect: "animate-wiggle",
        unlockCondition: "Create 3 financial plans"
    },
    {
        title: "Market Leader",
        reward: 850,
        image: badge10,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaCoins className="text-[#ED5E52]" />,
        effect: "animate-spin-slow",
        unlockCondition: "Outperform market index"
    },
    {
        title: "Gold Collector",
        reward: 500,
        image: badge1,
        color: "bg-[#FFC857]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaCoins className="text-[#ED5E52]" />,
        effect: "animate-bounce",
        unlockCondition: "Collect all coin badges"
    },
    {
        title: "Trophy Hunter",
        reward: 600,
        image: badge2,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaTrophy className="text-[#5FBFFF]" />,
        effect: "animate-pulse",
        unlockCondition: "Unlock 10 achievements"
    },
    {
        title: "Rising Star",
        reward: 450,
        image: badge3,
        color: "bg-[#88BC46]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaChartLine className="text-[#88BC46]" />,
        effect: "animate-wiggle",
        unlockCondition: "Reach Level 5"
    },
    {
        title: "Currency Chief",
        reward: 50,
        image: badge4,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaCoins className="text-[#ED5E52]" />,
        effect: "animate-float",
        unlockCondition: "Track 3 currencies"
    },
    {
        title: "Financial Guru",
        reward: 900,
        image: badge5,
        color: "bg-[#FFC857]",
        border: "border-[#FFC857]",
        text: "text-[#FFC857F]",
        icon: <FaTrophy className="text-[#FFC857]" />,
        effect: "animate-spin-slow",
        unlockCondition: "Master all financial modules"
    },
    {
        title: "Money Mountain",
        reward: 650,
        image: badge6,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#88BC46]",
        icon: <FaChartLine className="text-[#88BC46]" />,
        effect: "animate-float",
        unlockCondition: "Save R10,000 total"
    },
    {
        title: "Friend Builder",
        reward: 150,
        image: badge7,
        color: "bg-[#88BC46]",
        border: "border-[#88BC46]",
        text: "text-[#88BC46]",
        icon: <FaUsers className="text-[#88BC46]" />,
        effect: "animate-bounce",
        unlockCondition: "Create a savings group"
    },
    {
        title: "Precision Saver",
        reward: 5000,
        image: badge8,
        color: "bg-[#ED5E52]",
        border: "border-[#ED5E52]",
        text: "text-[#ED5E52]",
        icon: <FaBullseye className="text-[#ED5E52]" />,
        effect: "animate-ping",
        unlockCondition: "Hit exact savings target"
    },
    {
        title: "Net Worth Ninja",
        reward: 30,
        image: badge9,
        color: "bg-[#FFC857]",
        border: "border-[#FFC857]",
        text: "text-[#FFC857]",
        icon: <FaChartLine className="text-[#88BC46]" />,
        effect: "animate-wiggle",
        unlockCondition: "Double your net worth"
    },
    {
        title: "Portfolio Pro",
        reward: 850,
        image: badge10,
        color: "bg-[#5FBFFF]",
        border: "border-[#5FBFFF]",
        text: "text-[#5FBFFF]",
        icon: <FaCoins className="text-[#5FBFFF]" />,
        effect: "animate-spin-slow",
        unlockCondition: "Balance 5 asset classes"
    }
];

const AchievementCard = ({ title, reward, image, color, text, icon, unlockCondition }) => {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
            {/* Header */}
            <div className={`bg-gradient-to-r ${color} p-4 text-white`}>
                <div className="flex items-center justify-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm flex items-center justify-center">
                        {React.cloneElement(icon, { className: "text-white w-5 h-5" })}
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="opacity-90 text-xs">{reward} XP Reward</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col items-center flex-grow">
                {/* Badge Image */}
                <div className="relative mb-3 w-full flex justify-center">
                    <div className="absolute inset-0 rounded-full blur-md opacity-30 w-28 h-28 mx-auto"></div>
                    <img
                        src={image}
                        alt={title}
                        className="relative w-24 h-24 object-contain rounded-full z-10"
                    />
                </div>

                {/* Details */}
                <div className="w-full space-y-2 mt-auto text-sm">
                    {[
                        { label: "Unlocked achievement", iconBg: "bg-lime-200 text-lime-600" },
                        { label: `${reward} XP reward`, iconBg: "bg-purple-100 text-purple-600" },
                        { label: `Earned by: ${unlockCondition}`, iconBg: "bg-orange-100 text-orange-600" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className={`w-4 h-4 rounded-full ${item.iconBg} flex items-center justify-center mt-0.5`}>
                                <svg
                                    className="w-2.5 h-2.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <span className="text-gray-600">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const LandingAchievements = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-grey-50 px-4 py-10 sm:px-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-8 inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#B4CB98] to-[#4B6343] hover:from-[#4B6343] hover:to-[#B4CB98] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    <FaArrowLeft className="text-white" />
                    Back to Game
                </button>

                {/* Page heading */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4B6343] to-[#B4CB98] mb-4">
                        Achievement Unlocked!
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Collect them all to level up your financial skills!
                    </p>
                </div>

                {/* Acheiemvets layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {achievements.map((a, i) => (
                        <AchievementCard key={i} {...a} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingAchievements;