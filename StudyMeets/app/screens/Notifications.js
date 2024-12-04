import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Modal, Alert } from 'react-native';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Avatar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Notifications = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const placeholderImage = 'https://via.placeholder.com/80';
  const currentUserId = auth.currentUser.uid;
  const navigation = useNavigation();

  const fetchFriendRequests = async () => {
    try {
      const requestsCollection = collection(firestore, 'users', currentUserId, 'friendrequestreceived');
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestIds = requestsSnapshot.docs.map((doc) => doc.id);

      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => requestIds.includes(user.id));

      setFriendRequests(usersList);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriendRequests();
    setRefreshing(false);
  };

  const handlePress = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
  };

  const navigateToProfile = () => {
    if (selectedUser) {
      closeModal();
      navigation.navigate('Profile', { user: selectedUser });
    }
  };

  const acceptRequest = async () => {
    if (!selectedUser) return;

    try {
      const friendRefCurrentUser = doc(firestore, 'users', currentUserId, 'friends', selectedUser.id);
      const friendRefSelectedUser = doc(firestore, 'users', selectedUser.id, 'friends', currentUserId);

      await Promise.all([
        setDoc(friendRefCurrentUser, { username: selectedUser.username }),
        setDoc(friendRefSelectedUser, { username: auth.currentUser.displayName }),
        deleteDoc(doc(firestore, 'users', currentUserId, 'friendrequestreceived', selectedUser.id)),
      ]);

      Alert.alert('Accepted', `Friend request from ${selectedUser.username} accepted.`);
      closeModal();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'An error occurred while accepting the friend request.');
    }
  };

  const rejectRequest = async () => {
    if (!selectedUser) return;

    try {
      await deleteDoc(doc(firestore, 'users', currentUserId, 'friendrequestreceived', selectedUser.id));

      Alert.alert('Rejected', `Friend request from ${selectedUser.username} rejected.`);
      closeModal();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'An error occurred while rejecting the friend request.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={styles.userCard}>
            <View style={styles.messageContainer}>
              <Text style={styles.header}>Friend Request Received</Text>
              <Text style={styles.message}>
                You have received a friend request from <Text style={styles.username}>{item.username || 'Unknown'}</Text>.
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUsersText}>You have no notifications.</Text>
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

      {/* Modal Popup */}
      {selectedUser && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Avatar.Image
                size={100}
                source={{ uri: selectedUser.profileImageURL || placeholderImage }}
              />
              <Text style={styles.modalUsername}>{selectedUser.username || 'Unknown'}</Text>
              <Button mode="contained" onPress={acceptRequest} style={styles.actionButton}>
                Accept Request
              </Button>
              <Button mode="outlined" onPress={rejectRequest} style={styles.actionButton}>
                Reject Request
              </Button>
              <Button mode="contained" onPress={navigateToProfile} style={styles.profileButton}>
                View Profile
              </Button>
              <Button mode="outlined" onPress={closeModal} style={styles.closeButton}>
                Close
              </Button>
            </View>
          </View>
        </Modal>
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
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageContainer: {
    flexDirection: 'column',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  username: {
    fontWeight: 'bold',
    color: '#007bff',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalUsername: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButton: {
    marginTop: 10,
    width: '100%',
  },
  profileButton: {
    marginTop: 20,
    width: '100%',
  },
  closeButton: {
    marginTop: 10,
    width: '100%',
  },
});

export default Notifications;
