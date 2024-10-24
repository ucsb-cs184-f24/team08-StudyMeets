import { View, Text } from 'react-native';
import React from 'react';
import { useAuthState } from '../../hooks/useAuthState';

const Details = () => {
    const user = useAuthState();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {user ? (
                <>
                    <Text>Email: {user.email}</Text>
                    <Text>Password is not accessible</Text>
                </>
            ) : (
                <Text>No user is logged in.</Text>
            )}
        </View>
    );
};

export default Details;
