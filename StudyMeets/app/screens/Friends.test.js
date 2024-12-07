import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Friends from './Friends'; // Adjust the path as necessary
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

describe('Friends Component', () => {
  let navigateMock;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock navigation
    navigateMock = jest.fn();
    useNavigation.mockReturnValue({ navigate: navigateMock });
  });

  test('renders the Friends component correctly', () => {
    const { getByText } = render(<Friends />);
    expect(getByText("You're not friends with anyone yet.")).toBeTruthy();
  });

  test('fetches and displays friend users', async () => {
    // Mock Firestore data
    const mockFriendSnapshot = {
      docs: [{ id: 'friend1' }, { id: 'friend2' }],
    };
    const mockUsersSnapshot = {
      docs: [
        { id: 'friend1', data: () => ({ username: 'Alice', profileImageURL: null }) },
        { id: 'friend2', data: () => ({ username: 'Bob', profileImageURL: null }) },
        { id: 'notFriend', data: () => ({ username: 'Not Friend', profileImageURL: null }) },
      ],
    };

    getDocs
      .mockResolvedValueOnce(mockFriendSnapshot) // First call returns friends
      .mockResolvedValueOnce(mockUsersSnapshot); // Second call returns users

    const { getByText } = render(<Friends />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
      expect(getByText('Bob')).toBeTruthy();
      expect(getDocs).toHaveBeenCalledTimes(2);
    });
  });

  test('shows a message when there are no friends', async () => {
    // Mock Firestore to return no friends
    getDocs.mockResolvedValueOnce({ docs: [] }); // No friends
    getDocs.mockResolvedValueOnce({ docs: [] }); // No users

    const { getByText } = render(<Friends />);

    await waitFor(() => {
      expect(getByText("You're not friends with anyone yet.")).toBeTruthy();
    });
  });

  test('handles refresh functionality', async () => {
    // Mock Firestore data
    const mockFriendSnapshot = {
      docs: [{ id: 'friend1' }],
    };
    const mockUsersSnapshot = {
      docs: [
        { id: 'friend1', data: () => ({ username: 'Alice', profileImageURL: null }) },
      ],
    };

    getDocs
      .mockResolvedValueOnce(mockFriendSnapshot) // Initial fetch
      .mockResolvedValueOnce(mockUsersSnapshot) // Initial fetch
      .mockResolvedValueOnce(mockFriendSnapshot) // Refresh
      .mockResolvedValueOnce(mockUsersSnapshot); // Refresh

    const { getByTestId, getByText } = render(<Friends />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
    });

    // Simulate refresh
    const refreshControl = getByTestId('flatlist-refresh-control');
    fireEvent(refreshControl, 'refresh');

    // Wait for refresh to complete
    await waitFor(() => {
      expect(getDocs).toHaveBeenCalledTimes(4);
      expect(getByText('Alice')).toBeTruthy();
    });
  });

  test('navigates to Profile when a friend is pressed', async () => {
    // Mock Firestore data
    const mockFriendSnapshot = {
      docs: [{ id: 'friend1' }],
    };
    const mockUsersSnapshot = {
      docs: [
        { id: 'friend1', data: () => ({ username: 'Alice', profileImageURL: null }) },
      ],
    };

    getDocs
      .mockResolvedValueOnce(mockFriendSnapshot) // Friends
      .mockResolvedValueOnce(mockUsersSnapshot); // Users

    const { getByText } = render(<Friends />);

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Alice')).toBeTruthy();
    });

    // Simulate pressing on a friend
    const friendItem = getByText('Alice');
    fireEvent.press(friendItem);

    expect(navigateMock).toHaveBeenCalledWith('Profile', { user: { id: 'friend1', username: 'Alice', profileImageURL: null } });
  });
});
