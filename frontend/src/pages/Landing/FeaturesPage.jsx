import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaChartLine,
  FaTrophy,
  FaUserFriends,
  FaCoins,
  FaRocket,
  FaShieldAlt,
  FaArrowLeft
} from 'react-icons/fa';

const features = [
  {
    icon: <FaChartLine className="text-3xl" />,
    title: "Goal Quests",
    description: "Transform your savings goals into quests with XP and milestone rewards.",
    bullets: ["Set and track savings goals", "Earn XP for progress", "Unlock bonus rewards"],
    color: "bg-gradient-to-br from-[#3AADFA] to-[#B1E1FF]",
    borderColor: "border-blue-200"
  },
  {
    icon: <FaTrophy className="text-3xl" />,
    title: "Achievements",
    description: "Unlock badges for smart money habits and celebrate milestones.",
    bullets: ["100+ unique badges", "Level up your profile", "Share your progress"],
    color: "bg-gradient-to-br from-[#FFBF1A] to-[#FFD18C]",
    borderColor: "border-amber-200"
  },
  {
    icon: <FaUserFriends className="text-3xl" />,
    title: "Social Play",
    description: "Join guilds, compete with friends, and track community goals.",
    bullets: ["Leaderboards", "Challenge friends", "Join communities"],
    color: "bg-gradient-to-br from-[#AAD977] to-lime-500",
    borderColor: "border-lime-200"
  },
  {
    icon: <FaCoins className="text-3xl" />,
    title: "Reward Economy",
    description: "Earn in-game currency by completing tasks and challenges.",
    bullets: ["Coins for tasks", "Redeem for perks", "Avatar customization"],
    color: "bg-gradient-to-br from-[#FF4C28] to-[#FF907A]",
    borderColor: "border-orange-200"
  },
  {
    icon: <FaShieldAlt className="text-3xl" />,
    title: "Secure & Private",
    description: "Your data is protected with bank-level encryption and privacy tools.",
    bullets: ["Read-only financial access", "Encrypted data", "Custom privacy settings"],
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    borderColor: "border-indigo-200"
  },
  {
    icon: <FaRocket className="text-3xl" />,
    title: "Quick Start",
    description: "Interactive onboarding gets you earning XP in minutes.",
    bullets: ["Tutorial quests", "Instant feedback", "Gamified setup"],
    color: "bg-gradient-to-br from-pink-400 to-pink-500",
    borderColor: "border-pink-200"
  }
];

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore the Features
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover how each feature helps turn your financial life into an engaging, rewarding experience.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className={`bg-white rounded-xl border-2 ${feature.borderColor} hover:border-white transition-all overflow-hidden shadow-lg hover:shadow-xl relative group`}
              initial={{ opacity: 0, y: 30 }}
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
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 mb-5 text-center">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.bullets.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-[#AAD977] flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => navigate('/register')}
            className="relative bg-gradient-to-r from-[#4B6343] to-[#AAD977] text-white px-8 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPage;