import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalsBadgesPanel from '../../../../src/pages/GoalsPage/GoalBadges/GoalsBadgesPanel';

// // Mock badge icons
// jest.mock('../../../../../assets/Images/awardIcon.png', () => 'awardIcon.png');
// jest.mock('../../../../../assets/Images/highFiveIcon.png', () => 'highFiveIcon.png');
// jest.mock('../../../../../assets/Images/moneyBagIcon.png', () => 'moneyBagIcon.png');
// jest.mock('../../../../../assets/Images/notesIcon.png', () => 'notesIcon.png');
// jest.mock('../../../../../assets/Images/mountainIcon.png', () => 'mountainIcon.png');
// jest.mock('../../../../../assets/Images/moneyGrowIcon.png', () => 'moneyGrowIcon.png');
// jest.mock('../../../../../assets/Images/scaleIcon.png', () => 'scaleIcon.png');

describe('GoalsBadgesPanel', () => {
  it('renders badge panel title and button', () => {
    render(<GoalsBadgesPanel />);
    
    expect(screen.getByText(/🎖️ Badges/i)).toBeInTheDocument();
    expect(screen.getByText(/View All Badges/i)).toBeInTheDocument();
  });

  it('renders all 7 badge labels', () => {
    render(<GoalsBadgesPanel />);

    const badgeLabels = [
      'Coins Earned',
      'Stack Master',
      'Teamwork',
      'Top Saver',
      'Finance Guru',
      'Investor',
      'Reward Champ'
    ];

    badgeLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
