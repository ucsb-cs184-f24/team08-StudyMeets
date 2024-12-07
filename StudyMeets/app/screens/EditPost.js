import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, ScrollView, Alert, StyleSheet } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';
import { useSubjectsClasses } from './SubjectsClasses';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ThemeContext } from '../../theme/ThemeContext';

const EditPost = ({ visible, onClose, postId }) => {
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

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDoc = await getDoc(doc(firestore, 'studymeets', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.Title);
          setLocation(postData.Location);
          setDescription(postData.Description);
          setSelectedTags(postData.Tags || []);
          setSelectedSubjects(postData.Subjects || []);
          setSelectedClasses(postData.Classes || []);
          if (postData.NextMeetingDate) {
            setNextMeetingDate(new Date(postData.NextMeetingDate));
            setIsTBD(postData.NextMeetingDate === 'TBD');
          }
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
        Alert.alert('Error', 'Failed to fetch post data');
      }
    };

    if (postId) fetchPostData();
  }, [postId]);

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

  const handleUpdatePost = async () => {
    if (title.trim() === '' || location.trim() === '') {
      Alert.alert('Error', 'Title and Location cannot be empty.');
      return;
    }

    try {
      await updateDoc(doc(firestore, 'studymeets', postId), {
        Title: title,
        Location: location,
        Description: description,
        Tags: selectedTags,
        Subjects: selectedSubjects,
        Classes: selectedClasses,
        NextMeetingDate: isTBD ? 'TBD' : nextMeetingDate.toISOString(),
        UpdatedAt: new Date(),
      });
      Alert.alert('Success', 'Post updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      Alert.alert('Error', error.message);
    }
  };

  const filteredItems = [
    ...tagsList,
    ...subjects,
    ...classes,
  ].filter((item) => item.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card>
            <Card.Title title="Edit StudyMeet" />
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
                data={filteredItems}
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
              <Text variant="bodyMedium">Selected Tags:</Text>
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
                  ? 'Next Meeting Date: TBD'
                  : `Selected: ${nextMeetingDate.toLocaleDateString()} ${nextMeetingDate.toLocaleTimeString()}`}
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.actions}>
          <Button mode="contained" onPress={handleUpdatePost} buttonColor={theme.colors.primary}>
            Update
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

export default EditPost;
