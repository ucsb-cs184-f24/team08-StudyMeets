import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Modal, Text, TextInput, Button, Chip, Divider, Card } from 'react-native-paper';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { tagsList } from '../../definitions/Definitions.js';

const EditPost = ({ visible, onClose, postId }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [searchText, setSearchText] = useState('');

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
        } else {
          console.error('No such document!');
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

  const handleTagToggle = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
    setSearchText('');
  };

  const handleRemoveTag = (tag) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleUpdatePost = async () => {
    try {
      await updateDoc(doc(firestore, 'studymeets', postId), {
        Title: title,
        Location: location,
        Description: description,
        Tags: tags,
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
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ padding: 20 }}>
      <Card>
        <Card.Title title="Edit StudyMeet" />
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
                selected={tags.includes(item)}
              >
                {item}
              </Chip>
            )}
            horizontal
          />
          <Divider style={{ marginVertical: 10 }} />
          <Text variant="bodyMedium">Selected Tags:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                style={{ margin: 2 }}
                onClose={() => handleRemoveTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleUpdatePost}>
            Update
          </Button>
          <Button mode="outlined" onPress={onClose} color="red">
            Cancel
          </Button>
        </Card.Actions>
      </Card>
    </Modal>
  );
};

export default EditPost;
