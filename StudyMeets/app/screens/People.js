import { View, Text, StyleSheet, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Avatar } from 'react-native-paper';
import MyProfile from './MyProfile';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const FriendsScreen = () => (
  <View style={styles.tabContainer}>
    <Text>Friends</Text>
  </View>
);

const FollowingScreen = () => (
  <View style={styles.tabContainer}>
    <Text>Following</Text>
  </View>
);

const FollowersScreen = () => (
  <View style={styles.tabContainer}>
    <Text>Followers</Text>
  </View>
);

const People = () => {
  const [user, setUser] = useState(null);
  const [imageUri, setImageUri] = useState(null);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#f5f5f5' },
          tabBarItemStyle: { margin: 0, padding: 5 }
        }}
      >
        <Tab.Screen name="Friends" component={FriendsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Following" component={FollowingScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Followers" component={FollowersScreen} options={{ headerShown: false }} />
        <Tab.Screen
          name="MyProfile"
          options={{ headerShown: false, tabBarLabel: () => null,
            tabBarIcon: ({ color, size }) => (
              <Avatar.Image size={50} source={{ uri: imageUri || placeholderImage }} />
            ),
          }}>
          {() => <MyProfile imageUri={imageUri} setImageUri={setImageUri} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default People;

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
