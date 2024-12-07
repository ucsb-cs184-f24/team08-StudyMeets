import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { firestore } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from './GroupCard';
import CreateNewPost from './CreateNewPost';
import { PlusCircle, CircleX, Search, ChevronDown, ChevronUp } from 'lucide-react-native';
import { tagsList } from '../../definitions/Definitions';
import { useSubjectsClasses } from './SubjectsClasses';

const ExploreGroups = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    Days: false,
    Locations: false,
    Subjects: false,
    Classes: false,
    Misc: false,
  });
  const { subjects, classes, loading: isLoadingClasses } = useSubjectsClasses();

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

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  const toggleTagSelection = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const toggleSection = (section) => {
    setExpandedSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.Title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => post.Tags?.includes(tag));
    const matchesSubjects =
      selectedTags.length === 0 || selectedTags.some((subject) => post.Subjects?.includes(subject));
    const matchesClasses =
      selectedTags.length === 0 || selectedTags.some((cls) => post.Classes?.includes(cls));
    return matchesSearch && (matchesTags || matchesSubjects || matchesClasses);
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
          right={
            searchQuery ? (
              <PaperTextInput.Icon
                icon={() => <CircleX size={25} color="black" />}
                onPress={() => setSearchQuery('')}
              />
            ) : null
          }
          left={<PaperTextInput.Icon icon={() => <Search size={25} color="grey" />} />}
        />
        <Button mode="contained" onPress={openFilterModal} style={styles.filterButton}>
          Filter
        </Button>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => <GroupCard item={item} primaryActionLabel="View" />}
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

            {/* Days Section */}
            <TouchableOpacity onPress={() => toggleSection('Days')} style={styles.subheadingContainer}>
              <Text style={styles.subheading}>Days</Text>
              {expandedSections.Days ? <ChevronUp size={20} color="black" /> : <ChevronDown size={20} color="black" />}
            </TouchableOpacity>
            {expandedSections.Days && (
              <FlatList
                data={tagsList.slice(0, 7)}
                keyExtractor={(item) => item}
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
            )}

            {/* Locations Section */}
            <TouchableOpacity onPress={() => toggleSection('Locations')} style={styles.subheadingContainer}>
              <Text style={styles.subheading}>Locations</Text>
              {expandedSections.Locations ? (
                <ChevronUp size={20} color="black" />
              ) : (
                <ChevronDown size={20} color="black" />
              )}
            </TouchableOpacity>
            {expandedSections.Locations && (
              <FlatList
                data={tagsList.slice(7, 35)}
                keyExtractor={(item) => item}
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
            )}

            {/* Subjects Section */}
            <TouchableOpacity onPress={() => toggleSection('Subjects')} style={styles.subheadingContainer}>
              <Text style={styles.subheading}>Subjects</Text>
              {expandedSections.Subjects ? (
                <ChevronUp size={20} color="black" />
              ) : (
                <ChevronDown size={20} color="black" />
              )}
            </TouchableOpacity>
            {expandedSections.Subjects && (
              <FlatList
                data={subjects}
                keyExtractor={(subject) => subject}
                renderItem={({ item: subject }) => (
                  <TouchableOpacity
                    style={[
                      styles.tagContainer,
                      selectedTags.includes(subject) && styles.tagSelected,
                    ]}
                    onPress={() => toggleTagSelection(subject)}
                  >
                    <Text style={styles.tagText}>{subject}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* Classes Section */}
            <TouchableOpacity onPress={() => toggleSection('Classes')} style={styles.subheadingContainer}>
              <Text style={styles.subheading}>Classes</Text>
              {expandedSections.Classes ? (
                <ChevronUp size={20} color="black" />
              ) : (
                <ChevronDown size={20} color="black" />
              )}
            </TouchableOpacity>
            {expandedSections.Classes && (
              isLoadingClasses ? (
                <Text>Loading...</Text>
              ) : (
                <FlatList
                  data={classes}
                  keyExtractor={(cls) => cls}
                  renderItem={({ item: cls }) => (
                    <TouchableOpacity
                      style={[
                        styles.tagContainer,
                        selectedTags.includes(cls) && styles.tagSelected,
                      ]}
                      onPress={() => toggleTagSelection(cls)}
                    >
                      <Text style={styles.tagText}>{cls}</Text>
                    </TouchableOpacity>
                  )}
                />
              )
            )}

            {/* Misc Section */}
            <TouchableOpacity onPress={() => toggleSection('Misc')} style={styles.subheadingContainer}>
              <Text style={styles.subheading}>Misc</Text>
              {expandedSections.Misc ? <ChevronUp size={20} color="black" /> : <ChevronDown size={20} color="black" />}
            </TouchableOpacity>
            {expandedSections.Misc && (
              <FlatList
                data={tagsList.slice(35)}
                keyExtractor={(item) => item}
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
            )}

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
    zIndex: 10,
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
    backgroundColor: '#6495ed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#6495ed',
  },
  subheadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  tagContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: '#ededed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagSelected: {
    backgroundColor: '#6495ed',
    borderColor: '#6495ed',
    borderWidth: 1,
  },
  tagText: {
    textAlign: 'center',
    color: 'black',
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



export default ExploreGroups;