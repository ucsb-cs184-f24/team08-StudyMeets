import { getDownloadURL, uploadBytes } from 'firebase/storage';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profiles from './MyProfile';
import { NavigationContainer } from '@react-navigation/native';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
//import { useNavigation } from '@react-navigation/native';

jest.mock('../../firebase', () => ({
    auth: {
        currentUser: {
            uid: 'test-user-id',
            email: 'testuser@example.com',
        },
        signOut: jest.fn(),
    },
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(() => ({})),
    uploadBytes: jest.fn().mockResolvedValue({}),
    getDownloadURL: jest.fn().mockResolvedValue('https://upload.wikimedia.org/wikipedia/commons/4/43/Cute_dog.jpg'),
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
}));

jest.mock('firebase/auth', () => {
    let mockCurrentUser = {
        uid: 'test-user-id',
        email: 'testuser@example.com',
        displayName: 'Test User',
        photoURL: 'https://via.placeholder.com/80',
    };

    return {
        getAuth: jest.fn(() => ({
            currentUser: mockCurrentUser,
        })),
        signOut: jest.fn(),
        sendPasswordResetEmail: jest.fn(),
        updateProfile: jest.fn((user, updates) => {
            if (updates.photoURL) {
                mockCurrentUser.photoURL = updates.photoURL;
            }
            return Promise.resolve();
        }),
    };
});

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({
        canceled: false,
        assets: [{ uri: 'mock-selected-image-uri' }],
    }),
}));

describe('Profile Component', () => {
    it('renders the profile-screen correctly with a signed-in user, default state', async () => {
        const { getByText, getByTestId } = render(
            <NavigationContainer>
                <Profiles />
            </NavigationContainer>
        );

        const image = getByTestId('profilePic');
        expect(image.props.source).toEqual({ uri: 'https://via.placeholder.com/80' });
        expect(getByText('Change Profile Image')).toBeTruthy();
        expect(getByText('User Information')).toBeTruthy();
        expect(getByText('Email: testuser@example.com')).toBeTruthy();
        //expect(getByTestId('Username: test-user-id')).toBeDefined();
    });

    it('logs out on button press correctly.', async () => {
        const {getByText} = render(
            <NavigationContainer>
                <Profiles />
            </NavigationContainer>
        );
        fireEvent.press(getByText('Logout'));
        expect(require('firebase/auth').signOut).toHaveBeenCalledTimes(1);
    });

    
    it('should update the profile image to the dog image after the update', async () => {
        const { getByTestId, getByText } = render(
            <NavigationContainer>
                <Profiles />
            </NavigationContainer>
        );

        const profileImage = getByTestId('profilePic');
        expect(profileImage.props.source.uri).toBe('https://via.placeholder.com/80');
        fireEvent.press(getByText('Change Profile Image'));
        profileImage = getByTestId('profilePic');
        await waitFor(() =>
            expect(profileImage.props.source.uri).toBe('https://upload.wikimedia.org/wikipedia/commons/4/43/Cute_dog.jpg')
        );
    });


    it('properly changes password of user', async () => {
        const { getByText } = render(
            <NavigationContainer>
                <Profiles />
            </NavigationContainer>
        );

        fireEvent.press(getByText('Change Password'));

        await waitFor(() => {
            expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
            expect(sendPasswordResetEmail).toHaveBeenCalledWith(
                {
                    currentUser: {
                        email: 'testuser@example.com',
                        uid: 'test-user-id',
                    },
                    signOut: expect.any(Function),
                },
                'testuser@example.com'
            );
        });
    });
});
