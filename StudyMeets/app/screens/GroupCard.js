// GroupCard.js
import React from 'react';
import { Card, Button, Text, Divider } from 'react-native-paper';
import { View } from 'react-native';

const GroupCard = ({ item, onPrimaryAction, primaryActionLabel, secondaryActionLabel, onSecondaryAction }) => {
  return (
    <Card style={{ marginVertical: 10 }}>
      <Card.Title title={item.Title} subtitle={`Location: ${item.Location}`} />
      <Card.Content>
        <Text variant="bodyMedium" style={{ marginBottom: 5 }}>{item.Description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          <Text variant="bodySmall">Created by: {item.OwnerName}</Text>
          <Text variant="bodySmall">
            Date: {item.CreatedAt?.toDate().toLocaleDateString() || 'N/A'}
          </Text>
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
