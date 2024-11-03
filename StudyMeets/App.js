import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Explore from './app/screens/Explore';
import Profiles from './app/screens/Profiles';
import MyGroups from './app/screens/MyGroups';
import GroupDetails from './app/screens/GroupDetails';
import CreateProfile from './app/screens/CreateProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator initialRouteName='Account'>
      <Tab.Screen name="Explore" component={Explore} options={{title: 'Explore'}} />
      <Tab.Screen name="MyGroups" component={MyGroups} options={{title: 'MyGroups'}}/>
      <Tab.Screen name="Profiles" component={Profiles} options={{ title: 'Profiles' }} />
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
        <Stack.Screen name="GroupDetails" component={GroupDetails} options={{ title: 'Group Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;