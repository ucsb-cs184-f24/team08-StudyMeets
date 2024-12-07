import React, { useState, useContext } from 'react';
import { View, FlatList, ScrollView, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore, auth } from '../../firebase';
import { addDoc, collection, getDoc, doc, setDoc, getDocs } from 'firebase/firestore';
import { ThemeContext } from '../../theme/ThemeContext';
import { tagsList } from '../../definitions/Definitions.js';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { theme } = useContext(ThemeContext);
  const [nextMeetingDate, setNextMeetingDate] = useState(new Date());
  const [isTBD, setIsTBD] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [image, setImage] = useState(null);

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
    setSearchText(''); 
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
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

  const filteredTags = tagsList.filter(tag =>
    tag.toLowerCase().includes(searchText.toLowerCase())
  );

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
    if (title.trim() === '' || location.trim() === '') {
      Alert.alert('Error', 'Title and Location cannot be empty.');
      return;
    }
  
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      let imageUrl = null;
      if (image) {
        // Upload image to Firebase Storage
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `studymeet-images/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      console.log('Title:', title);
      console.log('Location:', location);
      console.log('Description:', description);
      console.log('Tags:', selectedTags);
      console.log('Image"', image)

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
                placeholderTextColor={theme.colors.placeholderTextColor}
              />
              <TextInput
                label="Description"
                mode="outlined"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { color: theme.colors.text }]}
                placeholderTextColor={theme.colors.placeholderTextColor}
              />
              <TextInput
                label="Search Tags"
                mode="outlined"
                value={searchText}
                onChangeText={setSearchText}
                style={[styles.input, { color: theme.colors.text }]}
                placeholderTextColor={theme.colors.placeholderTextColor}
              />
              <FlatList
                data={filteredTags}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <Chip
                    style={[styles.chip, { backgroundColor: theme.colors.background }]}
                    onPress={() => handleTagToggle(item)}
                    selected={selectedTags.includes(item)}
                    textStyle={{ color: theme.colors.text }}
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
                    style={[styles.chip, { backgroundColor: theme.colors.background }]}
                    onClose={() => handleRemoveTag(tag)}
                    textStyle={{ color: theme.colors.text }}
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
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.actions}>
          <Button 
            mode="contained" 
            onPress={handleCreatePost} 
            buttonColor={theme.colors.primary}
            textColor = {theme.colors.text}
          >
            Create
          </Button>
          <Button 
            mode="contained" 
            onPress={onClose}
            buttonColor={theme.colors.cancel}
            textColor = {theme.colors.text}
          >
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

export default CreateNewPost;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
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
  imageUploadButton: {
    width: '100%',
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  }
});
