import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert } from 'react-native';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditPost = ({ visible, onClose, postId }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDoc = await getDoc(doc(firestore, 'studymeets', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.Title);
          setLocation(postData.Location);
          setDescription(postData.Description);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        Alert.alert('Error', 'Failed to fetch post data');
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  const handleUpdatePost = async () => {
    try {
      await updateDoc(doc(firestore, 'studymeets', postId), {
        Title: title,
        Location: location,
        Description: description,
        UpdatedAt: new Date(),
      });
      Alert.alert('Success', 'Post updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.formTitle}>Edit StudyMeet</Text>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.largeInput}
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Update" onPress={handleUpdatePost} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  largeInput: {
    width: '100%',
    height: 100,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});