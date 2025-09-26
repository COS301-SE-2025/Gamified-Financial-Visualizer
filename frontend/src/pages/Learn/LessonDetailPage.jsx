import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaTrophy, FaClock, FaBookOpen } from 'react-icons/fa';
import LearnLayout from './LearnLayout';

const colorMap = {
  green: {
    border: 'border-l-[#7FDD53] dark:border-l-[#5FBFFF]',
    text: 'text-[#7FDD53] dark:text-[#5FBFFF]',
    bg: 'bg-[#7FDD5320] dark:bg-[#5FBFFF20]',
    ring: 'ring-[#7FDD5320] dark:ring-[#5FBFFF20]',
    icon: 'text-[#7FDD53] dark:text-[#5FBFFF]'
  },
  blue: {
    border: 'border-l-[#5FBFFF] dark:border-l-[#7FDD53]',
    text: 'text-[#5FBFFF] dark:text-[#7FDD53]',
    bg: 'bg-[#5FBFFF20] dark:bg-[#7FDD5320]',
    ring: 'ring-[#5FBFFF20] dark:ring-[#7FDD5320]',
    icon: 'text-[#5FBFFF] dark:text-[#7FDD53]'
  },
  purple: {
    border: 'border-l-[#B1E1FF] dark:border-l-[#AAD977]',
    text: 'text-[#B1E1FF] dark:text-[#AAD977]',
    bg: 'bg-[#B1E1FF20] dark:bg-[#AAD97720]',
    ring: 'ring-[#B1E1FF20] dark:ring-[#AAD97720]',
    icon: 'text-[#B1E1FF] dark:text-[#AAD977]'
  }
};

const ModuleLessonsPage = () => {
  const { moduleSlug, moduleId } = useParams();
  const navigate = useNavigate();

  const user = localStorage.getItem('user');
  const userId = user ? JSON.parse(user).id : null;

  const [lessons, setLessons] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [readLessons, setReadLessons] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const moduleResponse = await fetch(`http://localhost:5000/api/learning/${moduleId}`);
        if (!moduleResponse.ok) throw new Error('Failed to load module');
        const moduleData = await moduleResponse.json();
        setModuleTitle(moduleData.data.module_title);
        setModuleDescription(moduleData.data.module_description || 'Boost your financial knowledge with this module');

        const lessonsResponse = await fetch(`http://localhost:5000/api/learning/${moduleId}/lessons`);
        if (!lessonsResponse.ok) throw new Error('Failed to load lessons');
        const lessonsData = await lessonsResponse.json();

        const quizResponse = await fetch(`http://localhost:5000/api/learning/quizzes/${moduleId}`);
        if (!quizResponse.ok) throw new Error('Failed to load quiz');
        const quizData = await quizResponse.json();

        setLessons(lessonsData.data.map((lesson, index) => ({
          id: lesson.lesson_id,
          title: lesson.lesson_title,
          color: index % 2 === 0 ? 'green' : 'blue',
          content: lesson.content,
          estimated_duration: lesson.estimated_duration
        })));

        setQuizData(quizData.data[0]);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [moduleId]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
    setReadLessons(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const submitQuiz = async () => {
    if (!quizData) return;

    let score = 0;
    quizData.questions_jsonb.forEach((question, index) => {
      if (quizAnswers[index] === question.correct_answer) {
        score += question.points;
      }
    });

    try {
      await fetch(`http://localhost:5000/api/learning/quizzes/${moduleId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: quizAnswers,
          userId: userId,
          passed: score >= quizData.pass_score,
          attempt_score: score
        })
      });
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }

    setQuizScore(score);
    setQuizSubmitted(true);

    if (readLessons.length === lessons.length) {
      setShowCompletion(true);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const calculateProgress = () => {
    const totalLessons = lessons.length + (quizData ? 1 : 0);
    const completed = readLessons.length + (quizSubmitted ? 1 : 0);
    return totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  };

  const renderLessonContent = (lesson) => {
    return (
      <div className="mt-4 space-y-4 animate-fadeIn">
        <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base px-1">
          {lesson.content}
        </div>
        
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => toggleExpand(lesson.id)}
            className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center transition-colors"
          >
            Collapse lesson
            <FaChevronUp className="ml-1" />
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <LearnLayout>
        <div className="max-w-6xl mx-auto p-3">
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-[#FF8A8A] dark:border-[#F97156] p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#FF8A8A] dark:text-[#F97156]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[#FF8A8A] dark:text-[#F97156]">Error loading module content</h3>
                <div className="mt-2 text-sm text-[#FF8A8A] dark:text-[#F97156]">
                  <p>{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF8A8A] dark:bg-[#F97156] hover:bg-[#FF6B6B] dark:hover:bg-[#E5794B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8A8A] dark:focus:ring-[#F97156]"
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
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-xs w-full text-center animate-zoomIn mx-2">
            <div className="bg-gradient-to-br from-[#FFC54120] to-[#FFC54110] dark:from-[#FFC54110] dark:to-[#FFC54105] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <FaTrophy className="text-[#FFC541] text-xl" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">Module Complete!</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
              You've successfully completed <span className="font-semibold text-gray-800 dark:text-gray-200">{moduleTitle}</span> with a score of {quizScore}/{quizData?.max_score} on the quiz.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowCompletion(false)}
                className="px-3 py-2 bg-gradient-to-r from-[#5FBFFF] to-[#B1E1FF] dark:from-[#4FAFFF] dark:to-[#A1D1FF] text-white rounded-lg font-medium hover:from-[#4FAFFF] hover:to-[#A1D1FF] dark:hover:from-[#3F9FFF] dark:hover:to-[#91C1FF] transition-all shadow text-xs"
              >
                Continue Learning
              </button>
              <button
                onClick={() => navigate('/learn')}
                className="px-3 py-2 bg-white border border-gray-200 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all dark:text-gray-800 text-xs"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-3 py-4 w-full overflow-x-hidden">
        {/* Module Header */}
        <div className="bg-gradient-to-r from-[#B1E1FF20] to-[#7FDD5320] 
                      dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#334155] 
                      rounded-xl p-3 mb-4 shadow-sm border border-gray-100 dark:border-gray-700/50 w-full">
          <div className="flex flex-col justify-between items-start gap-2 w-full">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-1 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                bg-[#B1E1FF20] dark:bg-[#88D1FF] text-[#065989] dark:text-[#065989]">
                  Module
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-300 flex items-center">
                  <FaClock className="mr-1 text-[#F68D2B]" /> {lessons.reduce((acc, lesson) => acc + lesson.estimated_duration, 0)} min
                </span>
              </div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1 break-words leading-tight">{moduleTitle}</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{moduleDescription}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">Your Progress</h3>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {readLessons.length + (quizSubmitted ? 1 : 0)} of {lessons.length + (quizData ? 1 : 0)} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#5FBFFF] to-[#7FDD53]" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-2 mb-6 w-full">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
            <FaBookOpen className="text-[#B1E1FF] dark:text-[#AAD977] text-sm" />
            Lessons
          </h2>

          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 w-full ${
                colorMap[lesson.color].border
              } ${
                expandedId === lesson.id ? `ring-1 ${colorMap[lesson.color].ring} shadow-md` : ''
              }`}
            >
              <div
                className="flex justify-between items-start p-3 cursor-pointer w-full"
                onClick={() => toggleExpand(lesson.id)}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${colorMap[lesson.color].bg}`}
                  >
                    <span className={`text-sm font-bold ${colorMap[lesson.color].text}`}>
                      {lesson.id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${colorMap[lesson.color].text} leading-tight`}>
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex flex-wrap items-center gap-1">
                      <span className="flex items-center gap-0.5 whitespace-nowrap">
                        <FaClock className="text-[10px]" />
                        {lesson.estimated_duration} min
                      </span>
                      {readLessons.includes(lesson.id) && (
                        <span className="inline-flex items-center gap-0.5 text-[#7FDD53] dark:text-[#5FBFFF] whitespace-nowrap">
                          <FaCheckCircle className="text-[10px]" />
                          Completed
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="ml-1 flex-shrink-0 mt-0.5">
                  {expandedId === lesson.id ? (
                    <FaChevronUp className="text-gray-400 text-xs" />
                  ) : (
                    <FaChevronDown className="text-gray-400 text-xs" />
                  )}
                </div>
              </div>
              {expandedId === lesson.id && (
                <div className="px-3 pb-3">
                  {renderLessonContent(lesson)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        {quizData && (
          <div className="mt-4 w-full">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#B1E1FF] dark:text-[#AAD977]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Module Quiz
            </h2>
            
            <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 w-full ${
              colorMap.purple.border
            } ${
              expandedId === 'quiz' ? `ring-1 ${colorMap.purple.ring} shadow-md` : ''
            }`}>
              <div
                className="flex justify-between items-start p-3 cursor-pointer w-full"
                onClick={() => setExpandedId(prev => prev === 'quiz' ? null : 'quiz')}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${colorMap.purple.bg}`}>
                    <span className={`text-sm font-bold ${colorMap.purple.text}`}>
                      Q
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm truncate ${colorMap.purple.text} leading-tight`}>
                      Knowledge Check
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {quizData.questions_jsonb.length} questions • Pass: {quizData.pass_score}/{quizData.max_score}
                      {quizSubmitted && (
                        <span className={`ml-1 font-medium ${quizScore >= quizData.pass_score ? 'text-[#7FDD53] dark:text-[#5FBFFF]' : 'text-[#FF8A8A] dark:text-[#F97156]'}`}>
                          Your score: {quizScore}/{quizData.max_score}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="ml-1 flex-shrink-0 mt-0.5">
                  {expandedId === 'quiz' ? (
                    <FaChevronUp className="text-gray-400 text-xs" />
                  ) : (
                    <FaChevronDown className="text-gray-400 text-xs" />
                  )}
                </div>
              </div>

              {expandedId === 'quiz' && (
                <div className="px-3 pb-3">
                  {!quizSubmitted ? (
                    <div className="space-y-3">
                      {quizData.questions_jsonb.map((question, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-100 dark:border-gray-600">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1 text-xs">
                            <span className="text-gray-500 dark:text-gray-400 mr-1">Q{qIndex + 1}:</span>
                            {question.question} 
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-0.5">({question.points} point{question.points !== 1 ? 's' : ''})</span>
                          </h4>
                          <div className="space-y-1">
                            {question.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className="flex items-center space-x-2 cursor-pointer group p-1 rounded hover:bg-gray-100 transition-colors"
                                onClick={() => handleQuizAnswer(qIndex, oIndex)}
                              >
                                <div className={`flex-shrink-0 w-3 h-3 rounded-full border flex items-center justify-center ${quizAnswers[qIndex] === oIndex
                                  ? 'border-[#5FBFFF] bg-[#5FBFFF]'
                                  : 'border-gray-300'
                                  }`}>
                                  {quizAnswers[qIndex] === oIndex && (
                                    <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-800"></div>
                                  )}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors break-words flex-1 leading-tight">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length !== quizData.questions_jsonb.length}
                        className={`w-full mt-3 px-3 py-2 rounded font-medium text-sm transition-all ${Object.keys(quizAnswers).length === quizData.questions_jsonb.length
                            ? 'bg-[#5FBFFF] dark:from-[#4FAFFF] dark:to-[#A1D1FF] text-white hover:bg-[#4FAFFF] dark:hover:from-[#3F9FFF] dark:hover:to-[#91C1FF] shadow'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        Submit Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700 text-center">
                      <div className={`text-2xl font-bold mb-1 ${
                        quizScore >= quizData.pass_score ? 'text-[#7FDD53] dark:text-[#5FBFFF]' : 'text-[#FF8A8A] dark:text-[#F97156]'
                      }`}>
                        {quizScore}/{quizData.max_score}
                      </div>
                      <div className="text-sm font-medium mb-2">
                        {quizScore >= quizData.pass_score ? (
                          <span className="text-[#7FDD53] dark:text-[#5FBFFF] text-xs">Congratulations! You passed! 🎉</span>
                        ) : (
                          <span className="text-[#FF8A8A] dark:text-[#F97156] text-xs">Keep practicing! You'll get it next time! 💪</span>
                        )}
                      </div>
                      <div className="mb-3 text-gray-600 dark:text-gray-400 text-xs">
                        <p>
                          {quizScore >= quizData.pass_score
                            ? "You've demonstrated a good understanding of this module's concepts."
                            : "Review the material and try again to improve your score."}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <button
                          onClick={resetQuiz}
                          className="px-3 py-1 bg-[#B1E1FF20] dark:bg-[#AAD97720] text-[#5FBFFF] dark:text-[#7FDD53] rounded font-medium hover:bg-[#B1E1FF30] dark:hover:bg-[#AAD97730] transition-colors text-xs"
                        >
                          Retake Quiz
                        </button>
                        <button
                          onClick={() => navigate('/learn')}
                          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-xs"
                        >
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </LearnLayout>
  );
};

export default ModuleLessonsPage;