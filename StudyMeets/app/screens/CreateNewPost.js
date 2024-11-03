import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { firestore } from '../../firebase';
import { auth } from '../../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';

import { tagsList } from '../../definitions/Definitions.js';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
    setSearchText(''); // Clear the search text when a tag is added
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
  };

  const filteredTags = tagsList.filter(tag =>
    tag.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreatePost = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      console.log('Title:', title);
      console.log('Location:', location);
      console.log('Description:', description);
      console.log('Tags:', selectedTags);


      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().username);
      } else {
        console.log('No such document!');
      }

      await addDoc(collection(firestore, 'studymeets'), {
        Title: title,
        Location: location,
        Description: description,
        Tags: selectedTags,
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
          <Text style={styles.formTitle}>Create New StudyMeet</Text>
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
          
          <Text style={styles.label}>Search Tags</Text>
          <TextInput
            style={styles.input}
            placeholder="Search tags..."
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* Scrollable box for filtered tags */}
          {searchText && filteredTags.length > 0 && (
            <View style={styles.tagSuggestions}>
              <FlatList
                data={filteredTags}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <View style={styles.tagItem}>
                    <Text style={styles.tagText}>{item}</Text>
                    <Button 
                      title={selectedTags.includes(item) ? "Remove" : "Add"} 
                      onPress={() => handleTagToggle(item)}
                      color={selectedTags.includes(item) ? 'red' : 'green'}
                    />
                  </View>
                )}
              />
            </View>
          )}

          {/* Display selected tags with remove option */}
          <Text style={styles.label}>Selected Tags:</Text>
          <View style={styles.selectedTagsContainer}>
            {selectedTags.map(tag => (
              <View key={tag} style={styles.selectedTagContainer}>
                <Text style={styles.selectedTag}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Text style={styles.removeTag}> X </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Button title="Create" onPress={handleCreatePost} />
          <Button title="Cancel" onPress={onClose} color="red" />
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
  tagSuggestions: {
    width: '100%',
    maxHeight: 150, // Set a maximum height for the suggestions box
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingVertical: 5,
    overflow: 'hidden', // Hide overflow to create a clean border
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tagText: {
    flex: 1,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  selectedTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 5,
    margin: 5,
  },
  selectedTag: {
    marginRight: 5,
  },
  removeTag: {
    color: 'red',
    fontWeight: 'bold',
    padding: 5,
  },
});
