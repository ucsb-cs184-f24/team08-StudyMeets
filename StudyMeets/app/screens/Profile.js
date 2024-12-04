import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import { doc, getDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';

const Profile = ({ route }) => {
  const { user } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const docRef = doc(
          firestore,
          'users',
          currentUserId,
          'following',
          user.id
        );
        const docSnap = await getDoc(docRef);

        setIsFollowing(docSnap.exists());
      } catch (error) {
        console.error('Error checking following status: ', error);
      }
    };

    checkFollowingStatus();
  }, [firestore, currentUserId, user.id]);

  const fetchCurrentUsername = async () => {
    try {
      const userDocRef = doc(firestore, 'users', currentUserId);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        return userDoc.data().username;
      } else {
        console.error('User document does not exist.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching current user username:', error);
      return null;
    }
  };

  const handleFollowToggle = async () => {
    try {
      const currentUsername = await fetchCurrentUsername();
      if (!currentUsername) {
        console.error('Could not retrieve current user username.');
        return;
      }
  
      if (isFollowing) {
        const followingRef = doc(
          firestore,
          'users',
          currentUserId,
          'following',
          user.id
        );
        const followersRef = doc(
          firestore,
          'users',
          user.id,
          'followers',
          currentUserId
        );
  
        await Promise.all([
          deleteDoc(followingRef),
          deleteDoc(followersRef),
        ]);

        Alert.alert(`Unfollowed`, `You Are No Longer Following ${user.username}`);

      } else {
        const followingRef = doc(
          firestore,
          'users',
          currentUserId,
          'following',
          user.id
        );
        const followersRef = doc(
          firestore,
          'users',
          user.id,
          'followers',
          currentUserId
        );
  
        await Promise.all([
          setDoc(followingRef, { username: user.username }),
          setDoc(followersRef, { username: currentUsername }),
        ]);

        Alert.alert(`Followed`, `Following ${user.username}`);
      }
  
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={120}
          source={{ uri: user.profileImageURL || 'https://via.placeholder.com/150' }}
        />
      </View>

      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button
        mode="contained"
        onPress={handleFollowToggle}
        style={styles.followButton}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>

      <Text style={[styles.detailsTextBold]}>University: </Text>
      <Text style={styles.detailsText}>{user.university}</Text>

      <Text style={[styles.detailsTextBold]}>Major: </Text>
      <Text style={styles.detailsText}>{user.major}</Text>

      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>Bio</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>Interests</Text>
        <Text style={styles.bioText}>{user.interests}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 80,
    padding: 5,
    backgroundColor: '#fff',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    color: '#888',
  },
  detailsText: {
    fontSize: 16,
    color: '#555',
  },
  detailsTextBold: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
    marginTop: 10,
  },
  bioContainer: {
    marginTop: 20,
    width: '90%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  followButton: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
  },
});

export default Profile;
