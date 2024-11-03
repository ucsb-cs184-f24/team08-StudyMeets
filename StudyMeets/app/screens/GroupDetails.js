import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const GroupDetails = ({ route, navigation }) => {
  const { group } = route.params; // Get the group data passed from Explore.js
  const [loading, setLoading] = useState(false);

  const handleJoinGroup = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
  
      // Save the group to the user's joined groups in Firestore
      const userDoc = doc(firestore, 'users', currentUser.uid, 'joinedGroups', group.id);
      await setDoc(userDoc, { ...group });
  
      // Manually update MyGroups state if possible
      navigation.navigate('MyGroups', { refresh: true }); // Pass a refresh signal
  
      Alert.alert("Success", "You have joined the group!");
    } catch (error) {
      console.error("Error joining group:", error);
      Alert.alert("Error", "Failed to join the group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group.Title}</Text>
      <Text style={styles.location}>Location: {group.Location}</Text>
      <Text style={styles.description}>Description: {group.Description}</Text>
      <Text style={styles.owner}>Created by: {group.OwnerName}</Text>

      <Button title="Join" onPress={handleJoinGroup} disabled={loading} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default GroupDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  owner: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
});
