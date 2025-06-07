const ProfileSidebar = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Overall Performance */}
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <div className="text-3xl font-bold text-blue-500">560</div>
        <p className="text-sm text-gray-500">Excellent</p>
        <p className="text-xs text-gray-400 mt-1">Lv 3: Silver</p>
      </div>

      {/* Badges */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-sm font-semibold mb-2">Badges</h3>
        <div className="flex space-x-2 justify-center">
          <div className="w-10 h-10 rounded-full bg-yellow-200" />
          <div className="w-10 h-10 rounded-full bg-green-200" />
          <div className="w-10 h-10 rounded-full bg-purple-200" />
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-sm font-semibold mb-2">Overall Statistics</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>📘 55 Quizzes</li>
          <li>✅ 83% Accuracy</li>
          <li>🏆 #2 Leaderboard</li>
          <li>🎯 14 Goals</li>
          <li>🧩 56% Badges</li>
          <li>⚔️ #7 Challenger</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;
