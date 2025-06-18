import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import GoalsList from '../../../../src/pages/GoalsPage/AllMyGoals/GoalsList';

// // Mock images
// jest.mock('../../../../../assets/Images/pixelAllyway.jpeg', () => 'pixelAllyway.jpg');
// jest.mock('../../../../../assets/Images/pixelMoonLight.jpeg', () => 'pixelMoonLight.jpg');
// jest.mock('../../../../../assets/Images/pixelPath.jpeg', () => 'pixelPath.jpg');
// jest.mock('../../../../../assets/Images/pixelStore.jpeg', () => 'pixelStore.jpg');

// Mock navigate hook
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

describe('GoalsList', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders only ongoing goals', () => {
    render(
      <MemoryRouter>
        <GoalsList filter="ongoing" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Buy a Car/i)).toBeInTheDocument();
    expect(screen.getByText(/Bali Vacation/i)).toBeInTheDocument();
    expect(screen.getByText(/Gaming Setup/i)).toBeInTheDocument();

    // Ensure completed goal is NOT rendered
    expect(screen.queryByText(/Trip to Japan/i)).toBeNull();
  });

  it('navigates to detail page on view click', () => {
    render(
      <MemoryRouter>
        <GoalsList filter="ongoing" />
      </MemoryRouter>
    );

    const viewButtons = screen.getAllByText(/view/i);
    fireEvent.click(viewButtons[0]); // Click first goal's "View"

    expect(mockNavigate).toHaveBeenCalledWith('/goals/1');
  });
});
