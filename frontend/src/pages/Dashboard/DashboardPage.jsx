import { useState } from 'react';

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Calm color palette
  const colors = {
    primary: darkMode ? 'from-teal-800 to-emerald-900' : 'from-teal-500 to-emerald-600',
    cardBg: darkMode ? 'bg-slate-800' : 'bg-white',
    text: darkMode ? 'text-slate-100' : 'text-slate-800',
    secondaryText: darkMode ? 'text-slate-300' : 'text-slate-600',
    accent: 'text-emerald-500',
    border: darkMode ? 'border-slate-700' : 'border-slate-200',
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3 12l9 10 9-10-9-10zm0 2.8L18.4 12 12 19.2 5.6 12 12 4.8z" />
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            <h1 className={`text-3xl font-bold ${colors.text}`}>FinVision</h1>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition ${darkMode ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-slate-700'}`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>

        {/* Hero Section with Clear Value Proposition */}
        <section className={`rounded-2xl p-8 mb-12 bg-gradient-to-r ${colors.primary} text-white shadow-lg`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">See Your Money Grow</h1>
              <p className="text-xl mb-6">FinVision transforms your financial data into beautiful, understandable visualizations that help you make smarter decisions.</p>
              <div className="space-y-4">
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md">
                  Start Visualizing →
                </button>
                <p className="text-emerald-100 text-sm">Connect your accounts in under 2 minutes</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className={`bg-white/20 rounded-xl p-6 h-80 flex flex-col justify-center items-center border-2 border-white/10`}>
                <div className="w-full h-48 bg-white/10 rounded-lg mb-4 flex items-end justify-center space-x-1 p-2">
                  {[30, 60, 40, 80, 50, 90, 70].map((height, i) => (
                    <div 
                      key={i}
                      className="bg-emerald-300 w-8 rounded-t-sm transition-all duration-500 hover:bg-white"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <p className="text-center text-emerald-100">Interactive financial growth visualization</p>
              </div>
            </div>
          </div>
        </section>

        {/* App Explanation Section */}
        <section className={`mb-16 p-8 rounded-2xl ${colors.cardBg} shadow-md ${colors.border} border`}>
          <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>How FinVision Helps You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Visual Insights',
                desc: 'See patterns in your spending and income you might miss in spreadsheets'
              },
              {
                icon: '🎯',
                title: 'Goal Tracking',
                desc: 'Set and monitor financial goals with clear progress indicators'
              },
              {
                icon: '🔍',
                title: 'Deep Analysis',
                desc: 'Drill down into specific categories or time periods'
              }
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="text-4xl mb-4 group-hover:text-emerald-500 transition">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-2 ${colors.text}`}>{feature.title}</h3>
                <p className={colors.secondaryText}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Overview Cards */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${colors.text}`}>Your Financial Snapshot</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Net Worth',
                value: '$45,678',
                change: '+12%',
                positive: true,
                icon: '💰'
              },
              {
                title: 'Monthly Cash Flow',
                value: '$1,245',
                change: '+5%',
                positive: true,
                icon: '💸'
              },
              {
                title: 'Debt Reduction',
                value: '18% paid',
                change: '3% this month',
                positive: true,
                icon: '📉'
              }
            ].map((metric, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-xl shadow-sm ${colors.cardBg} ${colors.border} border transition hover:shadow-md hover:-translate-y-1`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm ${colors.secondaryText}`}>{metric.title}</p>
                    <p className={`text-2xl font-bold mt-1 ${colors.text}`}>{metric.value}</p>
                  </div>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <p className={`mt-4 text-sm ${metric.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {metric.change} {metric.positive ? '↑' : '↓'} from last month
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Visualization Preview + CTA */}
        <section className={`p-8 rounded-2xl ${colors.cardBg} shadow-md mb-12`}>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className={`text-2xl font-bold mb-4 ${colors.text}`}>Transform Numbers Into Understanding</h2>
              <p className={`mb-6 ${colors.secondaryText}`}>
                Our interactive visualizations help you see the story behind your finances. 
                Spot trends, identify opportunities, and make informed decisions.
              </p>
              <div className="space-x-4">
                <button className={`px-6 py-3 rounded-lg font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-md`}>
                  Try Demo
                </button>
                <button className={`px-6 py-3 rounded-lg font-semibold ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'} hover:opacity-90 transition`}>
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className={`rounded-xl overflow-hidden border ${colors.border}`}>
                <div className={`p-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} flex justify-between items-center`}>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <p className={`text-sm ${colors.secondaryText}`}>Sample Spending Analysis</p>
                </div>
                <div className={`h-64 ${darkMode ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center p-4`}>
                  <div className="w-full h-48 relative">
                    {/* Sample chart bars */}
                    {['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities'].map((category, i) => (
                      <div key={i} className="absolute bottom-0 left-0 flex items-end" style={{ left: `${i * 20 + 5}%`, width: '16%' }}>
                        <div 
                          className="w-full bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-t-sm hover:from-emerald-300 hover:to-emerald-500 transition-all"
                          style={{ height: `${30 + i * 15}%` }}
                        >
                          <div className="text-xs text-center -mt-6 text-slate-700">{category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`text-center p-8 rounded-2xl bg-gradient-to-r ${colors.primary} text-white shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4">Ready to See Your Finances Clearly?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of users who've gained control of their financial future</p>
          <button className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg text-lg">
            Get Started for Free
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;