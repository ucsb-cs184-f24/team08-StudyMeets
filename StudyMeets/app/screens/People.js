import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Individual Screens
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

// Main People Component
const People = () => {
  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 18 },
          tabBarStyle: { backgroundColor: '#f5f5f5', height: 50 },
        }}
      >
        <Tab.Screen name="Friends" component={FriendsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Following" component={FollowingScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Followers" component={FollowersScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default People;
