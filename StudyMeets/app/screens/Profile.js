import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-paper';

const Profile = ({ route }) => {
  const { user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={120}
          source={{ uri: user.profileImageURL || 'https://via.placeholder.com/150' }}
        />
      </View>

      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Text style={[styles.detailsTextBold]}>University: </Text>
      <Text style={styles.detailsText}>{user.university}</Text>

      <Text style={[styles.detailsTextBold]}>Major: </Text>
      <Text style={styles.detailsText}>{user.major}</Text>

      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>Bio</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>Interests</Text>
        <Text style={styles.bioText}>{user.interests}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 80,
    padding: 5,
    backgroundColor: '#fff',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    color: '#888',
  },
  detailsText: {
    fontSize: 16,
    color: '#555',
  },
  detailsTextBold: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
    marginTop: 10,
  },
  bioContainer: {
    marginTop: 20,
    width: '90%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});

export default Profile;
