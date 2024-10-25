import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { firestore } from './firebase';  // Import Firestore from your firebase.js
import { collection, addDoc } from 'firebase/firestore';  // Import Firestore methods
import CurrentLocation from './components/location/CurrentLocation';

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
    <View style={styles.container}>
      <Text>{message}</Text>
      <StatusBar style="auto" />
      <CurrentLocation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
