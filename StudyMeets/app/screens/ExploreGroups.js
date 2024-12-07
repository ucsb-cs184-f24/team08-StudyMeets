import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, Modal, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { TextInput as PaperTextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from './GroupCard';
import CreateNewPost from './CreateNewPost';
import PeopleList from './PeopleList';
import { PlusCircle, CircleX, Search, ChevronDown, ChevronUp } from 'lucide-react-native';
import { tagsList } from '../../definitions/Definitions';
import { useSubjectsClasses } from './SubjectsClasses';
import { ThemeContext } from '../../theme/ThemeContext';

const ExploreGroups = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isPeopleModalVisible, setPeopleModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedSections, setExpandedSections] = useState({Days: false, Locations: false, Subjects: false, Classes: false, Misc: false,});
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);
  const { subjects, classes, loading: isLoadingClasses } = useSubjectsClasses();
  const { theme } = useContext(ThemeContext);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  useEffect(() => {
    const fetchJoinedGroups = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userGroupsQuery = query(collection(firestore, 'userGroups'), orderBy('postId'));

        const unsubscribe = onSnapshot(userGroupsQuery, (snapshot) => {
          const groups = snapshot.docs
            .filter((doc) => doc.data().userId === currentUser.uid)
            .map((doc) => doc.data().postId);
          setJoinedGroups(groups);
        });

        return unsubscribe;
      }
    };

    const unsubscribe = fetchJoinedGroups();
    return () => unsubscribe();
  }, []);

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

  const clearFilters = () => setSelectedTags([]);

  const handlePeopleClick = async (postId) => {
    try {
      const groupDoc = await getDoc(doc(firestore, 'studymeets', postId));
      if (!groupDoc.exists()) {
        throw new Error('Group not found.');
      }

      const { OwnerEmail } = groupDoc.data();

      const ownerQuery = query(collection(firestore, 'users'), where('email', '==', OwnerEmail));
      const ownerSnapshot = await getDocs(ownerQuery);

      if (ownerSnapshot.empty) {
        throw new Error('Owner not found.');
      }

      const ownerDoc = ownerSnapshot.docs[0];
      const ownerData = { id: ownerDoc.id, ...ownerDoc.data() };

      const userGroupsQuery = query(
        collection(firestore, 'userGroups'),
        where('postId', '==', postId)
      );
      const userGroupsSnapshot = await getDocs(userGroupsQuery);
      const userIds = userGroupsSnapshot.docs.map((doc) => doc.data().userId);

      if (userIds.length === 0) {
        setMembers([]);
        setOwner(ownerData);
        setPeopleModalVisible(true);
        return;
      }

      const usersQuery = query(
        collection(firestore, 'users'),
        where('__name__', 'in', userIds)
      );
      const usersSnapshot = await getDocs(usersQuery);

      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembers(usersData);
      setOwner(ownerData);
      setPeopleModalVisible(true);
    } catch (error) {
      console.error('Error fetching people:', error);
      Alert.alert('Error', 'Failed to fetch group members.');
    }
  };

  const handleJoinGroup = async (postId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await addDoc(collection(firestore, 'userGroups'), {
          userId: currentUser.uid,
          postId: postId,
        });
        Alert.alert('Joined', 'You have successfully joined the group.');
      } catch (error) {
        console.error('Error joining group:', error);
        Alert.alert('Error', 'Failed to join the group.');
      }
    }
  };

  const handleLeaveGroup = async (postId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userGroupQuery = query(
          collection(firestore, 'userGroups'),
          where('userId', '==', currentUser.uid),
          where('postId', '==', postId)
        );

        const querySnapshot = await getDocs(userGroupQuery);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        Alert.alert('Left', 'You have successfully left the group.');
      } catch (error) {
        console.error('Error leaving group:', error);
        Alert.alert('Error', 'Failed to leave the group.');
      }
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'studymeets', id));
      Alert.alert('Deleted', 'The post has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert('Error', 'Failed to delete the post.');
    }
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
        renderItem={({ item }) => {
          const isOwner = item.OwnerEmail === auth.currentUser?.email;
          const isJoined = joinedGroups.includes(item.id);

          return (
            <GroupCard
              item={item}
              onPrimaryAction={() => handlePeopleClick(item.id)}
              primaryActionLabel="People"
              onSecondaryAction={() => {
                if (isOwner) {
                  handleDeleteGroup(item.id);
                } else {
                  isJoined ? handleLeaveGroup(item.id) : handleJoinGroup(item.id);
                }
              }}
              secondaryActionLabel={isOwner ? 'Delete' : isJoined ? 'Leave' : 'Join'}
            />
          );
        }}
        keyExtractor={(item) => item.id}
      />
      <PeopleList
        visible={isPeopleModalVisible}
        onClose={() => setPeopleModalVisible(false)}
        members={members}
        owner={owner}
      />
      <CreateNewPost visible={isModalVisible} onClose={closeModal} />
      {!isModalVisible && (
        <TouchableOpacity onPress={openModal} style={styles.floatingButton}>
          <View style={styles.circleBackground}>
            <PlusCircle size={40} color="white" />
          </View>
        </TouchableOpacity>
      )}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Tags</Text>

            <TouchableOpacity
              onPress={() => toggleSection('Days')}
              style={styles.subheadingContainer}
            >
              <Text style={styles.subheading}>Days</Text>
              {expandedSections.Days ? (
                <ChevronUp size={20} color="black" />
              ) : (
                <ChevronDown size={20} color="black" />
              )}
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

            <TouchableOpacity
              onPress={() => toggleSection('Locations')}
              style={styles.subheadingContainer}
            >
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

            <TouchableOpacity
              onPress={() => toggleSection('Subjects')}
              style={styles.subheadingContainer}
            >
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

            <TouchableOpacity
              onPress={() => toggleSection('Classes')}
              style={styles.subheadingContainer}
            >
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

            <TouchableOpacity
              onPress={() => toggleSection('Misc')}
              style={styles.subheadingContainer}
            >
              <Text style={styles.subheading}>Misc</Text>
              {expandedSections.Misc ? (
                <ChevronUp size={20} color="black" />
              ) : (
                <ChevronDown size={20} color="black" />
              )}
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
