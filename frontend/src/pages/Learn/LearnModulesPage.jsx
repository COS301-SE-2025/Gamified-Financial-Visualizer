import React from 'react';
import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CourseCard'; // adjust path

const allCourses = [
  { title: 'Budget', lessons: 22, progress: 65, image: '/images/budget.jpg' },
  { title: 'Investment', lessons: 10, progress: 78, image: '/images/investment.jpg' },
  { title: 'Savings', lessons: 22, progress: 50, image: '/images/savings.jpg' },
  { title: 'Budget', lessons: 22, progress: 89, image: '/images/budget.jpg' },
  { title: 'Investment', lessons: 10, image: '/images/investment.jpg' },
  { title: 'Savings', lessons: 22, image: '/images/savings.jpg' },
];

const LearningPage = () => {
  return (
    <LearnLayout>
      <h2 className="text-lg font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6">
        All Courses
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allCourses.map((course, i) => (
          <CourseCard key={i} {...course} />
        ))}
      </div>
    </LearnLayout>
  );
};

export default LearningPage;
