import { useEffect, useState, useCallback } from 'react';
import { Alert, View, StyleSheet, Image, Text } from 'react-native';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import OutlinedButton from '../ui/OutlinedButton';
import { getAddress, getMapPreview } from '../../util/location';

function LocationPicker({ onPickLocation, onPickMap }) {
  const [pickedLocation, setPickedLocation] = useState();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

  useEffect(() => {
      async function handleMapLocation() {
        if (isFocused && route.params?.pickedLat) {
          const lat = route.params.pickedLat;
          const lng = route.params.pickedLng;
          
          const address = await getAddress(lat, lng);
          const mapPickedLocation = { lat, lng, address };
          
          setPickedLocation(mapPickedLocation);
          onPickLocation(mapPickedLocation);

          navigation.setParams({ ...route.params, pickedLat: undefined, pickedLng: undefined });
        }
      }
      handleMapLocation();
    }, [route.params?.pickedLat, route.params?.pickedLng, isFocused, onPickLocation, navigation]);

  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    const address = await getAddress(lat, lng);
    const userLocation = { lat, lng, address };

    setPickedLocation(userLocation);
    onPickLocation(userLocation);
  }

  async function verifyPermissions() {
    const currentStatus = locationPermissionInformation?.status;
    if (currentStatus === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse?.status === PermissionStatus.GRANTED;
    }
    if (currentStatus === PermissionStatus.DENIED) {
      Alert.alert('Insufficient Permissions!', 'Grant location access to use this app.');
      return false;
    }
    return currentStatus === PermissionStatus.GRANTED;
  }

  function pickOnMapHandler() {
    if (onPickMap) {
      onPickMap();
    } else {
      navigation.navigate('Map');
    }
  }

  return (
    <View>
      <View style={styles.mapPreview}>
        {pickedLocation ? (
          <Image
            style={styles.image}
            source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}
          />
        ) : (
          <Text>No location picked yet.</Text>
        )}
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>Locate User</OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>Pick on Map</OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 8,
    borderColor: Colors.primary400,
    borderWidth: 5,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});