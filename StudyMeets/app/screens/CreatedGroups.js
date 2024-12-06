import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import GroupCard from './GroupCard';
import EditPost from './EditPost';
import PeopleList from './PeopleList'; 
import { Text } from 'react-native-paper';
import { ThemeContext } from '../../theme/ThemeContext';

const CreatedGroups = () => {
  const [createdPosts, setCreatedPosts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPeopleModalVisible, setIsPeopleModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    const createdQuery = query(
      collection(firestore, 'studymeets'),
      where('OwnerEmail', '==', currentUser.email)
    );
    const unsubscribe = onSnapshot(createdQuery, (snapshot) => {
      const createdData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCreatedPosts(createdData);
    });

    return () => unsubscribe();
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
        setIsPeopleModalVisible(true);
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
      setIsPeopleModalVisible(true);
    } catch (error) {
      console.error('Error fetching people:', error);
      Alert.alert('Error', 'Failed to fetch group members.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Groups You Created
      </Text>
      <FlatList
        data={createdPosts}
        renderItem={({ item }) => (
          <GroupCard
            item={item}
            primaryActionLabel="People"
            onPrimaryAction={() => handlePeopleClick(item.id)}
            secondaryActionLabel="Delete"
            onSecondaryAction={() => handleDeletePost(item.id)}
            thirdActionLabel="Edit"
            onThirdAction={() => handleEditPost(item.id)}
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

      <PeopleList
        visible={isPeopleModalVisible}
        onClose={() => setIsPeopleModalVisible(false)}
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

export default CreatedGroups;