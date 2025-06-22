import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";

export default function Contact() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#4B6343] to-[#AAD977] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
           <FiMail className="w-12 h-12 rounded-full text-[#88BC46]" />
            <h1 className="text-4xl font-bold">Contact Us</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            Have questions? Reach out to the Codeblooded team!
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BC46] focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BC46] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#88BC46] focus:border-transparent"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#88BC46] text-white font-medium rounded-lg hover:bg-[#6A9E36] transition-colors"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 p-8 rounded-xl border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Other Ways to Connect
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#88BC46]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Email</h4>
                  <a
                    href="mailto:codeblooded.capstone@gmail.com"
                    className="text-gray-600 hover:text-[#88BC46] transition-colors"
                  >
                    codeblooded.capstone@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#88BC46]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">GitHub</h4>
                  <a
                    href="https://github.com/COS301-SE-2025/Gamified-Financial-Visualizer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#88BC46] transition-colors"
                  >
                    github.com/COS301-SE-2025/Gamified-Financial-Visualizer
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#88BC46]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Social Media</h4>
                  <div className="flex gap-4 mt-2">
                    <a
                      href="https://www.instagram.com/__codeblooded__/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#88BC46] transition-colors"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}