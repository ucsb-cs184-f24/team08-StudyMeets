import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Explore from './app/screens/Explore';
import Profiles from './app/screens/Profiles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator initialRouteName='Account'>
      <Tab.Screen name="Explore" component={Explore} options={{
          title: 'Explore',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('CreateItem')} style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 30, color: 'grey' }}>+</Text>
            </TouchableOpacity>
          ),
        }} />
      {/* <Tab.Screen name="MyGroups" component={MyGroups}/> */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;