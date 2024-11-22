import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login'; // Adjust the path to the Login component
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {Alert} from 'react-native';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(() => ({
    data: jest.fn(() => ({ createdProfile: false })),
  })),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'testuser@example.com',
    },
    signOut: jest.fn(),
  },
  firestore: jest.fn(),
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('Login Component', () => {
  it('renders the sign-in screen correctly', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<Login />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('HeaderSignIn')).toBeDefined();
    expect(getByTestId('SignInButton')).toBeDefined();
    expect(getByText('Back to Create Account')).toBeTruthy();
  });

  it('switches to the sign-up screen when "Back to Create Account" is pressed', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<Login />);
    fireEvent.press(getByText('Back to Create Account'));
    expect(getByTestId('HeaderCreateAccount')).toBeDefined();
    expect(getByTestId('CreateAccountButton')).toBeDefined();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByText('Back to Sign In')).toBeTruthy();
  });

  it('handles sign-in with valid credentials', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { emailVerified: true, uid: '123' },
    });

    const { getByPlaceholderText, getByText, getByRole } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByRole('button', {name: 'Sign In'});
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);
    await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123'));
  });

  it('handles create account with valid credentials', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: '123', email: 'test@example.com' },
    });

    const { getByText, getByPlaceholderText, getByRole } = render(<Login />);
    fireEvent.press(getByText('Back to Create Account'));

    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const createAccountButton = getByRole('button', {name:'Create Account'});

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(createAccountButton);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    const passwordInput = getByPlaceholderText('Password');
    const toggleButton = getByText('Show');
    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(toggleButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });
});
