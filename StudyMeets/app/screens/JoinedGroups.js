import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, where, onSnapshot, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import GroupCard from './GroupCard';
import PeopleList from './PeopleList';
import { Text } from 'react-native-paper';

const JoinedGroups = () => {
  const [joinedPosts, setJoinedPosts] = useState([]);
  const [isPeopleModalVisible, setPeopleModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Groups You Joined
      </Text>
      <FlatList
        data={joinedPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            primaryActionLabel="People"
            onPrimaryAction={() => handlePeopleClick(item.id)}
            secondaryActionLabel="Leave Group"
            onSecondaryAction={() => handleLeaveGroup(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <PeopleList
        visible={isPeopleModalVisible}
        onClose={() => setPeopleModalVisible(false)}
        members={members}
        owner={owner}
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