import React, { useState } from 'react';
import { View, FlatList, ScrollView, Alert, StyleSheet } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore, auth } from '../../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
      });

      onClose();
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
});

export default CreateNewPost;
