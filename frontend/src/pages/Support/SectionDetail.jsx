// src/pages/Support/SectionDetail.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaTrophy, FaStar,
    FaGraduationCap, FaMoneyBillWave, FaBullseye, FaUsers, FaUser,
    FaChartPie, FaArrowRight, FaPlusCircle,
    FaChartBar, FaListUl, FaMedal, FaUsersCog,
    FaMapSigns, FaPuzzlePiece, FaAward, FaMountain, FaGem,
    FaPalette, FaHistory, FaChartLine, FaUpload, FaLightbulb, FaMagic, FaWallet, FaRobot,
    FaInfoCircle, FaClock, FaThLarge, FaFire, FaCalendarAlt, FaGamepad,
    FaUserFriends, FaBookOpen, FaCog, FaCrown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const pageInfo = {
    dashboard: {
        title: 'Mission Control',
        content: `Your ultimate command hub. This page offers a gamified overview of your entire financial journey — XP, coins, streaks, daily challenges, upcoming bills, recent transactions, and achievement progress. Start each session here to stay on top of your quest!`,
        color: '#72C1F5',
        icon: <FaStar />,
        xpReward: 5,
        features: [
            {
                title: 'XP Tracker',
                description: 'See your current XP, level, and how close you are to the next milestone.',
                icon: <FaTrophy />
            },
            {
                title: 'Quick Stats & Widgets',
                description: 'Glance at your coin balance, gems, streak days, and financial highlights.',
                icon: <FaChartPie />
            },
            {
                title: 'Daily Challenges',
                description: 'Complete micro-tasks like reviewing your budget or logging transactions to earn bonus XP and coins.',
                icon: <FaBullseye />
            },
            {
                title: 'Recent Transactions',
                description: 'Track the most recent spending, income, and updates across categories.',
                icon: <FaWallet />
            },
            {
                title: 'Upcoming Bills',
                description: 'Keep an eye on approaching due dates and payment statuses with one-click access.',
                icon: <FaCalendarAlt />
            },
            {
                title: 'Quick Actions',
                description: 'Easily add a transaction, start a lesson, or launch a goal without switching pages.',
                icon: <FaArrowRight />
            },
            {
                title: 'Level Up Celebration',
                description: 'Feel the progress with special animations and rewards every time you level up.',
                icon: <FaFire />
            },
            {
                title: 'Recent Achievements',
                description: 'See which milestones you’ve unlocked, which are locked, and how much XP you’ve earned.',
                icon: <FaMedal />
            }
        ],
        xpOpportunities: [
            { action: 'Complete daily challenges', xp: '+50 XP +100 coins', frequency: 'Daily' },
            { action: 'Check-in to dashboard', xp: '+5 XP', frequency: 'Daily' },
            { action: 'Click any main module', xp: '+XP per feature', frequency: 'Per action' },
            { action: 'Achieve level-up', xp: '+Level Bonus', frequency: 'Per milestone' }
        ],
        proTip: `Enable push notifications so you never miss a streak bonus or surprise event on your dashboard.`,
        upcomingFeatures: [
            'Dynamic financial weather alerts',
            'Mood-based dashboard backgrounds',
            'Seasonal XP streak events',
            'Customizable widget layout'
        ]
    }
    ,

    transactions: {
        title: 'Account Vault',
        content: `Welcome to your Coin Vault — a dynamic command center for managing your entire financial ecosystem. Here, you can monitor accounts, review transactions, analyze trends, and stay in control of your cash flow.`,
        color: '#FFA726',
        icon: <FaMoneyBillWave />,
        xpReward: 3,
        features: [
            {
                title: 'Account Overview',
                description: 'View all your linked bank accounts and their current balances, categorized into savings, checking, and credit.',
                icon: <FaWallet />
            },
            {
                title: 'Transaction Manager',
                description: 'Easily add, edit, or delete expenses and income entries. Supports auto-categorization and recurring entries.',
                icon: <FaListUl />
            },
            {
                title: 'Budget Insights',
                description: 'Set monthly spending limits by category and visualize progress using budget rings and progress bars.',
                icon: <FaChartPie />
            },
            {
                title: 'AI Financial Advisor',
                description: 'Type questions like "How can I reduce debt?" to get personalized suggestions and goals.',
                icon: <FaRobot />
            },
            {
                title: 'Spending Analytics',
                description: 'Compare your spending with peers by age group, income bracket, and overall averages.',
                icon: <FaChartBar />
            },
            {
                title: 'Bank Import',
                description: 'Import transaction history directly from supported banks or upload CSV statements.',
                icon: <FaUpload />
            }
        ],
        xpOpportunities: [
            { action: 'Categorize 5 transactions', xp: '+5 XP', frequency: 'Daily' },
            { action: 'Complete monthly budget setup', xp: '+12 XP', frequency: 'Monthly' },
            { action: 'Review AI insight report', xp: '+8 XP', frequency: 'Weekly' },
            { action: 'Compare peer stats', xp: '+3 XP', frequency: 'Per session' },
            { action: 'Connect a new account', xp: '+10 XP', frequency: 'One-time' }
        ],
        proTip: `Use the Insights tab to generate personalized AI summaries — perfect for adjusting spending strategies and boosting your XP with little effort.`,
        upcomingFeatures: [
            'Bank syncing with push notifications',
            'Spending prediction models',
            'Merchant-based cashbacks',
            'Gamified savings goals directly tied to Coin Vault entries'
        ]
    },

    goals: {
        title: 'Goal Quest',
        content: `The Quest Log is your goal-tracking realm. Whether you’re saving for a dream trip, a new PC, or crushing debt, this page lets you create personalized quests with rich visuals, progress charts, and deadlines.`,
        color: '#88BC46',
        icon: <FaBullseye />,
        xpReward: 10,
        features: [
            {
                title: 'Quest Creation',
                description: 'Use the "Create Goal" button to set your title, amount, deadline, and visual banner. Goals can be savings, spending limits, or payoff targets.',
                icon: <FaPlusCircle />
            },
            {
                title: 'Progress Tracking',
                description: 'Every quest displays a dynamic progress bar showing % completion. Your XP scales with progress milestones.',
                icon: <FaChartBar />
            },
            {
                title: 'Goal Dashboard',
                description: 'See all quests on a grid with colorful cards, progress indicators, and due dates. Use the side menu to switch tabs or filter quests.',
                icon: <FaThLarge />
            },
            {
                title: 'Visual Charts',
                description: 'Includes donut and bar charts summarizing category allocation and overall quest contributions for quick insights.',
                icon: <FaChartPie />
            },
            {
                title: 'Upcoming Deadlines',
                description: 'A helpful card shows goals with approaching due dates to keep you on track and focused.',
                icon: <FaClock />
            },
            {
                title: 'Detail View',
                description: 'Click a quest to access full details: start/due date, amount saved, breakdown history, and goal description.',
                icon: <FaInfoCircle />
            }
        ],
        xpOpportunities: [
            { action: 'Create a new quest', xp: '+5 XP', frequency: 'Per quest' },
            { action: 'Achieve 25% progress', xp: '+10 XP', frequency: 'Per quest' },
            { action: 'Complete a quest', xp: '+25 XP', frequency: 'Per quest' },
            { action: 'Beat a deadline by 3+ days', xp: '+15 XP', frequency: 'Per quest' }
        ],
        proTip: `Use banner images to visually connect with your quests. It improves motivation and looks epic on your quest grid.`,
        upcomingFeatures: [
            'Shared quests with teammates',
            'Streak bonuses for consistent savings',
            'Seasonal themed quests with exclusive XP'
        ]
    },

    community: {
        title: 'Community Adventures',
        content: `The Guild Hall is where collaboration meets competition. It's your portal to community-led financial adventures, including challenges, shared goals, and social engagement.`,
        color: '#9575CD',
        icon: <FaUsers />,
        xpReward: 8,
        features: [
            {
                title: 'Guild Dashboard',
                description: 'Track community progress, member XP, and shared financial goals in a single glance.',
                icon: <FaChartLine />
            },
            {
                title: 'Weekly Challenges',
                description: 'Participate in timed quests for XP boosts and leaderboard climbs.',
                icon: <FaFire />
            },
            {
                title: 'Guild Game Room',
                description: 'Join multiplayer budgeting games and trivia with other members.',
                icon: <FaGamepad />
            },
            {
                title: 'Create or Join Guilds',
                description: 'Start your own community or join existing ones with shared interests.',
                icon: <FaUsersCog />
            },
            {
                title: 'Leaderboards & Rankings',
                description: 'View top members based on XP, goal completion, and challenge victories.',
                icon: <FaMedal />
            },
            {
                title: 'Friends & Member Profiles',
                description: 'Send friend requests, explore profiles, and celebrate achievements.',
                icon: <FaUserFriends />
            },
            {
                title: 'Achievement Showcase',
                description: 'Display earned badges from your Guild activities and contributions.',
                icon: <FaTrophy />
            }
        ],
        xpOpportunities: [
            { action: 'Join a Guild', xp: '+10 XP', frequency: 'One-time' },
            { action: 'Participate in Weekly Challenge', xp: '+15 XP', frequency: 'Weekly' },
            { action: 'Create a Post or Comment', xp: '+2 XP', frequency: 'Daily (max 3)' },
            { action: 'Win a Game Room Challenge', xp: '+20 XP', frequency: 'Per win' },
            { action: 'Invite a Friend to a Guild', xp: '+5 XP', frequency: 'Per invite' }
        ],
        proTip: `Guild members with active streaks earn +10% XP across all pages. Stay consistent for long-term rewards.`,
        upcomingFeatures: [
            'Guild vs Guild battle events',
            'Community store for badge exchange',
            'Monthly guild boss raids with massive XP drops',
            'Cross-guild alliances and diplomacy mechanics'
        ]
    },

    learn: {
        title: "Knowledge Path",
        content: `Step into the Wizard’s Library, where knowledge is power. Dive into bite-sized lessons, take quizzes, and unlock mastery in personal finance. Each topic—from budgeting to saving—boosts your XP and your real-life money magic.`,
        color: '#FF7043',
        icon: <FaGraduationCap />,
        xpReward: 15,
        features: [
            {
                title: 'Interactive Modules',
                description: 'Explore themed courses like Budgeting, Saving, and Investing, each packed with digestible lessons.',
                icon: <FaBookOpen />
            },
            {
                title: 'Gamified Quizzes',
                description: 'Quizzes at the end of lessons help reinforce learning and grant bonus XP on high scores.',
                icon: <FaTrophy />
            },
            {
                title: 'Real-World Scenarios',
                description: 'Practice with challenges that simulate financial situations you’ll face in the real world.',
                icon: <FaPuzzlePiece />
            },
            {
                title: 'Progress Tracking',
                description: 'Follow your learning trail with progress bars and completion stats.',
                icon: <FaChartBar />
            },
            {
                title: 'Lesson Badges',
                description: 'Earn themed badges when you complete modules or ace quizzes.',
                icon: <FaMedal />
            },
            {
                title: 'Topic Specialization',
                description: 'Each course focuses on a core skill: Budgeting, Savings, Investment, and more.',
                icon: <FaMapSigns />
            }
        ],
        xpOpportunities: [
            { action: 'Complete a lesson', xp: '+10 XP', frequency: 'Per lesson' },
            { action: 'Score 100% on quiz', xp: '+5 XP bonus', frequency: 'Per quiz' },
            { action: 'Finish a skill track', xp: '+50 XP', frequency: 'Per track' }
        ],
        proTip: `Replay past lessons to retain mastery. You still earn half XP for refreshers!`,
        upcomingFeatures: [
            'Live workshops with real finance mentors',
            'Personalized module paths',
            'Audio narration for all lessons'
        ]
    },

    achievements: {
        title: 'Trophy Room',
        content: `Your hall of fame showcasing financial mastery. Display hard-earned badges, track progress toward milestones, and discover new challenges. This page gamifies your personal finance journey by rewarding XP and badges for completing activities throughout the app.`,
        color: '#FF4080',
        icon: <FaTrophy />,
        xpReward: 5,
        features: [
            {
                title: 'Badge Collection',
                description: 'Visual display of unlocked achievements, themed and styled to match badge rarity',
                icon: <FaAward />
            },
            {
                title: 'Milestone Tracker',
                description: 'See your progression with visual bars indicating how close you are to badge completion',
                icon: <FaMountain />
            },
            {
                title: 'Rarity System',
                description: 'Badges are styled with colors and gradients to represent their rarity and difficulty',
                icon: <FaGem />
            }
        ],
        xpOpportunities: [
            { action: 'Unlock any badge', xp: '+5-25 XP', frequency: 'Per badge' },
            { action: 'Complete a milestone', xp: '+50 XP', frequency: 'Per milestone' },
            { action: 'Collect all badges in category', xp: '+100 XP', frequency: 'Per category' }
        ],
        proTip: `Hover over locked badges to reveal the unlock criteria — plan ahead for big XP bonuses by tackling grouped achievements.`,
        upcomingFeatures: [
            'Achievement trading cards',
            'Badge customization with visual effects',
            'Physical or digital trophy rewards for milestones'
        ]
    },

    profile: {
        title: 'Character Profile',
        content: `This page is your identity hub in the financial journey. It visually showcases your progress, achievements, and avatar — allowing you to customize your experience, monitor progress, and access personal records.`,
        color: '#26C6DA',
        icon: <FaUser />,
        xpReward: 10,
        features: [
            {
                title: 'Avatar Customization',
                description: 'Change your character’s appearance with unique avatars and seasonal looks found in the Settings page.',
                icon: <FaPalette />
            },
            {
                title: 'Journey Timeline',
                description: 'See key financial moments in your life, such as goals completed, achievements earned, and community impact — presented in the Dashboard and Overview sections.',
                icon: <FaHistory />
            },
            {
                title: 'XP Analytics',
                description: 'Access a detailed breakdown of your XP gains through trades, tutorials, goals, and achievements directly on your main profile card.',
                icon: <FaChartLine />
            },
            {
                title: 'Tier System',
                description: 'Progress through tiers like Silver, Gold, and beyond, displayed on your dashboard based on XP.',
                icon: <FaCrown />
            },
            {
                title: 'Recent Achievements',
                description: 'Your latest badges (e.g. Streaks, Accuracy, Ranks) are displayed in a showcase format with XP and visuals.',
                icon: <FaTrophy />
            },
            {
                title: 'Community Presence',
                description: 'Scroll down to view your posts, explore guild memberships, and see engagement inside the “Active Communities” section.',
                icon: <FaUsers />
            },
            {
                title: 'Settings Customization',
                description: 'Change username, enable dark mode, edit notification settings, and delete account from the Settings tab.',
                icon: <FaCog />
            }
        ],
        xpOpportunities: [
            { action: 'Complete profile setup', xp: '+20 XP', frequency: 'One-time' },
            { action: 'Change avatar seasonally', xp: '+5 XP', frequency: 'Quarterly' },
            { action: 'Review yearly recap', xp: '+15 XP', frequency: 'Annual' }
        ],
        proTip: `Equip seasonal avatar styles during events to earn exclusive limited-time XP bonuses and appear in special leaderboard banners.`,
        upcomingFeatures: [
            'Animated avatar backgrounds with motion effects',
            'Commemorative NFT-like badge moments',
            'Social sharing templates for personal progress'
        ]
    },

    ai: {
        title: 'AI Companion',
        content: `This section introduces your built-in financial AI assistant — ask questions, receive insights, and optimize decisions across your journey.`,
        color: '#BA59FF',
        icon: <FaRobot />,
        xpReward: 5,
        features: [
            {
                title: 'Smart Recommendations',
                description: 'Get personalized suggestions on how to reduce spending or boost savings.',
                icon: <FaLightbulb />
            },
            {
                title: 'Goal Optimization',
                description: 'AI will analyze your progress and suggest deadline or amount adjustments.',
                icon: <FaBullseye />
            },
            {
                title: 'Interactive Advisor',
                description: 'Ask financial questions in natural language from the Transactions tab.',
                icon: <FaBookOpen />
            }
        ],
        xpOpportunities: [
            { action: 'Ask the AI assistant a question', xp: '+5 XP', frequency: 'Daily' },
            { action: 'Follow a recommendation', xp: '+10 XP', frequency: 'Per insight' }
        ],
        proTip: `Use the AI assistant weekly to adapt your plan — it evolves with your habits.`,
        upcomingFeatures: ['Voice assistant', 'AI avatar coach', 'Live chat support with AI']
    },

    ar: {
        title: 'AR World',
        content: `Step into a futuristic experience. The AR mode transforms your real space into a live dashboard where charts, goals, and avatars come to life.`,
        color: '#FFCB05',
        icon: <FaMagic />,
        xpReward: 8,
        features: [
            {
                title: 'AR Dashboard',
                description: 'View your XP, coins, budget charts and spending summaries in 3D.',
                icon: <FaChartPie />
            },
            {
                title: 'Interactive Avatars',
                description: 'Walk around your 3D avatar and tap virtual achievements to inspect them.',
                icon: <FaUser />
            },
            {
                title: 'Gesture Controls',
                description: 'Use hand movements to swipe, select, or dismiss financial panels.',
                icon: <FaArrowRight />
            },
            {
                title: 'Dual Mode Switching',
                description: 'Instantly toggle between AR and classic dashboard view.',
                icon: <FaCog />
            },
            {
                title: 'XP Boosts in AR',
                description: 'Daily AR check-ins earn extra XP and unlock seasonal visuals.',
                icon: <FaStar />
            }
        ],
        xpOpportunities: [
            { action: 'Activate AR dashboard', xp: '+10 XP', frequency: 'Daily' },
            { action: 'Tap 3D badge for insights', xp: '+5 XP', frequency: 'Per badge' },
            { action: 'Complete an AR challenge', xp: '+25 XP', frequency: 'Per quest' }
        ],
        proTip: `Use the AR mode in quiet environments for smoother detection and tracking.`,
        upcomingFeatures: ['Avatar interactions', 'AR savings garden', '3D goal trophy case']
    }

};

const SectionDetail = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const [showXpAnimation, setShowXpAnimation] = useState(false);
    const info = pageInfo[section];

    if (!info) {
        return (
            <div className="max-w-6xl mx-auto p-6 text-center bg-white rounded-3xl shadow-md border-l-8 border-red-500">
                <p className="text-red-500 font-bold text-xl">404 - Quest Not Found!</p>
                <p className="text-gray-600">This area doesn't exist in your adventure map.</p>
            </div>
        );
    }

    const handleBackClick = () => {
        setShowXpAnimation(true);
        setTimeout(() => {
            navigate('/support/overview');
            setShowXpAnimation(false);
        }, 800);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-3xl shadow-md border-l-8 border-t-2 border-r-2 border-b-2 relative overflow-hidden"
                style={{ borderLeftColor: info.color }}
            >
                <AnimatePresence>
                    {showXpAnimation && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center z-20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="text-[#f59e0b] text-3xl font-bold">+{info.xpReward} XP</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ x: -3 }}
                    onClick={handleBackClick}
                    className="absolute top-6 left-6 text-sm text-gray-600 hover:text-black transition flex items-center gap-1 z-10"
                >
                    <FaArrowLeft /> Back to Map
                </motion.button>

                <div className="flex flex-col items-center text-center mt-4 space-y-4 relative z-10">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-3"
                        style={{ backgroundColor: `${info.color}20`, color: info.color }}
                    >
                        {info.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">{info.title}</h2>
                    <p className="text-gray-600 max-w-lg whitespace-pre-line">{info.content}</p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {info.features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white p-5 rounded-xl border-l-4 shadow-sm"
                            style={{ borderLeftColor: info.color }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${info.color}20`, color: info.color }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 bg-[#f8fafc] p-6 rounded-xl">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <FaStar className="text-[#f59e0b]" /> XP Earning Opportunities
                    </h3>
                    <div className="space-y-3">
                        {info.xpOpportunities.map((opp, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center pb-2 border-b border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{ backgroundColor: `${info.color}20`, color: info.color }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{opp.action}</p>
                                        <p className="text-xs text-gray-500">{opp.frequency}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold" style={{ color: info.color }}>{opp.xp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 p-5 rounded-xl border-2 border-dashed" style={{ borderColor: info.color }}>
                    <div className="flex items-start gap-3">
                        <div
                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: info.color }}
                        >
                            <FaLightbulb />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 mb-1">Pro Tip</h4>
                            <p className="text-sm text-gray-600">{info.proTip}</p>
                        </div>
                    </div>
                </div>

                {info.upcomingFeatures.length > 0 && (
                    <div className="mt-10">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FaMagic className="text-purple-500" /> Coming Soon
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {info.upcomingFeatures.map((feature, index) => (
                                <span
                                    key={index}
                                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SectionDetail;
