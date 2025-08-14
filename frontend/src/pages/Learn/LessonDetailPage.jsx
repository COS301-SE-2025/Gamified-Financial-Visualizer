import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaTrophy} from 'react-icons/fa';
import LearnLayout from './LearnLayout';

const colorMap = {
  green: {
    border: 'border-l-[#88BC46]',
    text: 'text-[#88BC46]',
    bg: 'bg-[#88BC46]',
    ring: 'ring-[#88BC46]'
  },
  blue: {
    border: 'border-l-[#5FBFFF]',
    text: 'text-[#5FBFFF]',
    bg: 'bg-[#5FBFFF]',
    ring: 'ring-[#5FBFFF]'
  },
  purple: {
    border: 'border-l-[#a78bfa]',
    text: 'text-[#8b5cf6]',
    bg: 'bg-[#8b5cf6]',
    ring: 'ring-[#8b5cf6]'
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch module details
        const moduleResponse = await fetch(`http://localhost:5000/api/learning/${moduleId}`);
        if (!moduleResponse.ok) throw new Error('Failed to load module');
        const moduleData = await moduleResponse.json();
        setModuleTitle(moduleData.data.module_title);
        
        // Fetch lessons
        const lessonsResponse = await fetch(`http://localhost:5000/api/learning/${moduleId}/lessons`);
        if (!lessonsResponse.ok) throw new Error('Failed to load lessons');
        const lessonsData = await lessonsResponse.json();
        
        // Fetch quiz
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
        
        setQuizData(quizData.data[0]); // Assuming the API returns an array with one quiz
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

  // Submit quiz answers to backend
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
        attempt_score : score
      })
    });
  } catch (err) {
    // Optionally handle error
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
    const totalLessons = lessons.length + (quizData ? 1 : 0); // Count quiz as a lesson
    const completed = readLessons.length + (quizSubmitted ? 1 : 0);
    return totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  };

  const renderLessonContent = (lesson) => {
    return (
      <div className="mt-4 space-y-4">
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {lesson.content}
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <button 
            onClick={() => toggleExpand(lesson.id)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </LearnLayout>
    );
  }

  return (
    <LearnLayout>
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center animate-bounce-in">
            <div className="bg-[#fef9c3] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-[#eab308] text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h3>
            <p className="text-gray-600 mb-4">
              You've completed the {moduleTitle} module with a score of {quizScore}/{quizData?.max_score} on the quiz!
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowCompletion(false)}
                className="px-4 py-2 bg-[#8b5cf6] text-white rounded-full hover:bg-[#7c3aed]"
              >
                Continue Learning
              </button>
              <button
                onClick={() => navigate('/learn')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#0ea5e9] bg-[#e0f2fe] inline-block px-4 py-1 rounded-full mb-6">
            {moduleTitle || 'Module Lessons'}
          </h2>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-[#AAD977] text-white text-sm rounded-full shadow hover:from-green-500"
          >
            Back to Courses
          </button>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className="bg-[#22c55e] h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {readLessons.length + (quizSubmitted ? 1 : 0)} of {lessons.length + (quizData ? 1 : 0)} items completed
          </span>
        </div>

        <div className="space-y-4 mb-8">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white shadow-md rounded-xl overflow-hidden border-l-4 ${colorMap[lesson.color].border} transition-all duration-200 ${
                expandedId === lesson.id ? `ring-2 ring-opacity-50 ${colorMap[lesson.color].ring}` : ''
              }`}
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleExpand(lesson.id)}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3`}
                    style={{ backgroundColor: `${colorMap[lesson.color].bg.replace('bg-[', '').replace(']', '')}80` }}
                  >
                    <span className={`text-xs font-bold ${colorMap[lesson.color].text}`}>
                      {lesson.id}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-md ${colorMap[lesson.color].text}`}>
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {lesson.estimated_duration} min • Click to expand
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {readLessons.includes(lesson.id) && (
                    <FaCheckCircle className="text-[#22c55e]" />
                  )}
                  {expandedId === lesson.id ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>
              {expandedId === lesson.id && (
                <div className="p-4 pt-0">
                  {renderLessonContent(lesson)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        {quizData && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Module Quiz
            </h3>
            
            <div className={`bg-white shadow-md rounded-xl overflow-hidden border-l-4 ${colorMap.purple.border} ${expandedId === 'quiz' ? `ring-2 ring-opacity-50 ${colorMap.purple.ring}` : ''}`}>
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setExpandedId(prev => prev === 'quiz' ? null : 'quiz')}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${colorMap.purple.bg} bg-opacity-50`}>
                    <span className={`text-xs font-bold ${colorMap.purple.text}`}>
                      Q
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-md ${colorMap.purple.text}`}>
                      Test Your Knowledge
                    </h3>
                    <p className="text-xs text-gray-500">
                      {quizData.questions_jsonb.length} questions • Pass score: {quizData.pass_score}/{quizData.max_score}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {quizSubmitted && (
                    <span className={`text-sm font-medium ${quizScore >= quizData.pass_score ? 'text-green-600' : 'text-red-600'}`}>
                      {quizScore}/{quizData.max_score}
                    </span>
                  )}
                  {expandedId === 'quiz' ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedId === 'quiz' && (
                <div className="p-4 pt-0">
                  {!quizSubmitted ? (
                    <div className="space-y-6">
                      {quizData.questions_jsonb.map((question, qIndex) => (
                        <div key={qIndex} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-3">
                            {question.question} <span className="text-sm text-gray-500">({question.points} point{question.points !== 1 ? 's' : ''})</span>
                          </h4>
                          <div className="space-y-3">
                            {question.options.map((option, oIndex) => (
                              <label key={oIndex} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  checked={quizAnswers[qIndex] === oIndex}
                                  onChange={() => handleQuizAnswer(qIndex, oIndex)}
                                  className="text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length !== quizData.questions_jsonb.length}
                        className={`w-full mt-4 px-6 py-3 rounded-lg font-medium ${
                          Object.keys(quizAnswers).length === quizData.questions_jsonb.length
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-lg text-center">
                      <div className={`text-4xl font-bold mb-2 ${
                        quizScore >= quizData.pass_score ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quizScore}/{quizData.max_score}
                      </div>
                      <div className="text-lg font-medium mb-4">
                        {quizScore >= quizData.pass_score ? (
                          <span className="text-green-600">Congratulations! You passed! 🎉</span>
                        ) : (
                          <span className="text-red-600">Keep practicing! You'll get it next time! 💪</span>
                        )}
                      </div>
                      <div className="mb-6">
                        <p className="text-gray-600">
                          {quizScore >= quizData.pass_score 
                            ? "You've demonstrated a good understanding of this module."
                            : "Review the material and try again to improve your score."}
                        </p>
                      </div>
                      <button
                        onClick={resetQuiz}
                        className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
                      >
                        Retake Quiz
                      </button>
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