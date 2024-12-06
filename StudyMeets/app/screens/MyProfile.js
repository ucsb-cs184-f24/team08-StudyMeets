import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { Avatar, Button as PaperButton, IconButton } from 'react-native-paper';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit3 } from 'lucide-react-native';

const MyProfile = ({ imageUri, setImageUri }) => {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/80';
  const storage = getStorage();

  const fetchUserData = async () => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) throw new Error("User not authenticated.");

      const userDocRef = doc(firestore, 'users', currentUserId);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        setUser({ uid: currentUserId, ...userSnapshot.data() });
      } else {
        throw new Error("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      await uploadImage(selectedUri);
    }
  };

  const uploadImage = async (uri) => {
    if (uploading) return;

    setUploading(true);
    try {
      if (!user) throw new Error("User not authenticated.");

      const response = await fetch(uri);
      if (!response.ok) throw new Error("Failed to fetch image from URI");

      const blob = await response.blob();

      const imageRef = ref(storage, `profile_images/${user.uid}`);
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, 'users', user.uid), { profileImageURL: downloadURL });
      setImageUri(downloadURL);

      blob.close();
    } catch (error) {
      console.error("Image upload failed:", error.message);
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldValue(user[field]);
    setModalVisible(true);
  };

  const saveField = async () => {
    try {
      const updatedUser = { ...user, [editingField]: fieldValue };
      await updateDoc(doc(firestore, 'users', user.uid), { [editingField]: fieldValue });
      setUser(updatedUser);
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating field:", error.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleFieldChange = (text) => {
    if (editingField === 'university' || editingField === 'major') {
      if (text.length <= 28) {
        setFieldValue(text);
      }
    } else {
      setFieldValue(text);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image size={120} source={{ uri: imageUri || placeholderImage }} />
      </View>

      <PaperButton
        mode="text"
        onPress={pickImage}
        loading={uploading}
        disabled={uploading}
        style={{ width: 200 }}
      >
        {uploading ? "Uploading..." : "Change Profile Image"}
      </PaperButton>

      <Text style={styles.username}>{user.username || "Unknown User"}</Text>
      <Text style={styles.email}>{user.email || "No email provided"}</Text>

      <Text style={styles.detailsTextBold}>University:</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailsText}>{user.university}</Text>
        <IconButton icon={() => <Edit3 size={16} color="black" />} onPress={() => handleEditField('university')} style={styles.editIcon} />
      </View>

      <Text style={styles.detailsTextBold}>Major:</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailsText}>{user.major}</Text>
        <IconButton icon={() => <Edit3 size={16} color="black" />} onPress={() => handleEditField('major')} style={styles.editIcon} />
      </View>
  
      <View style={styles.bioContainer}>
        <View style={styles.editRow}>
          <Text style={styles.bioTitle}>Bio</Text>
          <IconButton icon={() => <Edit3 size={18} color="black" />} onPress={() => handleEditField('bio')} />
        </View>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>

      <View style={styles.bioContainer}>
        <View style={styles.editRow}>
          <Text style={styles.bioTitle}>Interests</Text>
          <IconButton icon={() => <Edit3 size={18} color="black" />} onPress={() => handleEditField('interests')} />
        </View>
        <Text style={styles.bioText}>{user.interests}</Text>
      </View>

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={fieldValue}
              onChangeText={handleFieldChange}
              placeholder={`Edit ${editingField}`}
              multiline={true}
            />
            <PaperButton onPress={saveField}>Save</PaperButton>
            <PaperButton onPress={() => setModalVisible(false)}>Cancel</PaperButton>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 80,
    padding: 5,
    backgroundColor: '#fff',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
    color: '#888',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    marginTop: 5,
  },
  editIcon: {
    position: 'absolute',
    right: 15,
  },
  detailsText: {
    fontSize: 16,
    color: '#555',
  },
  detailsTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  bioContainer: {
    position: 'relative',
    width: '90%',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: '50%',
  },
  bioText: {
    fontSize: 16,
    color: '#666',
  },
  editRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    padding: 8,
  },
});

export default MyProfile;
