import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firestore } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import GroupCard from './GroupCard';
import CreateNewPost from './CreateNewPost';
import { PlusCircle } from 'lucide-react-native';

const Explore = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  const API_KEY = '4N67Suy0261kD1AWSVvBOP0jdMS7E1PY'; // Put API key here DO NOT PUSH TO GITHUB
  const BASE_URL = 'https://api.ucsb.edu/academics/curriculums/v3';

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const openFilterModal = () => {
    fetchSubjectsAndClasses();
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => setFilterModalVisible(false);

  useEffect(() => {
    const fetchPosts = () => {
      const postsQuery = query(
        collection(firestore, 'studymeets'),
        orderBy('CreatedAt', 'desc')
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);

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

  const fetchSubjectsAndClasses = async () => {
    setIsLoadingSubjects(true);
    try {
      const subjectResponse = await fetch(
        `${BASE_URL}/classes/search?quarter=20244&pageSize=500`,
        {
          headers: {
            'ucsb-api-key': API_KEY,
          },
        }
      );

      if (!subjectResponse.ok)
        throw new Error(`Error fetching subjects: ${subjectResponse.status}`);

      const subjectData = await subjectResponse.json();
      const uniqueSubjects = new Set(subjectData.classes.map((cls) => cls.subjectArea.trim()));
      setSubjects(Array.from(uniqueSubjects));

      const classPromises = Array.from(uniqueSubjects).map(async (subject) => {
        try {
          const classResponse = await fetch(
            `${BASE_URL}/classes/search?quarter=20244&subjectCode=${encodeURIComponent(subject)}&pageSize=500`,
            {
              headers: {
                'ucsb-api-key': API_KEY,
              },
            }
          );

          if (!classResponse.ok) {
            console.warn(`Skipping subject ${subject} due to fetch error.`);
            return [];
          }

          const classData = await classResponse.json();
          return classData.classes.map((cls) => cls.courseId);
        } catch (error) {
          console.error(`Error fetching classes for ${subject}:`, error.message);
          return [];
        }
      });

      const classResults = await Promise.all(classPromises);
      setClasses(classResults.flat());
    } catch (error) {
      console.error('Failed to fetch subjects and classes:', error.message);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

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
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.Tags?.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <PaperTextInput
          mode="outlined"
          placeholder="Search study groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        <Button
          mode="contained"
          onPress={openFilterModal}
          style={styles.filterButton}
        >
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

      <TouchableOpacity onPress={openModal} style={styles.floatingButton}>
        <View style={styles.circleBackground}>
          <PlusCircle size={40} color="white" />
        </View>
      </TouchableOpacity>

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
              data={[
                { type: 'Tags', data: tagsList },
                { type: 'Subjects', data: subjects },
                { type: 'Classes', data: classes },
              ]}
              keyExtractor={(item, index) => `${item.type}-${index}`}
              renderItem={({ item }) => (
                <>
                  <Text style={styles.subheading}>{item.type}</Text>
                  <FlatList
                    data={item.data}
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
                </>
              )}
              contentContainerStyle={styles.scrollableContent}
            />

            <View style={styles.buttonRow}>
              <Button
                mode="contained"
                onPress={clearFilters}
                style={styles.clearButton}
              >
                Clear Filters
              </Button>
              <Button
                mode="contained"
                onPress={closeFilterModal}
                style={styles.applyButton}
              >
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
    paddingVertical: 12,
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
    zIndex: 10, // Ensure the filter button is above other elements
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 10,
  },
  circleBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#674fa3',
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
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#674fa3',
  },
  tagContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#ededed',
    alignItems: 'center',
  },
  tagSelected: {
    backgroundColor: '#674fa3',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
