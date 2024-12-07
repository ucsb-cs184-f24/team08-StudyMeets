import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Following from './Following'; // Adjust the path if necessary
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

// Mock dependencies
jest.mock('../../firebase', () => ({
  firestore: jest.fn(),
  auth: { currentUser: { uid: 'testUserId' } },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('Following Component', () => {
  let navigateMock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock navigation
    navigateMock = jest.fn();
    useNavigation.mockReturnValue({ navigate: navigateMock });
  });

  test('renders the Following component correctly', () => {
    const { getByText } = render(<Following />);
    expect(getByText("You're not following anyone yet.")).toBeTruthy();
  });

  test('fetches and displays following users', async () => {
    const mockFollowingSnapshot = {
      docs: [{ id: 'user1' }, { id: 'user2' }],
    };
    const mockUsersSnapshot = {
      docs: [
        { id: 'user1', data: () => ({ username: 'User One', profileImageURL: null }) },
        { id: 'user2', data: () => ({ username: 'User Two', profileImageURL: null }) },
        { id: 'notFollowing', data: () => ({ username: 'Not Following', profileImageURL: null }) },
      ],
    };

    getDocs
      .mockResolvedValueOnce(mockFollowingSnapshot) // First call: following IDs
      .mockResolvedValueOnce(mockUsersSnapshot); // Second call: user data

    const { getByText } = render(<Following />);

    await waitFor(() => {
      expect(getByText('User One')).toBeTruthy();
      expect(getByText('User Two')).toBeTruthy();
      expect(getDocs).toHaveBeenCalledTimes(2);
    });
  });

  test('shows a message when the user is not following anyone', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] }); // No following
    getDocs.mockResolvedValueOnce({ docs: [] }); // No users

    const { getByText } = render(<Following />);

    await waitFor(() => {
      expect(getByText("You're not following anyone yet.")).toBeTruthy();
    });
  });

  test('handles refresh functionality', async () => {
    const mockFollowingSnapshot = {
      docs: [{ id: 'user1' }],
    };
    const mockUsersSnapshot = {
      docs: [
        { id: 'user1', data: () => ({ username: 'User One', profileImageURL: null }) },
      ],
    };

    getDocs
      .mockResolvedValueOnce(mockFollowingSnapshot) // Initial fetch
      .mockResolvedValueOnce(mockUsersSnapshot) // Initial fetch
      .mockResolvedValueOnce(mockFollowingSnapshot) // Refresh
      .mockResolvedValueOnce(mockUsersSnapshot); // Refresh

    const { getByTestId, getByText } = render(<Following />);

    await waitFor(() => {
      expect(getByText('User One')).toBeTruthy();
    });

    const refreshControl = getByTestId('flatlist-refresh-control');
    fireEvent(refreshControl, 'refresh');

    await waitFor(() => {
      expect(getDocs).toHaveBeenCalledTimes(4);
      expect(getByText('User One')).toBeTruthy();
    });
  });

  test('navigates to Profile when a user is pressed', async () => {
    const mockFollowingSnapshot = {
      docs: [{ id: 'user1' }],
    };
    const mockUsersSnapshot = {
      docs: [
        { id: 'user1', data: () => ({ username: 'User One', profileImageURL: null }) },
      ],
    };

    getDocs
      .mockResolvedValueOnce(mockFollowingSnapshot) // Following
      .mockResolvedValueOnce(mockUsersSnapshot); // Users

    const { getByText } = render(<Following />);

    await waitFor(() => {
      expect(getByText('User One')).toBeTruthy();
    });

    const userItem = getByText('User One');
    fireEvent.press(userItem);

    expect(navigateMock).toHaveBeenCalledWith('Profile', { user: { id: 'user1', username: 'User One', profileImageURL: null } });
  });
});
