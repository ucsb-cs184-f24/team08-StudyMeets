import { View, Button } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { f_auth } from '../../firebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
            <Button onPress={() => navigation.navigate('Second Page')} title="Go to Second Page" />
            <Button onPress={() => f_auth.signOut()} title="Logout" />    
        </View>
    );
};

export default List;