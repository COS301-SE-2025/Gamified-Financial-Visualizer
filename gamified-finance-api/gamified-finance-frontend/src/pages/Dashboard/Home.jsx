
import ExpenseIncomeChart from '../../components/charts/ExpenseIncomeChart';
import netflixLogo from '../../assets/Images/netflix.png';
import spotifyLogo from '../../assets/Images/spotify.png';
import dstvLogo from '../../assets/Images/dstv.png';
import gdriveLogo from '../../assets/Images/gdrive.png';
import adobeLogo from '../../assets/Images/adobe.jpg';


const upcomingExpenses = [
  { name: "Netflix", date: "10 JUNE 2025", amount: "R 260" },
  { name: "Spotify", date: "11 JUNE 2025", amount: "R 120" },
  { name: "DSTV", date: "12 JUNE 2025", amount: "R 350" },
  { name: "Google Drive", date: "13 JUNE 2025", amount: "R 100" },
  { name: "Adobe Creative Cloud", date: "14 JUNE 2025", amount: "R 850" },
];

const logoMap = {
  netflix: netflixLogo,
  spotify: spotifyLogo,
  dstv: dstvLogo,
  'google drive': gdriveLogo,
  'adobe creative cloud': adobeLogo,
};


const expenseCategories = [
  { name: "Groceries", icon: "🛒", used: 600, limit: 1000 },
  { name: "Transport", icon: "🚗", used: 850, limit: 1000 },
  { name: "Dining", icon: "🍔", used: 300, limit: 800 },
  { name: "Internet", icon: "🌐", used: 200, limit: 500 },
  { name: "Health", icon: "🏥", used: 400, limit: 1000 },
];

const goalTracker = [
  { name: "New House", icon: "🏠", progress: 50 },
  { name: "New Car", icon: "🚗", progress: 45 },
  { name: "Emergency Fund", icon: "💼", progress: 70 },
  { name: "Vacation", icon: "✈️", progress: 30 },
  { name: "Home Office Setup", icon: "🖥️", progress: 60 },
];

const investments = [
  {
    account: "Capitec Smart",
    bank: "Capitec Bank",
    amount: "R2500",
    icon: "💳",
  },
  {
    account: "FNB Easy",
    bank: "FNB",
    amount: "R1300",
    icon: "🏦",
  },
  {
    account: "TymeGoalSave",
    bank: "TymeBank",
    amount: "R900",
    icon: "💰",
  },
  {
    account: "Discovery Invest",
    bank: "Discovery",
    amount: "R4200",
    icon: "📈",
  },
  {
    account: "Absa Wealth",
    bank: "Absa",
    amount: "R3000",
    icon: "🪙",
  },
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      
      <div className="rounded-lg p-6 text-white bg-gradient-to-r from-sky-300 via-yellow-300 to-red-400 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome back {user ? user.username : "Guest"}</h1>
      </div>
      
      {/* Top Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expense vs Income */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2">Expense vs Income</h2>
          <div className="border-t-4 border-green-600 mb-4" />
          <ExpenseIncomeChart />
        </div>

        {/* Investments */}
        <div className="bg-white rounded-lg shadow border relative overflow-hidden">
          <h2 className="text-xl font-semibold p-4 pb-2">Investments</h2>
          <div className="border-t-4 border-orange-400 mx-4 mb-4" />
          {/* Investment Entries */}
          <div className="space-y-4 px-4 pb-6">
            {investments.map((inv, idx) => (
              <div key={idx} className="flex justify-between items-start border-b last:border-b-0 pb-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-full bg-white border shadow-inner flex items-center justify-center text-xl">
                    {inv.icon}
                  </div>

                  {/* Labels */}
                  <div>
                    <p className="font-bold text-sm">{inv.account}</p>
                    <p className="text-xs text-gray-500">{inv.bank}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-sm font-bold pt-1">{inv.amount}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Expense Categories */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 border-b-4 border-blue-400 pb-2">Expense Categories</h2>
          <div className="space-y-6">
            {expenseCategories.map((cat, idx) => {
              const percent = (cat.used / cat.limit) * 100;
              const colorMap = {
                Groceries: 'bg-blue-300',
                Transport: 'bg-pink-300',
                Dining: 'bg-orange-300',
                Internet: 'bg-green-300',
                Health: 'bg-red-300',
              };
              const progressColor = colorMap[cat.name] || 'bg-gray-400';

              return (
                <div key={idx} className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl w-10">{cat.icon}</div>

                  {/* Label + Progress */}
                  <div className="flex-1">
                    <p className="text-md font-semibold">{cat.name}</p>
                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-1">
                      <div
                        className={`${progressColor} h-4 rounded-full`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{cat.used}/{cat.limit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Expenses */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-yellow-400 p-4 text-lg font-semibold text-white">Upcoming Expenses</div>
          <div className="divide-y">
            {upcomingExpenses.map((expense, idx) => {
              const logo = logoMap[expense.name.toLowerCase()];
              return (
                <div key={idx} className="flex justify-between items-center px-4 py-4">
                  {/* Left Section */}
                  <div className="flex items-center gap-4">
                    {/* Icon or logo */}
                    {logo ? (
                      <img
                        src={logo}
                        alt={expense.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border shadow-inner bg-white" />
                    )}
                    {/* Name + Date */}
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide">{expense.name}</p>
                      <p className="text-xs text-gray-500">{expense.date}</p>
                    </div>
                  </div>
                  {/* Amount */}
                  <div className="text-sm font-bold">{expense.amount}</div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Goal Tracker */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-green-400 p-4 text-lg font-semibold text-white">Goal Tracker</div>
          <div className="divide-y">
            {goalTracker.map((goal, idx) => {
              const colorMap = {
                "New House": "bg-red-300",
                "New Car": "bg-orange-300",
                "Emergency Fund": "bg-green-300",
                "Vacation": "bg-sky-300",
                "Home Office Setup": "bg-purple-300",
              };
              const progressColor = colorMap[goal.name] || 'bg-lime-400';

              return (
                <div key={idx} className="flex items-start gap-4 px-4 py-4">
                  {/* Icon */}
                  <div className="text-3xl">{goal.icon}</div>

                  {/* Text + Progress */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold uppercase text-sm">{goal.name}</p>
                      <span className="text-sm">{goal.progress}% saved</span>
                    </div>
                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div
                        className={`${progressColor} h-4 rounded-full`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* View Button */}
            {/* <div className="flex justify-end px-4 py-4">
            <button className="px-6 py-1 text-sm text-white bg-gradient-to-r from-lime-400 to-green-600 rounded-full shadow-md hover:brightness-110">
                View
            </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
