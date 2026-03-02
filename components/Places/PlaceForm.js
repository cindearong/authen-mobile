import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import Button from '../ui/Button';
import ImagePicker from './ImagePicker';
import LocationPicker from './LocationPicker';
import { insertPlace } from '../../util/http-places';

function PlaceForm({ onPlaceCreated }) {
  const navigation = useNavigation();
  const route = useRoute();

  const [enteredTitle, setEnteredTitle] = useState(route.params?.savedTitle || '');
  const [selectedImage, setSelectedImage] = useState(route.params?.savedImage);
  const [pickedLocation, setPickedLocation] = useState();

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  const takeImageHandler = useCallback((imageUri) => {
    setSelectedImage(imageUri);
  }, []);

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  function pickOnMapHandler() {
    navigation.navigate('Map', {
      savedTitle: enteredTitle,
      savedImage: selectedImage,
      initialLat: pickedLocation?.lat,
      initialLng: pickedLocation?.lng,
    });
  }

  async function savePlaceHandler() {
    if (!enteredTitle || !selectedImage || !pickedLocation) {
      Alert.alert('Invalid Input', 'Please fill in all fields.');
      return;
    }

    const placeData = {
      title: enteredTitle,
      imageUri: selectedImage,
      location: pickedLocation,
      address: pickedLocation.address,
    };

    try {
      await insertPlace(placeData); 
      if (onPlaceCreated) onPlaceCreated(); 
    } catch (error) {
      Alert.alert('Save Failed', error.message || 'Check your connection.');
    }
  }

  return (
    <View style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} initialImage={selectedImage} />
      <LocationPicker onPickLocation={pickLocationHandler} onPickMap={pickOnMapHandler} />
      <View style={styles.buttonContainer}>
        <Button onPress={savePlaceHandler}>Add Place</Button>
      </View>
    </View>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: { padding: 24 },
  label: { fontWeight: 'bold', marginBottom: 4, color: Colors.primary500 },
  input: {
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.primary400,
    borderRadius: 8,
    backgroundColor: Colors.primary100,
    color: Colors.gray700,
  },
  buttonContainer: {
    marginTop: 16,
  },
});