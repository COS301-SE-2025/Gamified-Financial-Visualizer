import React , {useState, useEffect}from 'react';
import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CoursesCard';
import banner1 from '../../assets/Images/banners/pixelAllyway.jpeg'
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelBalcony.gif';
import banner4 from '../../assets/Images/banners/pixelCafe.gif';
import banner5 from '../../assets/Images/banners/pixelCornerStore.gif';
import banner6 from '../../assets/Images/banners/pixelGirl.gif';


const bannerImages = {
  1: banner1,
  2: banner2,
  3: banner3,
  4: banner4,
  5: banner5,
  6: banner6
};
const LearningCompletePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [modulesData, setModulesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/learning/completed/${user.id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setModulesData(data.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError(error.message);
      }
    };

    fetchModules();
  }, []);

  return (
    <LearnLayout>
      <h2 className="text-lg font-semibold text-sky-500 bg-sky-100 inline-block px-4 py-1 rounded-full mb-6">
        Completed Courses
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {modulesData.map((module) => (
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
    </LearnLayout>
  );
};

export default LearningCompletePage;
