import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button as PaperButton, Text, Divider } from 'react-native-paper';
import { auth } from '../../firebase';
import { doc, getDoc, updateDoc, deleteDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { signOut, sendPasswordResetEmail, deleteUser } from 'firebase/auth';

const MyProfile = ({ imageUri, setImageUri }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
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

  const handleChangePassword = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        Alert.alert("Password Reset", "Check your email for password reset instructions.");
      } catch (error) {
        Alert.alert("Error", "Unable to send password reset email.");
      }
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

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const currentUser = auth.currentUser;
              if (!currentUser) {
                throw new Error("No user found");
              }

              // Delete user data from Firestore
              await deleteDoc(doc(firestore, 'users', currentUser.uid));

              // Delete the user's authentication account
              await deleteUser(currentUser);

              // Delete user's profile image from storage
              if (imageUri) {
                const imageRef = ref(storage, `profile_images/${currentUser.uid}`);
                try {
                  await deleteObject(imageRef);
                } catch (error) {
                  console.error("Error deleting profile image:", error);
                }
              }

              // Delete user's posts and related data
              const userPosts = await getDocs(
                query(collection(firestore, 'studymeets'), 
                where('OwnerEmail', '==', currentUser.email))
              );

              const deletePromises = userPosts.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deletePromises);

              // Navigate to login screen
              navigation.navigate('Login');
            } catch (error) {
              console.error("Error deleting account:", error);
              
              // Handle specific errors
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  "Re-authentication Required",
                  "Please log out and log in again before deleting your account.",
                  [
                    {
                      text: "OK",
                      onPress: handleLogout
                    }
                  ]
                );
              } else {
                Alert.alert("Error", "Failed to delete account. Please try again.");
              }
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 30 }}>
      {user ? (
        <>
          <Avatar.Image
            testID='profilePic'
            size={120}
            source={{ uri: imageUri || placeholderImage }}
          />
          <PaperButton
            mode="text"
            onPress={pickImage}
            loading={uploading}
            disabled={uploading}
            style={{ marginVertical: 10, width: 200 }}
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
          <PaperButton
            mode="contained"
            onPress={handleDeleteAccount}
            buttonColor="red"
            textColor="white"
            style={{ marginVertical: 5 }}
          >
            Delete Account
          </PaperButton>
        </>
      ) : (
        <Text>No user is logged in</Text>
      )}
    </View>
  );
};

export default MyProfile;
