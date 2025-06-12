import React from "react";
import { Button } from '../../components/ui/Button';
import { motion } from "framer-motion";

import { FaTrophy, FaUserFriends, FaChartLine, FaRocket, FaCoins, FaShieldAlt } from "react-icons/fa";
import { SiReact, SiTailwindcss, SiPostgresql, SiPython, SiNodedotjs, SiUnity, SiOpenai } from "react-icons/si";

// Image imports
import YohaliImg from '../../assets/Images/Team Profiles/Malaika.png';
import LebogangImg from '../../assets/Images/Team Profiles/Lebo.png';
import MphoImg from '../../assets/Images/Team Profiles/Mpho.png';
import NobuhleImg from '../../assets/Images/Team Profiles/Nobuhle.png';
import AundreaImg from '../../assets/Images/Team Profiles/Aundrea.png';

// Banner header images 
import heroGif from '../../assets/Images/banners/pixelOffice.gif';
import journeyGif from '../../assets/Images/banners/pixelOffice2.gif';

const featureColors = ["text-[#FF7256]", "text-[#facc15]", "text-[#60a5fa]", "text-[#91DB69]", "text-[#F68D2B]", "text-[#FF9BB7]"];

// Team details 
const team = [
    {
        name: "Yohali Kumangu",
        role: "Data Engineer, Team leader",
        github: "https://github.com/YourfavCompSciGirlie",
        linkedin: "https://www.linkedin.com/in/ymkamangu/",
        image: YohaliImg,
    },
    {
        name: "Lebogang Masenya",
        role: "Services Engineer, Project Manager",
        github: "https://github.com/B-WayneZA",
        linkedin: "https://www.linkedin.com/in/lebogang-masenya/",
        image: LebogangImg,
    },
    {
        name: "Mpho Siminya",
        role: "UX/UI Designer, UI Engineer",
        github: "https://github.com/MphoSiminya",
        linkedin: "https://www.linkedin.com/in/mpho-siminya/",
        image: MphoImg,
    },
    {
        name: "Nobuhle Mtshali",
        role: "UI Engineer, DevOps",
        github: "https://github.com/ReituTheCompSciGirlie",
        linkedin: "https://www.linkedin.com/in/nobuhle-reitumetse-mtshali/",
        image: NobuhleImg,
    },
    {
        name: "Aundrea Ncube",
        role: "Integration Engineer",
        github: "https://github.com/AundreaNcube",
        linkedin: "http://www.linkedin.com/in/aundrea-ncube-1484a9356",
        image: AundreaImg,
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#97989a] text-[#111827] font-pixel">
            {/* Header */}
            <header className="p-6 flex justify-between items-center shadow-md bg-[#ffffff] sticky top-0 z-50">
                <h1 className="text-5xl font-bold text-[#83AB55] drop-shadow-md animate-pulse">Gamified Finance</h1>
                <Button variant="outline" className="text-[#83AB55] border-[#93c45b] hover:bg-[#83AB55] hover:text-[#ffffff] transition duration-300" onClick={() => window.location.href = '/login'}>
                    Enter Portal
                </Button>
            </header>

            {/* Main banner footer */}
            <section className="relative text-center py-24 px-6">
                <img src={heroGif} alt="Finance Quest" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
                <div className="relative z-10">
                    <h2 className="text-6xl font-extrabold text-[#ffffff] animate-bounce drop-shadow-[0_0_20px_white]">Level Up Your Finances</h2>
                    <p className="text-xl text-[#ffffff] max-w-4xl mx-auto mt-6 leading-relaxed">
                        A revolutionary RPG-inspired platform where every financial milestone feels like an achievement.
                    </p>
                </div>
            </section>

            {/* Core features */}
            <section className="py-20 px-6 bg-[#ffffff]">
                <h3 className="text-4xl font-bold text-[#83AB55] mb-12 text-center">Core Features</h3>
                <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {[FaChartLine, FaTrophy, FaUserFriends, FaCoins, FaShieldAlt, FaRocket].map((Icon, i) => (
                        <div key={i} className="bg-[#ffffff] p-6 rounded-xl border border-[#e5e7eb] text-center shadow-md hover:shadow-xl transition duration-300">
                            <div className={`text-5xl mb-4 ${featureColors[i % featureColors.length]}`}><Icon /></div>
                            <h4 className="text-2xl font-bold mb-2 text-[#374151]">{[ "Dynamic Goal Quests", "Achievements & Badges", "Social & Community", "Rewards System", "Secure & Private", "Gamified Onboarding"][i]}</h4>
                            <p className="text-[#4b5563] text-sm leading-relaxed">{[ "Create, manage, and visualize goals with animated timelines and XP rewards.", "Unlock over 100 achievements from saving streaks to investment mastery.", "Join guilds, challenge friends, and rise through leaderboards.", "Earn coins and spend on avatar items, boosts, and badges.", "Bank-grade encryption and privacy-first design.", "Start with a fun interactive tutorial, earn XP instantly."][i]}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-10 px-6 bg-gradient-to-tr from-[#FFFFFF] via-[#FFFFFF] to-[#ffffff]">
                <h3 className="text-4xl font-bold text-[#83AB55] mb-10 text-center">Powered by Cutting Edge Tech</h3>
                <div className="flex flex-wrap justify-center gap-10 text-6xl text-[#FF7256]">
                    <SiReact title="React" />
                    <SiTailwindcss title="Tailwind CSS" />
                    <SiNodedotjs title="Node.js" />
                    <SiPostgresql title="PostgreSQL" />
                    <SiPython title="Python" />
                    <SiUnity title="Unity (AR)" />
                    <SiOpenai title="OpenAI / ML" />
                </div>
                <p className="mt-6 text-center text-[#9ca3af]">Engineered for speed, scale, and future-proof gamification</p>
            </section>

            {/* Financial Quest Roadmap */}
            <section className="relative bg-[#ffffff] py-48 px-4 overflow-visible">
                <h3 className="text-4xl font-bold text-[#83AB55] mb-20 text-center">Your Financial Quest Roadmap</h3>

                {/* Animated Road Path */}
                <motion.svg
                    viewBox="0 0 1440 160"
                    className="absolute top-[340px] left-0 w-full h-auto z-0 pointer-events-none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                >
                    <motion.path
                        fill="none"
                        stroke="#999"
                        strokeWidth="12"
                        strokeLinecap="round"
                        d="M0,80 Q180,0 360,80 T720,80 T1080,80 T1440,80"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2 }}
                    />
                    <motion.path
                        fill="none"
                        stroke="#fff"
                        strokeWidth="4"
                        strokeDasharray="20 20"
                        d="M0,80 Q180,0 360,80 T720,80 T1080,80 T1440,80"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 0.2 }}
                    />
                </motion.svg>

                {/* Tooltip Steps */}
                <div className="relative z-10 max-w-7xl mx-auto min-h-[300px]">
                    {[
                        { title: "Sign Up / Login", desc: "Start your quest with your custom avatar.", Icon: FaRocket, color: "bg-gradient-to-br from-[#FF4C28] to-[#FF907A]", left: "2%", top: "0" },
                        { title: "Set Financial Goals", desc: "Choose quests like saving or investing.", Icon: FaChartLine, color: "bg-gradient-to-br from-[#6BA226] to-[#AAD977]", left: "18%", top: "120px" },
                        { title: "Earn XP", desc: "Complete tasks to level up.", Icon: FaCoins, color: "bg-gradient-to-br from-[#FFBF1A] to-[#FFD18C]", left: "34%", top: "0" },
                        { title: "Unlock Achievements", desc: "Earn badges and boosts.", Icon: FaTrophy, color: "bg-gradient-to-br from-[#FF4080] to-[#FF9BB7]", left: "50%", top: "120px" },
                        { title: "Join Challenges", desc: "Compete with friends.", Icon: FaUserFriends, color: "bg-gradient-to-br from-[#35A8F4] to-[#B1E1FF]", left: "66%", top: "0" },
                        { title: "Upgrade Tools", desc: "Spend XP on upgrades.", Icon: FaShieldAlt, color: "bg-gradient-to-br from-[#0B8A8F] to-[#78E6EA]", left: "82%", top: "120px" },
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-[160px] flex flex-col items-center"
                            style={{ left: step.left, top: step.top }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true }}
                        >
                            {/* Icon + triangle */}
                            <div className="relative z-10">
                                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-[#ffffff] text-xl shadow-lg`}>
                                    <step.Icon />
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-[#f3f4f6]"></div>
                            </div>

                            {/* Text box */}
                            <div className="bg-[#f3f4f6] mt-4 px-4 py-3 rounded-xl shadow text-center">
                                <h4 className="font-bold text-sm text-[#1f2937]">{step.title}</h4>
                                <p className="text-xs text-[#63676c] mt-1">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Member Profiles */}
            <section className="py-24 px-6 bg-[#FFFFFF]">
                <h3 className="text-4xl font-bold text-[#83AB55] mb-14 text-center">Meet the Codeblooded Heroes</h3>
                <div className="grid md:grid-cols-5 gap-10 max-w-7xl mx-auto">
                    {team.map((member, i) => (
                        <div key={i} className="bg-[#ffffff] p-8 rounded-xl border border-[#84cc16] text-center shadow-lg hover:scale-105 transform transition duration-300">
                            <img src={member.image} alt={member.name} className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-2 border-[#d1d5db]" />
                            <div className="text-xl font-bold text-[#1f2937] mb-1">{member.name}</div>
                            <p className="text-[#6b7280] text-sm mb-3">{member.role}</p>
                            <div className="flex justify-center gap-3 text-[#f56d58] text-lg">
                                <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Journey Banner */}
            <section className="relative text-center py-32 px-6">
                <img src={journeyGif} alt="Journey GIF" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
                <div className="relative z-10">
                    <h3 className="text-4xl font-bold text-[#ffffff] mb-6 drop-shadow-[0_0_15px_white]">Your Journey Awaits...</h3>
                    <p className="text-lg text-[#ffffff] max-w-xl mx-auto">Adventure, rewards, friends, and financial victory await. Let's begin the quest for financial freedom!</p>
                </div>
            </section>

            {/* Contact details Footer */}
            <footer className="text-center py-10 px-6 bg-[#f3f4f6] text-[#828284]">
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-[#000000]">Contact Us</h4>
                    <p>Email: codebloded.capstone@gmail.com</p>
                    <p>GitHub: <a className="underline text-[#84cc16]" href="https://github.com/CodebloodedTeam">CodebloodedTeam</a></p>
                </div>
                <div className="text-xs text-[#6b7280]">© 2025 CodeBlooded - Gamified Finance. All badges and coins are metaphorical... but the XP is real.</div>
            </footer>
        </div>
    );
}