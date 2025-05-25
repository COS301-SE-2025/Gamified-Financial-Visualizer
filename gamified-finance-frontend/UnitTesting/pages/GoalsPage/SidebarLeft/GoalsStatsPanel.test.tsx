import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalsStatsPanel from '../../../../src/pages/GoalsPage/SidebarLeft/GoalsStatsPanel';

describe('GoalsStatsPanel', () => {
  it('renders the panel header and all stats', () => {
    render(<GoalsStatsPanel />);

    expect(screen.getByText(/📊 Goal Stats/i)).toBeInTheDocument();

    const titles = [
      'Total Goals',
      'Completed Goals',
      'XP Earned',
      'Total Saved',
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('12,300')).toBeInTheDocument();
    expect(screen.getByText('R18,500')).toBeInTheDocument();
  });
});
