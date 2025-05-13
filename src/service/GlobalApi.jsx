import axios from 'axios';


const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    'X-Goog-FieldMask': 'places.displayName,places.id,places.photos'
  }
};

export const GetPlaceDetails = async (query) => {
  try {
    if (!query || typeof query !== 'string') {
      throw new Error("Query must be a non-empty string");
    }

    const body = {
      textQuery: query
    };

    const response = await 
    axios.post(BASE_URL, body, config);
    return response.data;

  } catch (err) {
    console.error("❌ GetPlaceDetails failed", err.response?.data || err.message);
    throw err;
  }
};
// Handles both old and new photo name formats
export const getImageUrl = (photoNameOrRef, isV1 = false) =>
  isV1
    ? `https://places.googleapis.com/v1/${photoNameOrRef}/media?maxWidthPx=800&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`
    : `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoNameOrRef}&key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}`;

