

//const GOOGLE_API_KEY = 'AIzaSyAipxg8qHxTFQ-FIY_vcHUI66cSE8FLMeg'

const GOOGLE_API_KEY = 'AIzaSyC8w8Yi6FHz2PyYAUJvc0RCpFMOY10N3P0'

export function getMapPreview(lat, lng) {
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
  return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch address!');
  }

const data = await response.json();
// ADD THE DEBUG LOG HERE
  console.log("GOOGLE RESPONSE STATUS:", data.status); 
  console.log("FULL GOOGLE DATA:", data);
const address = data.results[0].formatted_address;
return address;

}