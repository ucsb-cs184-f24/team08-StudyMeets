import React from 'react';
import { Card, Button, Text, Divider, Chip } from 'react-native-paper';
import { View } from 'react-native';

const GroupCard = ({ item, onPrimaryAction, primaryActionLabel, secondaryActionLabel, onSecondaryAction }) => {
  // Helper to safely format the date
  const formatDate = (date) => {
    if (!date) return 'TBD';
    if (typeof date === 'string') return date; // Already a string like 'TBD'
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
    <Card style={{ marginVertical: 10, marginHorizontal: 10 }}>
      <Card.Title title={item.Title} subtitle={`Location: ${item.Location}`} />
      <Card.Content>
        <Text variant="bodyMedium" style={{ marginBottom: 5 }}>{item.Description}</Text>
        
        {/* Tags Section */}
        {item.Tags && item.Tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5 }}>
            {item.Tags.map((tag, index) => (
              <Chip key={index} style={{ marginRight: 5, marginBottom: 5 }}>
                {tag}
              </Chip>
            ))}
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

        {/* Next Meeting Date and Time */}
        <View style={{ marginTop: 10 }}>
          <Text variant="bodySmall" style={{ fontWeight: 'bold' }}>
            Next Meeting:
          </Text>
          <Text variant="bodySmall">{formatDate(item.NextMeetingDate)}</Text>
        </View>
      </Card.Content>
      <Divider />
      <Card.Actions>
        <Button onPress={() => onPrimaryAction(item.id)}>{primaryActionLabel}</Button>
        {secondaryActionLabel && onSecondaryAction && (
          <Button onPress={() => onSecondaryAction(item.id)} textColor="red">
            {secondaryActionLabel}
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

export default GroupCard;
