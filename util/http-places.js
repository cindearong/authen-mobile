import { Place } from '../models/place';
import { api } from './http';

//const GOOGLE_API_KEY = 'AIzaSyAipxg8qHxTFQ-FIY_vcHUI66cSE8FLMeg';
const GOOGLE_API_KEY = 'AIzaSyC8w8Yi6FHz2PyYAUJvc0RCpFMOY10N3P0'

// This is the URL to your Laravel storage folder
const STORAGE_URL = 'https://expenses-tracker-api-laravel.benova.com.my/storage/';

export async function fetchPlaces() {
  const response = await api.get('/places');
  const resData = response.data;

  // FIX 1: Ensure resData is an array. If Laravel wraps it in { "data": [...] }, use resData.data
  const fetchedPlaces = Array.isArray(resData) ? resData : resData.data || [];

  return fetchedPlaces
    .filter(dp => dp !== null && dp !== undefined) // FIX 2: Remove any corrupted/empty entries
    .map((dp) => {
      return {
        id: dp.id,
        title: dp.title || 'Untitled', // FIX 3: Fallback if title is missing
        imageUri: dp.image ? STORAGE_URL + dp.image : null, 
        address: dp.address === "undefined" || !dp.address ? "Unknown Address" : dp.address, 
        location: {
          lat: parseFloat(dp.lat || 0),
          lng: parseFloat(dp.lng || 0),
        },
      };
    });
}

 export async function insertPlace(place) {
  const formData = new FormData();

  formData.append('title', place.title);
  // Ensure address isn't "undefined" string
  formData.append('address', place.address || 'Unknown Location');
  formData.append('lat', place.location.lat.toString());
  formData.append('lng', place.location.lng.toString());

  // IMAGE UPLOAD LOGIC
  if (place.imageUri) {
    const localUri = place.imageUri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('image', {
      uri: localUri,
      name: filename,
      type: type,
    });
  }

  try {
    const token = api.defaults.headers.common['Authorization'];
    const baseURL = api.defaults.baseURL;

    const response = await fetch(`${baseURL}/places`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Authorization': token,
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      console.log("Laravel Error:", resData);
      throw new Error(resData.message || 'Could not save place');
    }

    return resData;
  } catch (error) {
    throw error;
  }
}

export async function fetchPlaceDetails(id) {
  const response = await api.get(`/places/${id}`);
  const dp = response.data.data || response.data;
  
  if (!dp) return null;

  return {
    id: dp.id,
    title: dp.title,
    imageUri: dp.image ? STORAGE_URL + dp.image : null, 
    address: dp.address === "undefined" || !dp.address ? "Unknown Address" : dp.address,
    location: {
      lat: parseFloat(dp.lat || 0),
      lng: parseFloat(dp.lng || 0),
    }
  };
}

export async function deletePlace(id) {
  await api.delete(`/places/${id}`);
}

export function getMapPreview(lat, lng) {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
}

export async function getAddress(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results[0].formatted_address;
}