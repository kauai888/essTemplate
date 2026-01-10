// Attendance Record Model
// Stores time in/out records with geolocation data

const attendanceRecords = [];

const AttendanceRecord = {
  create: function(employeeId, type, latitude, longitude, address) {
    const record = {
      id: attendanceRecords.length + 1,
      employeeId,
      type, // 'time-in' or 'time-out'
      timestamp: new Date(),
      latitude,
      longitude,
      address,
      createdAt: new Date()
    };
    attendanceRecords.push(record);
    return record;
  },

  getByEmployeeId: function(employeeId) {
    return attendanceRecords.filter(record => record.employeeId === employeeId);
  },

  getByEmployeeIdAndDate: function(employeeId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return attendanceRecords.filter(record => 
      record.employeeId === employeeId &&
      record.timestamp >= startOfDay &&
      record.timestamp <= endOfDay
    );
  },

  getLatestTimeIn: function(employeeId) {
    const timeInRecords = attendanceRecords.filter(
      record => record.employeeId === employeeId && record.type === 'time-in'
    );
    return timeInRecords[timeInRecords.length - 1] || null;
  },

  getLatestTimeOut: function(employeeId) {
    const timeOutRecords = attendanceRecords.filter(
      record => record.employeeId === employeeId && record.type === 'time-out'
    );
    return timeOutRecords[timeOutRecords.length - 1] || null;
  },

  getAll: function() {
    return attendanceRecords;
  }
};

module.exports = AttendanceRecord;
