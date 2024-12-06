import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FriendsNotifications from './FriendsNotifications';
import PostsNotifications from './PostsNotifications';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const Notifications = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#f5f5f5'},
        }}
      >
        <Tab.Screen name="Friend Requests" component={FriendsNotifications} />
        <Tab.Screen name="Post Notifications" component={PostsNotifications} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Notifications;