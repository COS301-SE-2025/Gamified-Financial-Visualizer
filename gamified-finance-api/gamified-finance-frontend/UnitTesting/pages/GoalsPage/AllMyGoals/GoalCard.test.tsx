import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import GoalCard from '../../../../src/pages/GoalsPage/SidebarLeft/GoalCard';

// // Mock image
// jest.mock('../../../../../assets/Images/pixelBar.jpeg', () => 'mock-avatar.jpg');

// Mock useNavigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('GoalCard', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders goal title, year, and progress', () => {
    render(
      <MemoryRouter>
        <GoalCard
          id={42}
          title="Trip to Mars"
          year={2030}
          percent={75}
          spent={15000}
          remaining={5000}
          daysLeft={90}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Trip to Mars/i)).toBeInTheDocument();
    expect(screen.getByText(/2030/i)).toBeInTheDocument();
    expect(screen.getByText(/75%/i)).toBeInTheDocument();
    expect(screen.getByText(/R15,000/i)).toBeInTheDocument();
    expect(screen.getByText(/R5,000/i)).toBeInTheDocument();
    expect(screen.getByText(/90/i)).toBeInTheDocument();
  });

  it('navigates to goal detail page on View button click', () => {
    render(
      <MemoryRouter>
        <GoalCard
          id={7}
          title="Gaming Setup"
          year={2025}
          percent={60}
          spent={6000}
          remaining={4000}
          daysLeft={60}
        />
      </MemoryRouter>
    );

    const viewBtn = screen.getByText(/view/i);
    fireEvent.click(viewBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/goals/7');
  });
});
