import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login'; // Adjust the path to the Login component
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {Alert} from 'react-native';

// Mock Firebase functions
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
    auth: jest.fn(),
    firestore: jest.fn(),
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

    /*await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
      expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
        email: 'test@example.com',
        username: 'testuser',
        createdAt: expect.any(Date),
        createdProfile: false,
      });
    });*/
  });

  it('shows an error when sign-in fails', async () => {
    // Mock a rejected promise for signInWithEmailAndPassword
    signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));

    // Render the Login component
    const { getByPlaceholderText, getByRole, getByText } = render(<Login />);

    // Interact with the component
    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByRole('button', { name: 'Sign In' }));

    // Wait for the error message to appear
    await waitFor(() => {
        expect(getByText('Email and Password not match!')).toBeTruthy();
    });

    // Ensure the mocked function was called
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'wrong@example.com',
        'wrongpassword'
    );
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
