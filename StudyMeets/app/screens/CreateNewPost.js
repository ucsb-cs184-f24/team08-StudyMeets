import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, FlatList, Alert, TouchableOpacity, Image, ScrollView} from 'react-native';
import { firestore } from '../../firebase';
import { auth } from '../../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [majors, setMajors] = useState([]);
  const [universityInput, setUniversityInput] = useState('');
  const [majorInput, setMajorInput] = useState('');
  const [restrictions, setRestrictions] = useState({
    universityRestricted: false,
    majorRestricted: false,
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
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

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setDescription('');
    setSelectedTags([]);
    setTagInput('');
    setUniversities([]);
    setMajors([]);
    setUniversityInput('');
    setMajorInput('');
    setImage(null);
    setRestrictions({
      universityRestricted: false,
      majorRestricted: false,
    });
  };

  const handleCreatePost = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let imageUrl = null;
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `studymeet-images/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().username);
      }

      await addDoc(collection(firestore, 'studymeets'), {
        Title: title,
        Location: location,
        Description: description,
        Tags: selectedTags,
        OwnerEmail: currentUser.email,
        OwnerName: userName,
        CreatedAt: new Date(),
        ImageUrl: imageUrl,
        Universities: universities,
        Majors: majors,
        Restrictions: restrictions,
      });

      resetForm();
      onClose();
      Alert.alert('Success', 'Your StudyMeet has been created!');
      
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
        <ScrollView style={styles.scrollView}>
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
              multiline={true}
              numberOfLines={4}
              textAlignVertical='top'
            />
            
            <Text style={styles.label}>Universities</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter university name"
                value={universityInput}
                onChangeText={setUniversityInput}
                onSubmitEditing={handleAddUniversity}
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddUniversity}
              >
                <Text style={styles.addButtonText}>Add</Text>
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

            <Text style={styles.label}>Majors</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter major"
                value={majorInput}
                onChangeText={setMajorInput}
                onSubmitEditing={handleAddMajor}
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddMajor}
              >
                <Text style={styles.addButtonText}>Add</Text>
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

            <Text style={styles.label}>Tags</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter tag"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddTag}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

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

            <Text style={styles.label}>Image (Optional)</Text>
            <TouchableOpacity 
              style={styles.imageUploadButton} 
              onPress={pickImage}
            >
              <Text style={styles.imageUploadText}>
                {image ? 'Change Image' : 'Pick an Image'}
              </Text>
            </TouchableOpacity>

            {image && (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            <Button title="Create" onPress={handleCreatePost} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
        </ScrollView>
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
    paddingVertical: 20,
  },
  scrollView: {
    width: '100%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 25,
    width: 'auto',
    minWidth: 300,
    alignSelf: 'center',
  },
  input: {
    // width: '100%',
    minHeight: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  largeInput: {
    // width: '100%',
    minHeight: 100,
    maxHeight: 200,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    textAlignVertical: 'top',
    multiline: true,
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
    maxHeight: 150,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingVertical: 5,
  },
  tagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tagText: {
    flex: 1,
  },
  tagButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    minWidth: 70,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#ff5252',
  },
  tagButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    fontSize: 18
  },
  imageUploadButton: {
    // width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
  },
  restrictionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  toggleButton: {
    backgroundColor: '#cc0404',
    padding: 8,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 5,
  },
  selectedTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedTag: {
    marginRight: 5,
  },
});
