import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Friends = () => {
  const [friendUsers, setFriendUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const placeholderImage = 'https://via.placeholder.com/80';
  const currentUserId = auth.currentUser.uid;

  const fetchFriendUsers = async () => {
    try {
      const friendCollection = collection(firestore, 'users', currentUserId, 'friends');
      const friendSnapshot = await getDocs(friendCollection);
      const friendIds = friendSnapshot.docs.map(doc => doc.id);

      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(user => friendIds.includes(user.id));

      setFriendUsers(usersList);
    } catch (error) {
      console.error('Error fetching friend users:', error);
    }
  };

  useEffect(() => {
    fetchFriendUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriendUsers();
    setRefreshing(false);
  };

  const handlePress = (user) => {
    navigation.navigate('Profile', { user });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friendUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.userCard}>
            <Avatar.Image size={50} source={{ uri: item.profileImageURL || placeholderImage }} />
            <Text style={styles.username}>{item.username || 'Unknown'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUsersText}>You're not friends with anyone yet.</Text>
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

export default Friends;