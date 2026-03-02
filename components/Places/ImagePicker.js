import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import { useState } from 'react';

import { Colors } from '../../constants/colors';
import OutlinedButton from '../ui/OutlinedButton';

function ImagePicker({ onTakeImage, initialImage }) {
  const [pickedImage, setPickedImage] = useState(initialImage);
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permissions!',
        'You need to grant camera permissions to use this app.'
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });


    if (!image.canceled) {
      const imageUri = image.assets[0].uri;
      
      if (imageUri !== pickedImage) {
        setPickedImage(imageUri);
        onTakeImage(imageUri);
      }
    }
  }

  return (
    <View>
      <View style={styles.imagePreview}>
        {!cameraPermissionInformation && <Text>Initializing Camera...</Text>}
        {cameraPermissionInformation && !pickedImage && (
          <Text>No image taken yet.</Text>
        )}
        {pickedImage && (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
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
  image: {
    width: '100%',
    height: '100%',
  },
});