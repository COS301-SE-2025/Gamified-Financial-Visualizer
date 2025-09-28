// src/pages/Support/SectionDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft, FaTrophy, FaStar,
    FaGraduationCap, FaBullseye, FaUsers, FaUser,
    FaChartPie, 
    FaChartBar, FaListUl, 
    FaPuzzlePiece, FaAward, 
    FaPalette, FaHistory, FaChartLine, FaLightbulb, FaMagic, FaWallet, FaRobot,
    FaUserFriends, FaBookOpen, FaCog, FaCrown,
    FaShieldAlt,
    FaCity,
    FaCompass,
    FaCoins,
    FaScroll,
    FaTags,
    FaFlagCheckered,
    FaDragon,
    FaHatWizard,
    FaFolder,
    FaShare,
    FaImage,
    FaQuestionCircle,
    FaGlasses,
    FaCube,
    FaDesktop,
    FaMapMarkerAlt,
    FaBox
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const pageInfo = {
    dashboard: {
        title: 'Home',
        content: `This is your central financial hub where you can monitor your accounts and get a comprehensive view of your financial landscape in a gamified environment.`,
        color: '#72C1F5',
        icon: <FaShieldAlt />,
        features: [
            {
                title: 'Financial City Overview',
                description: 'Visualize your finances as an interactive city with different districts representing various account types.',
                icon: <FaCity />
            },
            {
                title: 'AR Integration',
                description: 'Quick access to intuitive augmented reality functionality for immersive financial visualization.',
                icon: <FaGlasses />
            },
            {
                title: 'Progress Tracking',
                description: 'Monitor your financial growth and milestones with clear visual indicators.',
                icon: <FaChartLine />
            },
            {
                title: 'Theme Customization',
                description: 'Personalize your city view with different themes to match your preferences.',
                icon: <FaPalette />
            },
            {
                title: 'Quick Navigation',
                description: 'Easily navigate to key financial features through interactive tooltips and shortcuts.',
                icon: <FaCompass />
            }
        ],
        keyBenefits: [
            { action: 'Daily financial check-in', frequency: 'Daily' },
            { action: 'Review account overview', frequency: 'Daily' },
            { action: 'Complete financial tasks', frequency: 'As needed' }
        ],
        proTip: `Customize your city view with different themes to experience various visual representations of your financial landscape.`,
        upcomingFeatures: [
            'Interactive city buildings for different account types',
            'Seasonal city themes',
            'Real-time financial indicators'
        ]
    },

    transactions: {
        title: 'Accounts',
        content: `Manage your accounts and track transactions with visual insights into your cash flow and budgeting patterns.`,
        color: '#FFA726',
        icon: <FaCoins />,
        features: [
            {
                title: 'Account Management',
                description: 'Manage all your financial accounts in one centralized location.',
                icon: <FaWallet />
            },
            {
                title: 'Transaction Tracking',
                description: 'Monitor your income and expenses with detailed categorization.',
                icon: <FaListUl />
            },
            {
                title: 'Cash Flow Analysis',
                description: 'Visualize money movement with intuitive charts and graphs.',
                icon: <FaChartLine />
            },
            {
                title: 'Budget Integration',
                description: 'See how your spending aligns with your financial goals and budgets.',
                icon: <FaChartPie />
            }
        ],
        keyBenefits: [
            { action: 'Categorize transactions', frequency: 'Daily' },
            { action: 'Review weekly spending patterns', frequency: 'Weekly' },
            { action: 'Maintain financial organization', frequency: 'Ongoing' }
        ],
        proTip: `Use search and filter functions to quickly find specific transactions and identify spending trends.`,
        upcomingFeatures: [
            'Automated transaction categorization',
            'Recurring transaction predictions',
            'Advanced spending pattern insights'
        ]
    },

    goals: {
        title: 'Goals',
        content: `Set financial goals and track your progress with clear milestones. Break larger objectives into achievable steps with visual feedback.`,
        color: '#88BC46',
        icon: <FaScroll />,
        features: [
            {
                title: 'Goal Creation',
                description: 'Step-by-step guidance to create and customize your financial goals.',
                icon: <FaMagic />
            },
            {
                title: 'Progress Visualization',
                description: 'Clear visual indicators showing your goal progression and completion status.',
                icon: <FaChartBar />
            },
            {
                title: 'Goal Categories',
                description: 'Organize goals by type such as savings, investment, or debt reduction.',
                icon: <FaTags />
            },
            {
                title: 'Milestone Tracking',
                description: 'Track weekly achievements and progression toward your targets.',
                icon: <FaFlagCheckered />
            }
        ],
        keyBenefits: [
            { action: 'Create new financial goals', frequency: 'As needed' },
            { action: 'Monitor goal progress', frequency: 'Weekly' },
            { action: 'Achieve financial milestones', frequency: 'Per milestone' }
        ],
        proTip: `Break large financial goals into smaller, manageable tasks to maintain motivation and track progress effectively.`,
        upcomingFeatures: [
            'Shared goals for accountability',
            'Goal templates for common objectives',
            'Automated goal adjustment based on progress'
        ]
    },

    community: {
        title: 'Community',
        content: `Connect with others on similar financial journeys. Join communities, participate in challenges, and share achievements.`,
        color: '#9575CD',
        icon: <FaDragon />,
        features: [
            {
                title: 'Community Discovery',
                description: 'Find and join communities that match your financial interests and goals.',
                icon: <FaUsers />
            },
            {
                title: 'Group Challenges',
                description: 'Participate in community challenges to stay motivated and engaged.',
                icon: <FaTrophy />
            },
            {
                title: 'Social Features',
                description: 'Connect with friends and share progress and achievements securely.',
                icon: <FaUserFriends />
            },
            {
                title: 'Leaderboards',
                description: 'See how you rank among peers in various financial categories.',
                icon: <FaTrophy />
            }
        ],
        keyBenefits: [
            { action: 'Join financial communities', frequency: 'As interested' },
            { action: 'Participate in group challenges', frequency: 'Regularly' },
            { action: 'Connect with like-minded users', frequency: 'Ongoing' }
        ],
        proTip: `Active participation in communities provides motivation and valuable insights from others on similar financial paths.`,
        upcomingFeatures: [
            'Community events and webinars',
            'Peer-to-peer financial coaching',
            'Collaborative savings groups'
        ]
    },

    learn: {
        title: "Learn",
        content: `Improve your financial knowledge with interactive courses and lessons. Track your learning progress and develop new financial skills.`,
        color: '#FF7043',
        icon: <FaHatWizard />,
        features: [
            {
                title: 'Learning Modules',
                description: 'Structured courses covering essential financial topics and concepts.',
                icon: <FaBookOpen />
            },
            {
                title: 'Interactive Lessons',
                description: 'Engage with quizzes and practical exercises to reinforce learning.',
                icon: <FaGraduationCap />
            },
            {
                title: 'Skill Progression',
                description: 'Track your learning journey and celebrate educational milestones.',
                icon: <FaChartLine />
            },
            {
                title: 'Practical Applications',
                description: 'Apply learned concepts directly to your personal financial situation.',
                icon: <FaPuzzlePiece />
            }
        ],
        keyBenefits: [
            { action: 'Complete financial lessons', frequency: 'Regularly' },
            { action: 'Pass knowledge assessments', frequency: 'Per module' },
            { action: 'Finish comprehensive courses', frequency: 'Per course' }
        ],
        proTip: `Regular learning sessions help build financial knowledge that compounds over time, leading to better financial decisions.`,
        upcomingFeatures: [
            'Personalized learning paths',
            'Live financial workshops',
            'Certification programs'
        ]
    },

    achievements: {
        title: 'Achievements',
        content: `Showcase your financial accomplishments and earned badges. Celebrate milestones and track your progress across different categories.`,
        color: '#FF4080',
        icon: <FaCrown />,
        features: [
            {
                title: 'Badge Collection',
                description: 'Earn various badges by completing financial achievements and milestones.',
                icon: <FaAward />
            },
            {
                title: 'Achievement Categories',
                description: 'Organize achievements by type including financial, learning, and community categories.',
                icon: <FaFolder />
            },
            {
                title: 'Progress Tracking',
                description: 'Monitor which achievements are within reach and track your completion progress.',
                icon: <FaChartBar />
            },
            {
                title: 'Social Sharing',
                description: 'Share your achievements with the community through the post feature.',
                icon: <FaShare />
            }
        ],
        keyBenefits: [
            { action: 'Unlock new achievements', frequency: 'As earned' },
            { action: 'Complete achievement categories', frequency: 'Per category' },
            { action: 'Maintain consistent progress', frequency: 'Monthly' }
        ],
        proTip: `Focus on achievement categories that align with your current financial goals to maximize your progress.`,
        upcomingFeatures: [
            'Animated achievement unlocks',
            'Achievement challenges',
            'Seasonal achievement events'
        ]
    },

    profile: {
        title: 'Profile',
        content: `Personalize your profile and track your overall financial progress. Manage account settings and showcase your journey.`,
        color: '#26C6DA',
        icon: <FaUser />,
        features: [
            {
                title: 'Avatar Customization',
                description: 'Personalize your digital identity with a variety of pixel avatars to choose from.',
                icon: <FaPalette />
            },
            {
                title: 'Profile Banners',
                description: 'Showcase your achievements, goals, and financial milestones.',
                icon: <FaImage />
            },
            {
                title: 'Social Posts',
                description: 'Keep a record of your financial achievements and shared posts.',
                icon: <FaBox />
            },
            {
                title: 'Progress Statistics',
                description: 'View an overview of your financial growth and journey across your account.',
                icon: <FaChartLine />
            },
            {
                title: 'Settings Management',
                description: 'Manage account preferences, notifications, and security settings.',
                icon: <FaCog />
            }
        ],
        keyBenefits: [
            { action: 'Complete profile setup', frequency: 'One-time' },
            { action: 'Update profile information', frequency: 'Quarterly' },
            { action: 'Track profile milestones', frequency: 'Regularly' }
        ],
        proTip: `Regularly review your profile to monitor your current financial goals, milestones, and overall progress.`,
        upcomingFeatures: [
            'Advanced avatar customization',
            'Profile achievement showcases',
            'Enhanced social connectivity features'
        ]
    },

    ai: {
        title: 'AI Companion',
        content: `Your personalized financial assistant offering insights and recommendations based on your spending patterns and financial goals.`,
        color: '#BA59FF',
        icon: <FaRobot />,
        features: [
            {
                title: 'Personalized Advice',
                description: 'Receive tailored financial tips specific to your situation and goals.',
                icon: <FaLightbulb />
            },
            {
                title: 'Financial Questions',
                description: 'Ask money-related questions and get instant, knowledgeable answers.',
                icon: <FaQuestionCircle />
            },
            {
                title: 'Progress Analysis',
                description: 'Gain insights into your financial habits and spending patterns.',
                icon: <FaChartLine />
            },
            {
                title: 'Goal Optimization',
                description: 'Receive AI-powered suggestions to help you achieve goals more efficiently.',
                icon: <FaBullseye />
            }
        ],
        keyBenefits: [
            { action: 'Daily AI interaction', frequency: 'Daily' },
            { action: 'Follow AI recommendations', frequency: 'As suggested' },
            { action: 'Complete AI-assisted tasks', frequency: 'Regularly' }
        ],
        proTip: `The more you engage with your AI companion, the better it understands your financial needs and can provide personalized guidance.`,
        upcomingFeatures: [
            'Voice-enabled AI interactions',
            'Predictive financial forecasting',
            'Automated financial health reports'
        ]
    },

    ar: {
        title: 'AR World',
        content: `Visualize your financial data in augmented reality. Experience your financial information in an immersive, interactive 3D environment.`,
        color: '#FFCB05',
        icon: <FaGlasses />,
        features: [
            {
                title: '3D Data Visualization',
                description: 'Explore your financial data through interactive 3D models and representations.',
                icon: <FaCube />
            },
            {
                title: 'Interactive Tooltips',
                description: 'Access detailed financial information through interactive AR tooltips.',
                icon: <FaChartBar />
            },
            {
                title: 'Immersive Dashboard',
                description: 'Experience your complete financial picture in an augmented reality environment.',
                icon: <FaDesktop />
            },
            {
                title: 'Spatial Planning',
                description: 'Visualize your financial goals and projections in physical space.',
                icon: <FaMapMarkerAlt />
            }
        ],
        keyBenefits: [
            { action: 'Complete AR exploration sessions', frequency: 'Daily' },
            { action: 'Explore financial data in AR', frequency: 'Regularly' },
            { action: 'Visualize goals in augmented reality', frequency: 'Weekly' }
        ],
        proTip: `Use AR in a well-lit space on a flat surface for optimal tracking and the best visual experience.`,
        upcomingFeatures: [
            'Multi-user AR sessions',
            'Holographic financial projections',
            'Gesture-based financial planning'
        ]
    }
};

const SectionDetail = () => {
    const { section } = useParams();
    const navigate = useNavigate();
    const info = pageInfo[section];

    if (!info) {
        return (
            <div className="max-w-6xl mx-auto p-4 sm:p-6 text-center bg-white rounded-2xl sm:rounded-3xl shadow-md border-l-8 border-red-500">
                <p className="text-red-500 font-bold text-lg sm:text-xl">404 - Section Not Found!</p>
                <p className="text-gray-600 text-sm sm:text-base">This area doesn't exist in your adventure map.</p>
            </div>
        );
    }

    const handleBackClick = () => {
        navigate('/support/overview');
    };

    return (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-md dark:shadow-gray-700/50 border-l-8 border-t-2 border-r-2 border-b-2 dark:border-gray-700 relative overflow-hidden"
                style={{ borderLeftColor: info.color }}
            >
                <motion.button
                    whileHover={{ x: -3 }}
                    onClick={handleBackClick}
                    className="absolute top-4 sm:top-6 left-4 sm:left-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition flex items-center gap-1 z-10"
                >
                    <FaArrowLeft /> Back to Overview
                </motion.button>

                <div className="flex flex-col items-center text-center mt-8 sm:mt-4 space-y-3 sm:space-y-4 relative z-10">
                    <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-2 sm:mb-3"
                        style={{ backgroundColor: `${info.color}20`, color: info.color }}
                    >
                        {info.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">{info.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md sm:max-w-lg">{info.content}</p>
                </div>

                <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                    {info.features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-700 p-3 sm:p-5 rounded-lg sm:rounded-xl border-l-4 shadow-sm dark:shadow-gray-600/20"
                            style={{ borderLeftColor: info.color }}
                        >
                            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg flex items-center justify-center text-sm sm:text-base flex-shrink-0"
                                    style={{ backgroundColor: `${info.color}20`, color: info.color }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base">{feature.title}</h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 sm:mt-10 bg-[#f8fafc] dark:bg-gray-700 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                        <FaStar className="text-[#f59e0b] text-sm sm:text-base" /> Key Benefits
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        {info.keyBenefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600"
                            >
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{ backgroundColor: `${info.color}20`, color: info.color }}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white truncate">{benefit.action}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{benefit.frequency}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 border-dashed dark:border-gray-600" style={{ borderColor: info.color }}>
                    <div className="flex items-start gap-2 sm:gap-3">
                        <div
                            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base"
                            style={{ backgroundColor: info.color }}
                        >
                            <FaLightbulb />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-gray-800 dark:text-white mb-1 text-sm sm:text-base">Pro Tip</h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{info.proTip}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SectionDetail;