import React from 'react';
import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CoursesCard'; 
import banner1 from '../../assets/Images/banners/pixelAllyway.jpeg'
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelBalcony.gif';
import banner4 from '../../assets/Images/banners/pixelCafe.gif';
import banner5 from '../../assets/Images/banners/pixelCornerStore.gif';
import banner6 from '../../assets/Images/banners/pixelGirl.gif';

const allCourses = [
  { title: 'Budget', lessons: 22, progress: 65, image: banner1 },
  { title: 'Investment', lessons: 10, progress: 78, image: banner2 },
  { title: 'Savings', lessons: 22, progress: 50, image: banner3 },
  { title: 'Budget', lessons: 22, progress: 89, image: banner4},
  { title: 'Investment', lessons: 10, image: banner5 },
  { title: 'Savings', lessons: 22, image: banner6},
];

const LearningIncompletePage = () => {
  return (
    <LearnLayout>
      <h2 className="text-lg font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6">
        Incomplete Courses
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allCourses.map((course, i) => (
          <CourseCard key={i} {...course} />
        ))}
      </div>
    </LearnLayout>
  );
};

export default LearningIncompletePage;
