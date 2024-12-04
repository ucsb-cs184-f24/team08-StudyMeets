import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { tagsList } from '../../definitions/Definitions.js';

const EditPost = ({ visible, onClose, postId }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]); // New state for tags
  const [searchText, setSearchText] = useState('');

  const handleTagToggle = (tag) => {
    setTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
    setSearchText(''); // Clear the search text when a tag is added
  };

  const filteredTags = tagsList.filter(tag =>
    tag.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDoc = await getDoc(doc(firestore, 'studymeets', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.Title);
          setLocation(postData.Location);
          setDescription(postData.Description);
          setTags(postData.Tags || []); // Set the fetched tags
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

  const handleRemoveTag = (tag) => {
    setTags(prevTags => prevTags.filter(t => t !== tag)); // Remove tag from state
  };

  const handleUpdatePost = async () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'The title cannot be empty, please enter a title.');
      return;
    }

    try {
      await updateDoc(doc(firestore, 'studymeets', postId), {
        Title: title,
        Location: location,
        Description: description,
        Tags: tags, // Update with the current tags
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
                      title={tags.includes(item) ? "Remove" : "Add"} 
                      onPress={() => handleTagToggle(item)}
                      color={tags.includes(item) ? 'red' : 'green'}
                    />
                  </View>
                )}
              />
            </View>
          )}
          
          <Text style={styles.label}>Tags:</Text>
          <View style={styles.selectedTagsContainer}>
            {tags.map(tag => (
              <View key={tag} style={styles.selectedTagContainer}>
                <Text style={styles.selectedTag}>{tag}</Text>
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                  <Text style={styles.removeTag}> X </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

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
  }
});
