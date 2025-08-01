import React, { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

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

  const filteredModules = modulesData.filter(module => {
    const matchesSearch = module.module_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
    const matchesTopic = topicFilter === 'all' || module.topic === topicFilter;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  // Extract unique topics for filter
  const uniqueTopics = [...new Set(modulesData.map(module => module.topic))];

  if (error) {
    return (
      <LearnLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <div className="flex items-center">
              <div className="py-1">
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold">Error loading courses</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </LearnLayout>
    );
  }

  return (
    <LearnLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">All Courses</h1>
            <p className="text-gray-600">Find all and complete all your modules</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* search section */}
            <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white shadow-sm">
              <FaSearch className="text-[#76B947] mr-2" />
              <input
                type="text"
                placeholder="Search your modules..."
                className="w-full outline-none bg-transparent text-sm text-[#76B947] placeholder-[#76B947]/70"
              />
            </div>
            {/* fiter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-[#76B947] rounded-lg shadow-sm hover:bg-lime-100 transition-colors"
            >
              <FaFilter className="text-[#76B947]" />
              <span className="text-[#76B947]">Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  {/* filter levels  */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDifficultyFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'all' ? 'bg-[#AAD977] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      All Levels
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('beginner')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'beginner' ? 'bg-[#B1E1FF] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('intermediate')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'intermediate' ? 'bg-[#FFD18C] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Intermediate
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('advanced')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'advanced' ? 'bg-[#FE9B90] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#AAD977] focus:border-transparent rounded-lg"
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                  >
                    <option value="all">All Topics</option>
                    {uniqueTopics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Courses Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredModules.length} {filteredModules.length === 1 ? 'Course' : 'Courses'} Available
          </h2>
          {searchTerm && (
            <p className="text-gray-600">
              Results for: <span className="font-semibold">"{searchTerm}"</span>
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-[#E5794B] rounded-full mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No courses found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setDifficultyFilter('all');
                setTopicFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-[#E5794B] text-white rounded-lg hover:bg-[#d46b3f] transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredModules.map((module) => (
              <CourseCard
                key={module.module_id}
                id={module.module_id}
                title={module.module_title}
                lessons={module.lesson_count}
                topic={module.topic}
                difficulty={module.difficulty}
                image={bannerImages[module.module_banner_id] || banner1}
                moduleId={module.module_id}
              />
            ))}
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default LearningPage;