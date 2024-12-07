import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExploreGroups from './ExploreGroups';
import ExploreUsers from './ExploreUsers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../theme/ThemeContext';

const Tab = createMaterialTopTabNavigator();

const Explore = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        lazy={true}
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: '#000' },
          tabBarLabelStyle: { fontSize: 16 },
          tabBarActiveTintColor: theme.colors.tabBarActive,
          tabBarInactiveTintColor: theme.colors.tabBarInactive,
          tabBarStyle: { backgroundColor: theme.colors.tabBar },
          headerStyle: { backgroundColor: theme.colors.tabBar },
          headerTintColor: theme.colors.text
        }}
      >
        <Tab.Screen name="Study Groups" component={ExploreGroups} />
        <Tab.Screen name="All Users" component={ExploreUsers} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Explore;
