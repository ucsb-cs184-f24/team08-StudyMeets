import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CreateNewPost from './CreateNewPost';

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPostIds, setExpandedPostIds] = useState(new Set());
  const navigation = useNavigation();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const fetchPosts = () => {
      const postsQuery = query(collection(firestore, 'studymeets'), orderBy('CreatedAt', 'desc'));

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      });

      return unsubscribe;
    };

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

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTags = (postId) => {
    setExpandedPostIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(postId)) {
        newIds.delete(postId);
      } else {
        newIds.add(postId);
      }
      return newIds;
    });
  };

  const renderPost = ({ item }) => {
    const isExpanded = expandedPostIds.has(item.id);

    return (
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.Title}</Text>
        <Text style={styles.postLocation}>Location: {item.Location}</Text>
        <Text style={styles.postDescription}>{item.Description}</Text>
        <Text style={styles.postOwner}>Created by: {item.OwnerName}</Text>
        <Text style={styles.postDate}>Date: {item.CreatedAt.toDate().toLocaleString()}</Text>

        {item.Tags && item.Tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Tags:</Text>
            <View style={styles.tags}>
              {item.Tags.slice(0, isExpanded ? item.Tags.length : 4).map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
              {item.Tags.length > 4 && (
                <TouchableOpacity onPress={() => toggleTags(item.id)} style={styles.arrowContainer}>
                  <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search study groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  tagsContainer: {
    marginTop: 10,
  },
  tagsLabel: {
    fontWeight: 'bold',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 5,
    margin: 5,
    fontSize: 12,
  },
  arrowContainer: {
    marginLeft: 5,
  },
  arrow: {
    fontSize: 16,
    color: 'gray',
  },
});
