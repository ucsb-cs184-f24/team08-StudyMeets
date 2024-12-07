import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Modal, ScrollView, Alert } from 'react-native';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import { Button, IconButton, Chip } from 'react-native-paper';

const PostsNotifications = () => {
  const [postNotifications, setPostNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const currentUserId = auth.currentUser.uid;

  const fetchPostNotifications = async () => {
    try {
      const notificationsCollection = collection(firestore, 'users', currentUserId, 'notifications');
      const notificationsSnapshot = await getDocs(notificationsCollection);
      const notificationsList = notificationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        PostId: doc.data().PostId, 
        ...doc.data(),
      }));
      setPostNotifications(notificationsList);
    } catch (error) {
      console.error('Error fetching post notifications:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notificationRef = doc(firestore, 'users', currentUserId, 'notifications', notificationId);
      await deleteDoc(notificationRef); 
      setPostNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
      // Alert.alert('Deleted', 'Notification has been deleted.');
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Alert.alert('Error', 'Failed to delete notification.');
    }
  };

  useEffect(() => {
    fetchPostNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPostNotifications();
    setRefreshing(false);
  };

  const viewPostDetails = async (postId) => {
    try {
      const notification = postNotifications.find((notif) => notif.id === postId);
      if (!notification) throw new Error('Notification not found');
  
      const postDoc = await getDoc(doc(firestore, 'studymeets', notification.PostId));
      if (postDoc.exists()) {
        setSelectedPost({ ...postDoc.data(), id: notification.id, PostId: notification.PostId });
        setModalVisible(true);
      } else {
        throw new Error('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const handleJoinGroup = async () => {
    const currentUser = auth.currentUser;
    if (currentUser && selectedPost) {
      try {
        console.log('Joining group for Post ID:', selectedPost.PostId);
        console.log('Notification ID to delete:', selectedPost.id);
  
        await addDoc(collection(firestore, 'userGroups'), {
          userId: currentUser.uid,
          postId: selectedPost.PostId,
        });
  
        Alert.alert('Joined', 'You have successfully joined the group.');
        setModalVisible(false);
        await deleteNotification(selectedPost.id);
      } catch (error) {
        console.error('Error joining group:', error);
        Alert.alert('Error', 'Failed to join the group.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={postNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <TouchableOpacity onPress={() => viewPostDetails(item.PostId)} style={{ flex: 1 }}>
              <Text>{item.Title}</Text>
            </TouchableOpacity>
            <IconButton
              icon="close"
              onPress={() => deleteNotification(item.id)}
              style={styles.deleteButton}
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.noUsersContainer}>
            <Text style={styles.noUsersText}>You have no notifications.</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {selectedPost && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedPost.Title}</Text>
                <IconButton icon="close" onPress={() => setModalVisible(false)} />
              </View>
              <ScrollView>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.bodyText}>{selectedPost.Location}</Text>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.bodyText}>{selectedPost.Description}</Text>
                {selectedPost.Tags && selectedPost.Tags.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <View style={styles.tagsContainer}>
                      {selectedPost.Tags.map((tag, index) => (
                        <Chip key={index} style={styles.tag}>
                          {tag}
                        </Chip>
                      ))}
                    </View>
                  </>
                )}
                <View style={styles.detailsContainer}>
                  <Text style={styles.bodyText}>Created by: {selectedPost.OwnerName}</Text>
                  <Text style={styles.bodyText}>
                    Date: {selectedPost.CreatedAt?.toDate().toLocaleDateString() || 'N/A'}
                  </Text>
                  <Text style={styles.bodyText}>
                    Time: {selectedPost.CreatedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
                  </Text>
                </View>
              </ScrollView>
              <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={handleJoinGroup}
                style={styles.joinButton}
              >
                Join
              </Button>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  Close
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  emptyText: { textAlign: 'center', marginTop: 20 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '90%', maxHeight: '90%', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginLeft: 16 },
  bodyText: { fontSize: 14, marginTop: 8, marginLeft: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 16, marginTop: 8 },
  tag: { margin: 4 },
  detailsContainer: { marginTop: 16, marginBottom: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-evenly', margin: 16 },
  joinButton: { flex: 1, marginRight: 8 },
  closeButton: { flex: 1, marginLeft: 8 },
  deleteButton: { marginLeft: 8 },
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

export default PostsNotifications;