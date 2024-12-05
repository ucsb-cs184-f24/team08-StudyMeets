// GroupCard.js
import React, { useState } from 'react';
import { Card, Button, Text, Divider, Chip, IconButton } from 'react-native-paper';
import { View, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

const GroupCard = ({ 
  item, 
  onPrimaryAction, 
  primaryActionLabel, 
  secondaryActionLabel, 
  onSecondaryAction,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (item) => {
    setModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity onPress={() => handleCardPress(item)}>
        <Card style={{ marginVertical: 10 ,marginHorizontal: 10}}>
          <Card.Title title={item.Title} />
          
          {item.ImageUrl && (
            <Card.Cover 
              source={{ uri: item.ImageUrl }} 
              style={{ height: 275, marginBottom: 5, resizeMode: 'cover' }}
            />
          )}
          
          <Card.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>
              Location: {item.Location}
            </Text>
            
            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>
              {item.Description}
            </Text>

            {/* Add Universities Section */}
            {item.Restrictions?.universityRestricted && item.Universities?.length > 0 && (
              <View style={styles.restrictionSection}>
                <Text variant="bodyMedium" style={styles.restrictionTitle}>
                  Restricted to Universities:
                </Text>
                <View style={styles.chipContainer}>
                  {item.Universities.map((uni, index) => (
                    <Chip key={`uni-${index}`} style={styles.chip}>
                      {uni}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {/* Add Majors Section */}
            {item.Restrictions?.majorRestricted && item.Majors?.length > 0 && (
              <View style={styles.restrictionSection}>
                <Text variant="bodyMedium" style={styles.restrictionTitle}>
                  Restricted to Majors:
                </Text>
                <View style={styles.chipContainer}>
                  {item.Majors.map((major, index) => (
                    <Chip key={`major-${index}`} style={styles.chip}>
                      {major}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {/* Existing Tags Section */}
            {item.Tags && item.Tags.length > 0 && (
              <View style={styles.restrictionSection}>
                <Text variant="bodyMedium" style={styles.restrictionTitle}>
                  Tags:
                </Text>
                <View style={styles.chipContainer}>
                  {item.Tags.map((tag, index) => (
                    <Chip key={`tag-${index}`} style={styles.chip}>
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            )}

            {/* Creator and Date/Time Information */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text variant="bodySmall">Created by: {item.OwnerName}</Text>
              <Text variant="bodySmall">
                Date: {item.CreatedAt?.toDate().toLocaleDateString() || 'N/A'}
              </Text>
            </View>
            <Text variant="bodySmall">
              Time: {item.CreatedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
            </Text>
          </Card.Content>
          <Divider />
          <Card.Actions>
            <View style={styles.buttonContainer}>
              <Button 
                onPress={() => onPrimaryAction(item.id)}
                style={styles.actionButton}
              >
                {primaryActionLabel}
              </Button>
              {secondaryActionLabel && onSecondaryAction && (
                <Button 
                  onPress={() => onSecondaryAction(item.id)} 
                  textColor="red"
                  style={styles.actionButton}
                >
                  {secondaryActionLabel}
                </Button>
              )}
            </View>
          </Card.Actions>
        </Card>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="headlineMedium">{item.Title}</Text>
              <IconButton
                icon="close"
                onPress={() => setModalVisible(false)}
              />
            </View>
            
            <ScrollView>
              <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
              <Text variant="bodyLarge">{item.Location}</Text>

              <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
              <Text variant="bodyLarge">{item.Description}</Text>

              {/* Add Universities to Modal */}
              {item.Restrictions?.universityRestricted && item.Universities?.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Restricted to Universities
                  </Text>
                  <View style={styles.tagsContainer}>
                    {item.Universities.map((uni, index) => (
                      <Chip key={`uni-${index}`} style={styles.tag}>
                        {uni}
                      </Chip>
                    ))}
                  </View>
                </>
              )}

              {/* Add Majors to Modal */}
              {item.Restrictions?.majorRestricted && item.Majors?.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Restricted to Majors
                  </Text>
                  <View style={styles.tagsContainer}>
                    {item.Majors.map((major, index) => (
                      <Chip key={`major-${index}`} style={styles.tag}>
                        {major}
                      </Chip>
                    ))}
                  </View>
                </>
              )}

              {/* Existing Tags Section */}
              {item.Tags && item.Tags.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {item.Tags.map((tag, index) => (
                      <Chip key={index} style={styles.tag}>
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </>
              )}

              <View style={styles.detailsContainer}>
                <Text variant="bodyMedium">Created by: {item.OwnerName}</Text>
                <Text variant="bodyMedium">
                  Date: {item.CreatedAt?.toDate().toLocaleDateString() || 'N/A'}
                </Text>
                <Text variant="bodyMedium">
                  Time: {item.CreatedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
                </Text>
              </View>
            </ScrollView>

            <Button 
              mode="contained" 
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </>
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  tag: {
    marginRight: 5,
    marginBottom: 5,
  },
  detailsContainer: {
    marginTop: 15,
    gap: 5,
  },
  closeButton: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  restrictionSection: {
    marginVertical: 5,
  },
  restrictionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  chip: {
    marginRight: 5,
    marginBottom: 5,
  },
});

export default GroupCard;
