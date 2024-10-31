import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import { firestore } from '../../firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { auth } from '../../firebase';
import EditPost from './EditPost'; 

const MyGroups = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchMyPosts = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const postsQuery = query(
          collection(firestore, 'studymeets'),
          where('OwnerEmail', '==', currentUser.email)
        );

        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMyPosts(postsData);
        });

        return unsubscribe;
      }
    };

    const unsubscribe = fetchMyPosts();

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleEditPost = (id) => {
    setSelectedPostId(id);
    setIsEditModalVisible(true);
  };

  const handleDeletePost = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'studymeets', id));
      Alert.alert('Deleted', 'The post has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert('Error', 'Failed to delete the post.');
    }
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedPostId(null);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.Title}</Text>
      <Text style={styles.postLocation}>Location: {item.Location}</Text>
      <Text style={styles.postDescription}>{item.Description}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => handleEditPost(item.id)} />
        <Button title="Delete" onPress={() => handleDeletePost(item.id)} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={myPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      {isEditModalVisible && (
        <EditPost 
          visible={isEditModalVisible} 
          onClose={closeEditModal} 
          postId={selectedPostId} 
        />
      )}
    </View>
  );
};

export default MyGroups;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 20,
  },
  postContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postLocation: {
    fontSize: 16,
    color: '#555',
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});