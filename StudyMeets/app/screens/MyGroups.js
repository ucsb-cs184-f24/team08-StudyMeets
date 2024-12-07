import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CreatedGroups from './CreatedGroups';
import JoinedGroups from './JoinedGroups';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../theme/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const MyGroups = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
      <Tab.Navigator
        lazy={true}
        screenOptions={{
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
          tabBarStyle: { backgroundColor: theme.colors.tabBar },
          headerStyle: { backgroundColor: theme.colors.tabBar },
          headerTintColor: theme.colors.text
        }}
      >
        <Tab.Screen name="Created Groups" component={CreatedGroups} />
        <Tab.Screen name="Joined Groups" component={JoinedGroups} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};


export default MyGroups;