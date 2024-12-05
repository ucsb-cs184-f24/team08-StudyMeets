import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007BFF',
    tabBar: '#f0f0f0',
    tabBarActive: '#007BFF',
    tabBarInactive: '#7d868e',
    background: '#ffffff',
    text: '#000000',
    secondary: '#75b8ff',
    borderColor: '#b5b5b5',
    cardBackgroundColor: '#fbf0ff',
    warning: '#dc3545',
    placeholderTextColor: '#8c8c8c',
    icon: '#000000',
    groupCardTag: '#b6abf7'
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
    background: '#222222',
    text: '#ffffff',
    secondary: '#75b8ff',
    borderColor: '#f2f2f2',
    cardBackgroundColor: '#474547',
    warning: '#dc3545',
    placeholderTextColor: '#a6a6a6',
    icon: '#ffffff',
    groupCardTag: '#6c85a1'
  },
};