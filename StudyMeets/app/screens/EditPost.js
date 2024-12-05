import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Alert, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { tagsList } from '../../definitions/Definitions.js';

const EditPost = ({ visible, onClose, postId }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]); // New state for tags
  const [searchText, setSearchText] = useState('');
  const [universities, setUniversities] = useState([]);
  const [majors, setMajors] = useState([]);
  const [universityInput, setUniversityInput] = useState('');
  const [majorInput, setMajorInput] = useState('');
  const [restrictions, setRestrictions] = useState({
    universityRestricted: false,
    majorRestricted: false,
  });

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
          setUniversities(postData.Universities || []);
          setMajors(postData.Majors || []);
          setRestrictions({
            universityRestricted: postData.universityRestricted || false,
            majorRestricted: postData.majorRestricted || false,
          });
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
    try {
      await updateDoc(doc(firestore, 'studymeets', postId), {
        Title: title,
        Location: location,
        Description: description,
        Tags: tags, // Update with the current tags
        UpdatedAt: new Date(),
        Universities: universities,
        Majors: majors,
        Restrictions: restrictions,
      });
      Alert.alert('Success', 'Post updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleAddUniversity = () => {
    if (universityInput.trim() && !universities.includes(universityInput.trim())) {
      setUniversities(prev => [...prev, universityInput.trim()]);
      setUniversityInput('');
    }
  };

  const handleAddMajor = () => {
    if (majorInput.trim() && !majors.includes(majorInput.trim())) {
      setMajors(prev => [...prev, majorInput.trim()]);
      setMajorInput('');
    }
  };

  const handleRemoveUniversity = (uni) => {
    setUniversities(prev => prev.filter(u => u !== uni));
  };

  const handleRemoveMajor = (major) => {
    setMajors(prev => prev.filter(m => m !== major));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView style={styles.scrollView}>
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

            {/* Universities Section */}
            <Text style={styles.label}>Universities</Text>
            <View style={styles.restrictionContainer}>
              <Text>Restrict to universities</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  restrictions.universityRestricted && styles.toggleButtonActive
                ]}
                onPress={() => setRestrictions(prev => ({
                  ...prev,
                  universityRestricted: !prev.universityRestricted
                }))}
              >
                <Text style={styles.toggleButtonText}>
                  {restrictions.universityRestricted ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>

            {restrictions.universityRestricted && (
              <>
                <TextInput
                  style={styles.largeInput}
                  placeholder="Enter universities (one per line)"
                  value={universityInput}
                  onChangeText={setUniversityInput}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.inputContainer}>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                      const newUniversities = universityInput
                        .split('\n')
                        .map(uni => uni.trim())
                        .filter(uni => uni && !universities.includes(uni));
                      
                      if (newUniversities.length > 0) {
                        setUniversities(prev => [...prev, ...newUniversities]);
                        setUniversityInput('');
                      }
                    }}
                  >
                    <Text style={styles.addButtonText}>Add Universities</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.selectedTagsContainer}>
                  {universities.map(uni => (
                    <View key={uni} style={styles.selectedTagContainer}>
                      <Text style={styles.selectedTag}>{uni}</Text>
                      <TouchableOpacity onPress={() => handleRemoveUniversity(uni)}>
                        <Text style={styles.removeTag}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Majors Section */}
            <Text style={styles.label}>Majors</Text>
            <View style={styles.restrictionContainer}>
              <Text>Restrict to majors</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  restrictions.majorRestricted && styles.toggleButtonActive
                ]}
                onPress={() => setRestrictions(prev => ({
                  ...prev,
                  majorRestricted: !prev.majorRestricted
                }))}
              >
                <Text style={styles.toggleButtonText}>
                  {restrictions.majorRestricted ? 'Yes' : 'No'}
                </Text>
              </TouchableOpacity>
            </View>

            {restrictions.majorRestricted && (
              <>
                <TextInput
                  style={styles.largeInput}
                  placeholder="Enter majors (one per line)"
                  value={majorInput}
                  onChangeText={setMajorInput}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <View style={styles.inputContainer}>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                      const newMajors = majorInput
                        .split('\n')
                        .map(major => major.trim())
                        .filter(major => major && !majors.includes(major));
                      
                      if (newMajors.length > 0) {
                        setMajors(prev => [...prev, ...newMajors]);
                        setMajorInput('');
                      }
                    }}
                  >
                    <Text style={styles.addButtonText}>Add Majors</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.selectedTagsContainer}>
                  {majors.map(major => (
                    <View key={major} style={styles.selectedTagContainer}>
                      <Text style={styles.selectedTag}>{major}</Text>
                      <TouchableOpacity onPress={() => handleRemoveMajor(major)}>
                        <Text style={styles.removeTag}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}

            <Button title="Update" onPress={handleUpdatePost} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </ScrollView>
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
    minHeight: 100,
    maxHeight: 200,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
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
  },
  restrictionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  toggleButtonText: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
