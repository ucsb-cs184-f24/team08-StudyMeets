import React, { useContext } from 'react';
import { Modal, View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../theme/ThemeContext';

const PeopleList = ({ visible, onClose, members, owner }) => {
  const navigation = useNavigation();
  const placeholderImage = 'https://via.placeholder.com/80';
  const { theme } = useContext(ThemeContext);

  const handlePress = (user) => {
    onClose()
    navigation.navigate('Profile', { user });
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.userRow}>
      <Avatar.Image size={50} source={{ uri: item.profileImageURL || placeholderImage }} />
      <Text style={[styles.userName, { color: theme.colors.text }]}>{item.username || 'Unknown User'}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          {/* Owner Section */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Owner</Text>
          <View style={styles.ownerContainer}>
            <TouchableOpacity onPress={() => handlePress(owner)} style={styles.ownerRow}>
              <Avatar.Image size={70} source={{ uri: owner?.profileImageURL || placeholderImage }} />
              <Text style={[styles.ownerName, { color: theme.colors.text }]}>{owner?.username || 'Unknown Owner'}</Text>
            </TouchableOpacity>
          </View>

          {/* Members Section */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Members</Text>
          <FlatList
            data={members}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.text }]}>No members found.</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ownerContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PeopleList;
