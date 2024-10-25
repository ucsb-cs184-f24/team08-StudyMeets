import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore'; 
import { firestore } from '../../firebase'; 

const Account = () => {
  const [user, setUser] = useState(null); 
  const [username, setUsername] = useState(null); 

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

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>User Information</Text>
          <Text>Email: {user.email}</Text>
          {username && <Text>Username: {username}</Text>}
        </>
      ) : (
        <Text>No user is logged in</Text>
      )}
    </View>
  );
};

export default Account;

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