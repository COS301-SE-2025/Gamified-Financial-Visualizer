import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GoalsDetailPage from '../../../src/pages/GoalsPage/GoalsDetailPage/GoalsDetailPage';

// 🧪 Mock images
jest.mock('../../../../assets/Images/pixelAllyway.jpeg', () => 'goal1.jpg');
jest.mock('../../../../assets/Images/pixelMoonLight.jpeg', () => 'goal2.jpg');
jest.mock('../../../../assets/Images/pixelPath.jpeg', () => 'goal3.jpg');
jest.mock('../../../../assets/Images/pixelStore.jpeg', () => 'goal5.jpg');
jest.mock('../../../../assets/Images/highFiveIcon.png', () => 'r1.png');
jest.mock('../../../../assets/Images/awardIcon.png', () => 'r2.png');
jest.mock('../../../../assets/Images/mountainIcon.png', () => 'r3.png');
jest.mock('../../../../assets/Images/moneyGrowIcon.png', () => 'r4.png');

// 🧪 Mock useNavigate globally for test
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('GoalsDetailPage', () => {
  it('renders full goal detail for goal with id 1', () => {
    render(
      <MemoryRouter initialEntries={['/goals/1']}>
        <Routes>
          <Route path="/goals/:id" element={<GoalsDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Buy a Car/i)).toBeInTheDocument();
    expect(screen.getByText(/Vehicle/i)).toBeInTheDocument();
    expect(screen.getByText(/XP Earned/i)).toBeInTheDocument();
  });

  it('shows "Goal not found" for an invalid id', () => {
    render(
      <MemoryRouter initialEntries={['/goals/999']}>
        <Routes>
          <Route path="/goals/:id" element={<GoalsDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Goal not found/i)).toBeInTheDocument();
  });

  it('back button navigates to previous page', () => {
    render(
      <MemoryRouter initialEntries={['/goals/1']}>
        <Routes>
          <Route path="/goals/:id" element={<GoalsDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
