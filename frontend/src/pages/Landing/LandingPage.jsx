import React, { useState } from "react";
import { Button } from '../../components/ui/Button';
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaUserFriends, FaChartLine, FaRocket, FaCoins, FaShieldAlt, FaArrowRight, FaCrown, FaGem, FaMedal, FaLightbulb } from "react-icons/fa";
import { SiReact, SiTailwindcss, SiPostgresql, SiPython, SiNodedotjs, SiUnity, SiOpenai } from "react-icons/si";

// Image imports
import YohaliImg from '../../assets/Team Profiles/Malaika.png';
import LebogangImg from '../../assets/Team Profiles/Lebo.png';
import MphoImg from '../../assets/Team Profiles/Mpho.png';
import NobuhleImg from '../../assets/Team Profiles/Nobuhle.png';
import AundreaImg from '../../assets/Team Profiles/Aundrea.png';

// Banner header images 
import heroGif from '../../assets/Images/banners/pixelOffice.gif';
import journeyGif from '../../assets/Images/banners/pixelOffice2.gif';
import coinImg from '../../assets/Images/badges/CoinStack.png';
import xpImg from '../../assets/Images/badges/awardIcon.png';
import gemImg from '../../assets/Images/Logo.png'; // adjust path if necessary
import achievementImg from '../../assets/Images/badges/moneyBagIcon.png';

const FloatingCoins = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-8 h-8"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: -50,
                        opacity: 0,
                        rotate: 0
                    }}
                    animate={{
                        y: window.innerHeight + 50,
                        x: Math.random() * 200 - 100,
                        opacity: [0, 1, 0],
                        rotate: 360
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        delay: Math.random() * 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <img src={coinImg} alt="Floating coin" className="w-full h-full" />
                </motion.div>
            ))}
        </div>
    );
};

const AchievementBadge = ({ title, description, icon, color }) => (
    <motion.div
        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
        whileHover={{ y: -5 }}
    >
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white text-xl`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </motion.div>
);

export default function LandingPage() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // team names and details 
    const team = [
        {
            name: 'Malaika Yohali',
            role: 'Frontend Developer',
            image: YohaliImg,
            github: 'https://github.com/malaika',
            linkedin: 'https://linkedin.com/in/malaika',
        },
        {
            name: 'Lebogang Lebo',
            role: 'Backend Developer',
            image: LebogangImg,
            github: 'https://github.com/lebo',
            linkedin: 'https://linkedin.com/in/lebo',
        },
        {
            name: 'Mpho Mthembu',
            role: 'UI/UX Designer',
            image: MphoImg,
            github: 'https://github.com/mpho',
            linkedin: 'https://linkedin.com/in/mpho',
        },
        {
            name: 'Nobuhle Nkosi',
            role: 'QA Engineer',
            image: NobuhleImg,
            github: 'https://github.com/nobuhle',
            linkedin: 'https://linkedin.com/in/nobuhle',
        },
        {
            name: 'Aundrea Smith',
            role: 'Project Manager',
            image: AundreaImg,
            github: 'https://github.com/aundrea',
            linkedin: 'https://linkedin.com/in/aundrea',
        },
    ];

    const testimonials = [
        {
            name: "Sarah K.",
            role: "Financial Beginner",
            quote: "I went from avoiding my finances to checking them daily thanks to the game elements!",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Michael T.",
            role: "Small Business Owner",
            quote: "The goal quests helped me finally organize my business finances in a way that stuck.",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Priya M.",
            role: "College Student",
            quote: "Earning badges for saving money made budgeting actually fun for the first time.",
            avatar: "https://randomuser.me/api/portraits/women/63.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 font-sans">
            {/* Floating XP and coins */}
            <FloatingCoins />

            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 shadow-sm">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                >
                    <div className="relative">
                        <img
                            src={gemImg}
                            alt="Gem Icon"
                            className="w-20 h-20 animate-pulse"
                        />

                        <div className="absolute -inset-2 rounded-full border-2 border-indigo-200 animate-ping opacity-0"></div>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5c7e51] to-[#88BC46]">
                        Gamified Finance
                    </h1>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        className="bg-gradient-to-r from-[#98C988] to-[#4B6343] hover:from-[#4B6343] hover:to-[#98C988] text-white px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all group"
                        onClick={() => window.location.href = '/login'}
                    >
                        <span className="flex items-center gap-2">
                            Start Playing <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Button>
                </motion.div>
            </header>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-white/90 z-0"></div>
                <img src={heroGif} alt="Finance Quest" className="absolute inset-0 w-full h-full object-cover z-0 opacity-50" />

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.h2
                        className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">Level Up</span> Your Financial Game
                    </motion.h2>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Transform boring money management into an exciting RPG adventure. Earn XP, unlock achievements, and conquer your financial goals!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Button
                            className="bg-gradient-to-r from-[#4B6343] to-[#98C988] hover:from-[#4B6343] hover:to-[#98C988] text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
                            onClick={() => window.location.href = '/login'}
                        >
                            <span className="flex items-center gap-2">
                                Start Your Quest <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#4B6343] text-[#4B6343] hover:bg-[#98C988] px-8 py-4 text-lg font-medium shadow-sm hover:shadow-md transition-all"
                            onClick={() => window.location.href = '/features'}
                        >
                            <span className="flex items-center gap-2">
                                See How It Works
                            </span>
                        </Button>
                    </motion.div>

                    <div className="mt-16 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                            <img src={xpImg} alt="XP" className="w-6 h-6" />
                            <span className="font-medium text-gray-700">+100 XP Signup Bonus</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                            <FaMedal className="text-yellow-500" />
                            <span className="font-medium text-gray-700">Exclusive Starter Badge</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                            <FaLightbulb className="text-[#4B6343]" />
                            <span className="font-medium text-gray-700">No Credit Card Needed</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-8 bg-gradient-to-r from-[#4B6343] to-[#98C988] text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold">10K+</div>
                        <div className="text-sm opacity-90">Active Players</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">500K+</div>
                        <div className="text-sm opacity-90">XP Earned Daily</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">120+</div>
                        <div className="text-sm opacity-90">Unique Badges</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">$5M+</div>
                        <div className="text-sm opacity-90">Collectively Saved</div>
                    </div>
                </div>
            </section>

            {/* Core Features */}
            <section className="py-20 px-6 bg-white">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            Financial Growth <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">Feels Like Play</span>
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We've transformed every aspect of personal finance into rewarding game mechanics
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaChartLine className="text-4xl" />,
                                title: "Goal Quests",
                                desc: "Transform financial goals into exciting quests with XP rewards",
                                color: "bg-gradient-to-br from-indigo-500 to-purple-500",
                                features: ["Visual progress tracking", "Milestone rewards", "Custom challenges"]
                            },
                            {
                                icon: <FaTrophy className="text-4xl" />,
                                title: "Achievements",
                                desc: "Unlock badges for financial milestones and good habits",
                                color: "bg-gradient-to-br from-amber-400 to-amber-500",
                                features: ["100+ unique badges", "Special edition collectibles", "Shareable accomplishments"]
                            },
                            {
                                icon: <FaUserFriends className="text-4xl" />,
                                title: "Social Features",
                                desc: "Join forces with friends and compete on leaderboards",
                                color: "bg-gradient-to-br from-emerald-400 to-emerald-500",
                                features: ["Private groups", "Friendly challenges", "Progress sharing"]
                            },
                            {
                                icon: <FaCoins className="text-4xl" />,
                                title: "Reward Economy",
                                desc: "Earn coins for completing financial tasks",
                                color: "bg-gradient-to-br from-yellow-400 to-yellow-500",
                                features: ["Redeem for perks", "Avatar customization", "Exclusive content"]
                            },
                            {
                                icon: <FaShieldAlt className="text-4xl" />,
                                title: "Security",
                                desc: "Bank-level protection for your financial data",
                                color: "bg-gradient-to-br from-blue-500 to-blue-600",
                                features: ["Encrypted connections", "Read-only access", "Privacy controls"]
                            },
                            {
                                icon: <FaRocket className="text-4xl" />,
                                title: "Quick Start",
                                desc: "Get set up in minutes with our interactive tutorial",
                                color: "bg-gradient-to-br from-pink-500 to-pink-600",
                                features: ["Instant XP rewards", "Beginner quests", "Personalized onboarding"]
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-xl border border-gray-200 hover:border-indigo-200 transition-all overflow-hidden shadow-sm hover:shadow-md"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className={`h-2 ${feature.color}`}></div>
                                <div className="p-6">
                                    <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center text-white mb-6 mx-auto shadow-md`}>
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-2xl font-bold text-center mb-3 text-gray-800">{feature.title}</h4>
                                    <p className="text-gray-600 text-center mb-5">{feature.desc}</p>
                                    <ul className="space-y-2">
                                        {feature.features.map((item, j) => (
                                            <li key={j} className="flex items-center gap-2 text-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-[#4B6343]"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Achievement Showcase */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">Earn Prestige</span> With Achievements
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Collect badges that showcase your financial accomplishments
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <AchievementBadge
                            title="Savings Streak"
                            description="Save money for 7 days in a row"
                            icon={<FaCoins />}
                            color="bg-gradient-to-br from-yellow-400 to-yellow-500"
                        />
                        <AchievementBadge
                            title="Budget Master"
                            description="Stay under budget for a full month"
                            icon={<FaChartLine />}
                            color="bg-gradient-to-br from-emerald-400 to-emerald-500"
                        />
                        <AchievementBadge
                            title="Debt Slayer"
                            description="Pay off a significant debt"
                            icon={<FaShieldAlt />}
                            color="bg-gradient-to-br from-red-400 to-red-500"
                        />
                        <AchievementBadge
                            title="Investment Novice"
                            description="Make your first investment"
                            icon={<FaTrophy />}
                            color="bg-gradient-to-br from-blue-400 to-blue-500"
                        />
                        <AchievementBadge
                            title="Community Hero"
                            description="Help 5 friends with their finances"
                            icon={<FaUserFriends />}
                            color="bg-gradient-to-br from-purple-400 to-purple-500"
                        />
                        <AchievementBadge
                            title="Early Bird"
                            description="Complete 5 morning financial check-ins"
                            icon={<FaRocket />}
                            color="bg-gradient-to-br from-pink-400 to-pink-500"
                        />
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            className="border-[#4B6343] text-[#4B6343] hover:bg-[#98C988] px-8 py-3 font-medium"
                            onClick={() => window.location.href = '/achievements'}
                        >
                            View All 120+ Achievements
                        </Button>
                    </div>
                </div>
            </section>

            {/* Financial Quest Roadmap */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">Financial Quest</span> Roadmap
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Journey through our gamified financial system with clear milestones
                        </p>
                    </div>

                    <div className="relative h-[400px]">
                        {/* Animated Path */}
                        <motion.svg
                            viewBox="0 0 1440 400"
                            className="absolute inset-0 w-full h-full z-0"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                        >
                            <motion.path
                                fill="none"
                                stroke="#98C988"
                                strokeWidth="8"
                                strokeLinecap="round"
                                d="M0,200 Q360,50 720,200 T1440,200"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2 }}
                            />
                            <motion.path
                                fill="none"
                                stroke="#98C988"
                                strokeWidth="4"
                                strokeDasharray="20 20"
                                d="M0,200 Q360,50 720,200 T1440,200"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, delay: 0.2 }}
                            />
                        </motion.svg>

                        {/* Steps */}
                        {[
                            {
                                title: "Create Account",
                                desc: "Customize your avatar",
                                icon: <FaRocket className="text-xl" />,
                                color: "bg-gradient-to-br from-indigo-500 to-purple-500",
                                x: "5%",
                                y: "180px"
                            },
                            {
                                title: "Set Goals",
                                desc: "Choose financial quests",
                                icon: <FaChartLine className="text-xl" />,
                                color: "bg-gradient-to-br from-emerald-500 to-teal-500",
                                x: "25%",
                                y: "50px"
                            },
                            {
                                title: "Earn XP",
                                desc: "Complete money tasks",
                                icon: <FaCoins className="text-xl" />,
                                color: "bg-gradient-to-br from-amber-400 to-amber-500",
                                x: "45%",
                                y: "180px"
                            },
                            {
                                title: "Unlock Badges",
                                desc: "Achieve milestones",
                                icon: <FaTrophy className="text-xl" />,
                                color: "bg-gradient-to-br from-pink-500 to-rose-500",
                                x: "65%",
                                y: "50px"
                            },
                            {
                                title: "Join Guilds",
                                desc: "Team up with friends",
                                icon: <FaUserFriends className="text-xl" />,
                                color: "bg-gradient-to-br from-blue-500 to-cyan-500",
                                x: "85%",
                                y: "180px"
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                className="absolute flex flex-col items-center z-10"
                                style={{ left: step.x, top: step.y }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.3 }}
                                viewport={{ once: true }}
                            >
                                <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                                    {step.icon}
                                </div>
                                <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg text-center max-w-[200px]">
                                    <h4 className="font-bold text-[#4B6343] mb-1">{step.title}</h4>
                                    <p className="text-sm text-gray-600">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            What <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">Players</span> Are Saying
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Real people achieving real financial progress through gamification
                        </p>
                    </div>

                    <div className="relative h-64">
                        {testimonials.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                className={`absolute inset-0 bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center ${activeTestimonial === i ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeTestimonial === i ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mb-4 object-cover border-4 border-indigo-100" />
                                <p className="text-lg text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-[#4B6343]">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className={`w-3 h-3 rounded-full ${activeTestimonial === i ? 'bg-[#4B6343]' : 'bg-gray-300'}`}
                                aria-label={`View testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            Meet the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">Gamified Finance</span> Team
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The passionate creators behind your financial adventure
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h4>
                                    <p className="text-[#72af5e] text-sm mb-4">{member.role}</p>
                                    <div className="flex justify-center gap-4">
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-[#98C988] transition-colors"
                                            aria-label={`${member.name}'s GitHub`}
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-[#98C988] transition-colors"
                                            aria-label={`${member.name}'s LinkedIn`}
                                        >
                                            LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 bg-gradient-to-r from-[#4B6343] to-[#9cd987] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-4xl font-bold mb-6">
                        Ready to Transform Your Financial Life?
                    </h3>
                    <p className="text-xl text-[#c9e8be] mb-10 max-w-2xl mx-auto">
                        Join thousands of players who've made finance fun and rewarding
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            className="bg-white text-[#4B6343] hover:bg-[#98C988] px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                            onClick={() => window.location.href = '/register'}
                        >
                            <span className="flex items-center gap-2">
                                Start Your Free Quest <FaArrowRight />
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
                            onClick={() => window.location.href = '/demo'}
                        >
                            <span className="flex items-center gap-2">
                                Try Interactive Demo
                            </span>
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <img src={xpImg} alt="XP" className="w-5 h-5" />
                            <span>+100 XP Signup Bonus</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <FaMedal className="text-yellow-300" />
                            <span>Exclusive Starter Badge</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                        <div className="flex items-center gap-3">
                            <img
                                src={gemImg}
                                alt="Gem Icon"
                                className="w-10 h-10 animate-pulse"
                            />

                            <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#98C988]">
                                Gamified Finance
                            </h4>
                        </div>

                        <div className="flex gap-6">
                            <a href="/about" className="text-gray-600 hover:text-[#98C988]">About</a>
                            <a href="/features" className="text-gray-600 hover:text-[#98C988]">Features</a>
                            <a href="/pricing" className="text-gray-600 hover:text-[#98C988]">Pricing</a>
                            <a href="/blog" className="text-gray-600 hover:text-[#98C988]">Blog</a>
                            <a href="/contact" className="text-gray-600 hover:text-[#98C988]">Contact</a>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Gamified Finance. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-[#98C988]">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#98C988]">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#98C988]">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}