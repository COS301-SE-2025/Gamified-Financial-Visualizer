const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="w-full px-6 py-8">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 shadow">
        <h1 className="text-2xl font-bold">Welcome back {user?.username || 'Guest'}</h1>
        <p className="text-sm mt-1">Your dashboard is ready. Use the navbar to explore.</p>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow border max-w-md">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>👤 <a href="/app/profile" className="text-blue-600 underline">View your Profile</a></li>
          <li>🎯 <a href="/app/goals" className="text-blue-600 underline">Manage your Goals</a></li>
          <li>👥 <a href="/app/community" className="text-blue-600 underline">Join a Community</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
