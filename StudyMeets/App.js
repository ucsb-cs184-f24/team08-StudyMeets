import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { firestore } from './firebase';  // Import Firestore from your firebase.js
import { collection, addDoc } from 'firebase/firestore';  // Import Firestore methods
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './SignUp'; // Adjust the import path accordingly

// Create the Stack Navigator
const Stack = createNativeStackNavigator();

// Home screen with a Sign Up button
const HomeScreen = ({ navigation, setMessage }) => {
  return (
      <View style={styles.container}>
          <Button
              title="Sign Up"
              onPress={() => {
                  setMessage(""); // Clear firebase when clicking
                  navigation.navigate('SignUp');
              }}
          />
      </View>
  );
};

export default function App() {
  const [message, setMessage] = useState("Connecting to Firebase...");

  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        // Write a test document to the "testCollection" collection in Firestore
        const docRef = await addDoc(collection(firestore, "testCollection"), {
          testField: "Hello, Firebase!"
        });
        setMessage("Firebase connected! Document written with ID: " + docRef.id);
      } catch (e) {
        setMessage("Error adding document: " + e);
      }
    };

    testFirestoreConnection();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          children={props => <HomeScreen {...props} setMessage={setMessage} />} 
        />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{message}</Text>
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    position: 'absolute',
    bottom: 250, // higher number moves message higher on screen
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});