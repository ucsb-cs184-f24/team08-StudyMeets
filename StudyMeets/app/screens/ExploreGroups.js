import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import CreateNewPost from './CreateNewPost';
import { TextInput as PaperTextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from './GroupCard';
import { PlusCircle } from 'lucide-react-native';
import PeopleList from './PeopleList'

const ExploreGroups = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [isPeopleModalVisible, setPeopleModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null); 
  const navigation = useNavigation();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const fetchJoinedGroups = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userGroupsQuery = query(collection(firestore, 'userGroups'), orderBy('postId'));
  
        const unsubscribe = onSnapshot(userGroupsQuery, (snapshot) => {
          const groups = snapshot.docs
            .filter(doc => doc.data().userId === currentUser.uid)
            .map(doc => doc.data().postId);
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

  const handlePeopleClick = async (postId) => {
    try {
      const groupDoc = await getDoc(doc(firestore, 'studymeets', postId));
      if (!groupDoc.exists()) {
        throw new Error('Group not found.');
      }
  
      const { OwnerEmail } = groupDoc.data();
    
      const ownerQuery = query(
        collection(firestore, 'users'),
        where('email', '==', OwnerEmail)
      );
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

  const filteredPosts = posts.filter(post =>
    post.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <PaperTextInput
        mode="outlined"
        placeholder="Search study groups..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />
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
            secondaryActionLabel={isOwner ? "Delete" : isJoined ? "Leave" : "Join"}
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
        </SafeAreaView>
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    marginHorizontal: 10,
    marginBottom: 10,
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
});

export default ExploreGroups;
