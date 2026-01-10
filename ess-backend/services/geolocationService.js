// Geolocation Service
// Uses geofetch to get user coordinates and reverse geocoding for address

/**
 * Get geolocation coordinates using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
async function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Reverse geocode coordinates to get address
 * Using Open Street Map Nominatim API (free, no key required)
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>}
 */
async function reverseGeocode(latitude, longitude) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'EmployeeSelfService/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    return data.address?.city || 
           data.address?.town || 
           data.address?.village || 
           `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to coordinates format
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

/**
 * Get full geolocation data with coordinates and address
 * @returns {Promise<{latitude: number, longitude: number, address: string, accuracy: number}>}
 */
async function getGeolocationData() {
  try {
    const coordinates = await getCoordinates();
    const address = await reverseGeocode(coordinates.latitude, coordinates.longitude);
    
    return {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      address,
      accuracy: coordinates.accuracy
    };
  } catch (error) {
    throw error;
  }
}

// Client-side only (browser-based)
const GeolocationService = {
  getCoordinates,
  reverseGeocode,
  getGeolocationData
};

// For Node.js/Express backend - export geolocation validation helper
function formatGeolocationResponse(geolocationData) {
  return {
    location: {
      coordinates: [geolocationData.longitude, geolocationData.latitude], // GeoJSON format
      latitude: geolocationData.latitude,
      longitude: geolocationData.longitude
    },
    address: geolocationData.address,
    accuracy: geolocationData.accuracy,
    timestamp: new Date()
  };
}

// Export based on environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatGeolocationResponse };
} else if (typeof window !== 'undefined') {
  window.GeolocationService = GeolocationService;
}
