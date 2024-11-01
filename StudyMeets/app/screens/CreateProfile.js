import { View, Text, Button, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from '../../firebase';



const CreateProfile = () => {

    const [user, setUser] = useState(null); 
    const navigation = useNavigation();
    const currentUser = auth.currentUser;

    useEffect(() => {
        setUser(currentUser);
    }, [currentUser]);

    const handleCreateProfile = async () => {
        try {
            const userRef = doc(firestore, "users", currentUser.uid);
            await updateDoc(userRef, { createdProfile: true });
            navigation.navigate('Main');
        } catch (error) {
            console.error("Error Creating Profile: ", error);
        }
      };

  return (
    <View style={styles.container}>
      <Text>This is where you will create your profile</Text>
      <Button title="Create Profile" onPress={handleCreateProfile} />
    </View>
  )
}

export default CreateProfile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
  });