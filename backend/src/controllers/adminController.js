/**
 * Admin Controller - Handle admin operations
 */

const crypto = require('crypto');

// Hash password function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Employee Management
 */
exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, position, password, status } = req.body;

    // Validate input
    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if employee already exists (would use database in production)
    // const existingEmployee = await Employee.findOne({ employeeId });
    // if (existingEmployee) {
    //   return res.status(409).json({ success: false, message: 'Employee already exists' });
    // }

    const hashedPassword = hashPassword(password);

    // Create employee object
    const employee = {
      employeeId,
      name,
      email,
      position,
      password: hashedPassword,
      status: status || 'Active',
      createdAt: new Date()
    };

    // TODO: Save to database
    // await employee.save();

    res.json({
      success: true,
      message: 'Employee created successfully',
      employee: {
        employeeId,
        name,
        email,
        position,
        status
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    // TODO: Fetch from database
    // const employees = await Employee.find({});
    
    res.json({
      success: true,
      employees: []
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, email, position, status } = req.body;

    // TODO: Update in database
    // await Employee.findOneAndUpdate({ employeeId }, { name, email, position, status });

    res.json({
      success: true,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // TODO: Delete from database
    // await Employee.deleteOne({ employeeId });

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Attendance Management
 */
exports.updateAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.params;
    const { clockIn, clockOut } = req.body;

    if (!clockIn || !clockOut) {
      return res.status(400).json({
        success: false,
        message: 'Missing clock in or clock out time'
      });
    }

    // TODO: Update in database
    // await Attendance.findOneAndUpdate(
    //   { employeeId, date },
    //   { clockIn, clockOut, updatedAt: new Date() }
    // );

    res.json({
      success: true,
      message: 'Attendance updated successfully'
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { employeeId, date } = req.query;

    // TODO: Fetch from database
    // const query = {};
    // if (employeeId) query.employeeId = employeeId;
    // if (date) query.date = date;
    // const attendance = await Attendance.find(query);

    res.json({
      success: true,
      attendance: []
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Leave Balance Management
 */
exports.updateLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { annualLeave, sickLeave, emergencyLeave } = req.body;

    if (annualLeave === undefined || sickLeave === undefined || emergencyLeave === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required leave balance fields'
      });
    }

    // TODO: Update in database
    // await LeaveBalance.findOneAndUpdate(
    //   { employeeId },
    //   { annualLeave, sickLeave, emergencyLeave, updatedAt: new Date() }
    // );

    res.json({
      success: true,
      message: 'Leave balance updated successfully'
    });
  } catch (error) {
    console.error('Error updating leave balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.query;

    // TODO: Fetch from database
    // const query = employeeId ? { employeeId } : {};
    // const leaveBalances = await LeaveBalance.find(query);

    res.json({
      success: true,
      leaveBalances: []
    });
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Announcements Management
 */
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, date, pinned } = req.body;

    if (!title || !content || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const announcement = {
      id: Date.now(),
      title,
      content,
      date,
      pinned: pinned || false,
      createdAt: new Date()
    };

    // TODO: Save to database
    // await announcement.save();

    res.json({
      success: true,
      message: 'Announcement created successfully',
      announcementId: announcement.id
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    // TODO: Fetch from database
    // const announcements = await Announcement.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      announcements: []
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, content, date, pinned } = req.body;

    // TODO: Update in database
    // await Announcement.findByIdAndUpdate(
    //   announcementId,
    //   { title, content, date, pinned, updatedAt: new Date() }
    // );

    res.json({
      success: true,
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    // TODO: Delete from database
    // await Announcement.findByIdAndDelete(announcementId);

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
