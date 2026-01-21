const express = require('express');
const router = express.Router();
const { 
  timeIn, 
  timeOut, 
  getAttendance, 
  getStatus 
} = require('../controllers/attendanceController');

/**
 * POST /api/attendance/time-in
 * Record employee arrival with geolocation
 */
router.post('/time-in', timeIn);

/**
 * POST /api/attendance/time-out
 * Record employee departure with geolocation
 */
router.post('/time-out', timeOut);

/**
 * GET /api/attendance/:employeeId
 * Get attendance records for employee
 * Query params: startDate, endDate, type
 */
router.get('/:employeeId', getAttendance);

/**
 * GET /api/attendance/:employeeId/status
 * Get current clock in/out status for employee
 */
router.get('/:employeeId/status', getStatus);

module.exports = router;
