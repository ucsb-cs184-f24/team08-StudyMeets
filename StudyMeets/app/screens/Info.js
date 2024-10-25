import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Info = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is some random info displayed here.</Text>
      <Text style={styles.text}>This is some random info displayed here.</Text>
      <Text style={styles.text}>This is some random info displayed here.</Text>
      <Text style={styles.text}>This is some random info displayed here.</Text>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});