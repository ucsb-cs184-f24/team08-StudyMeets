import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function CurrentLocation() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        setAddress(reverseGeocode[0]);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Location</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <Text style={styles.location}>
            Latitude: {location.latitude} {'\n'}
            Longitude: {location.longitude}
          </Text>
          {address && (
            <Text style={styles.address}>
              City: {address.city} {'\n'}
              Region: {address.region} {'\n'}
              Country: {address.country}
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
  location: {
    marginTop: 10,
  },
  address: {
    marginTop: 10,
  },
});