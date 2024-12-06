import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExploreGroups from './ExploreGroups';
import ExploreUsers from './ExploreUsers';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const Explore = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        lazy={true}
        screenOptions={{
          tabBarActiveTintColor: '#000',
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: { backgroundColor: '#f5f5f5' },
        }}
      >
        <Tab.Screen name="Study Groups" component={ExploreGroups} />
        <Tab.Screen name="All Users" component={ExploreUsers} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Explore;