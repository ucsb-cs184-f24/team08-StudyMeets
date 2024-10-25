import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { firestore } from '../firebase';  // Import Firestore from your firebase.js
import { collection, addDoc } from 'firebase/firestore';  // Import Firestore methods
import { Link, router } from 'expo-router';

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
      <Link href="/users/1">Go to user 1{'\n'}</Link>
      <Pressable onPress={() => router.push("/users/2")} style={({ pressed }) => [
      styles.button,
      { backgroundColor: pressed ? '#ddd' : '#007BFF' }
    ]}>
      <Text style={styles.text}>Go to user 2</Text>
    </Pressable>
      <StatusBar style="auto" />
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
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});