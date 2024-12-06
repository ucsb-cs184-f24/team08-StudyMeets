import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GroupCard from './GroupCard';

describe('GroupCard Component', () => {
  const mockItem = {
    id: '1',
    Title: 'Study Group',
    Location: 'Library',
    Description: 'A group for studying React Native.',
    Tags: ['React', 'JavaScript'],
    OwnerName: 'John Doe',
    CreatedAt: {
      toDate: () => new Date('2024-01-01T10:00:00Z'),
    },
  };

  const mockOnPrimaryAction = jest.fn();
  const mockOnSecondaryAction = jest.fn();

  it('renders correctly with all props', () => {
    const { getByText } = render(
      <GroupCard
        item={mockItem}
        onPrimaryAction={mockOnPrimaryAction}
        primaryActionLabel="Join"
        secondaryActionLabel="Leave"
        onSecondaryAction={mockOnSecondaryAction}
      />
    );

    // Check that title, description, and location are rendered
    expect(getByText('Study Group')).toBeTruthy();
    expect(getByText('A group for studying React Native.')).toBeTruthy();
    expect(getByText('Location: Library')).toBeTruthy();

    // Check tags
    expect(getByText('React')).toBeTruthy();
    expect(getByText('JavaScript')).toBeTruthy();

    // Check date and time
    expect(getByText('Date: 1/1/2024')).toBeTruthy();
    expect(getByText('Time: 02:00 AM')).toBeTruthy();


    // Check creator name
    expect(getByText('Created by: John Doe')).toBeTruthy();

    // Check buttons
    expect(getByText('Join')).toBeTruthy();
    expect(getByText('Leave')).toBeTruthy();
  });

  it('handles primary action button press', () => {
    const { getByText } = render(
      <GroupCard
        item={mockItem}
        onPrimaryAction={mockOnPrimaryAction}
        primaryActionLabel="Join"
      />
    );

    const joinButton = getByText('Join');
    fireEvent.press(joinButton);

    expect(mockOnPrimaryAction).toHaveBeenCalledWith('1');
  });

  it('handles secondary action button press', () => {
    const { getByText } = render(
      <GroupCard
        item={mockItem}
        onSecondaryAction={mockOnSecondaryAction}
        secondaryActionLabel="Leave"
      />
    );

    const leaveButton = getByText('Leave');
    fireEvent.press(leaveButton);

    expect(mockOnSecondaryAction).toHaveBeenCalledWith('1');
  });
});
