const pool = require('../config/database');

/**
 * Create a new attendance record
 * @param {Object} data - Attendance record data
 * @returns {Object} Created record
 */
async function create(data) {
  try {
    const {
      employeeId,
      attendanceDate,
      timeIn,
      timeInLat,
      timeInLng,
      timeInAddress,
      timeOutLat,
      timeOutLng,
      timeOutAddress
    } = data;

    const query = `
      INSERT INTO attendance_records 
      (employee_id, attendance_date, time_in, time_in_latitude, time_in_longitude, time_in_address, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const result = await pool.query(query, [employeeId, attendanceDate, timeIn, timeInLat, timeInLng, timeInAddress]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating attendance record:', error);
    throw error;
  }
}

/**
 * Get attendance records by employee ID
 * @param {string} employeeId - Employee ID
 * @returns {Array} Array of attendance records
 */
async function getByEmployeeId(employeeId) {
  try {
    const query = `
      SELECT * FROM attendance_records 
      WHERE employee_id = $1 
      ORDER BY attendance_date DESC
    `;
    const result = await pool.query(query, [employeeId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

/**
 * Get attendance records by employee ID and date
 * @param {string} employeeId - Employee ID
 * @param {Date} date - Date to filter
 * @returns {Array} Array of attendance records for the date
 */
async function getByEmployeeIdAndDate(employeeId, date) {
  try {
    const query = `
      SELECT * FROM attendance_records 
      WHERE employee_id = $1 
      AND attendance_date = $2
    `;
    const result = await pool.query(query, [employeeId, date]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching daily attendance:', error);
    throw error;
  }
}

/**
 * Get latest time-in record for employee
 * @param {string} employeeId - Employee ID
 * @returns {Object|null} Latest time-in record or null
 */
async function getLatestTimeIn(employeeId) {
  try {
    const query = `
      SELECT * FROM attendance_records 
      WHERE employee_id = $1 AND time_in IS NOT NULL
      ORDER BY time_in DESC 
      LIMIT 1
    `;
    const result = await pool.query(query, [employeeId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching latest time-in:', error);
    throw error;
  }
}

/**
 * Get latest time-out record for employee
 * @param {string} employeeId - Employee ID
 * @returns {Object|null} Latest time-out record or null
 */
async function getLatestTimeOut(employeeId) {
  try {
    const query = `
      SELECT * FROM attendance_records 
      WHERE employee_id = $1 AND time_out IS NOT NULL
      ORDER BY time_out DESC 
      LIMIT 1
    `;
    const result = await pool.query(query, [employeeId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching latest time-out:', error);
    throw error;
  }
}

/**
 * Update attendance record
 * @param {string} recordId - Record ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated record
 */
async function update(recordId, updates) {
  try {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    
    const query = `
      UPDATE attendance_records 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;
    const result = await pool.query(query, [...values, recordId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw error;
  }
}

/**
 * Get all attendance records (paginated)
 * @param {number} limit - Records per page
 * @param {number} offset - Pagination offset
 * @returns {Array} Array of attendance records
 */
async function getAll(limit = 50, offset = 0) {
  try {
    const query = `
      SELECT * FROM attendance_records 
      ORDER BY attendance_date DESC, time_in DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all attendance records:', error);
    throw error;
  }
}

module.exports = {
  create,
  getByEmployeeId,
  getByEmployeeIdAndDate,
  getLatestTimeIn,
  getLatestTimeOut,
  update,
  getAll
};
