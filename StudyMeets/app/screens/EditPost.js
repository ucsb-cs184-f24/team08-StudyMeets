import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card, IconButton } from 'react-native-paper';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditPost = ({ visible, onClose, postId }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [nextMeetingDate, setNextMeetingDate] = useState(new Date());
  const [isTBD, setIsTBD] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [universityInput, setUniversityInput] = useState('');
  const [majorInput, setMajorInput] = useState('');
  const [universities, setUniversities] = useState([]);
  const [majors, setMajors] = useState([]);
  const [restrictions, setRestrictions] = useState({
    universityRestricted: false,
    majorRestricted: false,
  });

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDoc = await getDoc(doc(firestore, 'studymeets', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setTitle(postData.Title);
          setLocation(postData.Location);
          setDescription(postData.Description);
          setTags(postData.Tags || []);
          if (postData.NextMeetingDate) {
            setNextMeetingDate(new Date(postData.NextMeetingDate));
            setIsTBD(postData.NextMeetingDate === 'TBD');
          }
          setUniversities(postData.Universities || []);
          setMajors(postData.Majors || []);
          setRestrictions(postData.Restrictions || {
            universityRestricted: false,
            majorRestricted: false,
          });
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

  const handleTagToggle = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    setSearchText('');
  };

  const handleRemoveTag = (tag) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
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
    if (title.trim() === '') {
      Alert.alert('Error', 'The Title cannot be empty, please enter a Title.');
      return;
    }
    if (location.trim() === '') {
      Alert.alert('Error', 'The Location cannot be empty, please enter a Location.');
      return;
    }    

    try {
      await updateDoc(doc(firestore, 'studymeets', postId), {
        Title: title,
        Location: location,
        Description: description,
        Tags: tags,
        NextMeetingDate: isTBD ? 'TBD' : nextMeetingDate.toISOString(),
        UpdatedAt: new Date(),
        Universities: universities,
        Majors: majors,
        Restrictions: {
          universityRestricted: restrictions.universityRestricted,
          majorRestricted: restrictions.majorRestricted,
        },
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
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card>
            <Card.Title title="Edit StudyMeet" />
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
                    selected={tags.includes(item)}
                  >
                    {item}
                  </Chip>
                )}
                horizontal
              />
              <Divider style={styles.divider} />
              <TouchableOpacity 
                style={styles.restrictionHeader}
                onPress={() => setShowRestrictions(!showRestrictions)}
              >
                <Text style={styles.sectionTitle}>Restrictions</Text>
                <IconButton
                  icon={showRestrictions ? "chevron-up" : "chevron-down"}
                  size={24}
                />
              </TouchableOpacity>

              {showRestrictions && (
                <View style={styles.restrictionsContainer}>
                  {/* Universities Section */}
                  <View style={styles.restrictionSection}>
                    <View style={styles.restrictionContainer}>
                      <Text>Restrict to specific universities</Text>
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
                        <Text style={[
                          styles.toggleButtonText,
                          restrictions.universityRestricted && styles.toggleButtonTextActive
                        ]}>
                          {restrictions.universityRestricted ? 'ON' : 'OFF'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {restrictions.universityRestricted && (
                      <>
                        <TextInput
                          mode="outlined"
                          label="Enter universities (one per line)"
                          value={universityInput}
                          onChangeText={setUniversityInput}
                          multiline
                          numberOfLines={4}
                          style={styles.restrictionInput}
                        />
                        <Button
                          mode="contained"
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
                          style={styles.addButton}
                        >
                          Add Universities
                        </Button>

                        <View style={styles.selectedTagsContainer}>
                          {universities.map(uni => (
                            <Chip
                              key={uni}
                              onClose={() => handleRemoveUniversity(uni)}
                              style={styles.restrictionChip}
                            >
                              {uni}
                            </Chip>
                          ))}
                        </View>
                      </>
                    )}
                  </View>

                  {/* Majors Section */}
                  <View style={styles.restrictionSection}>
                    <View style={styles.restrictionContainer}>
                      <Text>Restrict to specific majors</Text>
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
                        <Text style={[
                          styles.toggleButtonText,
                          restrictions.majorRestricted && styles.toggleButtonTextActive
                        ]}>
                          {restrictions.majorRestricted ? 'ON' : 'OFF'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {restrictions.majorRestricted && (
                      <>
                        <TextInput
                          mode="outlined"
                          label="Enter majors (one per line)"
                          value={majorInput}
                          onChangeText={setMajorInput}
                          multiline
                          numberOfLines={4}
                          style={styles.restrictionInput}
                        />
                        <Button
                          mode="contained"
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
                          style={styles.addButton}
                        >
                          Add Majors
                        </Button>

                        <View style={styles.selectedTagsContainer}>
                          {majors.map(major => (
                            <Chip
                              key={major}
                              onClose={() => handleRemoveMajor(major)}
                              style={styles.restrictionChip}
                            >
                              {major}
                            </Chip>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                </View>
              )}
              <Divider style={styles.divider} />
              <Text variant="bodyMedium">Selected Tags:</Text>
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
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
                  ? 'Next Meeting Date: TBD'
                  : `Selected: ${nextMeetingDate.toLocaleDateString()} ${nextMeetingDate.toLocaleTimeString()}`}
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
        <View style={styles.actions}>
          <Button mode="contained" onPress={handleUpdatePost}>
            Update
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
  restrictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  restrictionSection: {
    marginBottom: 10,
  },
  restrictionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  toggleButton: {
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  toggleButtonActive: {
    backgroundColor: '#e0e0e0',
  },
  toggleButtonText: {
    fontWeight: 'bold',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  restrictionInput: {
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  restrictionChip: {
    margin: 2,
  },
});

export default EditPost;
