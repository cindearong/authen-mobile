import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import PlacesList from '../../components/Places/PlaceList';
import { fetchPlaces } from '../../util/http-places';

function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
  async function loadPlaces() {
    setIsLoading(true);
    try {
      const places = await fetchPlaces();
      
      const sanitizedPlaces = (places || []).filter(p => p !== null && p !== undefined);
      
      setLoadedPlaces(sanitizedPlaces);
    } catch (error) {
      console.error("Failed to load places:", error);
    }
    setIsLoading(false);
  }

  if (isFocused) {
    loadPlaces();
  }
}, [isFocused]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: 'white' }}>Updating places...</Text>
      </View>
    );
  }

  return <PlacesList places={loadedPlaces} />;
}
export default AllPlaces;