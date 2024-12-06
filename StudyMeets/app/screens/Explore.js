import React, {useState} from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExploreGroups from './ExploreGroups';
import ExploreUsers from './ExploreUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from './GroupCard';
import { PlusCircle } from 'lucide-react-native';
import PeopleList from './PeopleList'
import {useNavigation} from "@react-navigation/native"

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