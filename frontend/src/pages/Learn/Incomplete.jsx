import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LearnLayout from '../../pages/Learn/LearnLayout';
import CourseCard from '../../components/cards/CoursesCard';
import banner1 from '../../assets/Images/banners/pixelAllyway.jpeg';
import banner2 from '../../assets/Images/banners/pixelApartment.gif';
import banner3 from '../../assets/Images/banners/pixelBalcony.gif';
import banner4 from '../../assets/Images/banners/pixelCafe.gif';
import banner5 from '../../assets/Images/banners/pixelCornerStore.gif';
import banner6 from '../../assets/Images/banners/pixelGirl.gif';
import { FaFilter, FaSearch, FaClock } from 'react-icons/fa';

const bannerImages = { 
  1: banner1,
  2: banner2,
  3: banner3,
  4: banner4,
  5: banner5,
  6: banner6
};

const LearningIncompletePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [modulesData, setModulesData] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Extract unique topics from modules data
  const uniqueTopics = [...new Set(modulesData.map(module => module.topic))];

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/learning/uncompleted/${user.id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setModulesData(data.data);
        setFilteredModules(data.data);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [user.id]);

  useEffect(() => {
    const filtered = modulesData.filter(module => {
      const matchesSearch = module.module_title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
      const matchesTopic = topicFilter === 'all' || module.topic === topicFilter;
      return matchesSearch && matchesDifficulty && matchesTopic;
    });
    setFilteredModules(filtered);
  }, [searchTerm, difficultyFilter, topicFilter, modulesData]);

  if (isLoading) {
    return (
      <LearnLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5FBFFF]"></div>
        </div>
      </LearnLayout>
    );
  }

  if (error) {
    return (
      <LearnLayout>
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-red-50 border-l-4 border-[#FF8A8A] p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#FF8A8A]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[#FF8A8A]">Error loading incomplete courses</h3>
                <div className="mt-2 text-sm text-[#FF8A8A]">
                  <p>{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF8A8A] hover:bg-[#FF6B6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A8A]"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </LearnLayout>
    );
  }

  return (
    <LearnLayout>
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Incomplete Courses</h1>
            <p className="text-gray-600">Continue learning where you left off</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#5FBFFF20] text-[#5FBFFF]">
              <FaClock className="mr-1" /> {filteredModules.length} In Progress
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search section */}
            <div className="flex items-center w-full px-4 py-2 border border-[#5FBFFF] rounded-full bg-white shadow-sm">
              <FaSearch className="text-[#5FBFFF] mr-2" />
              <input
                type="text"
                placeholder="Search your incomplete courses..."
                className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#5FBFFF] rounded-lg shadow-sm hover:bg-[#5FBFFF10] transition-colors"
            >
              <FaFilter className="text-[#5FBFFF]" />
              <span className="text-[#5FBFFF]">Filters</span>
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
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDifficultyFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'all' ? 'bg-[#5FBFFF] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      All Levels
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('beginner')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'beginner' ? 'bg-[#7FDD53] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('intermediate')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'intermediate' ? 'bg-[#FFC541] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Intermediate
                    </button>
                    <button
                      onClick={() => setDifficultyFilter('advanced')}
                      className={`px-3 py-1 rounded-full text-sm ${difficultyFilter === 'advanced' ? 'bg-[#F68D2B] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Advanced
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5FBFFF] focus:border-transparent rounded-lg"
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

        {/* Courses Grid */}
        {filteredModules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                completed={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center bg-[#5FBFFF20] rounded-full mb-4">
              <FaSearch className="text-[#5FBFFF] text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm ? 
                `No incomplete courses match your search for "${searchTerm}". Try adjusting your filters.` : 
                "All your courses are completed! Great job!"}
            </p>
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default LearningIncompletePage;