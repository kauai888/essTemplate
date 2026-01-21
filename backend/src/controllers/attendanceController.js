const AttendanceRecord = require('../models/attendanceModels');
const { formatGeolocationResponse } = require('../services/geolocationService');

/**
 * Time In - Records employee arrival with geolocation
 * @route POST /api/attendance/time-in
 * @body {employeeId, latitude, longitude, address, accuracy}
 */
exports.timeIn = (req, res) => {
  try {
    const { employeeId, latitude, longitude, address, accuracy } = req.body;

    if (!employeeId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: 'Missing required fields: employeeId, latitude, longitude'
      });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        message: 'Latitude and longitude must be numbers'
      });
    }

    const todayRecords = AttendanceRecord.getByEmployeeIdAndDate(
      employeeId,
      new Date()
    );
    
    const alreadyClocked = todayRecords.some(r => r.type === 'time-in');
    if (alreadyClocked) {
      return res.status(409).json({
        message: 'Already clocked in today. Please clock out first.'
      });
    }

    const record = AttendanceRecord.create(
      employeeId,
      'time-in',
      latitude,
      longitude,
      address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    );

    res.status(201).json({
      message: 'Clock in successful',
      data: {
        recordId: record.id,
        type: record.type,
        timestamp: record.timestamp,
        location: {
          latitude: record.latitude,
          longitude: record.longitude,
          address: record.address
        },
        accuracy: accuracy
      }
    });
  } catch (error) {
    console.error('Time in error:', error);
    res.status(500).json({
      message: 'Error processing time in',
      error: error.message
    });
  }
};

/**
 * Time Out - Records employee departure with geolocation
 * @route POST /api/attendance/time-out
 * @body {employeeId, latitude, longitude, address, accuracy}
 */
exports.timeOut = (req, res) => {
  try {
    const { employeeId, latitude, longitude, address, accuracy } = req.body;

    if (!employeeId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: 'Missing required fields: employeeId, latitude, longitude'
      });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        message: 'Latitude and longitude must be numbers'
      });
    }

    const latestTimeIn = AttendanceRecord.getLatestTimeIn(employeeId);
    if (!latestTimeIn) {
      return res.status(400).json({
        message: 'No active time in record. Please clock in first.'
      });
    }

    const latestTimeOut = AttendanceRecord.getLatestTimeOut(employeeId);
    if (latestTimeOut && latestTimeOut.timestamp > latestTimeIn.timestamp) {
      return res.status(409).json({
        message: 'Already clocked out. Please clock in again to start a new shift.'
      });
    }

    const record = AttendanceRecord.create(
      employeeId,
      'time-out',
      latitude,
      longitude,
      address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    );

    const hoursWorked = (record.timestamp - latestTimeIn.timestamp) / (1000 * 60 * 60);

    res.status(201).json({
      message: 'Clock out successful',
      data: {
        recordId: record.id,
        type: record.type,
        timestamp: record.timestamp,
        location: {
          latitude: record.latitude,
          longitude: record.longitude,
          address: record.address
        },
        accuracy: accuracy,
        shiftSummary: {
          timeIn: latestTimeIn.timestamp,
          timeOut: record.timestamp,
          hoursWorked: parseFloat(hoursWorked.toFixed(2)),
          locationChangeDistance: calculateDistance(
            latestTimeIn.latitude,
            latestTimeIn.longitude,
            latitude,
            longitude
          )
        }
      }
    });
  } catch (error) {
    console.error('Time out error:', error);
    res.status(500).json({
      message: 'Error processing time out',
      error: error.message
    });
  }
};

/**
 * Get attendance records for employee
 * @route GET /api/attendance/:employeeId
 * @query {startDate, endDate, type}
 */
exports.getAttendance = (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate, type } = req.query;

    let records = AttendanceRecord.getByEmployeeId(parseInt(employeeId));

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();

      records = records.filter(r =>
        r.timestamp >= start && r.timestamp <= end
      );
    }

    if (type) {
      records = records.filter(r => r.type === type);
    }

    res.json({
      message: 'Attendance records retrieved',
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      message: 'Error retrieving attendance records',
      error: error.message
    });
  }
};

/**
 * Get current status for employee (clocked in or out)
 * @route GET /api/attendance/:employeeId/status
 */
exports.getStatus = (req, res) => {
  try {
    const { employeeId } = req.params;

    const latestTimeIn = AttendanceRecord.getLatestTimeIn(parseInt(employeeId));
    const latestTimeOut = AttendanceRecord.getLatestTimeOut(parseInt(employeeId));

    let status = 'not-clocked-in';
    let currentRecord = null;

    if (latestTimeIn) {
      if (!latestTimeOut || latestTimeOut.timestamp < latestTimeIn.timestamp) {
        status = 'clocked-in';
        currentRecord = latestTimeIn;
      } else {
        status = 'clocked-out';
        currentRecord = latestTimeOut;
      }
    }

    res.json({
      message: 'Status retrieved',
      data: {
        employeeId,
        status,
        currentRecord,
        lastStatusChange: currentRecord?.timestamp
      }
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      message: 'Error retrieving status',
      error: error.message
    });
  }
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return parseFloat(d.toFixed(3));
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

module.exports = exports;
