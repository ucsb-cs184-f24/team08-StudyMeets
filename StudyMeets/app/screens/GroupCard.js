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

  const formatDate = (date) => {
    if (!date) return 'TBD';
    if (typeof date === 'string') return date; // If date is already a string (e.g., 'TBD')
    if (date.toDate) {
      const formattedDate = date.toDate();
      return `${formattedDate.toLocaleDateString()} ${formattedDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    return 'TBD';
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Card style={{ marginVertical: 10, marginHorizontal: 10 }}>
          <Card.Title title={item.Title} subtitle={`Location: ${item.Location}`} />
          {item.ImageUrl && (
            <Card.Cover 
              source={{ uri: item.ImageUrl }} 
              style={{ height: 275, marginBottom: 5, resizeMode: 'cover' }}
            />
          )}
          <Card.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>
              {item.Description}
            </Text>
            {item.Tags && item.Tags.length > 0 && (
              <View style={styles.tagRow}>
                <Text variant="bodySmall" style={{ fontWeight: 'bold' }}></Text>
                <View style={styles.condensedChipContainer}>
                  {item.Tags.map((tag, index) => (
                    <Chip 
                      key={`tag-${index}`} 
                      style={styles.condensedChip}
                      textStyle={styles.condensedChipText}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              </View>
            )}
            <View style={{ marginTop: 10 }}>
              <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
                Next Meeting:
              </Text>
              <Text variant="bodySmall">{formatDate(item.NextMeetingDate)}</Text>
            </View>
          </Card.Content>
          <Divider />
          <Card.Actions>
            <View style={styles.buttonContainer}>
              <Button onPress={() => onPrimaryAction(item.id)}>{primaryActionLabel}</Button>
              {secondaryActionLabel && onSecondaryAction && (
                <Button onPress={() => onSecondaryAction(item.id)} textColor="red">
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
              <IconButton icon="close" onPress={() => setModalVisible(false)} />
            </View>
            <ScrollView>
              <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
              <Text variant="bodyLarge">{item.Location}</Text>
              <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
              <Text variant="bodyLarge">{item.Description}</Text>
              <Text variant="titleMedium" style={styles.sectionTitle}>Tags:</Text>
              {item.Tags && item.Tags.length > 0 && (
                <>
                  {/* <Text variant="titleMedium" style={styles.sectionTitle}>Tags</Text> */}
                  <View style={styles.tagsContainer}>
                    {item.Tags.map((tag, index) => (
                      <Chip key={index} style={styles.tag}>
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </>

              )}
              {item.Restrictions && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Restrictions</Text>
                  <Text variant="bodyLarge">
                    {item.Restrictions.universityRestricted ? 'University Restricted' : ''}
                    {item.Restrictions.universityRestricted && item.Restrictions.majorRestricted ? ', ' : ''}
                    {item.Restrictions.majorRestricted ? 'Major Restricted' : ''}
                    {!item.Restrictions.universityRestricted && !item.Restrictions.majorRestricted ? 'None' : ''}
                  </Text>
                  
                  {item.Restrictions.universityRestricted && item.Restrictions.universities?.length > 0 && (
                    <>
                      <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: 14 }]}>Allowed Universities:</Text>
                      <View style={styles.tagsContainer}>
                        {item.Restrictions.universities.map((university, index) => (
                          <Chip key={`uni-${index}`} style={styles.tag}>
                            {university}
                          </Chip>
                        ))}
                      </View>
                    </>
                  )}

                  {item.Restrictions.majorRestricted && item.Restrictions.majors?.length > 0 && (
                    <>
                      <Text variant="titleMedium" style={[styles.sectionTitle, { fontSize: 14 }]}>Allowed Majors:</Text>
                      <View style={styles.tagsContainer}>
                        {item.Restrictions.majors.map((major, index) => (
                          <Chip key={`major-${index}`} style={styles.tag}>
                            {major}
                          </Chip>
                        ))}
                      </View>
                    </>
                  )}
                </>
              )}
            </ScrollView>
            <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
    marginTop: 5,
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
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  condensedChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  condensedChip: {
    marginRight: 5,
    marginBottom: 5,
  },
  condensedChipText: {
    fontSize: 12,
  },
  restrictionsText: {
    fontWeight: 'bold',
  },
});

export default GroupCard;
