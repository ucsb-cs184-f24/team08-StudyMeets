import React, { useState, useContext } from 'react';
import { Card, Button, Text, Divider, Chip, IconButton } from 'react-native-paper';
import { View, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';

const GroupCard = ({ 
  item, 
  onPrimaryAction, 
  primaryActionLabel, 
  secondaryActionLabel, 
  onSecondaryAction,
  thirdActionLabel,
  onThirdAction
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (item) => {
    setModalVisible(true);
  };

  const { theme } = useContext(ThemeContext);

  const formatDate = (date) => {
    if (!date) return 'TBD';
    if (typeof date === 'string') return date;
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
        <Card style={{ marginVertical: 10, marginHorizontal: 10 , backgroundColor: theme.colors.cardBackgroundColor}}>
          <Card.Title title={item.Title} subtitle={`Location: ${item.Location}`} />
          <Card.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>
              {item.Description}
            </Text>

            {/* Tags */}
            {item.Tags && item.Tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
                {item.Tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    style={[styles.tag, { marginRight: 5, marginBottom: 5, backgroundColor: theme.colors.groupCardTag }]}
                    textStyle={{ color: theme.colors.text }}
                  >
                    {tag}
                  </Chip>
                ))}
              </View>
            )}

            {/* Subjects */}
            {item.Subjects && item.Subjects.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
                {item.Subjects.map((subject, index) => (
                  <Chip 
                    key={index} 
                    style={[styles.tag, { marginRight: 5, marginBottom: 5, backgroundColor: theme.colors.groupCardTag }]}
                    textStyle={{ color: theme.colors.text }}
                  >
                    {subject}
                  </Chip>
                ))}
              </View>
            )}

            {/* Classes */}
            {item.Classes && item.Classes.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
                {item.Classes.map((cls, index) => (
                  <Chip 
                    key={index} 
                    style={[styles.tag, { marginRight: 5, marginBottom: 5, backgroundColor: theme.colors.groupCardTag }]}
                    textStyle={{ color: theme.colors.text }}
                  >
                    {cls}
                  </Chip>
                ))}
              </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text variant="bodySmall">Created by: {item.OwnerName}</Text>
              <Text variant="bodySmall">
                Date: {item.CreatedAt?.toDate().toLocaleDateString() || 'N/A'}
              </Text>
            </View>
            <Text variant="bodySmall">
              Time: {item.CreatedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'}
            </Text>
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
              <Button 
                mode="contained"
                onPress={() => onPrimaryAction(item.id)}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.text}
              >
                {primaryActionLabel}
              </Button>

              {thirdActionLabel && onThirdAction && (
                <Button 
                  mode="contained"
                  onPress={() => onThirdAction(item.id)}
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.text}
                >
                  {thirdActionLabel}
                </Button>
              )}
              
              {secondaryActionLabel && onSecondaryAction && (
                <Button 
                  mode="contained" 
                  onPress={() => onSecondaryAction(item.id)} 
                  buttonColor={theme.colors.cancel}
                  textColor={theme.colors.text}
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
          <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackgroundColor}]}>
            <View style={styles.modalHeader}>
              <Text variant="headlineMedium">{item.Title}</Text>
              <IconButton icon="close" onPress={() => setModalVisible(false)} />
            </View>
            <ScrollView>
              <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
              <Text variant="bodyLarge">{item.Location}</Text>
              <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
              <Text variant="bodyLarge">{item.Description}</Text>

              {/* Tags */}
              {item.Tags && item.Tags.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {item.Tags.map((tag, index) => (
                      <Chip 
                        key={index} 
                        style={[styles.tag, { backgroundColor: theme.colors.groupCardTag }]}
                        textStyle={{ color: theme.colors.text }}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </>
              )}

              {/* Subjects */}
              {item.Subjects && item.Subjects.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Subjects</Text>
                  <View style={styles.tagsContainer}>
                    {item.Subjects.map((subject, index) => (
                      <Chip 
                        key={index} 
                        style={[styles.tag, { backgroundColor: theme.colors.groupCardTag }]}
                        textStyle={{ color: theme.colors.text }}
                      >
                        {subject}
                      </Chip>
                    ))}
                  </View>
                </>
              )}

              {/* Classes */}
              {item.Classes && item.Classes.length > 0 && (
                <>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Classes</Text>
                  <View style={styles.tagsContainer}>
                    {item.Classes.map((cls, index) => (
                      <Chip 
                        key={index} 
                        style={[styles.tag, { backgroundColor: theme.colors.groupCardTag }]}
                        textStyle={{ color: theme.colors.text }}
                      >
                        {cls}
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
              textColor = {theme.colors.text}
              buttonColor={theme.colors.cancel}
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
});

export default GroupCard;
