import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const UserPage = () => {
    const {id} = useLocalSearchParams();

    return (
        <View>
            <Text>User Page - {id}</Text>
        </View>
    );
};

export default UserPage;