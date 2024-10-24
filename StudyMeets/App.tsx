import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import SecondPage from './app/screens/SecondPage';
import { onAuthStateChanged, User } from 'firebase/auth';
import { f_auth } from './firebaseConfig';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Main Page" component={List} />
      <InsideStack.Screen name="Details" component={Details} />
      <InsideStack.Screen name="Second Page" component={SecondPage} />
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(f_auth, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{ headerShown: false}} />
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false}} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
