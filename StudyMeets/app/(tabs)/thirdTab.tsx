import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const thirdTab = () => {
  return (
    <View>
      <Pressable onPress={() => router.push("/differentPageFolder/differentPage/")} style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? '#ddd' : '#007BFF' }
        ]}>
        <Text style={styles.text}>Go to differentPage</Text>
      </Pressable>
    </View>
  );
};

export default thirdTab;

const styles = StyleSheet.create({
    button: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    text: {
      color: 'white',
      fontSize: 16,
    },
  });