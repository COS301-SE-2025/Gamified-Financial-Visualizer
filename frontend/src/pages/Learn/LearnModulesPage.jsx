import React from 'react';
import { FaSearch } from 'react-icons/fa';
import XPProgressRing from '../../components/cards/XPProgressRing';
import BadgeRow from '../../components/cards/BadgeRow';

const courses = {
  active: [
    { title: 'Budget', duration: '22 mins', progress: '50%', image: '/images/budget.jpg' },
    { title: 'Investment', duration: '18 mins', progress: '67%', image: '/images/investment.jpg' },
    { title: 'Savings', duration: '24 mins', progress: '90%', image: '/images/savings.jpg' },
  ],
  upcoming: [
    { title: 'Investment', duration: '32 mins', image: '/images/investment.jpg' },
    { title: 'Savings', duration: '20 mins', image: '/images/savings.jpg' },
    { title: 'Budget', duration: '25 mins', image: '/images/budget.jpg' },
  ],
};

const CourseCard = ({ title, duration, progress, image }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden w-48">
    <img src={image} alt={title} className="w-full h-24 object-cover" />
    <div className="p-3">
      <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      <p className="text-xs text-gray-500">{duration}</p>
      {progress && (
        <p className="text-xs font-semibold text-green-600">{progress} complete</p>
      )}
    </div>
  </div>
);

const LearningPage = () => {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="w-1/5 p-4 space-y-6">
        {/* Profile Summary */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="flex flex-col items-center">
            <img
              src="/images/avatar.png"
              alt="avatar"
              className="w-16 h-16 rounded-full mb-2"
            />
            <p className="font-semibold text-sm">satoshi_nak</p>
            <p className="text-xs text-gray-400">Silver</p>
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Overall Performance</h4>
            <XPProgressRing value={350} level="Lv 3 Silver" />
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-4 shadow">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Badges</h4>
          <BadgeRow />
        </div>

        {/* Progress Placeholder */}
        <div className="bg-white rounded-2xl p-4 shadow h-32">
          <h4 className="text-sm font-semibold text-gray-700">Progress</h4>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none text-sm"
          />
        </div>

        {/* Active Courses */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Active Courses</h2>
          <div className="flex gap-4 overflow-x-auto">
            {courses.active.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </section>

        {/* Upcoming Courses */}
        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Upcoming Courses</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.upcoming.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LearningPage;
