import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CreateNewPost from './CreateNewPost';

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Function to open the modal
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const fetchPosts = () => {
    setRefreshing(true);
    const postsQuery = query(collection(firestore, 'studymeets'), orderBy('CreatedAt', 'desc'));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
      setRefreshing(false);
    });

    return unsubscribe;
  };

  useEffect(() => {

    const unsubscribe = fetchPosts();

    return () => unsubscribe();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={openModal} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 30, color: 'grey' }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.Title}</Text>
      <Text style={styles.postLocation}>Location: {item.Location}</Text>
      <Text style={styles.postDescription}>{item.Description}</Text>
      <Text style={styles.postOwner}>Created by: {item.OwnerName}</Text>
      <Text style={styles.postDate}>Date: {item.CreatedAt.toDate().toLocaleString()}</Text>
    </View>
  );

  const handleRefresh = () =>{
    fetchPosts();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      <CreateNewPost visible={isModalVisible} onClose={closeModal} />
    </View>
  );
};

export default Explore;

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
  postOwner: {
    fontSize: 14,
    color: '#888',
  },
  postDate: {
    fontSize: 12,
    color: '#aaa',
  },
});