import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CreatedGroups from './CreatedGroups';
import JoinedGroups from './JoinedGroups';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const MyGroups = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Tab.Screen name="Created Groups" component={CreatedGroups} />
        <Tab.Screen name="Joined Groups" component={JoinedGroups} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MyGroups;