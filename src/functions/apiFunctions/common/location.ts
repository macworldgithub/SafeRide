import axios from 'axios';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCqw1dzXk74gdrqunxHYiuVLSEIHu4fbcM'; //client

interface Address {
  address: string;
  fulladdress: string;
}

interface Origin {
  latitude: number;
  longitude: number;
}

interface GeocodeResponse {
  latitude: number;
  longitude: number;
  cityCode?: string;
  stateCode?: string;
}

export const getLocations = async (
  value: string,
  origin: Origin,
): Promise<Address[]> => {
  let addressList: Address[] = [];

  try {
    const response = await axios.post(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&location=${origin.latitude},${origin.longitude}&radius=50000&key=${GOOGLE_MAPS_APIKEY}`,
    );

    if (response.data) {
      const data = response.data.predictions;

      for (const element of data) {
        const temp: Address = {
          address: element.structured_formatting.main_text,
          fulladdress: element.description,
        };
        addressList.push(temp);
      }
    }
  } catch (error) {
    console.log('Error from google api', error);
  }

  return addressList;
};

export const getGeocode = async (
  destination: string,
): Promise<GeocodeResponse> => {
  console.log("destination searched", destination);
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: destination,
          key: GOOGLE_MAPS_APIKEY,
        },
      },
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const location = response.data.results[0].geometry.location;
      const addressComponents = response.data.results[0].address_components;

      let cityCode = '';
      let stateCode = '';

      addressComponents.forEach((component: any) => {
        if (component.types.includes('locality')) {
          cityCode = component.short_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          stateCode = component.short_name;
        }
      });

      // console.log('location data', response.data.results[0]);
      const geocodeResponse: GeocodeResponse = {
        latitude: location.lat,
        longitude: location.lng,
        cityCode,
        stateCode,
      };
      return geocodeResponse;
    } else {
      throw new Error('No results found for the given destination.');
    }
  } catch (error) {
    console.error('Error fetching geocode data:', error);
    throw error;
  }
};

export const getTravelTime = async (pickup: string, dropoff: string): Promise<string> => {
  const apiKey = GOOGLE_MAPS_APIKEY;
  const startLocation = pickup;
  const endLocation = dropoff; 

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      {
        params: {
          origins: startLocation,
          destinations: endLocation,
          key: apiKey,
          mode: 'driving',
        },
      }
    );

    const travelTime = response.data.rows[0].elements[0].duration.text;

    console.log(`Travel time: ${travelTime}`);
    return travelTime;
  } catch (error) {
    console.error('Error fetching data:', error);
    return 'Time not calculated';
  }
};


