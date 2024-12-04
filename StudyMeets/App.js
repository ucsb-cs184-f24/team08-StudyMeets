import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Explore from './app/screens/Explore';
import SettingsTab from './app/screens/SettingsTab';
import MyGroups from './app/screens/MyGroups';
import People from './app/screens/People';
import CreateProfile from './app/screens/CreateProfile';
import Profile from './app/screens/Profile';
import Notifications from './app/screens/Notifications';
import { Settings, Search, Users, LayoutGrid } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// delete below screen when implemented, currently like this do we dont have empty skeleton files

const NotificationSettingsScreen = () => (
  <View>
      <Text>notification settings</Text>
  </View>
);

const ProfilePrivacyScreen = () => (
  <View>
      <Text>profile privacy settings</Text>
  </View>
);

const GeneralScreen = () => (
  <View>
      <Text>general settings</Text>
  </View>
);

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Explore" component={Explore} options={{headerShown: false, tabBarIcon: ({ color, size }) => <Search color={color} size={size} />}} />
      <Tab.Screen name="MyGroups" component={MyGroups} options={{headerShown: false, tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />}}/>
      <Tab.Screen name="People" component={People} options={{headerShown: false, tabBarIcon: ({ color, size }) => <Users color={color} size={size} />}}/>
      <Tab.Screen name="Settings" component={SettingsTab} options={{headerShown: false, tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerTitle: ''}}/>
        <Stack.Screen name="Notifications" component={Notifications}/>
        <Stack.Screen name="Notification Settings" component={NotificationSettingsScreen}/>
        <Stack.Screen name="Profile Privacy Settings" component={ProfilePrivacyScreen}/>
        <Stack.Screen name="General Settings" component={GeneralScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;