import React from 'react';
import { FaUmbrellaBeach, FaDesktop, FaCameraRetro, FaCalendarAlt } from 'react-icons/fa';

const UpcomingDeadlinesCard = () => {
  const deadlines = [
    { title: 'Vacation: Bali', date: '20 Jul', icon: <FaUmbrellaBeach className="text-[#5FBFFF]" /> },
    { title: 'New PC', date: '5 Aug', icon: <FaDesktop className="text-[#AAD977]" /> },
    { title: 'Camera Kit', date: '15 Sep', icon: <FaCameraRetro className="text-[#F97156]" /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="text-md font-semibold text-gray-600 mb-3 flex items-center gap-2">
        <FaCalendarAlt className="text-[#F59E0B]" /> Upcoming Deadlines
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {deadlines.map((goal, index) => (
          <li key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {goal.icon}
              <span>{goal.title}</span>
            </div>
            <span className="text-gray-500">{goal.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingDeadlinesCard;
