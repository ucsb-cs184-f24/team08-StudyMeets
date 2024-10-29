import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authenticatedUser = userCredential.user;
      setUser(authenticatedUser);
      if (authenticatedUser.emailVerified) {
        navigation.navigate('Main');
      } else {
        alert("Please verify your email before login!");
      }
    } catch (error) {
      alert("Email and Password not match!");
      console.error(error);
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
      });

      setIsSignUp(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isSignUp ? (
        <>
          <Text style={styles.header}>Create Account</Text>
          <TextInput
            placeholder="Username"
            value={username || ''}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Button title="Create Account" onPress={handleCreateAccount} />
              <Button title="Back to Sign In" onPress={() => setIsSignUp(false)} />
            </>
          )}
        </>
      ) : (
        <>
          <Text style={styles.header}>Sign In</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Button title="Sign In" onPress={handleSignIn} />
              <Button title="Back to Create Account" onPress={() => setIsSignUp(true)} />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});