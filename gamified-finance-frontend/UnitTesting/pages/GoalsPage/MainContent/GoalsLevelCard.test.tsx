import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalsLevelCard from '../../../../src/pages/GoalsPage/MainContent/GoalsLevelCard';

// // Mock image
// jest.mock('../../../../../assets/Images/pixelStreet.gif', () => 'pixelStreet.gif');

describe('GoalsLevelCard', () => {
  it('renders with correct XP and level info', () => {
    render(<GoalsLevelCard level={4} points={4000} nextLevelPoints={5000} />);

    expect(screen.getByText(/Lv Silver/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 4/i)).toBeInTheDocument();
    expect(screen.getByText(/4000 \/ 5000 XP/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 5/i)).toBeInTheDocument();
    expect(screen.getByText(/🎯 1000 Points to next level/i)).toBeInTheDocument();
  });

  it('renders full progress bar when at or above next level threshold', () => {
    render(<GoalsLevelCard level={5} points={6000} nextLevelPoints={6000} />);

    expect(screen.getByText(/6000 \/ 6000 XP/i)).toBeInTheDocument();
    expect(screen.getByText(/🎯 0 Points to next level/i)).toBeInTheDocument();
  });
});
