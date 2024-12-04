import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore, auth } from '../../firebase';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateNewPost = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [nextMeetingDate, setNextMeetingDate] = useState(new Date());
  const [isTBD, setIsTBD] = useState(false);

  const handleTagToggle = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    setSearchText('');
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setNextMeetingDate(selectedDate);
      setIsTBD(false); // Reset TBD when a valid date is selected
    }
  };

  const handleSetTBD = () => {
    setIsTBD(true);
    setNextMeetingDate(new Date()); // Maintain valid Date object for picker
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
        NextMeetingDate: isTBD ? 'TBD' : nextMeetingDate,
      });

      onClose();
    } catch (error) {
      console.error('Error creating document:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ padding: 20 }}>
      <Card>
        <Card.Title title="Create New StudyMeet" />
        <Card.Content>
          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Location"
            mode="outlined"
            value={location}
            onChangeText={setLocation}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Description"
            mode="outlined"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label="Search Tags"
            mode="outlined"
            value={searchText}
            onChangeText={setSearchText}
            style={{ marginBottom: 10 }}
          />
          <FlatList
            data={tagsList.filter((tag) =>
              tag.toLowerCase().includes(searchText.toLowerCase())
            )}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Chip
                style={{ margin: 2 }}
                onPress={() => handleTagToggle(item)}
                selected={selectedTags.includes(item)}
              >
                {item}
              </Chip>
            )}
            horizontal
          />
          <Divider style={{ marginVertical: 10 }} />
          <Text variant="bodyMedium">Selected Tags:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                style={{ margin: 2 }}
                onClose={() => handleRemoveTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
            Set First Meeting:
          </Text>
          <View style={{ marginBottom: 20 }}>
            <DateTimePicker
              mode="date"
              value={nextMeetingDate}
              onChange={handleDateChange}
              style={{ marginBottom: 10 }}
            />
            <DateTimePicker
              mode="time"
              value={nextMeetingDate}
              onChange={handleDateChange}
              style={{ marginBottom: 10 }}
            />
            <Button
              mode="outlined"
              color="red"
              onPress={handleSetTBD}
              style={{ marginTop: 10 }}
            >
              Set as TBD
            </Button>
          </View>
          <Text>
            {isTBD
              ? 'First Meeting Date: TBD'
              : `Selected: ${nextMeetingDate.toLocaleDateString()} ${nextMeetingDate.toLocaleTimeString()}`}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleCreatePost}>
            Create
          </Button>
          <Button mode="outlined" onPress={onClose} color="red">
            Cancel
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  );
};

export default CreateNewPost;
