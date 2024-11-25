import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Followers = () => {
  const [followersUsers, setFollowersUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const placeholderImage = 'https://via.placeholder.com/80';
  const currentUserId = auth.currentUser.uid;

  const fetchFollowersUsers = async () => {
    try {
      setLoading(true);
      const followersCollection = collection(firestore, 'users', currentUserId, 'followers');
      const followersSnapshot = await getDocs(followersCollection);
      const followersIds = followersSnapshot.docs.map(doc => doc.id);

      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => followersIds.includes(user.id));

      setFollowersUsers(usersList);
    } catch (error) {
      console.error('Error fetching followers users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowersUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowersUsers();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handlePress = (user) => {
    navigation.navigate('Profile', { user });
  };

  return (
    <View style={styles.container}>
      {followersUsers.length > 0 ? (
        <FlatList
          data={followersUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.userCard}>
              <Avatar.Image size={50} source={{ uri: item.profileImageURL || placeholderImage }} />
              <Text style={styles.username}>{item.username || 'Unknown'}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.noUsersContainer}>
          <Text style={styles.noUsersText}>You're not followed by anyone yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f9f9f9',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noUsersText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Followers;
