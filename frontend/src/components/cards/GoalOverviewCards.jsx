import React, { useEffect, useState } from 'react';

import { FaCoins } from 'react-icons/fa';

const GoalOverviewCards = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    if (storedUser?.id) {
      const fetchData = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/goal/user/${storedUser.id}/total-value`);
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
      <div className="bg-white rounded-2xl shadow p-4 text-center text-sm text-gray-500">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ZAR Value Target */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Goal Target Value</p>
          <p className="text-2xl font-bold text-[#88BC46]">R{data.total_goal_value_target}</p>
        </div>
        <FaCoins className="text-[#FF955A] text-3xl" />
      </div>
 

      {/* ZAR Value */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Goal Current Value</p>
          <p className="text-2xl font-bold text-[#88BC46]">R{data.total_goal_value}</p>
        </div>
        <FaCoins className="text-[#FF955A] text-3xl" />
      </div>
    </div>
  );
};

export default GoalOverviewCards;
