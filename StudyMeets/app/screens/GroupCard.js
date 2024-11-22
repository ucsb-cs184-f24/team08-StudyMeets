// GroupCard.js
import React, { useContext } from 'react';
import { Card, Button, Text, Divider } from 'react-native-paper';
import { View } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';

const GroupCard = ({ item, onPrimaryAction, primaryActionLabel, secondaryActionLabel, onSecondaryAction }) => {
  const { theme, isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <Card style={{ marginVertical: 10, backgroundColor: theme.colors.cardBackgroundColor }}>
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
        <Button 
          onPress={() => onPrimaryAction(item.id)}
          buttonColor = {theme.colors.primary}
          textColor = {theme.colors.text}
        >
            {primaryActionLabel}
        </Button>
        {secondaryActionLabel && onSecondaryAction && (
          <Button 
            onPress={() => onSecondaryAction(item.id)} 
            buttonColor = {theme.colors.warning}
            textColor = {theme.colors.text}
          >
            {secondaryActionLabel}
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
};

export default GroupCard;
