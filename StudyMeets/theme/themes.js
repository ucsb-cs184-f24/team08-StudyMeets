import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007BFF',
    tabBar: '#ededed',
    tabBarActive: '#007BFF',
    tabBarInactive: '#7d868e',
    background: '#ffffff',
    text: '#000000',
    secondary: '#6c757d',
    borderColor: '#ccc',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#007BFF',
    tabBar: '#181818',
    tabBarActive: '#007BFF',
    tabBarInactive: '#7d868e',
    background: '#333333',
    text: '#ffffff',
    secondary: '#6c757d',
    borderColor: '#555',
  },
};