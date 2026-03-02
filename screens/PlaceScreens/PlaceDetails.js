import { useEffect, useState, useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';

import IconButton from '../../components/ui/IconButton';
import OutlinedButton from '../../components/ui/OutlinedButton';
import { Colors } from '../../constants/colors';
import { deletePlace, fetchPlaceDetails } from '../../util/http-places';

function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState();
  const selectedPlaceId = route.params.placeId;

  const deletePlaceHandler = useCallback(() => {
    Alert.alert(
      "Delete Place",
      "Are you sure you want to delete this place?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlace(selectedPlaceId);
              navigation.reset({
                index: 0,
                routes: [{ name: 'AllPlaces' }],
              });
            } catch (err) {
              Alert.alert('Delete Failed', 'Could not delete this place from the server.');
            }
          }
        },
      ]
    );
  }, [selectedPlaceId, navigation]);

  function showOnMapHandler() {
    if (!fetchedPlace || !fetchedPlace.location) {
      Alert.alert("Error", "Location coordinates are missing.");
      return;
    }

    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  }

  useEffect(() => {
    async function loadPlaceData() {
      try {
        const place = await fetchPlaceDetails(selectedPlaceId);
        if (!place) {
            Alert.alert('Error', 'Could not find place details.');
            navigation.goBack();
            return;
        }

        setFetchedPlace(place);
        
        navigation.setOptions({
          title: place.title || 'Place Details',
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="trash"
              size={24}
              color={tintColor}
              onPress={deletePlaceHandler} 
            />
          ),
        });
      } catch (err) {
        console.log("Error loading details:", err);
      }
    }
    loadPlaceData();
  }, [selectedPlaceId, navigation, deletePlaceHandler]);


  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100
  },
  fallbackText: {
    color: Colors.primary500,
    fontWeight: 'bold'
  },
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});