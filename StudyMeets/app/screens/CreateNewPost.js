import React, { useState } from 'react';
import { View, FlatList, ScrollView, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore, auth } from '../../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [nextMeetingDate, setNextMeetingDate] = useState(new Date());
  const [isTBD, setIsTBD] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [majors, setMajors] = useState([]);
  const [universityInput, setUniversityInput] = useState('');
  const [majorInput, setMajorInput] = useState('');
  const [restrictions, setRestrictions] = useState({
    universityRestricted: false,
    majorRestricted: false,
  });

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    setSearchText('');
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      setNextMeetingDate((prevDate) => {
        if (isTimePickerVisible) {
          return new Date(
            prevDate.getFullYear(),
            prevDate.getMonth(),
            prevDate.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes()
          );
        }
        return selectedDate;
      });
      setIsTBD(false);
    }
    setDatePickerVisible(false);
    setTimePickerVisible(false);
  };

  const handleSetTBD = () => {
    setIsTBD(true);
    setNextMeetingDate(new Date());
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
    setNextMeetingDate(new Date());
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
      if (!currentUser) throw new Error('User not authenticated');

      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (userDoc.exists()) setUserName(userDoc.data().username);

      await addDoc(collection(firestore, 'studymeets'), {
        Title: title,
        Location: location,
        Description: description,
        Tags: selectedTags,
        OwnerEmail: currentUser.email,
        OwnerName: userName,
        CreatedAt: new Date(),
        NextMeetingDate: isTBD ? 'TBD' : nextMeetingDate.toISOString(),
        ImageUrl: image,
        Restrictions: {
          universities: restrictions.universityRestricted ? universities : [],
          majors: restrictions.majorRestricted ? majors : [],
          universityRestricted: restrictions.universityRestricted,
          majorRestricted: restrictions.majorRestricted,
          },
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
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card>
            <Card.Title title="Create New StudyMeet" />
            <Card.Content>
              <TextInput
                label="Title"
                mode="outlined"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput
                label="Location"
                mode="outlined"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
              />
              <TextInput
                label="Description"
                mode="outlined"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
              <TextInput
                label="Search Tags"
                mode="outlined"
                value={searchText}
                onChangeText={setSearchText}
                style={styles.input}
              />
              <FlatList
                data={tagsList.filter((tag) =>
                  tag.toLowerCase().includes(searchText.toLowerCase())
                )}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Chip
                    style={styles.chip}
                    onPress={() => handleTagToggle(item)}
                    selected={selectedTags.includes(item)}
                  >
                    {item}
                  </Chip>
                )}
                horizontal
              />
              <Divider style={styles.divider} />
              <Text variant="bodyMedium">Selected Tags:</Text>
              <View style={styles.tagsContainer}>
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag}
                    style={styles.chip}
                    onClose={() => handleRemoveTag(tag)}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={styles.sectionTitle}>
                Next Meeting:
              </Text>
              <Button
                mode="outlined"
                onPress={() => setDatePickerVisible(true)}
                style={styles.input}
              >
                Pick Date
              </Button>
              <Button
                mode="outlined"
                onPress={() => setTimePickerVisible(true)}
                style={styles.input}
              >
                Pick Time
              </Button>
              <Button
                mode="outlined"
                color="red"
                onPress={handleSetTBD}
                style={styles.input}
              >
                Set as TBD
              </Button>
              <Text style={styles.selectedDate}>
                {isTBD
                  ? 'First Meeting Date: TBD'
                  : `Selected: ${nextMeetingDate.toLocaleDateString()} ${nextMeetingDate.toLocaleTimeString()}`}
              </Text>
              <Divider style={styles.divider} />
              <Text variant="bodyMedium">Image:</Text>
              <TouchableOpacity onPress={pickImage} style={styles.imageUploadButton}>
                <Text style={styles.imageUploadText}>
                  {image ? 'Change Image' : 'Pick an Image'}
                </Text>
              </TouchableOpacity>
              {image && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <TouchableOpacity
                    onPress={() => setImage(null)}
                    style={styles.removeImageButton}
                  >
                    <Text style={styles.removeImageText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Divider style={styles.divider} />
              <Text variant="bodyMedium">Restrictions:</Text>
              
              <View style={styles.restrictionContainer}>
                <Text>University Restriction</Text>
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
                    {restrictions.universityRestricted ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {restrictions.universityRestricted && (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Add University"
                      mode="outlined"
                      value={universityInput}
                      onChangeText={setUniversityInput}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddUniversity}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.selectedTagsContainer}>
                    {universities.map((uni) => (
                      <View key={uni} style={styles.selectedTagContainer}>
                        <Text style={styles.selectedTag}>{uni}</Text>
                        <TouchableOpacity onPress={() => handleRemoveUniversity(uni)}>
                          <Text>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.restrictionContainer}>
                <Text>Major Restriction</Text>
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
                    {restrictions.majorRestricted ? 'ON' : 'OFF'}
                  </Text>
                </TouchableOpacity>
              </View>

              {restrictions.majorRestricted && (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      label="Add Major"
                      mode="outlined"
                      value={majorInput}
                      onChangeText={setMajorInput}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddMajor}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.selectedTagsContainer}>
                    {majors.map((major) => (
                      <View key={major} style={styles.selectedTagContainer}>
                        <Text style={styles.selectedTag}>{major}</Text>
                        <TouchableOpacity onPress={() => handleRemoveMajor(major)}>
                          <Text>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.actions}>
          <Button mode="contained" onPress={handleCreatePost}>
            Create
          </Button>
          <Button mode="outlined" onPress={onClose} color="red">
            Cancel
          </Button>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible || isTimePickerVisible}
        mode={isDatePickerVisible ? 'date' : 'time'}
        date={nextMeetingDate}
        onConfirm={handleDateChange}
        onCancel={() => {
          setDatePickerVisible(false);
          setTimePickerVisible(false);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '90%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  chip: {
    margin: 2,
  },
  divider: {
    marginVertical: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    marginBottom: 10,
  },
  selectedDate: {
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  imageUploadButton: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    marginTop: 10,
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

export default CreateNewPost;
