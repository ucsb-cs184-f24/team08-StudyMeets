import React, { useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Switch } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../theme/ThemeContext";

const SettingsTab = () => {
    
    const navigation = useNavigation();
    const { theme, isDarkTheme, toggleTheme } = useContext(ThemeContext);

    return (
        <SafeAreaView style={styles.container}
          backgroundColor={theme.colors.background}
        >

          <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

          <TouchableOpacity style={styles.mailIcon} onPress={() => navigation.navigate('Notifications')}>
            <Mail size={40} color={theme.colors.icon} />
          </TouchableOpacity>

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

          <View style={styles.switchContainer}>
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Dark Mode</Text>
            <Switch value={isDarkTheme} onValueChange={toggleTheme} style={styles.switch}/>
          </View>

        </SafeAreaView>
    );
};
    
export default SettingsTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 15,
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
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    switch: {
      marginBottom: 0
    }
});
    
