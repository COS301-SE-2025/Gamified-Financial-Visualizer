import React from 'react';
import { Outlet } from 'react-router-dom';
import GoalsSidebar from '../../layouts/sidebars/GoalsSidebar';
import GoalsHeader from '../../layouts/headers/GoalsHeader';
import NotificationsPanel from '../../components/notifications/NotificationsPanel';

// const GoalsViewLayout = ({ children }) => {
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Left Sidebar */}
//       <div className="w-1/4 p-4">
//         <GoalsSidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-4 overflow-y-auto">
//         <GoalsHeader />
//         {children}
//       </div>

//       {/* Notifications Panel */}
//       <NotificationsPanel />
//     </div>
//   );
// };

const GoalsViewLayout = ({ children }) => {
  return <div>{children}</div>;
};

export default GoalsViewLayout;