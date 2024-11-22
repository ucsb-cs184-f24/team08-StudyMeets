import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firestore, auth } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import GroupCard from './GroupCard';
import CreateNewPost from './CreateNewPost';

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  useEffect(() => {
    const fetchPosts = () => {
      const postsQuery = query(collection(firestore, 'studymeets'), orderBy('CreatedAt', 'desc'));

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);

        // Extract unique tags from all posts
        const allTags = new Set();
        postsData.forEach((post) => {
          if (post.Tags && Array.isArray(post.Tags)) {
            post.Tags.forEach((tag) => allTags.add(tag));
          }
        });
        setTagsList([...allTags]);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchPosts();
    return () => unsubscribe();
  }, []);

  const toggleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.Title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => post.Tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.topBar}>
        <PaperTextInput
          mode="outlined"
          placeholder="Search study groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        <Button mode="contained" onPress={openFilterModal} style={styles.filterButton}>
          Filter
        </Button>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            onPrimaryAction={(id) => console.log(`Joining group: ${id}`)}
            primaryActionLabel="Join"
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <CreateNewPost visible={isModalVisible} onClose={closeModal} />

      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Tags</Text>
            <FlatList
              data={tagsList}
              keyExtractor={(tag) => tag}
              renderItem={({ item: tag }) => (
                <TouchableOpacity
                  style={[
                    styles.tagContainer,
                    selectedTags.includes(tag) && styles.tagSelected,
                  ]}
                  onPress={() => toggleTagSelection(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonRow}>
              <Button mode="contained" onPress={clearFilters} style={styles.clearButton}>
                Clear Filters
              </Button>
              <Button mode="contained" onPress={closeFilterModal} style={styles.applyButton}>
                Apply
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
  },
  filterButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    width: '100%',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#674fa3',
  },
  tagText: {
    color: '#000',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
  },
});

export default Explore;
