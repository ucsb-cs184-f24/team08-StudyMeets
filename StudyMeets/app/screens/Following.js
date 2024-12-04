import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Following = () => {
  const [followingUsers, setFollowingUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const placeholderImage = 'https://via.placeholder.com/80';
  const currentUserId = auth.currentUser.uid;

  const fetchFollowingUsers = async () => {
    try {
      const followingCollection = collection(firestore, 'users', currentUserId, 'following');
      const followingSnapshot = await getDocs(followingCollection);
      const followingIds = followingSnapshot.docs.map(doc => doc.id);

      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => followingIds.includes(user.id));

      setFollowingUsers(usersList);
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowingUsers();
    setRefreshing(false);
  };

  const handlePress = (user) => {
    navigation.navigate('Profile', { user });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={followingUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.userCard}>
            <Avatar.Image size={50} source={{ uri: item.profileImageURL || placeholderImage }} />
            <Text style={styles.username}>{item.username || 'Unknown'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUsersText}>You're not following anyone yet.</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
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

export default Following;