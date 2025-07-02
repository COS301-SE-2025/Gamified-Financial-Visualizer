import React, { useEffect, useState } from 'react';
import { FaUmbrellaBeach, FaDesktop, FaCameraRetro, FaCalendarAlt, FaQuestion } from 'react-icons/fa';
import { categoryIconMap, categorize } from './categoryIcons.ts';


const UpcomingDeadlinesCard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [deadlines, setDeadlines] = useState([]);

  
  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/goal/user/${user.id}/upcoming`);
        const data = await res.json();
        setDeadlines(data.data || []);
      } catch (err) {
        console.error('Failed to fetch upcoming deadlines', err);
      }
    };

    if (user?.id) fetchDeadlines();
  }, [user?.id]);

const getIcon = (goalType) => {
  const category = categorize(goalType);
  const Icon = categoryIconMap[category];
  return <Icon className="text-[#5FBFFF]" />;
};


  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); // e.g., 5 Aug
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-md font-semibold text-gray-600 mb-3 flex items-center gap-2">
        <FaCalendarAlt className="text-[#F59E0B]" /> Upcoming Deadlines
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {deadlines.map((goal, index) => (
          <li key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getIcon(goal.goal_type)}
              <span>{goal.goal_name}</span>
            </div>
            <span className="text-gray-500">{formatDate(goal.target_date)}</span>
          </li>
        ))}
        {deadlines.length === 0 && (
          <li className="text-gray-400 text-sm italic">No upcoming deadlines</li>
        )}
      </ul>
    </div>
  );
};

export default UpcomingDeadlinesCard;
