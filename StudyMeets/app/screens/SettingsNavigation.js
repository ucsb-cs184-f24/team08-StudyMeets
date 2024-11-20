import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsTab from './SettingsTab';

const Stack = createNativeStackNavigator();

const NotificationsScreen = () => (
    <View style={styles.tabContainer}>
        <Text>notifications</Text>
    </View>
);

const NotificationSettingsScreen = () => (
    <View style={styles.tabContainer}>
        <Text>notification settings</Text>
    </View>
);

const ProfilePrivacyScreen = () => (
    <View style={styles.tabContainer}>
        <Text>profile privacy settings</Text>
    </View>
);

const GeneralScreen = () => (
    <View style={styles.tabContainer}>
        <Text>general settings</Text>
    </View>
);

const SettingsNavigation = () => {

    return (
        <Stack.Navigator initialRouteName="SettingsTab">
            <Stack.Screen name="SettingsTab" component={SettingsTab} options={{ headerShown: false }}/>
            <Stack.Screen name="Notifications" component={NotificationsScreen}/>
            <Stack.Screen name="Notification Settings" component={NotificationSettingsScreen}/>
            <Stack.Screen name="Profile Privacy Settings" component={ProfilePrivacyScreen}/>
            <Stack.Screen name="General Settings" component={GeneralScreen}/>
        </Stack.Navigator>
    )
};

export default SettingsNavigation;

const styles = StyleSheet.create({
    tabContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
  });