import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Avatar, TextInput as PaperTextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CircleX } from 'lucide-react-native';

const ExploreUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const placeholderImage = 'https://via.placeholder.com/80';
  const currentUserId = auth.currentUser.uid;

  const fetchAllUsers = async () => {
    try {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUserId); // Exclude current user

      setAllUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllUsers();
    setRefreshing(false);
  };

  const handlePress = (user) => {
    navigation.navigate('Profile', { user });
  };

  const filteredUsers = allUsers.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => setSearchQuery('');

  return (
    <SafeAreaView style={styles.container}>
      <PaperTextInput
        mode="outlined"
        placeholder="Search users by username..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        right={
          searchQuery ? (
            <PaperTextInput.Icon
              icon={() => <CircleX size={25} color="black" />}
              onPress={clearSearch}
            />
          ) : null }
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.userCard}>
            <Avatar.Image size={50} source={{ uri: item.profileImageURL || placeholderImage }} />
            <Text style={styles.username}>{item.username || 'Unknown'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUsersText}>No users found.</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBar: {
    marginHorizontal: 10,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
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

export default ExploreUsers;
