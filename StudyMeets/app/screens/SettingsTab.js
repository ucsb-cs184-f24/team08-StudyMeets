import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from '../../firebase';
import { Button as PaperButton } from 'react-native-paper';
import { signOut } from "firebase/auth";

const SettingsTab = () => {
    
    const navigation = useNavigation();

    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigation.navigate('Login');
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    return (
        <SafeAreaView style={styles.container}>

          <Text style={styles.title}>Settings</Text>

          <TouchableOpacity style={styles.mailIcon} onPress={() => navigation.navigate('Notifications')}>
            <Mail size={40} color="black" />
          </TouchableOpacity>

          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => navigation.navigate('Notification Settings')}>
              <Text style={styles.settingText}>Notification Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => navigation.navigate('Profile Privacy Settings')}>
              <Text style={styles.settingText}>Profile Privacy Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingOption}
              onPress={() => navigation.navigate('General Settings')}>
              <Text style={styles.settingText}>General Settings</Text>
            </TouchableOpacity>
          </View>

          <PaperButton
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </PaperButton>

        </SafeAreaView>
    );
};
    
export default SettingsTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    mailIcon: {
        position: 'absolute',
        top: 45,
        right: 15,
    },
    settingsContainer: {
        flex: 1,
    },
    settingOption: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        color: '#000',
    },
    logoutButton: {
        marginVertical: 20,
    },
});
