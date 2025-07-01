import React, { useEffect, useState } from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';

import { FaCoins } from 'react-icons/fa';

const GoalOverviewCards = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if (storedUser?.id) {
      const fetchData = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/goal/user/${storedUser.id}/total-value`);
          const result = await res.json();
          setData(result.data);
        } catch (error) {
          console.error('Error fetching goal value:', error);
        }
      };
      fetchData();
    }

    fetch(`http://localhost:5000/api/community/performance-summary/${storedUser.id}`)
      .then(res => res.json())
      .then(data => setPerformance(data.data))
      .catch(err => console.error('Community performance summary error:', err));

    // Fetch level progress
    fetch(`http://localhost:5000/api/auth/profile/level-progress/${storedUser.id}`)
      .then(res => res.json())
      .then(res => setLevelProgress(res.data))
      .catch(err => console.error('Failed to load level progress:', err));
  }, []);

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 text-center text-sm text-gray-500">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar & Name Card */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <img
          src={
            performance
              ? `../../assets/Images/${performance.avatar_image_path}`
              : avatar
          }
          alt="Avatar"
          className="w-8 h-8 mt-1 rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-bold text-gray-800">{user.username}</p>
          <p className="text-sm text-gray-500">Lv {levelProgress?.tier_status ?? '—'}</p>
        </div>
      </div>

      {/* ZAR Value */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Goal Value</p>
          <p className="text-2xl font-bold text-[#88BC46]">R{data.total_goal_value}</p>
        </div>
        <FaCoins className="text-[#FF955A] text-3xl" />
      </div>
    </div>
  );
};

export default GoalOverviewCards;
