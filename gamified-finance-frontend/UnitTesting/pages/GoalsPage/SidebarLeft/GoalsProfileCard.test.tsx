import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GoalsProfileCard from '../../../../src/pages/GoalsPage/SidebarLeft/GoalsProfileCard';

// Mock avatar image
jest.mock('../../../../../assets/Images/pixelWindow.gif', () => 'mock-avatar.gif');

describe('GoalsProfileCard', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('displays user info correctly', () => {
    render(<GoalsProfileCard />);

    expect(screen.getByText(/Lebo/i)).toBeInTheDocument();
    expect(screen.getByText(/Tier: Silver/i)).toBeInTheDocument();
    expect(screen.getByText(/Lv 3/i)).toBeInTheDocument();
    expect(screen.getByText(/5200 \/ 6000 XP/i)).toBeInTheDocument();
  });

  it('triggers alert on profile settings button click', () => {
    render(<GoalsProfileCard />);

    const button = screen.getByText(/profile settings/i);
    fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith('Open profile settings');
  });
});
