import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GoalPage from '../../../src/pages/GoalsPage/GoalPage';

// ✅ Mocks for layout components
jest.mock('../../../src/pages/GoalsPage/MainContent/GoalsHeader', () => () => <div>GoalsHeader</div>);
jest.mock('../../../src/pages/GoalsPage/MainContent/GoalsLevelCard', () => () => <div>GoalsLevelCard</div>);
jest.mock('../../../src/pages/GoalsPage/SidebarLeft/GoalsProfileCard', () => () => <div>GoalsProfileCard</div>);
jest.mock('../../../src/pages/GoalsPage/SidebarLeft/GoalsStatsPanel', () => () => <div>GoalsStatsPanel</div>);
jest.mock('../../../src/pages/GoalsPage/GoalBadges/GoalsBadgesPanel', () => () => <div>GoalsBadgesPanel</div>);
jest.mock('../../../src/pages/GoalsPage/GoalsCreatePage/GoalsCreateForm', () => () => <div>GoalsCreateForm</div>);
jest.mock('../../../src/pages/GoalsPage/AllMyGoals/GoalsList', () => () => <div>GoalsList</div>);

// ✅ Custom mock for NotificationsPanel (because it accepts onClose)
jest.mock('../../../src/pages/GoalsPage/SidebarRight/NotificationsPanel', () => ({
  __esModule: true,
  default: ({ onClose }: any) => (
    <div>
      NotificationsPanel
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe('GoalPage', () => {
  it('renders all main layout sections', () => {
    render(
      <MemoryRouter initialEntries={['/goals']}>
        <Routes>
          <Route path="/goals" element={<GoalPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/GoalsHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/GoalsLevelCard/i)).toBeInTheDocument();
    expect(screen.getByText(/GoalsProfileCard/i)).toBeInTheDocument();
    expect(screen.getByText(/GoalsStatsPanel/i)).toBeInTheDocument();
    expect(screen.getByText(/GoalsBadgesPanel/i)).toBeInTheDocument();
    expect(screen.getByText(/GoalsCreateForm/i)).toBeInTheDocument();
    expect(screen.getByText(/GoalsList/i)).toBeInTheDocument();
  });

  it('toggles notifications panel via text button click', () => {
    render(
      <MemoryRouter initialEntries={['/goals']}>
        <Routes>
          <Route path="/goals" element={<GoalPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/🔔 Notifications/i));
    expect(screen.getByText(/NotificationsPanel/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Close/i));
  });
});
