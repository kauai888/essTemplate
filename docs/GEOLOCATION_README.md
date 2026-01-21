# Geolocation Tracking for Time In/Out

This document explains the geolocation feature that tracks employee location during clock in and clock out events.

## Overview

The geolocation tracking system captures the employee's location coordinates and address whenever they clock in or clock out. This provides:

- **Location verification** - Ensures employees are at approved work locations
- **Distance tracking** - Calculates distance between clock in and clock out locations
- **Audit trail** - Records time and location for compliance
- **Shift verification** - Validates that clock in and clock out are from reasonable locations

## Architecture

### Backend Components

#### 1. **Models** - `models/attendanceModels.js`
Stores attendance records with geolocation data:
- `employeeId` - Employee identifier
- `type` - 'time-in' or 'time-out'
- `timestamp` - When the record was created
- `latitude` - Decimal latitude coordinate
- `longitude` - Decimal longitude coordinate
- `address` - Human-readable address or location name
- Methods for querying records by employee, date, or type

#### 2. **Services** - `services/geolocationService.js`
Utility functions for geolocation processing:
- `formatGeolocationResponse()` - Formats geolocation data in GeoJSON format
- Helper for reverse geocoding (used on frontend)

#### 3. **Controllers** - `controllers/attendanceController.js`
Handles business logic for attendance:

**`timeIn(req, res)`**
- Records employee arrival with geolocation
- Validates employee hasn't already clocked in
- Creates attendance record with coordinates and address

**`timeOut(req, res)`**
- Records employee departure with geolocation
- Calculates hours worked
- Computes distance between clock in and clock out locations
- Validates employee is currently clocked in

**`getAttendance(req, res)`**
- Retrieves attendance records for an employee
- Supports filtering by date range and type

**`getStatus(req, res)`**
- Returns current clock status (clocked-in, clocked-out, not-clocked-in)

#### 4. **Routes** - `routes/attendance.js`
API endpoints:
- `POST /api/attendance/time-in` - Clock in with geolocation
- `POST /api/attendance/time-out` - Clock out with geolocation
- `GET /api/attendance/:employeeId` - Get attendance records
- `GET /api/attendance/:employeeId/status` - Get current status

### Frontend Components

#### 1. **Geolocation Service** - `Dashboard/geolocationService.js`
Client-side service for geolocation operations:

**`getCoordinates()`**
- Gets device's current GPS coordinates
- Uses browser Geolocation API with high accuracy
- Returns latitude, longitude, accuracy

**`reverseGeocode(latitude, longitude)`**
- Converts GPS coordinates to human-readable address
- Uses free OpenStreetMap Nominatim API
- Returns city name or fallback to coordinates

**`sendTimeIn(employeeId)`**
- Gets current geolocation
- Sends time-in request to backend with coordinates
- Returns success/error response

**`sendTimeOut(employeeId)`**
- Gets current geolocation
- Sends time-out request to backend with coordinates
- Returns success/error response with shift summary

**`getAttendance(employeeId, startDate, endDate)`**
- Retrieves attendance records from backend

**`getStatus(employeeId)`**
- Gets current clock status

#### 2. **Dashboard Integration** - `Dashboard/index.html`
Updated dashboard with geolocation features:
- Integrated geolocation service script
- Enhanced Clock In/Clock Out buttons with location capture
- Location notifications showing address and coordinates
- Error handling for geolocation permission issues
- Button status updates based on clock state

## API Endpoints

### Clock In
```
POST /api/attendance/time-in
Content-Type: application/json

Request Body:
{
  "employeeId": 1,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "New York, NY",
  "accuracy": 15.5
}

Response (201 Created):
{
  "message": "Clock in successful",
  "data": {
    "recordId": 1,
    "type": "time-in",
    "timestamp": "2026-01-09T10:30:00Z",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "New York, NY"
    },
    "accuracy": 15.5
  }
}
```

### Clock Out
```
POST /api/attendance/time-out
Content-Type: application/json

Request Body:
{
  "employeeId": 1,
  "latitude": 40.7140,
  "longitude": -74.0074,
  "address": "New York, NY",
  "accuracy": 12.3
}

Response (201 Created):
{
  "message": "Clock out successful",
  "data": {
    "recordId": 2,
    "type": "time-out",
    "timestamp": "2026-01-09T17:30:00Z",
    "location": {
      "latitude": 40.7140,
      "longitude": -74.0074,
      "address": "New York, NY"
    },
    "accuracy": 12.3,
    "shiftSummary": {
      "timeIn": "2026-01-09T10:30:00Z",
      "timeOut": "2026-01-09T17:30:00Z",
      "hoursWorked": 7.0,
      "locationChangeDistance": 1.234
    }
  }
}
```

### Get Attendance Records
```
GET /api/attendance/:employeeId?startDate=2026-01-01&endDate=2026-01-31

Response:
{
  "message": "Attendance records retrieved",
  "count": 20,
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "type": "time-in",
      "timestamp": "2026-01-09T10:30:00Z",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "New York, NY",
      "createdAt": "2026-01-09T10:30:00Z"
    },
    ...
  ]
}
```

### Get Current Status
```
GET /api/attendance/:employeeId/status

Response:
{
  "message": "Status retrieved",
  "data": {
    "employeeId": 1,
    "status": "clocked-in",
    "currentRecord": {
      "id": 1,
      "type": "time-in",
      "timestamp": "2026-01-09T10:30:00Z",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "New York, NY"
    },
    "lastStatusChange": "2026-01-09T10:30:00Z"
  }
}
```

## Browser Permissions

The geolocation feature requires browser permission to access the device's location:

1. When Clock In/Out is clicked, browser shows permission prompt
2. User must grant location access
3. If denied, an error message appears
4. Permissions can be managed in browser settings

### Common Permission Errors

| Error | Cause | Solution |
|-------|-------|----------|
| PERMISSION_DENIED | User declined location access | Grant permission in browser settings |
| POSITION_UNAVAILABLE | Device GPS not working | Enable GPS on device |
| TIMEOUT | Location request took too long | Move to better signal area, try again |

## Accuracy Considerations

- **GPS Accuracy**: Typically 5-15 meters in urban areas, varies outdoors
- **Address Accuracy**: Depends on reverse geocoding database coverage
- **Timeout**: 10 seconds to retrieve coordinates
- **Recorded Accuracy**: Included in response for quality assessment

## Database Schema Extension

Current implementation uses in-memory storage. For production, extend your database with:

```sql
CREATE TABLE attendance_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT NOT NULL,
  type ENUM('time-in', 'time-out') NOT NULL,
  timestamp DATETIME NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address VARCHAR(255),
  accuracy FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(id),
  INDEX idx_employee_date (employee_id, timestamp)
);
```

## Security Considerations

1. **HTTPS Required** - Always use HTTPS in production
2. **CORS Configuration** - Restrict API access to authorized domains
3. **Authentication** - Verify employee identity via JWT token
4. **Data Privacy** - Comply with regulations like GDPR
5. **Location Storage** - Implement data retention policies
6. **Accuracy Validation** - Reject unreasonable coordinates

## Future Enhancements

- **Geofencing** - Define work location boundaries
- **Office Lookup** - Compare coordinates to known office locations
- **Mobile App** - Native iOS/Android app for better accuracy
- **Analytics** - Dashboard showing attendance patterns and locations
- **Notifications** - Alert managers for late arrivals or missed clocks
- **Offline Support** - Queue requests if network unavailable
- **Camera Verification** - Capture selfie at clock time for identity verification

## Troubleshooting

### Issue: "Location permission denied"
- **Solution**: Check browser settings, grant location permission for the site

### Issue: "Location information unavailable"
- **Solution**: Enable GPS on device, or ensure good WiFi/cellular signal

### Issue: "Coordinates not being captured"
- **Solution**: Ensure HTTPS is used, check browser console for errors

### Issue: "Address not showing"
- **Solution**: Nominatim API may be throttled; coordinates will display as fallback

## Testing

To test the geolocation feature:

1. Start the backend server:
   ```bash
   cd ess-backend
   npm start
   ```

2. Open the Dashboard in a browser
3. Click "Clock In" button
4. Grant location permission when prompted
5. Verify location notification appears with address and coordinates
6. Click "Clock Out" to record exit with location

## Support

For issues or questions about the geolocation feature, check:
- Browser console for JavaScript errors
- Network tab for API requests/responses
- Server logs for backend errors
- Browser settings for location permissions
