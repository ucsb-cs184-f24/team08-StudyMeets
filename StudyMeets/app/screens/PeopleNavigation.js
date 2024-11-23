import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import People from './People';
import Profile from './Profile';

const Stack = createNativeStackNavigator();

export default function PeopleNavigation() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="People" component={People} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ headerTitle: ''}}/>
    </Stack.Navigator>
  );
}
