import React, { useState, useContext } from 'react';
import { Pressable, View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ThemeContext } from "../../theme/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [isVisible, setVisible] = useState(true);
  const { theme } = useContext(ThemeContext);


  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authenticatedUser = userCredential.user;
      setUser(authenticatedUser);
      const userDoc = await getDoc(doc(firestore, 'users', authenticatedUser.uid));

      if (authenticatedUser.emailVerified && userDoc.data().createdProfile) {
        navigation.navigate('Main');
      } else if (authenticatedUser.emailVerified && !userDoc.data().createdProfile){
        navigation.navigate('CreateProfile')
      } else {
        alert("Please verify your email before login!");
      }
    } catch (error) {
      alert("Email and Password not match!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      sendEmailVerification(user);
      alert('Check your email for verification');

      await setDoc(doc(firestore, 'users', user.uid), { 
        email: user.email,
        username: username,
        createdAt: new Date(),
        createdProfile: false,
      });

      setIsSignUp(false);
    } catch (error) {
      alert("Invalid Email!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => {
    setVisible(!isVisible);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>StudyMeets</Text>
      {isSignUp ? (
        <>
          <Text testID='HeaderCreateAccount' style={[styles.header, { color: theme.colors.text }]}>Create Account</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              value={username || ''}
              onChangeText={setUsername}
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.placeholderTextColor}
              borderColor={theme.colors.borderColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.placeholderTextColor}
              borderColor={theme.colors.borderColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isVisible}
              style={[styles.passwordInput, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.placeholderTextColor}
              borderColor={theme.colors.borderColor}
            />
            <Button
              title="Show"
              onPress={toggleVisibility}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button testID='CreateAccountButton' title="Create Account" onPress={handleCreateAccount} />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button title="Back to Sign In" onPress={() => setIsSignUp(false)} />
              </View>
            </View>
          </>
          )}
        </>
      ) : (
        <>
          <Text testID='HeaderSignIn' style={[styles.header, { color: theme.colors.text }]}>Sign In</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.placeholderTextColor}
              borderColor={theme.colors.borderColor}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isVisible}
              style={[styles.passwordInput, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.placeholderTextColor}
              borderColor={theme.colors.borderColor}
            />
            <Button
              title='Show'
              onPress={toggleVisibility}
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <Button testID='SignInButton' title="Sign In" onPress={handleSignIn} />
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                  <Button title="Back to Create Account" onPress={() => setIsSignUp(true)} />
                </View>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'white', 
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginRight: 10, // Add space between the input and button
  },
  createAccountButton: {
    marginTop: 20,
    marginBottom: 10
  },
  buttonContainer: {
    marginBottom: 10,
  },
  buttonWrapper: {
    width: 330
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 100,
    marginTop: -60
  }
});

export default Login;
