import React, { useEffect, useState, useContext } from 'react';
import { View, Alert, Switch, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button as PaperButton, Text, Divider } from 'react-native-paper';
import { auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { ThemeContext } from '../../theme/ThemeContext';

const Profiles = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigation = useNavigation();
  const storage = getStorage();

  const placeholderImage = 'https://via.placeholder.com/80';

  const { theme, isDarkTheme, toggleTheme } = useContext(ThemeContext);

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
          setImageUri(userDoc.data()?.photoURL || placeholderImage);
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
      await updateDoc(doc(firestore, 'users', user.uid), { photoURL: downloadURL });
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
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.colors.background }]}>
      {user ? (
        <>
        <View style={styles.switchContainer}>
          <Text style={[styles.text, { color: theme.colors.text }]}>Dark Mode</Text>
          <Switch value={isDarkTheme} onValueChange={toggleTheme} style={styles.switch}/>
        </View>
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
            buttonColor={theme.colors.primary}
            style={{ marginVertical: 5 }}
            textColor={theme.colors.text}
          >
            Change Password
          </PaperButton>
          <PaperButton
            mode="contained"
            onPress={handleLogout}
            buttonColor={theme.colors.secondary}
            style={{ marginVertical: 5 }}
            textColor={theme.colors.text}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 20,
    left: 20,
    position: 'absolute'
  },
  switch: {
    marginBottom: 12
  }
});

export default Profiles;
