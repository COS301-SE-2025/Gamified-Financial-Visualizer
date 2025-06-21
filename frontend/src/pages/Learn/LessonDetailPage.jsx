import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaTrophy } from 'react-icons/fa';
import LearnLayout from './LearnLayout';

const mockModules = {
  budget: [
    { 
      id: 1, 
      title: 'Introduction to Budgeting', 
      color: 'green', 
      content: 'A budget helps you track income vs expenses. It gives you control over your finances, reduces stress, and ensures you live within your means.',
    },
    { 
      id: 2, 
      title: 'Why Budget?', 
      color: 'pink', 
      content: 'Budgeting is the foundation of financial wellness. It allows you to plan for expenses, save for the future, and avoid debt.',
      infographic: '/path/to/infographic.png'
    },
    { 
      id: 3, 
      title: 'The 50/30/20 Rule', 
      color: 'orange', 
      content: 'This rule divides your income: 50% for needs, 30% for wants, 20% for savings and debt repayments. It\'s a simple way to manage money.',
      example: 'For a $3000 monthly income: $1500 needs, $900 wants, $600 savings/debt'
    },
    { 
      id: 4, 
      title: 'Creating Your First Budget', 
      color: 'blue', 
      content: 'Start by listing income, tracking expenses, and setting realistic spending limits per category. Use tools like spreadsheets or budgeting apps.',
      checklist: [
        'Track all income sources',
        'List fixed expenses (rent, utilities)',
        'Estimate variable expenses (food, entertainment)',
        'Set savings goals',
        'Review and adjust monthly'
      ]
    },
    { 
      id: 5, 
      title: 'Budgeting Quiz', 
      color: 'purple', 
      isQuiz: true,
      questions: [
        {
          id: 1,
          question: 'What is the primary purpose of a budget?',
          options: [
            'To restrict your spending',
            'To track income and expenses',
            'To impress your friends',
            'To make more money'
          ],
          correctAnswer: 1
        },
        {
          id: 2,
          question: 'In the 50/30/20 rule, what does the 20% represent?',
          options: [
            'Entertainment expenses',
            'Savings and debt repayment',
            'Housing costs',
            'Taxes'
          ],
          correctAnswer: 1
        },
        {
          id: 3,
          question: 'Which of these is NOT a benefit of budgeting?',
          options: [
            'Reduced financial stress',
            'Better control over finances',
            'Guaranteed wealth increase',
            'Clear spending priorities'
          ],
          correctAnswer: 2
        },
        {
          id: 4,
          question: 'How often should you review your budget?',
          options: [
            'Once a year',
            'Only when you have money problems',
            'Monthly or when income/expenses change',
            'Never - set it and forget it'
          ],
          correctAnswer: 2
        }
      ]
    }
  ]
};

const colorMap = {
  green: {
    border: 'border-l-[#88BC46]',
    text: 'text-[#88BC46]',
    bg: 'bg-[#88BC46]',
    ring: 'ring-[#88BC46]'
  },
  pink: {
    border: 'border-l-[#EA746A]',
    text: 'text-[#EA746A]',
    bg: 'bg-[]',
    ring: 'ring-[#EA746A]'
  },
  orange: {
    border: 'border-l-[#FBBF1A]',
    text: 'text-[#FBBF1A]',
    bg: 'bg-[]',
    ring: 'ring-[#FBBF1A]'
  },
  blue: {
    border: 'border-l-[#5FBFFF]',
    text: 'text-[#5FBFFF]',
    bg: 'bg-[]',
    ring: 'ring-[#5FBFFF]'
  },
  purple: {
    border: 'border-l-[#a78bfa]',
    text: 'text-[#8b5cf6]',
    bg: 'bg-[]',
    ring: 'ring-[#8b5cf6]'
  }
};

const ModuleLessonsPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const lessons = mockModules[moduleId] || [];
  const [expandedId, setExpandedId] = useState(null);
  const [readLessons, setReadLessons] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
    setReadLessons(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = (quizLesson) => {
    let score = 0;
    quizLesson.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (readLessons.length === lessons.length - 1) {
      setShowCompletion(true);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const calculateProgress = () => {
    return Math.round((readLessons.length / lessons.length) * 100);
  };

  const renderLessonContent = (lesson) => {
    if (lesson.isQuiz) {
      return (
        <div className="mt-4">
          {!quizSubmitted ? (
            <div className="space-y-4">
              {lesson.questions.map((q) => (
                <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-2">{q.question}</h4>
                  <div className="space-y-2">
                    {q.options.map((option, idx) => (
                      <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={quizAnswers[q.id] === idx}
                          onChange={() => handleQuizAnswer(q.id, idx)}
                          className="text-[#8b5cf6] focus:ring-[#8b5cf6]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => submitQuiz(lesson)}
                disabled={Object.keys(quizAnswers).length !== lesson.questions.length}
                className={`mt-4 px-4 py-2 rounded-full font-medium ${
                  Object.keys(quizAnswers).length === lesson.questions.length
                    ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-[#8b5cf6] mb-2">
                {quizScore}/{lesson.questions.length}
              </div>
              <div className="text-lg font-medium mb-4">
                {quizScore === lesson.questions.length ? 'Perfect! 🎉' : 
                 quizScore >= lesson.questions.length / 2 ? 'Good job! 👍' : 'Keep practicing! 💪'}
              </div>
              {quizScore !== lesson.questions.length && (
                <button
                  onClick={resetQuiz}
                  className="mt-2 px-4 py-2 bg-[#f5f3ff] text-[#8b5cf6] rounded-full font-medium hover:bg-[#ede9fe]"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-4">
        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {lesson.content}
        </div>
        
        {lesson.video && (
          <div className="mt-4 aspect-w-16 aspect-h-9">
            <iframe 
              src={lesson.video} 
              title={lesson.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-64 rounded-lg"
            ></iframe>
          </div>
        )}
        
        {lesson.infographic && (
          <div className="mt-4">
            <img 
              src={lesson.infographic} 
              alt={lesson.title} 
              className="w-full rounded-lg border border-gray-200"
            />
          </div>
        )}
        
        {lesson.example && (
          <div className="mt-4 p-4 bg-[#fef9c3] border-l-4 border-[#facc15] rounded-r">
            <h4 className="font-medium text-[#b45309]">Example</h4>
            <p className="text-[#b45309]">{lesson.example}</p>
          </div>
        )}
        
        {lesson.checklist && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Action Items:</h4>
            <ul className="space-y-2">
              {lesson.checklist.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-5 h-5 mr-2 mt-0.5 border border-gray-300 rounded-full flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
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
              You've completed the {moduleId} module with a {quizScore}/{lessons.find(l => l.isQuiz)?.questions.length} on the quiz!
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
            {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} Lessons
          </h2>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-[#AAD977] text-white text-sm rounded-full shadow hover:from-green-500 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
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
            {readLessons.length} of {lessons.length} lessons completed
          </span>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white shadow-md rounded-xl overflow-hidden border-l-4 ${colorMap[lesson.color].border} ${colorMap[lesson.color].bg} transition-all duration-200 ${
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
                      {lesson.isQuiz ? 'Test your knowledge' : 'Click to expand'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {readLessons.includes(lesson.id) && !lesson.isQuiz && (
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
      </div>
    </LearnLayout>
  );
};

export default ModuleLessonsPage;