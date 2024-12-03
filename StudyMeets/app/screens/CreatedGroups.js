import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { firestore, auth } from '../../firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import GroupCard from './GroupCard';
import EditPost from './EditPost';
import { Text } from 'react-native-paper';

const CreatedGroups = () => {
  const [createdPosts, setCreatedPosts] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

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

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.sectionTitle}>Groups You Created</Text>
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

      {isEditModalVisible && (
        <EditPost
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          postId={selectedPostId}
        />
      )}
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