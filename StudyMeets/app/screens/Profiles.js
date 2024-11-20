import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button as PaperButton, Text, Divider } from 'react-native-paper';
import { auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';

const Profiles = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();
  const storage = getStorage();

  const placeholderImage = 'https://via.placeholder.com/80';

  useEffect(() => {
    const fetchUserInfo = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not found. Please log in again.");
        navigation.navigate('Login');
        return;
      }

      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data()?.username || 'No username found');
          setImageUri(userDoc.data()?.profileImageURL || placeholderImage);
        } else {
          console.log('No user document found!');
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("ImagePicker result:", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      console.log("Selected Image URI:", selectedUri);
      await uploadImage(selectedUri);
    } else {
      console.log("Image selection was canceled or failed");
    }
  };

  const uploadImage = async (uri) => {
    if (uploading) return;

    setUploading(true);
    try {
      if (!user) throw new Error("User not authenticated.");

      console.log("Uploading image from URI:", uri);

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

  const handleChangePassword = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        Alert.alert("Password Reset", "Check your email for password reset instructions.");
      } catch (error) {
        console.error("Error sending password reset email:", error);
        Alert.alert("Error", "Unable to send password reset email.");
      }
    } else {
      Alert.alert("Error", "No user email found.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {user ? (
        <>
          {/* Increase Avatar Image size */}
          <Avatar.Image
            size={120} // Larger size for the profile image
            source={{ uri: imageUri || placeholderImage }}
          />
          <PaperButton
            mode="text"
            onPress={pickImage}
            loading={uploading}
            style={{ marginVertical: 10, width: 200, paddingVertical: 0 }} // Smaller button size
            
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Change Profile Image"}
          </PaperButton>

          <Text variant="headlineMedium" style={{ marginVertical: 10 }}>User Information</Text>
          <Text>Email: {user.email}</Text>
          {username && <Text>Username: {username}</Text>}
          <Divider style={{ marginVertical: 20, width: '100%' }} />

          <PaperButton
            mode="contained"
            onPress={handleChangePassword}
            style={{ marginVertical: 5 }}
          >
            Change Password
          </PaperButton>
          <PaperButton
            mode="outlined"
            onPress={handleLogout}
            style={{ marginVertical: 5 }}
          >
            Logout
          </PaperButton>
        </>
      ) : (
        <Text>No user is logged in</Text>
      )}
    </View>
  );
};

export default Profiles;
