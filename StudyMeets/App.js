import React, { useContext } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './app/screens/Login';
import Explore from './app/screens/Explore';
import Profiles from './app/screens/Profiles';
import MyGroups from './app/screens/MyGroups';
import CreateProfile from './app/screens/CreateProfile';
import { User, Search, Users } from 'lucide-react-native';
import { ThemeProvider, ThemeContext } from './theme/ThemeContext';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName='Profiles'
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: { backgroundColor: theme.colors.tabBar },
        headerStyle: { backgroundColor: theme.colors.tabBar },
        headerTintColor: theme.colors.text
      }}
    >
      <Tab.Screen
        name="Explore"
        component={Explore}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyGroups"
        component={MyGroups}
        options={{
          title: 'MyGroups',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profiles"
        component={Profiles}
        options={{
          title: 'Profiles',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Login"
                screenOptions={{
                  headerStyle: { backgroundColor: theme.colors.tabBar },
                  headerTintColor: theme.colors.text,
                }}
              >
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: false }} />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  
  );
};

export default App;