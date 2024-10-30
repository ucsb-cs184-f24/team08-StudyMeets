import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore'; 
import { firestore } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';

const Profiles = () => {
  const [user, setUser] = useState(null); 
  const [username, setUsername] = useState(null); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data()?.username || 'No username found');
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navigate back to the SignIn (Login) page
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>User Information</Text>
          <Text>Email: {user.email}</Text>
          {username && <Text>Username: {username}</Text>}
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>No user is logged in</Text>
      )}
    </View>
  );
};

export default Profiles;

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
