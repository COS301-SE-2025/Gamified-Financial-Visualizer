import React, { useState } from 'react'; 
import AccountsLayout from './AccountsLayout';
import { 
  FaChartBar, 
  FaUsers, 
  FaTrophy, 
  FaPiggyBank, 
  FaRunning,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaRobot,        
  FaPaperPlane,   
  FaLightbulb   
} from 'react-icons/fa';

const InsightsPage = () => {

   const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const getAiAnalysis = async (userPrompt) => {
  setIsLoading(true);
    
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      default: "Based on your spending patterns, you could save 15% more by reducing dining out expenses and optimizing your grocery budget.",
      savings: "Your savings rate is 18%, which is good but could improve. Consider automating R500 more per month to reach your goals faster.",
      investments: "Your portfolio lacks diversification. 78% is in equities - consider adding 20% bonds and 2% crypto for better risk balance.",
      debt: "Your credit card utilization is 45%. Aim for under 30% to improve your credit score. Focus on paying down the card with 19.5% APR first."
    };

    let response = responses.default;
    if (userPrompt.toLowerCase().includes('savings')) response = responses.savings;
    if (userPrompt.toLowerCase().includes('invest')) response = responses.investments;
    if (userPrompt.toLowerCase().includes('debt')) response = responses.debt;

    setAiResponse({
      prompt: userPrompt,
      analysis: response,
      actionItems: [
        "Set up auto-transfer of R500 to savings",
        "Review dining expenses from last month",
        "Schedule a portfolio review next week"
      ],
      generatedAt: new Date().toLocaleString()
    });
    setIsLoading(false);
  };



  // Comparative Analysis Data
  const comparisonData = {
    categorySpending: [
      { category: 'Groceries', userSpent: 2100, avgSpent: 1600, status: 'higher' },
      { category: 'Entertainment', userSpent: 1200, avgSpent: 850, status: 'higher' },
      { category: 'Transport', userSpent: 400, avgSpent: 600, status: 'lower' },
      { category: 'Dining', userSpent: 800, avgSpent: 750, status: 'higher' },
      { category: 'Utilities', userSpent: 1200, avgSpent: 1250, status: 'lower' }
    ],
    monthlySpending: {
      user: 8500,
      allUsers: 9200,
      ageGroup: 8100,
      incomeBracket: 8800
    },
    aiScore: {
      user: 74,
      allUsers: 68,
      ageGroup: 62
    },
    savingsRate: {
      user: 15,
      average: 10,
      topPercentile: 25
    },
    goalProgress: [
      { goal: 'Emergency Fund', userMonths: 2, avgMonths: 3.5 },
      { goal: 'Vacation', userMonths: 4, avgMonths: 6 }
    ],
    leaderboards: {
      entertainment: { percentile: 72, direction: 'less' },
      savings: { percentile: 65, direction: 'more' },
      quizScore: { percentile: 20, direction: 'top' }
    }
  };

  // Determine comparison status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'higher': return <FaArrowUp className="text-red-500" />;
      case 'lower': return <FaArrowDown className="text-green-500" />;
      default: return <FaCheckCircle className="text-gray-500" />;
    }
  };

  return (
    <AccountsLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        
         {/* AI Insights Section */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <FaRobot size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">AI Financial Advisor</h2>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Ask for specific analysis:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. 'How can I improve my savings rate?'"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => getAiAnalysis(prompt)}
                disabled={!prompt.trim() || isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-purple-700 transition"
              >
                {isLoading ? 'Analyzing...' : (
                  <>
                    <FaPaperPlane /> Analyze
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "Review my debt strategy" or "Investment suggestions"
            </p>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" /> Analysis for: "{aiResponse.prompt}"
                </h3>
                <span className="text-xs text-gray-500">{aiResponse.generatedAt}</span>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800">{aiResponse.analysis}</p>
              </div>
              
              <h4 className="font-medium text-gray-800 mb-2">Recommended Actions:</h4>
              <ul className="space-y-2">
                {aiResponse.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Predefined Quick Prompts */}
          {!aiResponse && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick analysis prompts:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Optimize my budget",
                  "Debt payoff strategy",
                  "Investment review",
                  "Savings potential"
                ].map((quickPrompt) => (
                  <button
                    key={quickPrompt}
                    onClick={() => {
                      setPrompt(quickPrompt);
                      getAiAnalysis(quickPrompt);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm transition"
                  >
                    {quickPrompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Spending Comparison */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <FaChartBar size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Category Spending</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2">Category</th>
                    <th className="pb-2 text-right">You</th>
                    <th className="pb-2 text-right">Average</th>
                    <th className="pb-2 text-right">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comparisonData.categorySpending.map((item, index) => (
                    <tr key={index} className={item.status === 'higher' ? 'bg-red-50' : ''}>
                      <td className="py-3 font-medium">{item.category}</td>
                      <td className="py-3 text-right">R{item.userSpent.toLocaleString()}</td>
                      <td className="py-3 text-right">R{item.avgSpent.toLocaleString()}</td>
                      <td className="py-3 text-right flex items-center justify-end gap-1">
                        {getStatusIcon(item.status)}
                        {item.status === 'higher' ? (
                          <span className="text-red-600">
                            +R{(item.userSpent - item.avgSpent).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-green-600">
                            -R{(item.avgSpent - item.userSpent).toLocaleString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              💡 You're spending less than average in {comparisonData.categorySpending.filter(x => x.status === 'lower').length} categories
            </p>
          </div>

          {/* Monthly Spending Comparison */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                <FaUsers size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Monthly Spending</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Your Spending</span>
                <span className="font-bold">R{comparisonData.monthlySpending.user.toLocaleString()}</span>
              </div>
              
              <div className="bg-gray-100 rounded-full h-8 relative">
                <div 
                  className="absolute bg-purple-500 rounded-full h-8 flex items-center justify-end pr-2 text-white text-sm"
                  style={{ 
                    width: `${(comparisonData.monthlySpending.user / comparisonData.monthlySpending.allUsers) * 100}%`,
                    maxWidth: '100%'
                  }}
                >
                  You
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">All Users</p>
                  <p className="font-medium">R{comparisonData.monthlySpending.allUsers.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Your Age</p>
                  <p className="font-medium">R{comparisonData.monthlySpending.ageGroup.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-xs text-gray-500">Income Group</p>
                  <p className="font-medium">R{comparisonData.monthlySpending.incomeBracket.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Score & Savings Rate */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg text-green-600">
                <FaTrophy size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Financial Health Score</h2>
            </div>
            
            <div className="flex items-center justify-between bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg mb-4">
              <div>
                <p className="text-sm text-gray-600">Your AI Score</p>
                <p className="text-3xl font-bold text-green-700">{comparisonData.aiScore.user}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Average: {comparisonData.aiScore.allUsers}</p>
                <p className="text-sm">Age Group: {comparisonData.aiScore.ageGroup}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">Savings Rate Comparison</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>You</span>
                      <span>{comparisonData.savingsRate.user}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${comparisonData.savingsRate.user}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average</span>
                      <span>{comparisonData.savingsRate.average}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${comparisonData.savingsRate.average}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  🎉 You're saving better than {comparisonData.savingsRate.user - comparisonData.savingsRate.average}% more than average!
                </p>
              </div>
            </div>
          </div>

          {/* Goal Progress & Leaderboards */}
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                <FaRunning size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Goal Achievement</h2>
            </div>
            
            <div className="space-y-4">
              {comparisonData.goalProgress.map((goal, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <p className="font-medium">{goal.goal}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">You</p>
                      <p className="font-bold">{goal.userMonths} months</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Average</p>
                      <p className="font-medium">{goal.avgMonths} months</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Difference</p>
                      <p className="font-bold text-green-600">
                        -{goal.avgMonths - goal.userMonths} months
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-medium mb-3">Your Leaderboard Positions</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Entertainment</p>
                  <p className="font-medium">
                    You spend {comparisonData.leaderboards.entertainment.direction} than {comparisonData.leaderboards.entertainment.percentile}%
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Savings</p>
                  <p className="font-medium">
                    Saving {comparisonData.leaderboards.savings.direction} than {comparisonData.leaderboards.savings.percentile}%
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Financial Knowledge</p>
                  <p className="font-medium">
                    Top {comparisonData.leaderboards.quizScore.percentile}% in quiz score
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-2">Your Financial Standing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-90">Categories Spending Less Than Average</p>
              <p className="text-2xl font-bold">
                {comparisonData.categorySpending.filter(x => x.status === 'lower').length}
                <span className="text-lg">/{comparisonData.categorySpending.length}</span>
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Financial Health Score</p>
              <p className="text-2xl font-bold flex items-center">
                {comparisonData.aiScore.user}
                <span className="text-sm ml-2">
                  ({comparisonData.aiScore.user > comparisonData.aiScore.allUsers ? 'Above' : 'Below'} average)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Savings Rate Percentile</p>
              <p className="text-2xl font-bold">
                Top {100 - Math.floor((comparisonData.savingsRate.user / comparisonData.savingsRate.topPercentile) * 100)}%
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-90">
            💪 Keep up the good work! You're making better financial decisions than most users in your demographic.
          </p>
        </div>

        {/* AI-Generated Monthly Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-2">AI-Generated Financial Summary</h2>
              <p className="opacity-90 max-w-2xl">
                Based on your June activity: Your savings rate improved by 2% from last month, 
                but dining expenses increased by 18%. You're on track to complete your emergency 
                fund goal 3 weeks early.
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <FaRobot size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm opacity-90">Financial Health Score</p>
              <p className="text-2xl font-bold">82/100</p>
              <p className="text-sm mt-1">↑ 5 points from May</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Savings Potential</p>
              <p className="text-2xl font-bold">R1,200/mo</p>
              <p className="text-sm mt-1">Through budget optimization</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Goal Projection</p>
              <p className="text-2xl font-bold">2.1 years</p>
              <p className="text-sm mt-1">To financial independence</p>
            </div>
          </div>
        </div>

      </div>
    </AccountsLayout>
  );
};

export default InsightsPage;