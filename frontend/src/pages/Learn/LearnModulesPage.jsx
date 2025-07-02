import React, { useEffect, useState } from 'react';

import { FaSearch} from 'react-icons/fa';

import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CoursesCard';
import banner1 from '../../assets/Images/banners/pixelAllyway.jpeg';
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelBalcony.gif';
import banner4 from '../../assets/Images/banners/pixelCafe.gif';
import banner5 from '../../assets/Images/banners/pixelCornerStore.gif';
import banner6 from '../../assets/Images/banners/pixelGirl.gif';

// Map of banner images to use for courses
const bannerImages = {
  1: banner1,
  2: banner2,
  3: banner3,
  4: banner4,
  5: banner5,
  6: banner6
};

const LearningPage = () => {
  const [modulesData, setModulesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/learning');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setModulesData(data.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (error) {
    return (
      <LearnLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </LearnLayout>
    );
  }

  return (

    <LearnLayout>
      <div className="flex items-center w-full max-w-9xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
        <FaSearch className="text-[#E5794B] mr-2" />
        <input
          type="text"
          placeholder="Search for modules..."
          className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <h2 className="text-lg font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6">
        All Courses
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {modulesData.filter(m => m.module_title.toLowerCase().includes(searchTerm.toLowerCase())).map((module) => (
          <CourseCard
            id={module.module_id}
            title={module.module_title}
            lessons={module.lesson_count} // You might want to fetch actual lesson count from API
            topic={module.topic}
            difficulty={module.difficulty}
            image={bannerImages[module.module_banner_id] || banner1} // Fallback to banner1 if no mapping
            moduleId={module.module_id}
          />
        ))}
      </div>
      {modulesData.filter(m =>
          m.module_title.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <div className="text-center text-gray-500 mt-6 text-sm">
            No matching Goals found.
          </div>
        )}
    </LearnLayout>
  );
};

export default LearningPage;