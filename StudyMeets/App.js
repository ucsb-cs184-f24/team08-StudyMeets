import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Info from './app/screens/Info';
import Account from './app/screens/Account';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Define the tab navigation component after login
const MainTabs = () => {
  return (
    <Tab.Navigator initialRouteName='Account'>
      <Tab.Screen name="Info" component={Info} options={{ title: 'Info' }} />
      <Tab.Screen name="Account" component={Account} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;