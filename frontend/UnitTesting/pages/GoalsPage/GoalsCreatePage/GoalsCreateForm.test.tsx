import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GoalsCreateForm from '../../../../src/pages/GoalsPage/GoalsCreatePage/GoalsCreateForm';

// // Mock image assets
// jest.mock('../../../../../assets/Images/pixelPath.jpeg', () => 'pixelPath.jpg');
// jest.mock('../../../../../assets/Images/pixelShop.gif', () => 'pixelShop.gif');
// jest.mock('../../../../../assets/Images/pixelMoonLight.jpeg', () => 'pixelMoonLight.jpeg');

describe('GoalsCreateForm', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all inputs and XP reward label', () => {
    render(<GoalsCreateForm />);
    expect(screen.getByPlaceholderText(/buy a car/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/vehicle/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/10000/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/🏆 XP Reward/i)).toBeInTheDocument();
    expect(screen.getByText(/create goal/i)).toBeInTheDocument();
  });

  it('updates form fields and submits correctly', () => {
    render(<GoalsCreateForm />);

    fireEvent.change(screen.getByPlaceholderText(/buy a car/i), { target: { value: 'Test Goal' } });
    fireEvent.change(screen.getByPlaceholderText(/vehicle/i), { target: { value: 'Fitness' } });
    fireEvent.change(screen.getByPlaceholderText(/10000/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/start date/i), {target: { value: '2025-06-01' },});
    fireEvent.click(screen.getByLabelText(/make this goal recurring/i));

    fireEvent.click(screen.getByText(/create goal/i));
    expect(window.alert).toHaveBeenCalledWith('Goal submitted (mock)');
  });
});
