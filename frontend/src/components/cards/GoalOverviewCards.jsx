import React, { useEffect, useState } from 'react';

import { FaCoins } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const GoalOverviewCards = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if (storedUser?.id) {
      const fetchData = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/goal/user/${storedUser.id}/total-value`);
          const result = await res.json();
          setData(result.data.total_goal_value);
        } catch (error) {
          console.error('Error fetching goal value:', error);
        }
      };
      fetchData();
    }
  }, []);

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow p-4 text-center text-sm text-gray-500 dark:text-gray-300">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ZAR Value Target */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-300">Total Goal Target Value</p>
          <p className="text-2xl font-bold text-[#88BC46] dark:text-[#a8d86c]">R{data.total_goal_value_target}</p>
        </div>
        <FaCoins className="text-[#FF955A] text-3xl" />
      </div>

      {/* ZAR Value */}
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-300">Total Goal Current Value</p>
          <p className="text-2xl font-bold text-[#88BC46] dark:text-[#a8d86c]">R{data.total_goal_value}</p>
        </div>
        <FaCoins className="text-[#FF955A] text-3xl" />
      </div>
    </div>
  );
};

export default GoalOverviewCards;