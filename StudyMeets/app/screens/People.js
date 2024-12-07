import { View, Text, StyleSheet, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState, useContext } from 'react';
import { auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Avatar } from 'react-native-paper';
import MyProfile from './MyProfile';
import { SafeAreaView } from 'react-native-safe-area-context';
import Friends from './Friends';
import Following from './Following';
import Followers from './Followers';
import { ThemeContext } from '../../theme/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const People = () => {
  const [user, setUser] = useState(null);
  const [imageUri, setImageUri] = useState(null);
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
        lazy={true}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: theme.colors.tabBar },
          tabBarItemStyle: { margin: 0, padding: 5 },
          headerStyle: { backgroundColor: theme.colors.tabBar },
          headerTintColor: theme.colors.text
        }}
      >
        <Tab.Screen name="Friends" component={Friends} options={{ headerShown: false }} />
        <Tab.Screen name="Following" component={Following} options={{ headerShown: false }} />
        <Tab.Screen name="Followers" component={Followers} options={{ headerShown: false }} />
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
