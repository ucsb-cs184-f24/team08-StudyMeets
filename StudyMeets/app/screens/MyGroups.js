import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, where, onSnapshot, getDocs, doc, deleteDoc } from 'firebase/firestore';
import EditPost from './EditPost';
import GroupCard from './GroupCard';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyGroups = () => {
  const [createdPosts, setCreatedPosts] = useState([]);
  const [joinedPosts, setJoinedPosts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    // Listener for created groups
    const createdQuery = query(
      collection(firestore, 'studymeets'),
      where('OwnerEmail', '==', currentUser.email)
    );
    const unsubscribeCreated = onSnapshot(createdQuery, (snapshot) => {
      const createdData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isCreator: true,
      }));
      setCreatedPosts(createdData);
    });

    // Listener for joined groups
    const userGroupsQuery = query(
      collection(firestore, 'userGroups'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribeJoined = onSnapshot(userGroupsQuery, async (userGroupsSnapshot) => {
      const joinedGroupIds = userGroupsSnapshot.docs.map((doc) => doc.data().postId);

      if (joinedGroupIds.length > 0) {
        const joinedPostsQuery = query(
          collection(firestore, 'studymeets'),
          where('__name__', 'in', joinedGroupIds)
        );
        const joinedPostsSnapshot = await getDocs(joinedPostsQuery);
        const joinedData = joinedPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isCreator: false,
        }));
        setJoinedPosts(joinedData);
      } else {
        setJoinedPosts([]);
      }
    });

    return () => {
      unsubscribeCreated();
      unsubscribeJoined();
    };
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

  const handleLeaveGroup = async (postId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userGroupQuery = query(
          collection(firestore, 'userGroups'),
          where('userId', '==', currentUser.uid),
          where('postId', '==', postId)
        );
        const userGroupSnapshot = await getDocs(userGroupQuery);
        if (!userGroupSnapshot.empty) {
          await deleteDoc(userGroupSnapshot.docs[0].ref);
          Alert.alert('Left Group', 'You have successfully left the group.');
        }
      } catch (error) {
        console.error('Error leaving group:', error);
        Alert.alert('Error', 'Failed to leave the group.');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, paddingTop: 30 }}>
      <Text variant="titleLarge" style={{ marginVertical: 10 }}>Groups You Created</Text>
      <FlatList
        data={createdPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            onPrimaryAction={handleEditPost}
            primaryActionLabel="Edit"
            secondaryActionLabel="Delete"
            onSecondaryAction={handleDeletePost}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <Text variant="titleLarge" style={{ marginVertical: 10 }}>Groups You Joined</Text>
      <FlatList
        data={joinedPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            onPrimaryAction={handleLeaveGroup}
            primaryActionLabel="Leave Group"
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {isEditModalVisible && (
        <EditPost 
          visible={isEditModalVisible} 
          onClose={() => setIsEditModalVisible(false)} 
          postId={selectedPostId} 
        />
      )}
    </SafeAreaView>
  );
};

export default MyGroups;
