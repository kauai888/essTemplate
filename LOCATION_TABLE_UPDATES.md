# Attendance Table with Geolocation Display

## Overview
The attendance table has been updated to display location information alongside check-in and check-out times. The system now shows:
- **3 Complete Time In/Out Entries** with location data
- **Location badges** with city/area name and GPS coordinates
- **Real-time updates** when employees clock in/out

## Changes Made

### 1. **Dashboard HTML Structure** ([Dashboard/index.html](Dashboard/index.html))
Updated the attendance table with:
- Expanded header with 7 columns (Date, Check In Time, Check In Location, Check Out Time, Check Out Location, Total Hours, Status)
- 6 sample rows showing 3 complete clock-in/clock-out cycles with location data
- Each location shows:
  - City/Area name with 📍 emoji
  - Decimal coordinates (latitude, longitude)

**Sample Data:**
| Date | Check In | Location | Check Out | Location | Hours | Status |
|------|----------|----------|-----------|----------|-------|--------|
| Jan 09, 2026 | 08:55 AM | 📍 New York, NY (40.7128, -74.0060) | 05:32 PM | 📍 New York, NY (40.7140, -74.0074) | 8.5h | Present |
| Jan 08, 2026 | 09:02 AM | 📍 Manhattan (40.7185, -74.0150) | 05:45 PM | 📍 Manhattan (40.7200, -74.0165) | 8.7h | Present |
| Jan 07, 2026 | 08:48 AM | 📍 Midtown, NY (40.7549, -73.9840) | 05:15 PM | 📍 Midtown, NY (40.7560, -73.9850) | 8.4h | Present |

### 2. **CSS Styling** ([Dashboard/dashboardStyle.css](Dashboard/dashboardStyle.css))
Added `.location-badge` class:
```css
.location-badge {
  display: inline-block;
  padding: 4px 12px;
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}
```

Features:
- Light blue background with primary color text
- Rounded pill-shaped badge
- Coordinates displayed in smaller gray text below
- Responsive and readable design

### 3. **JavaScript Functionality** ([Dashboard/index.html](Dashboard/index.html))

**New Functions Added:**

#### `updateAttendanceWithGeoLocation(isClockIn, locationData, time)`
- Automatically updates the attendance table when employee clocks in/out
- Adds new row for today if not exists
- Updates location data from real geolocation API
- Displays formatted time and location in table

#### `addAttendanceRecord(date, checkInTime, checkInLocation, checkOutTime, checkOutLocation, hours)`
- Creates new attendance row in table
- Maintains maximum of 6 rows displayed
- Auto-removes oldest row if limit exceeded
- Updates total hours in footer

#### `calculateHoursWorked(startTime, endTime)`
- Calculates hours between clock in and clock out times
- Handles AM/PM conversion
- Returns formatted string (e.g., "8.5h")

#### `updateTotalHours()`
- Recalculates total hours for all displayed records
- Updates footer total dynamically

### 4. **Real-time Integration**
When employee clicks Clock In/Out:
1. Geolocation is captured (latitude, longitude)
2. Address is reverse-geocoded
3. Time is formatted (HH:MM AM/PM format)
4. Attendance table is automatically updated
5. Location notification shows to user
6. Total hours are recalculated

## Table Data Structure

Each row contains:
```
Date | CheckInTime | CheckInLocation | CheckOutTime | CheckOutLocation | TotalHours | Status
```

### Location Display Format
```
📍 City Name
Latitude, Longitude
```

Example:
```
📍 New York, NY
40.7128, -74.0060
```

## Features

✅ **Dynamic Updates** - Table updates in real-time when clocking in/out  
✅ **Precise Coordinates** - Shows GPS coordinates to 4 decimal places  
✅ **Auto-calculation** - Hours worked calculated automatically  
✅ **Location Tracking** - Both check-in and check-out locations recorded  
✅ **Total Hours** - Maintains running total at bottom  
✅ **Clean Layout** - Styled location badges for easy readability  
✅ **Sample Data** - Pre-populated with 3 complete examples  

## Usage

1. **View Attendance**: Open Dashboard to see attendance table with locations
2. **Clock In**: Click "Clock In" button, grant location permission
   - Location and time automatically added to table
   - Blue badge shows check-in location
3. **Clock Out**: Click "Clock Out" button, grant location permission
   - Location and time added to check-out column
   - Hours automatically calculated and updated
4. **Total Hours**: Footer shows running total of all hours

## Browser Requirements

- GPS/Geolocation support
- User must grant location permission
- Reverse geocoding via OpenStreetMap (free, no API key)

## Future Enhancements

- [ ] Geofencing to verify office location
- [ ] Map view of all check-in/out locations
- [ ] Distance calculation between locations
- [ ] History pagination (show more than 6 records)
- [ ] Export with location data to CSV
- [ ] Admin dashboard for location analytics
