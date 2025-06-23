import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components/ui/Button';
import { motion } from "framer-motion";
import { FaTrophy, FaUserFriends, FaChartLine, FaArrowUp, FaArrowDown, FaRocket, FaCoins, FaShieldAlt, FaArrowRight, FaMedal } from "react-icons/fa";

// Image imports
import YohaliImg from '../../assets/Team Profiles/Malaika.png';
import LebogangImg from '../../assets/Team Profiles/Lebo.png';
import MphoImg from '../../assets/Team Profiles/Mpho.png';
import NobuhleImg from '../../assets/Team Profiles/Nobuhle.png';
import AundreaImg from '../../assets/Team Profiles/Aundrea.png';

// Testimonial imports
import avatar1 from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import avatar2 from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import avatar3 from '../../assets/Images/avatars/lilyAvatar.jpeg';

// Banner header images 
import heroGif from '../../assets/Images/banners/pixelOffice.gif';
import gemImg from '../../assets/Images/Logo.png';

const AchievementBadge = ({ title, description, icon, color }) => (
    <motion.div
        className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-3 text-center"
        whileHover={{ y: -5, scale: 1.03 }}
    >
        <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white text-2xl shadow-md`}>
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="absolute -top-2 -right-2 text-white bg-[#FFD18C] text-xs font-bold px-2 py-1 rounded-full shadow">
            NEW!
        </div>
    </motion.div>
);

const SectionHeader = ({ title, subtitle, highlight }) => (
    <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#AAD977]">{highlight}</span>
        </h3>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
        </p>
    </div>
);

const ScrollNavigation = ({ sections }) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const scrollToSection = (index) => {
        sections[index].current.scrollIntoView({ behavior: 'smooth' });
        setCurrentSection(index);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentSection(0);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;
            setShowScrollTop(window.scrollY > 200);

            sections.forEach((section, index) => {
                if (section.current) {
                    const sectionTop = section.current.offsetTop;
                    const sectionBottom = sectionTop + section.current.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        setCurrentSection(index);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    return (
        <div className="fixed right-6 bottom-6 flex flex-col items-center gap-2 z-50">
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="p-3 bg-[#4B6343] text-white rounded-full shadow-lg hover:bg-[#AAD977] transition-colors"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}

            <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                {sections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToSection(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentSection === index ? 'bg-[#4B6343]' : 'bg-gray-300 hover:bg-[#AAD977]'
                            }`}
                        aria-label={`Scroll to section ${index + 1}`}
                    />
                ))}
            </div>

            {currentSection < sections.length - 1 && (
                <button
                    onClick={() => scrollToSection(currentSection + 1)}
                    className="p-3 bg-[#4B6343] text-white rounded-full shadow-lg hover:bg-[#AAD977] transition-colors"
                    aria-label="Scroll to next section"
                >
                    <FaArrowDown />
                </button>
            )}
        </div>
    );
};

export default function LandingPage() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    //Team members 
    const team = [
        {
            name: 'Yohali Malaika Kamangu',
            role: 'Data Engineer, Project Manager',
            image: YohaliImg,
            github: 'https://github.com/YourfavCompSciGirlie',
            linkedin: 'https://www.linkedin.com/in/ymkamangu/',
        },
        {
            name: 'Lebogang Masenya',
            role: 'Services Engineer, Systems Architect',
            image: LebogangImg,
            github: 'https://github.com/B-WayneZA',
            linkedin: 'https://www.linkedin.com/in/lebogang-masenya/',
        },
        {
            name: 'Mpho Siminya',
            role: 'UX/UI Designer, UI Engineer',
            image: MphoImg,
            github: 'https://github.com/MphoSiminya',
            linkedin: 'https://www.linkedin.com/in/mpho-siminya/',
        },
        {
            name: 'Nobuhle Mtshali',
            role: 'UI Engineer, DevOps',
            image: NobuhleImg,
            github: 'https://github.com/ReituTheCompSciGirlie',
            linkedin: 'https://www.linkedin.com/in/nobuhle-reitumetse-mtshali/',
        },
        {
            name: 'Aundrea Ncube',
            role: 'Integration Engineer, Testing Engineer',
            image: AundreaImg,
            github: 'https://github.com/AundreaNcube',
            linkedin: 'http://www.linkedin.com/in/aundrea-ncube-1484a9356',
        },
    ];

    // testimonials
    const testimonials = [
        {
            name: "yummy",
            role: "Financial Beginner",
            quote: "I went from avoiding my finances to checking them daily thanks to the game elements!",
            avatar: avatar1
        },
        {
            name: "mike_t",
            role: "Small Business Owner",
            quote: "The goal quests helped me finally organize my business finances in a way that stuck.",
            avatar: avatar2
        },
        {
            name: "lily_luna",
            role: "College Student",
            quote: "Earning badges for saving money made budgeting actually fun for the first time.",
            avatar: avatar3
        }
    ];

    // scrol referncess for each section
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const featuresRef = useRef(null);
    const achievementsRef = useRef(null);
    const roadmapRef = useRef(null);
    const previewRef = useRef(null);
    const comingSoonRef = useRef(null);
    const techStackRef = useRef(null);
    const testimonialsRef = useRef(null);
    const teamRef = useRef(null);
    const ctaRef = useRef(null);

    const sectionRefs = [
        heroRef,
        statsRef,
        featuresRef,
        achievementsRef,
        roadmapRef,
        previewRef,
        comingSoonRef,
        techStackRef,
        testimonialsRef,
        teamRef,
        ctaRef
    ];

    return (

        <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 font-sans overflow-x-hidden`}>
            {/* Header with game UI styling */}
            <header className="p-4 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">

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
                            className="w-20 h-20"
                        />
                        <div className="absolute -inset-2 rounded-full border-2 border-indigo-200 animate-ping opacity-0"></div>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5c7e51] to-[#88BC46]">
                        Gamified Finance
                    </h1>
                </motion.div>
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            className="bg-gradient-to-r from-[#98C988] to-[#4B6343] hover:from-[#4B6343] hover:to-[#98C988] text-white px-6 py-2 font-medium shadow-md hover:shadow-lg transition-all group"
                            onClick={() => window.location.href = '/login'}
                        >
                            <span className="flex items-center gap-2">
                                Continue Playing <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </motion.div>
                </div>
            </header>

            {/* Hero Section with game-like UI */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-emerald-600/10 z-0"></div>
                <img src={heroGif} alt="Finance Quest" className="absolute inset-0 w-full h-full object-cover z-0 opacity-20" />

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-6 bg-[#AAD977] text-[#4B6343] px-4 py-1 rounded-full text-sm font-semibold"
                    >
                        PLAY TO EARN • LEVEL UP YOUR FINANCES
                    </motion.div>

                    <motion.h2
                        className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#AAD977]">Turn Finance</span><br />
                        Into an Adventure
                    </motion.h2>

                    <motion.p
                        className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Earn XP, collect rare badges, and complete quests as you master your money management skills.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Button
                            className="bg-gradient-to-r from-[#4B6343] to-[#AAD977] hover:from-[#4B6343] hover:to-[#AAD977] text-white px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
                            onClick={() => window.location.href = '/login'}
                        >
                            <span className="flex items-center gap-2">
                                Start Your Quest <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar with game UI styling */}
            <section ref={statsRef} className="py-7 bg-gradient-to-r from-[#4B6343] to-[#AAD977] text-white shadow-lg">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
                    {[
                        { value: "100+", label: "Active Players", icon: <FaUserFriends /> },
                        { value: "500+", label: "XP Earned Daily", icon: <FaChartLine /> },
                        { value: "30+", label: "Unique Achievements", icon: <FaTrophy /> },
                        { value: "R100K+", label: "Collectively Saved", icon: <FaCoins /> }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-3xl font-bold flex items-center justify-center gap-2">
                                {stat.icon} {stat.value}
                            </div>
                            <div className="text-sm opacity-90 mt-1">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Core Features with game card styling */}
            <section ref={featuresRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title="Financial Growth"
                        highlight="Feels Like Play"
                        subtitle="We've transformed every aspect of personal finance into rewarding game mechanics"
                    />

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaChartLine className="text-4xl" />,
                                title: "Goal Quests",
                                desc: "Transform financial goals into exciting quests with XP rewards",
                                color: "bg-gradient-to-br from-[#3AADFA] to-[#B1E1FF]",
                                features: ["Visual progress tracking", "Milestone rewards", "Custom challenges"]
                            },
                            {
                                icon: <FaTrophy className="text-4xl" />,
                                title: "Achievements",
                                desc: "Unlock badges for financial milestones and good habits",
                                color: "bg-gradient-to-br from-[#FFBF1A] to-[#FFD18C]",
                                features: ["100+ unique badges", "Special edition collectibles", "Shareable accomplishments"]
                            },
                            {
                                icon: <FaUserFriends className="text-4xl" />,
                                title: "Social Features",
                                desc: "Join forces with friends and compete on leaderboards",
                                color: "bg-gradient-to-br from-[#AAD977] to-lime-500",
                                features: ["Private groups", "Friendly challenges", "Progress sharing"]
                            },
                            {
                                icon: <FaCoins className="text-4xl" />,
                                title: "Reward Economy",
                                desc: "Earn coins for completing financial tasks",
                                color: "bg-gradient-to-br from-[#FF4C28] to-[#FF907A]",
                                features: ["Redeem for perks", "Avatar customization", "Exclusive content"]
                            },
                            {
                                icon: <FaShieldAlt className="text-4xl" />,
                                title: "Security",
                                desc: "Bank-level protection for your financial data",
                                color: "bg-gradient-to-br from-indigo-500 to-purple-500",
                                features: ["Encrypted connections", "Read-only access", "Privacy controls"]
                            },
                            {
                                icon: <FaRocket className="text-4xl" />,
                                title: "Quick Start",
                                desc: "Get set up in minutes with our interactive tutorial",
                                color: "bg-gradient-to-br from-pink-400 to-pink-500",
                                features: ["Instant XP rewards", "Beginner quests", "Personalized onboarding"]
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-xl border-2 border-gray-200 hover:border-white transition-all overflow-hidden shadow-lg hover:shadow-xl relative"
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
                                                <div className="w-2 h-2 rounded-full bg-[#AAD977]"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievement Showcase */}
            <section ref={achievementsRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title="Earn Prestige With"
                        highlight="Achievements"
                        subtitle="Collect badges that showcase your financial accomplishments"
                    />

                    <div className="grid md:grid-cols-3 gap-6">
                        <AchievementBadge
                            title="Savings Streak"
                            description="Save money for 7 days in a row"
                            icon={<FaCoins />}
                            color="bg-gradient-to-br from-[#FFBF1A] to-[#FFD18C]"
                        />
                        <AchievementBadge
                            title="Budget Master"
                            description="Stay under budget for a full month"
                            icon={<FaChartLine />}
                            color="bg-gradient-to-br from-[#AAD977] to-lime-500"
                        />
                        <AchievementBadge
                            title="Debt Slayer"
                            description="Pay off a significant debt"
                            icon={<FaShieldAlt />}
                            color="bg-gradient-to-br from-[#FF4C28] to-[#FF907A]"
                        />
                        <AchievementBadge
                            title="Investment Novice"
                            description="Make your first investment"
                            icon={<FaTrophy />}
                            color="bg-gradient-to-br from-[#3AADFA] to-[#B1E1FF]"
                        />
                        <AchievementBadge
                            title="Community Hero"
                            description="Help 5 friends with their finances"
                            icon={<FaUserFriends />}
                            color="bg-gradient-to-br from-indigo-500 to-purple-500"
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
                            className="border-lime-600 text-lime-500 hover:bg-lime-600 hover:text-white px-8 py-3 font-medium"
                            onClick={() => window.location.href = '/landingAchievements'}
                        >
                            View All 30+ Achievements
                        </Button>
                    </div>
                </div>
            </section>

            {/* Financial Quest Roadmap */}
            <section ref={roadmapRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title="Your Financial"
                        highlight="Quest Roadmap"
                        subtitle="Journey through our gamified financial system with clear milestones"
                    />

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
                                stroke="#AAD977"
                                strokeWidth="8"
                                strokeLinecap="round"
                                d="M0,200 Q360,50 720,200 T1440,200"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2 }}
                            />
                            <motion.path
                                fill="none"
                                stroke="#AAD977"
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
                                color: "bg-gradient-to-br from-[#AAD977] to-lime-500",
                                x: "25%",
                                y: "50px"
                            },
                            {
                                title: "Earn XP",
                                desc: "Complete money tasks",
                                icon: <FaCoins className="text-xl" />,
                                color: "bg-gradient-to-br from-[#FFBF1A] to-[#FFD18C]",
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
                                color: "bg-gradient-to-br from-[#3AADFA] to-[#B1E1FF]",
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
                                <div className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-lg text-center max-w-[200px]">
                                    <h4 className="font-bold text-emerald-600 mb-1">{step.title}</h4>
                                    <p className="text-sm text-gray-600">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Visualization Preview + Demo */}
            <section ref={previewRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#AAD977]">Gameplay</span> Preview
                                </h2>
                                <p className="text-lg text-gray-600 mb-6">
                                    See how Gamified Finance transforms financial management into an engaging adventure with quests, achievements, and rewards.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        className="bg-gradient-to-r from-[#4B6343] to-[#AAD977] hover:from-[#4B6343] hover:to-[#AAD977] text-white px-6 py-3 font-bold shadow-md hover:shadow-lg transition-all"
                                        onClick={() => window.location.href = '/register'}
                                    >
                                        Start Your Quest
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-lime-500 text-lime-600 hover:bg-lime-500 hover:text-white px-6 py-3 font-medium"
                                        onClick={() => window.location.href = '/features'}
                                    >
                                        Explore Features
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:w-1/2 relative">
                                <div className="relative h-full min-h-[400px] bg-gray-900">
                                    {/* Browser UI */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-full bg-gray-800 rounded-b-lg overflow-hidden">
                                            {/* Browser chrome */}
                                            <div className="bg-gray-700 p-3 flex items-center">
                                                <div className="flex space-x-2 mr-4">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <div className="flex-1 bg-gray-600 rounded-md px-4 py-2 text-sm text-gray-300">
                                                    gamified.finance/demo
                                                </div>
                                            </div>

                                            {/* Video container */}
                                            <div className="relative w-full h-[360px] flex items-center justify-center">
                                                <video
                                                    className="w-full h-full object-cover rounded-b-lg"
                                                    src={require('../../assets/Videos/demoPreview.mp4')}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Coming Soon: AI and AR Section */}
            <section ref={comingSoonRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Coming Soon: <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#AAD977]">Next-Level Features</span>
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We're developing cutting-edge technologies to make financial management even more engaging and intuitive.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* AI Feature Card */}
                        <motion.div
                            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                            whileHover={{ y: -5 }}
                        >
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">AI Smart Advisor</h3>
                                        <p className="opacity-90">Coming Demo 3</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-6">
                                    Our AI assistant learns your financial habits to provide personalized recommendations, predict cash flow, and suggest optimal strategies.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-gray-700">Personalized financial insights</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-gray-700">Automated budget optimization</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-gray-700">Predictive cash flow analysis</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* AR Feature Card */}
                        <motion.div
                            className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                            whileHover={{ y: -5 }}
                        >
                            <div className="bg-gradient-to-r from-[#3AADFA] to-[#B1E1FF] p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">AR Financial World</h3>
                                        <p className="opacity-90">Coming Demo 3</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-6">
                                    Visualize your financial goals in augmented reality - watch your savings grow as a 3D model in your physical space.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-[#AAD977]/20 text-[#4B6343] flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-gray-700">3D visualization of financial goals</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-[#AAD977]/20 text-[#4B6343] flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-gray-700">Interactive financial visualisation</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-[#AAD977]/20 text-[#4B6343] flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                        </div>
                                        <span className="text-gray-700">AR-powered investment simulations</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Tech Stack Section */}
            <section ref={techStackRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title="Built With"
                        highlight="Modern Technology"
                        subtitle="Our tech stack ensures a seamless, secure, and scalable experience"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[
                            { name: "React", icon: "react", description: "Frontend framework" },
                            { name: "Tailwind CSS", icon: "tailwind", description: "CSS framework" },
                            { name: "Node.js", icon: "nodejs", description: "Runtime environment" },
                            { name: "PostgreSQL", icon: "postgresql", description: "Database" },
                            { name: "Python", icon: "python", description: "Backend services" },
                            { name: "Unity", icon: "unity", description: "AR engine" },
                            { name: "Figma", icon: "figma", description: "Design tool" },
                            { name: "TypeScript", icon: "typescript", description: "Typed JavaScript" },
                            { name: "Express.js", icon: "express", description: "Web framework" },
                            { name: "Docker", icon: "docker", description: "Containerization" },
                            { name: "GitHub", icon: "github", description: "Version control" },
                            { name: "Notion", icon: "notion", description: "Project management" },
                            { name: "Vercel", icon: "vercel", description: "Deployment" },
                            { name: "Jest", icon: "jest", description: "Testing" },
                            { name: "Cypress", icon: "cypress", description: "E2E testing" }
                        ].map((tech, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 hover:border-[#AAD977] transition-all"
                                whileHover={{ y: -3, scale: 1.03 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-12 h-12 flex items-center justify-center mb-3">
                                    <img
                                        src={`https://skillicons.dev/icons?i=${tech.icon.toLowerCase()}`}
                                        alt={tech.name}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://skillicons.dev/icons?i=${tech.icon.toLowerCase()}&theme=light`;
                                        }}
                                    />
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm text-center">{tech.name}</h4>
                                <p className="text-xs text-gray-500 text-center mt-1">{tech.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section ref={testimonialsRef} className="py-20 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <SectionHeader
                        title="What"
                        highlight="Players Are Saying"
                        subtitle="Real people achieving real financial progress through gamification"
                    />

                    <div className="relative h-64">
                        {testimonials.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                className={`absolute inset-0 bg-white p-8 rounded-xl border-2 border-gray-200 shadow-lg flex flex-col items-center text-center ${activeTestimonial === i ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeTestimonial === i ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="relative">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-lime-400" />
                                    <div className="absolute -top-1 -right-1 bg-[#FFD18C] text-white text-xs font-bold px-2 py-1 rounded-full">
                                        ★★★★★
                                    </div>
                                </div>
                                <p className="text-lg text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                                <div>
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-sm text-[#AAD977]">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === i ? 'bg-[#AAD977] scale-125' : 'bg-gray-300'}`}
                                aria-label={`View testimonial ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section ref={teamRef} className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title="Meet the"
                        highlight="Gamified Finance Team"
                        subtitle="The passionate creators behind your financial adventure"
                    />

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all relative group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                                <div className="p-6 text-center">
                                    <h4 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h4>
                                    <p className="text-[#88BC46] text-sm mb-4">{member.role}</p>
                                    <div className="flex justify-center gap-4">
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-lime-600 transition-colors"
                                            aria-label={`${member.name}'s GitHub`}
                                        >
                                            GitHub
                                        </a>
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-500 hover:text-lime-600 transition-colors"
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
            <section ref={ctaRef} className="py-32 px-6 bg-gradient-to-r from-[#4B6343] to-[#AAD977] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNiA2WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiNmZmYiPjwvcGF0aD4KPHBhdGggZD0iTTYgMEwwIDZaIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZT0iI2ZmZiI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h3 className="text-4xl font-bold mb-6">
                        Ready to Transform Your Financial Life?
                    </h3>
                    <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
                        Join thousands of players who've made finance fun and rewarding
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            className="bg-white text-lime-600 hover:bg-lime-100 px-8 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
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
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                            <FaMedal className="text-yellow-300" />
                            <span>+100 XP Signup Bonus</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
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
                                className="w-10 h-10"
                            />
                            <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4B6343] to-[#AAD977]">
                                Gamified Finance
                            </h4>
                        </div>

                        <div className="flex gap-6">
                            <a href="/about" className="text-gray-600 hover:text-lime-600 transition-colors">About</a>
                            <a href="/contact" className="text-gray-600 hover:text-lime-600 transition-colors">Contact</a>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Gamified Finance. All rights reserved.
                        </div>
                        <div className="flex gap-4">
                            <a href="https://github.com/COS301-SE-2025/Gamified-Financial-Visualizer" className="text-gray-400 hover:text-lime-600 transition-colors">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/__codeblooded__/?hl=en" className="text-gray-400 hover:text-lime-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            <ScrollNavigation sections={sectionRefs} />
        </div>
    );
}