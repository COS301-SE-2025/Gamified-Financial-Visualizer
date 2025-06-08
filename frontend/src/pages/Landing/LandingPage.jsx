import React from "react";
import { Button } from '../../components/ui/Button';
import { FaTrophy, FaUserFriends, FaChartLine, FaCode, FaRocket, FaCoins, FaShieldAlt } from "react-icons/fa";
import { SiReact, SiTailwindcss, SiPostgresql, SiPython, SiNodedotjs, SiUnity, SiOpenai } from "react-icons/si";

const team = [
    { name: "Yohali Kumangu", role: "Data Engineer, Team leader", github: "https://github.com/YourfavCompSciGirlie", linkedin: "https://www.linkedin.com/in/ymkamangu/" },
    { name: "Lebogang Masenya", role: "Services Engineer, Project Manager", github: "https://github.com/B-WayneZA", linkedin: "https://www.linkedin.com/in/lebogang-masenya/" },
    { name: "Mpho Siminya", role: "UX/UI Designer, UI Engineer", github: "https://github.com/MphoSiminya", linkedin: "https://www.linkedin.com/in/mpho-siminya/" },
    { name: "Nobuhle Mtshali", role: "UI Engineer, DevOps", github: "https://github.com/ReituTheCompSciGirlie", linkedin: "https://www.linkedin.com/in/nobuhle-reitumetse-mtshali/" },
    { name: "Aundrea Ncube", role: "Integration Engineer", github: "https://github.com/AundreaNcube", linkedin: "http://www.linkedin.com/in/aundrea-ncube-1484a9356" },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-200 to-gray-100 text-white font-pixel">
            <header className="p-6 flex justify-between items-center shadow-md bg-black/80 sticky top-0 z-50">
                <h1 className="text-5xl font-bold text-green-500 drop-shadow-md animate-pulse">Gamified Finance</h1>
                <Button variant="outline" className="text-white border-green-400 hover:bg-green-500 hover:text-black transition duration-300" onClick={() => window.location.href = '/login'}>
                    Enter Portal
                </Button>
            </header>

            <section className="text-center py-24 px-6 bg-gradient-to-br from-blue-100/10 via-purple-200/10 to-pink-300/10">
                <h2
                    className="text-6xl font-extrabold text-green-500 animate-bounce"
                    style={{
                        textShadow: '0 0 10px #ffffff, 0 0 20px #ffffff'
                    }}
                >
                    Level Up Your Finances
                </h2>

                <p className="text-xl text-gray-500 max-w-4xl mx-auto mt-6 leading-relaxed">
                    A revolutionary, gamified platform where your personal finance journey becomes an epic RPG adventure. Track your XP, battle budgeting beasts, unlock legendary badges, and climb the leaderboards!
                </p>
            </section>

            <section className="py-20 px-6 bg-gray-100">
                <h3 className="text-4xl font-bold text-green-500 mb-12 text-center">Core Features</h3>
                <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    <Feature icon={<FaChartLine />} title="Dynamic Goal Quests" desc="Create, manage, and visualize goals with animated timelines and XP rewards." />
                    <Feature icon={<FaTrophy />} title="Achievements & Badges" desc="Unlock over 100 achievements from saving streaks to investment mastery." />
                    <Feature icon={<FaUserFriends />} title="Social & Community" desc="Join guilds, challenge friends, and rise through community leaderboards." />
                    <Feature icon={<FaCoins />} title="Rewards System" desc="Earn gold coins and use them to unlock avatar items, tools, and boosts." />
                    <Feature icon={<FaShieldAlt />} title="Secure & Private" desc="Bank-level encryption, local AI, and privacy-first design principles." />
                    <Feature icon={<FaRocket />} title="Gamified Onboarding" desc="Embark on your first financial quest with tutorial missions and XP boosts." />
                </div>
            </section>

            <section className="py-20 px-6 bg-gradient-to-tr from-gray-100 via-gray-100 to-white">
                <h3 className="text-4xl font-bold text-green-500 mb-10 text-center">Powered by Cutting Edge Tech</h3>
                <div className="flex flex-wrap justify-center gap-10 text-6xl text-blue-300">
                    <SiReact title="React" />
                    <SiTailwindcss title="Tailwind CSS" />
                    <SiNodedotjs title="Node.js" />
                    <SiPostgresql title="PostgreSQL" />
                    <SiPython title="Python" />
                    <SiUnity title="Unity (AR)" />
                    <SiOpenai title="OpenAI / ML" />
                </div>
                <p className="mt-6 text-center text-gray-400">Engineered for speed, scale, and future-proof gamification</p>
            </section>

            <section className="py-24 px-6 bg-gray-100">
                <h3 className="text-4xl font-bold text-green-500 mb-14 text-center">Meet the Codeblooded Heroes</h3>
                <div className="grid md:grid-cols-5 gap-10 max-w-7xl mx-auto">
                    {team.map((member, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-lime-500 text-center shadow-lg hover:scale-105 transform transition duration-300">
                            <div className="text-3xl font-bold text-blue-300 mb-2">{member.name}</div>
                            <p className="text-gray-400 text-sm mb-3">{member.role}</p>
                            <div className="flex justify-center gap-3 text-lime-400 text-xl">
                                <a href={member.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="text-center py-16 px-4 bg-gradient-to-br from-green-500/80 via-white to-green-600/90">
                <h3 className="text-4xl font-bold text-blue-400 mb-6">Your Journey Awaits...</h3>
                <p className="text-lg text-gray-500 mb-8">Join thousands of adventurers turning finance into fun. Are you ready to enter the realm?</p>
                <Button variant="outline" className="text-white border-blue-400 hover:bg-blue-400 hover:text-white px-10 py-4 text-xl rounded-xl transition-all duration-300 shadow-lg" onClick={() => window.location.href = '/login'}>
                    🎯 Begin Your Quest
                </Button>
            </section>

            <footer className="text-center py-6 text-sm text-gray-500 bg-white">
                <div>© 2025 Codeblooded - FinanceQuest</div>
                <div className="text-xs text-gray-600">All characters, systems, and badges are fictional but your XP is real.</div>
            </footer>
        </div>
    );
}

function Feature({ icon, title, desc }) {
    return (
        <div className="bg-gray-100 p-6 rounded-xl border border-lime-400 text-center shadow-md hover:shadow-lime-400/40 transition-all duration-300">
            <div className="text-5xl mb-4 text-green-300">{icon}</div>
            <h4 className="text-2xl font-bold mb-2 text-gray-600">{title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
