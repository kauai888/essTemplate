const GeolocationService = (() => {
  const API_BASE = 'http://localhost:5000/api';

  /**
   * Get user's current coordinates using browser Geolocation API
   * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
   */
  async function getCoordinates() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
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
          let errorMsg = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Location permission denied. Please enable geolocation in browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Location request timed out.';
              break;
          }
          reject(new Error(errorMsg));
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
   * Using Open Street Map Nominatim API
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
      const address = data.address;
      if (address) {
        return (
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          address.state ||
          `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        );
      }
      
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  }

  /**
   * Send time in request to backend
   * @param {number} employeeId
   * @returns {Promise}
   */
  async function sendTimeIn(employeeId) {
    try {
      const coords = await getCoordinates();
      const address = await reverseGeocode(coords.latitude, coords.longitude);

      console.log(`Sending time-in request to: ${API_BASE}/attendance/time-in`);
      
      const response = await fetch(`${API_BASE}/attendance/time-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          address,
          accuracy: coords.accuracy
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Time in failed');
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send time out request to backend
   * @param {number} employeeId
   * @returns {Promise}
   */
  async function sendTimeOut(employeeId) {
    try {
      const coords = await getCoordinates();
      const address = await reverseGeocode(coords.latitude, coords.longitude);

      console.log(`Sending time-out request to: ${API_BASE}/attendance/time-out`);

      const response = await fetch(`${API_BASE}/attendance/time-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          address,
          accuracy: coords.accuracy
        })
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
        console.error('Non-JSON response received:', data);
      }

      if (!response.ok) {
        throw new Error(data.message || data || `Server error: ${response.status}`);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('sendTimeOut error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get attendance records for employee
   * @param {number} employeeId
   * @returns {Promise}
   */
  async function getAttendance(employeeId, startDate = null, endDate = null) {
    try {
      let url = `${API_BASE}/attendance/${employeeId}`;
      const params = new URLSearchParams();

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve attendance');
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current status for employee
   * @param {number} employeeId
   * @returns {Promise}
   */
  async function getStatus(employeeId) {
    try {
      const response = await fetch(`${API_BASE}/attendance/${employeeId}/status`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to retrieve status');
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  return {
    getCoordinates,
    reverseGeocode,
    sendTimeIn,
    sendTimeOut,
    getAttendance,
    getStatus
  };
})();

// Export for use in browser
window.GeolocationService = GeolocationService;
