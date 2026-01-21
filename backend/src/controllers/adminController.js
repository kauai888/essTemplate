const bcrypt = require('bcrypt');
/**
 * Create a new employee
 * @route POST /api/admin/employees
 * @param {Object} req.body - {employeeId, name, email, phone, department, designation, password, role, status}
 */
exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, phone, department, designation, password, role, status } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: employeeId, name, email, password'
      });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));

    const pool = require('../config/database');
    const query = `
      INSERT INTO users 
      (employee_id, username, email, phone, password_hash, role, status, first_name, department, designation, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
      RETURNING id, employee_id, first_name, email, role, status
    `;
    const result = await pool.query(query, [employeeId, name, email, phone, hashedPassword, role || 'employee', status || 'active', name, department, designation]);
    const createdEmployee = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: createdEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating employee'
    });
  }
};

/**
 * Get all employees with pagination and filtering
 * @route GET /api/admin/employees
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Records per page (default: 10)
 * @query {string} search - Search by name or employee ID
 * @query {string} department - Filter by department
 * @query {string} status - Filter by status
 */
exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query;
    const offset = (page - 1) * limit;

    const pool = require('../config/database');
    const whereConditions = [];
    const params = [];
    
    if (search) {
      whereConditions.push(`(first_name ILIKE $${params.length + 1} OR employee_id ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    if (department) {
      whereConditions.push(`department = $${params.length + 1}`);
      params.push(department);
    }
    if (status) {
      whereConditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    params.push(parseInt(limit), parseInt(offset));
    
    const query = `
      SELECT id, employee_id, first_name, last_name, email, phone, department, designation, role, status, created_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        employees: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employees'
    });
  }
};

/**
 * Get employee details
 * @route GET /api/admin/employees/:employeeId
 */
exports.getEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const pool = require('../config/database');
    const query = `
      SELECT id, employee_id, first_name, last_name, email, phone, department, designation, role, status, join_date, created_at
      FROM users 
      WHERE employee_id = $1
    `;
    const result = await pool.query(query, [employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee'
    });
  }
};

/**
 * Update employee information
 * @route PUT /api/admin/employees/:employeeId
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, email, phone, department, designation, status } = req.body;

    const pool = require('../config/database');
    const query = `
      UPDATE users 
      SET first_name = $1, email = $2, phone = $3, department = $4, designation = $5, status = $6, updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $7
      RETURNING id, employee_id, first_name, email, status
    `;
    const result = await pool.query(query, [name, email, phone, department, designation, status, employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating employee'
    });
  }
};

/**
 * Delete employee
 * @route DELETE /api/admin/employees/:employeeId
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const pool = require('../config/database');
    const query = `
      UPDATE users 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $1
      RETURNING id, employee_id
    `;
    const result = await pool.query(query, [employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting employee'
    });
  }
};
/**
 * Get attendance records
 * @route GET /api/admin/attendance
 * @query {string} employeeId - Filter by employee
 * @query {string} date - Filter by date
 * @query {number} page - Pagination page
 * @query {number} limit - Records per page
 */
exports.getAttendance = async (req, res) => {
  try {
    const { employeeId, date, page = 1, limit = 20 } = req.query;

    const pool = require('../config/database');
    const whereConditions = [];
    const params = [];
    
    if (employeeId) {
      whereConditions.push(`employee_id = $${params.length + 1}`);
      params.push(employeeId);
    }
    if (date) {
      whereConditions.push(`attendance_date = $${params.length + 1}`);
      params.push(date);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    params.push(parseInt(limit), parseInt(offset));
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const query = `
      SELECT * FROM attendance_records 
      ${whereClause}
      ORDER BY attendance_date DESC, time_in DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM attendance_records ${whereClause}`;
    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        attendance: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
};

/**
 * Update attendance record (admin edit)
 * @route PUT /api/admin/attendance/:recordId
 * @param {string} recordId - Attendance record ID
 * @param {Object} req.body - {timeIn, timeOut, remarks}
 */
exports.updateAttendance = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { timeIn, timeOut, remarks } = req.body;

    if (!timeIn || !timeOut) {
      return res.status(400).json({
        success: false,
        message: 'timeIn and timeOut are required'
      });
    }

    const pool = require('../config/database');
    const query = `
      UPDATE attendance_records 
      SET time_in = $1, time_out = $2, remarks = $3, edited_by = $4, edited_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [timeIn, timeOut, remarks, req.user.id, recordId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating attendance'
    });
  }
};
/**
 * Get leave balance for employees
 * @route GET /api/admin/leave-balance
 * @query {string} employeeId - Filter by employee
 */
exports.getLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const pool = require('../config/database');
    const whereClause = employeeId ? `WHERE employee_id = $1` : '';
    const params = employeeId ? [employeeId] : [];
    
    const query = `
      SELECT * FROM leave_balance 
      ${whereClause}
      ORDER BY financial_year DESC
    `;
    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        leaveBalances: result.rows
      }
    });
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leave balance'
    });
  }
};

/**
 * Update leave balance
 * @route PUT /api/admin/leave-balance/:employeeId
 * @param {Object} req.body - {annualLeaveUsed, sickLeaveUsed, emergencyLeaveUsed}
 */
exports.updateLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { annualLeaveUsed, sickLeaveUsed, emergencyLeaveUsed } = req.body;

    if (annualLeaveUsed === undefined || sickLeaveUsed === undefined || emergencyLeaveUsed === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required leave balance fields'
      });
    }

    const pool = require('../config/database');
    const query = `
      UPDATE leave_balance 
      SET leave_used = $1, updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $2
      RETURNING *
    `;
    const totalLeaveUsed = annualLeaveUsed + sickLeaveUsed + emergencyLeaveUsed;
    const result = await pool.query(query, [totalLeaveUsed, employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Leave balance not found for employee'
      });
    }

    res.json({
      success: true,
      message: 'Leave balance updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating leave balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating leave balance'
    });
  }
};

/**
 * Create announcement
 * @route POST /api/admin/announcements
 * @param {Object} req.body - {title, content, announcementDate, isPinned, targetRole, targetDepartment, expiryDate}
 */
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, announcementDate, isPinned, targetRole, targetDepartment, expiryDate } = req.body;

    if (!title || !content || !announcementDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, content, announcementDate'
      });
    }

    const pool = require('../config/database');
    const query = `
      INSERT INTO announcements 
      (title, content, created_by, announcement_date, is_pinned, target_role, target_department, expiry_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      RETURNING id, title, announcement_date
    `;
    const result = await pool.query(query, [title, content, req.user.id, announcementDate, isPinned || false, targetRole, targetDepartment, expiryDate]);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating announcement'
    });
  }
};

/**
 * Get announcements
 * @route GET /api/admin/announcements
 * @query {boolean} active - Show only active announcements
 */
exports.getAnnouncements = async (req, res) => {
  try {
    const { active = true } = req.query;

    const pool = require('../config/database');
    const query = `
      SELECT * FROM announcements 
      WHERE is_active = $1
      ORDER BY is_pinned DESC, announcement_date DESC
    `;
    const result = await pool.query(query, [active === 'true' || active === true]);

    res.json({
      success: true,
      data: {
        announcements: result.rows
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching announcements'
    });
  }
};

/**
 * Update announcement
 * @route PUT /api/admin/announcements/:announcementId
 */
exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, content, isPinned, expiryDate } = req.body;

    const pool = require('../config/database');
    const query = `
      UPDATE announcements 
      SET title = $1, content = $2, is_pinned = $3, expiry_date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [title, content, isPinned, expiryDate, announcementId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating announcement'
    });
  }
};

/**
 * Delete announcement
 * @route DELETE /api/admin/announcements/:announcementId
 */
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const pool = require('../config/database');
    const query = `
      UPDATE announcements 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;
    const result = await pool.query(query, [announcementId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting announcement'
    });
  }
};
