import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, where, onSnapshot, getDocs, deleteDoc } from 'firebase/firestore';
import GroupCard from './GroupCard';
import { Text } from 'react-native-paper';

const JoinedGroups = () => {
  const [joinedPosts, setJoinedPosts] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const userGroupsQuery = query(
      collection(firestore, 'userGroups'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribe = onSnapshot(userGroupsQuery, async (snapshot) => {
      const joinedGroupIds = snapshot.docs.map((doc) => doc.data().postId);

      if (joinedGroupIds.length > 0) {
        const joinedPostsQuery = query(
          collection(firestore, 'studymeets'),
          where('__name__', 'in', joinedGroupIds)
        );
        const joinedPostsSnapshot = await getDocs(joinedPostsQuery);
        const joinedData = joinedPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJoinedPosts(joinedData);
      } else {
        setJoinedPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

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
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.sectionTitle}>Groups You Joined</Text>
      <FlatList
        data={joinedPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            primaryActionLabel="Leave Group"
            onPrimaryAction={() => handleLeaveGroup(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JoinedGroups;