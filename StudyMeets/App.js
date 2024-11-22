import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Explore from './app/screens/Explore';
import SettingsNavigation from './app/screens/SettingsNavigation';
import MyGroups from './app/screens/MyGroups';
import People from './app/screens/People';
import CreateProfile from './app/screens/CreateProfile';
import { Settings, Search, Users, LayoutGrid } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Explore" component={Explore} options={{headerShown: false, tabBarIcon: ({ color, size }) => <Search color={color} size={size} />}} />
      <Tab.Screen name="MyGroups" component={MyGroups} options={{headerShown: false, tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />}}/>
      <Tab.Screen name="People" component={People} options={{headerShown: false, tabBarIcon: ({ color, size }) => <Users color={color} size={size} />}}/>
      <Tab.Screen name="Settings" component={SettingsNavigation} options={{headerShown: false, tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;