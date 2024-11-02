import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { firestore } from '../../firebase';
import { auth } from '../../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';

import { TextInput, Button, Text, Title } from 'react-native-paper';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');

  const handleCreatePost = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      console.log('Title:', title);
      console.log('Location:', location);
      console.log('Description:', description);

      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      console.log(userDoc.data().username)
      if (userDoc.exists()) {
        setUserName(userDoc.data().username)
      } else {
        console.log('No such document!');
      }
      await addDoc(collection(firestore, 'studymeets'), {
        Title: title,
        Location: location,
        Description: description,
        OwnerEmail: currentUser.email,
        OwnerName: userName,
        CreatedAt: new Date(),
      });

      onClose();
    } catch (error) {
      console.error('Error creating document:', error);
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
        <Title>Create New StudyMeet</Title>
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
          <Button mode="contained" onPress={handleCreatePost} style={[styles.button, styles.createPostButton]}>
          Create Post
          </Button>
          <Button mode="contained" onPress={onClose} style={[styles.button, styles.cancelButton]}>
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default CreateNewPost;

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
    height: 100, // 增大 Description 部分的高度
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    textAlignVertical: 'top', // 多行文本从顶部开始显示
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
    textAlign: 'center'
  },
  createPostButton: {
    marginBottom: 10
  },
  cancelButton: {
    backgroundColor: '#ff7777'
  }
});