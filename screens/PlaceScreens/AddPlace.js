import PlaceForm from '../../components/Places/PlaceForm';
import { ScrollView } from 'react-native';

function AddPlace({ navigation }) {
  function placeCreatedHandler() {
    navigation.reset({
      index: 0,
      routes: [{ name: 'AllPlaces' }],
    });
  }

  return (
    <ScrollView>
      <PlaceForm onPlaceCreated={placeCreatedHandler} />
    </ScrollView>
  );
}

export default AddPlace;