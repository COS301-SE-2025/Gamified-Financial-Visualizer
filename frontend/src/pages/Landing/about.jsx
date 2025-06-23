import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";
import codebloodedTeamPhoto from "../../assets/Team Profiles/codeBloodeTeam.jpg"; // Add your team photo asset

// Image imports
import YohaliImg from '../../assets/Team Profiles/Malaika.png';
import LebogangImg from '../../assets/Team Profiles/Lebo.png';
import MphoImg from '../../assets/Team Profiles/Mpho.png';
import NobuhleImg from '../../assets/Team Profiles/Nobuhle.png';
import AundreaImg from '../../assets/Team Profiles/Aundrea.png';

const team = [
  {
    name: 'Yohali Malaika Kamangu',
    role: 'Data Engineer, Project Manager',
    image: YohaliImg,
    github: 'https://github.com/YourfavCompSciGirlie',
    linkedin: 'https://www.linkedin.com/in/ymkamangu/',
    bio: 'Experienced in Java development with diverse projects leveraging the language. Proficient in backend technologies like Node.js, with strong financial management background as a university treasurer. Skilled in integration development with expertise in Python, MongoDB, and Node.js.'
  },
  {
    name: 'Lebogang Masenya',
    role: 'Services Engineer, Systems Architect',
    image: LebogangImg,
    github: 'https://github.com/B-WayneZA',
    linkedin: 'https://www.linkedin.com/in/lebogang-masenya/',
    bio: 'Possesses foundational experience in Data Science with small-scale machine learning models using R and Python. Familiar with AI development tools like Hugging Face, applied in full-stack personal projects. Contributes to finance-focused AI model development and intelligent systems.'
  },
  {
    name: 'Mpho Siminya',
    role: 'UX/UI Designer, UI Engineer',
    image: MphoImg,
    github: 'https://github.com/MphoSiminya',
    linkedin: 'https://www.linkedin.com/in/mpho-siminya/',
    bio: 'Creative front-end developer skilled at translating Figma wireframes into responsive web applications. Proficient in Bootstrap and React with Blender 3D modeling experience. Passionate gamer bringing unique perspective to immersive UX design.'
  },
  {
    name: 'Nobuhle Mtshali',
    role: 'UI Engineer, DevOps',
    image: NobuhleImg,
    github: 'https://github.com/ReituTheCompSciGirlie',
    linkedin: 'https://www.linkedin.com/in/nobuhle-reitumetse-mtshali/',
    bio: 'Proficient in React and Java with strong UI/UX design foundation. Interested in VR/AR technologies to enhance learning and engagement. Detail-driven with focus on functional, visually engaging solutions for financial literacy.'
  },
  {
    name: 'Aundrea Ncube',
    role: 'Integration Engineer, Testing Engineer',
    image: AundreaImg,
    github: 'https://github.com/AundreaNcube',
    linkedin: 'http://www.linkedin.com/in/aundrea-ncube-1484a9356',
    bio: 'Experienced in JavaScript, PHP, and Java with deep database and API design knowledge. Skilled at seamless frontend/backend integration. Proficient in Vanilla JavaScript for lightweight development and Node.js environments.'
  }
];

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#4B6343] to-[#AAD977] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <FiInfo className="w-12 h-12 text-white" />
            <h1 className="text-4xl font-bold">About Gamified Finance</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            Transforming financial literacy into an engaging, game-like adventure.
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Project Overview
              </h2>
              <p className="text-gray-600 mb-4">
                The <strong>Gamified Financial Visualizer</strong> is a cross-platform solution that leverages <strong>AR and AI</strong> to reimagine financial literacy as an engaging, game-like experience. Designed for digitally native users—particularly those interested in financial management—the platform makes budgeting, saving, investing, and spending management interactive and accessible.
              </p>
              <p className="text-gray-600 mb-4">
                Aligned with EPI-USE's strategic goals, the solution integrates advanced AI and Machine Learning to analyze transaction data and provide real-time, personalized financial advice contextualized to local realities.
              </p>
              <p className="text-gray-600">
                Users can explore financial goals through <strong>immersive AR environments</strong>, engage with AI financial coaches, and navigate 3D "financial worlds." A built-in community layer promotes social accountability through group challenges and shared milestones.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-8 border border-gray-200">
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={codebloodedTeamPhoto} 
                  alt="Codeblooded Team" 
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  Presented by <span className="text-[#88BC46]">Codeblooded</span>
                </h3>
              </div>
              <p className="text-gray-600 text-center">
                A team of passionate developers and designers committed to making financial literacy accessible through technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Meet the <span className="text-[#88BC46]">Team</span>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            The passionate creators behind your financial adventure
          </p>
          
          <div className="space-y-12">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all relative group flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/3 h-64 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="md:w-2/3 p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h4>
                  <p className="text-[#88BC46] text-sm mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6">{member.bio}</p>
                  <div className="flex gap-4">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 hover:bg-[#88BC46]/10 text-gray-700 hover:text-[#88BC46] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 hover:bg-[#88BC46]/10 text-gray-700 hover:text-[#88BC46] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}