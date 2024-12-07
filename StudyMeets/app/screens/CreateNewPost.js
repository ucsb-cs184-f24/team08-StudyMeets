import React, { useState, useContext } from 'react';
import { View, FlatList, ScrollView, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore, auth } from '../../firebase';
import { addDoc, collection, getDoc, doc, setDoc, getDocs } from 'firebase/firestore';
import { ThemeContext } from '../../theme/ThemeContext';
import { tagsList } from '../../definitions/Definitions.js';
import { useSubjectsClasses } from './SubjectsClasses';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { theme } = useContext(ThemeContext);
  const { subjects, classes } = useSubjectsClasses();
  const [nextMeetingDate, setNextMeetingDate] = useState(new Date());
  const [isTBD, setIsTBD] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [image, setImage] = useState(null);

  const handleTagToggle = (tag, setSelectedList) => {
    setSelectedList((prevList) =>
      prevList.includes(tag) ? prevList.filter((item) => item !== tag) : [...prevList, tag]
    );
  };

  const handleRemoveTag = (tag, setSelectedList) => {
    setSelectedList((prevList) => prevList.filter((item) => item !== tag));
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

  const handleCreatePost = async () => {
    if (title.trim() === '') {
      Alert.alert('Error', 'The Title cannot be empty, please enter a Title.');
      return;
    }
    if (location.trim() === '') {
      Alert.alert('Error', 'The Location cannot be empty, please enter a Location.');
      return;
    }    

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (!userDoc.exists()) throw new Error('User data not found');
  
      const postRef = await addDoc(collection(firestore, 'studymeets'), {
        Title: title,
        Location: location,
        Description: description,
        Tags: selectedTags,
        OwnerEmail: currentUser.email,
        OwnerName: userDoc.data().username,
        CreatedAt: new Date(),
        NextMeetingDate: isTBD ? 'TBD' : nextMeetingDate.toISOString(),
        ImageUrl: image,
      });
  
      const friendsCollection = collection(firestore, 'users', currentUser.uid, 'friends');
      const friendsSnapshot = await getDocs(friendsCollection);
      const friends = friendsSnapshot.docs.map(doc => doc.id);
  
      const notifications = friends.map(friendId => {
        const notificationRef = doc(firestore, 'users', friendId, 'notifications', postRef.id);
        return setDoc(notificationRef, {
          Title: `New Post by ${userDoc.data().username}`,
          Description: `${title} - ${description}`,
          PostId: postRef.id,
          CreatedAt: new Date(),
          Read: false,
        });
      });
  
      await Promise.all(notifications);
  
      Alert.alert('Success', 'Post created and friends notified!');
      setImage(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message);
    }
  };

  const filteredTags = [
    ...tagsList,
    ...subjects,
    ...classes,
  ].filter((item) => item.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card>
            <Card.Title title="Create New StudyMeet" />
            <Card.Content>
              <TextInput
                label="Title"
                mode="outlined"
                value={title}
                onChangeText={setTitle}
                style={[styles.input, { color: theme.colors.text }]}
              />
              <TextInput
                label="Location"
                mode="outlined"
                value={location}
                onChangeText={setLocation}
                style={[styles.input, { color: theme.colors.text }]}
              />
              <TextInput
                label="Description"
                mode="outlined"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { color: theme.colors.text }]}
              />
              <TextInput
                label="Search Tags"
                mode="outlined"
                value={searchText}
                onChangeText={setSearchText}
                style={[styles.input, { color: theme.colors.text }]}
              />
              <FlatList
                data={filteredTags}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Chip
                    style={[styles.chip, { backgroundColor: theme.colors.background }]}
                    onPress={() => {
                      if (tagsList.includes(item)) handleTagToggle(item, setSelectedTags);
                      else if (subjects.includes(item)) handleTagToggle(item, setSelectedSubjects);
                      else if (classes.includes(item)) handleTagToggle(item, setSelectedClasses);
                    }}
                    selected={
                      selectedTags.includes(item) ||
                      selectedSubjects.includes(item) ||
                      selectedClasses.includes(item)
                    }
                  >
                    {item}
                  </Chip>
                )}
                horizontal
              />
              <Divider style={styles.divider} />
              <Text variant="bodyMedium" style={styles.sectionTitle}>
                Selected Tags:
              </Text>
              <View style={styles.tagsContainer}>
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag}
                    style={[styles.chip, { backgroundColor: theme.colors.background }]}
                    onClose={() => handleRemoveTag(tag, setSelectedTags)}
                  >
                    {tag}
                  </Chip>
                ))}
                {selectedSubjects.map((subject) => (
                  <Chip
                    key={subject}
                    style={[styles.chip, { backgroundColor: theme.colors.background }]}
                    onClose={() => handleRemoveTag(subject, setSelectedSubjects)}
                  >
                    {subject}
                  </Chip>
                ))}
                {selectedClasses.map((cls) => (
                  <Chip
                    key={cls}
                    style={[styles.chip, { backgroundColor: theme.colors.background }]}
                    onClose={() => handleRemoveTag(cls, setSelectedClasses)}
                  >
                    {cls}
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
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.actions}>
          <Button mode="contained" onPress={handleCreatePost} buttonColor={theme.colors.primary}>
            Create
          </Button>
          <Button mode="contained" onPress={onClose} buttonColor={theme.colors.cancel}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    width: '100%',
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
  imageUploadButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
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
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CreateNewPost;
