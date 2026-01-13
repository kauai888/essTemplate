# Backend Integration Code Snippets

This file contains ready-to-use code snippets for integrating the Admin Panel with your backend database.

---

## 1. Employee Creation Integration

### Frontend (scripts/admin.js)
```javascript
employeeForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const employeeData = {
    employeeId: document.getElementById('employeeId').value,
    name: document.getElementById('employeeName').value,
    email: document.getElementById('employeeEmail').value,
    position: document.getElementById('employeePosition').value,
    password: document.getElementById('employeePassword').value,
    status: document.getElementById('employeeStatus').value
  };

  try {
    const response = await fetch('/api/admin/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(employeeData)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Employee created successfully!');
      closeEmployeeModal();
      loadEmployees();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error creating employee: ' + error.message);
  }
});
```

### Backend (controllers/adminController.js)
```javascript
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, position, password, status } = req.body;

    // Validation
    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if employee exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'Employee ID already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = new Employee({
      employeeId,
      name,
      email,
      position,
      password: hashedPassword,
      status: status || 'Active',
      createdAt: new Date()
    });

    await employee.save();

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
```

### Employee Model (models/Employee.js)
```javascript
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  position: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
```

---

## 2. Attendance Update Integration

### Frontend (scripts/admin.js)
```javascript
attendanceForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const attendanceData = {
    clockIn: document.getElementById('attendanceClockIn').value,
    clockOut: document.getElementById('attendanceClockOut').value
  };

  const [employeeId, date] = editingAttendanceKey.split('-');

  try {
    const response = await fetch(`/api/admin/attendance/${employeeId}/${date}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(attendanceData)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Attendance updated successfully!');
      closeAttendanceModal();
      loadAttendance();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error updating attendance: ' + error.message);
  }
});
```

### Backend (controllers/adminController.js)
```javascript
const Attendance = require('../models/Attendance');

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

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: new Date(date) },
      { 
        clockIn, 
        clockOut, 
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

### Attendance Model (models/Attendance.js)
```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  clockIn: {
    type: String,
    required: true
  },
  clockOut: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
```

---

## 3. Leave Balance Update Integration

### Frontend (scripts/admin.js)
```javascript
leaveForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const leaveData = {
    annualLeave: parseInt(document.getElementById('leaveAnnual').value),
    sickLeave: parseInt(document.getElementById('leaveSick').value),
    emergencyLeave: parseInt(document.getElementById('leaveEmergency').value)
  };

  try {
    const response = await fetch(`/api/admin/leave-balance/${editingLeaveEmployeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(leaveData)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Leave balance updated successfully!');
      closeLeaveModal();
      loadLeaveBalances();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error updating leave balance: ' + error.message);
  }
});
```

### Backend (controllers/adminController.js)
```javascript
const LeaveBalance = require('../models/LeaveBalance');

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

    const leaveBalance = await LeaveBalance.findOneAndUpdate(
      { employeeId },
      { 
        annualLeave, 
        sickLeave, 
        emergencyLeave, 
        updatedAt: new Date() 
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Leave balance updated successfully',
      leaveBalance
    });
  } catch (error) {
    console.error('Error updating leave balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
```

### Leave Balance Model (models/LeaveBalance.js)
```javascript
const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  annualLeave: {
    type: Number,
    default: 0
  },
  sickLeave: {
    type: Number,
    default: 0
  },
  emergencyLeave: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
```

---

## 4. Announcement Management Integration

### Frontend (scripts/admin.js)
```javascript
announcementForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const announcementData = {
    title: document.getElementById('announcementTitle').value,
    content: document.getElementById('announcementContent').value,
    date: document.getElementById('announcementDate').value,
    pinned: document.getElementById('announcementPinned').checked
  };

  const method = editingAnnouncementId ? 'PUT' : 'POST';
  const url = editingAnnouncementId 
    ? `/api/admin/announcements/${editingAnnouncementId}`
    : '/api/admin/announcements';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(announcementData)
    });
    
    const result = await response.json();
    if (result.success) {
      alert(`Announcement ${editingAnnouncementId ? 'updated' : 'created'} successfully!`);
      closeAnnouncementModal();
      loadAnnouncements();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
```

### Backend (controllers/adminController.js)
```javascript
const Announcement = require('../models/Announcement');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, date, pinned } = req.body;

    if (!title || !content || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const announcement = new Announcement({
      title,
      content,
      date: new Date(date),
      pinned: pinned || false,
      createdAt: new Date()
    });

    await announcement.save();

    res.json({
      success: true,
      message: 'Announcement created successfully',
      announcementId: announcement._id
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
    const announcements = await Announcement.find({})
      .sort({ pinned: -1, createdAt: -1 });

    res.json({
      success: true,
      announcements
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findByIdAndDelete(announcementId);

    if (!announcement) {
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
      message: 'Server error'
    });
  }
};
```

### Announcement Model (models/Announcement.js)
```javascript
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Announcement', announcementSchema);
```

---

## 5. Load Data Functions

### Load Employees
```javascript
async function loadEmployees() {
  try {
    const response = await fetch('/api/admin/employees', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const result = await response.json();
    if (result.success) {
      const tbody = document.getElementById('employeesTableBody');
      tbody.innerHTML = '';
      
      result.employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${emp.employeeId}</td>
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.position}</td>
          <td><span class="badge badge-${emp.status.toLowerCase()}">${emp.status}</span></td>
          <td>
            <button class="btn-icon" onclick="openEditEmployeeModal('${emp.employeeId}')">✎</button>
            <button class="btn-icon btn-danger" onclick="deleteEmployee('${emp.employeeId}')">🗑</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error loading employees:', error);
  }
}
```

---

## 6. Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = adminAuth;
```

---

## 7. Routes with Middleware

```javascript
const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// Apply auth middleware to all admin routes
router.use(adminAuth);

// Employee routes
router.post('/employees', adminController.createEmployee);
router.get('/employees', adminController.getEmployees);
router.put('/employees/:employeeId', adminController.updateEmployee);
router.delete('/employees/:employeeId', adminController.deleteEmployee);

// Attendance routes
router.get('/attendance', adminController.getAttendance);
router.put('/attendance/:employeeId/:date', adminController.updateAttendance);

// Leave balance routes
router.get('/leave-balance', adminController.getLeaveBalance);
router.put('/leave-balance/:employeeId', adminController.updateLeaveBalance);

// Announcements routes
router.post('/announcements', adminController.createAnnouncement);
router.get('/announcements', adminController.getAnnouncements);
router.put('/announcements/:announcementId', adminController.updateAnnouncement);
router.delete('/announcements/:announcementId', adminController.deleteAnnouncement);

module.exports = router;
```

---

## Installation Instructions

1. **Install dependencies**:
```bash
npm install bcryptjs jsonwebtoken
```

2. **Create models directory**:
```bash
mkdir ess-backend/models
```

3. **Copy model files to `ess-backend/models/`**:
   - Employee.js
   - Attendance.js
   - LeaveBalance.js
   - Announcement.js

4. **Update routes/admin.js** with the provided code

5. **Create middleware directory**:
```bash
mkdir ess-backend/middleware
```

6. **Add authentication middleware** to `ess-backend/middleware/adminAuth.js`

7. **Update server.js** with admin routes and middleware

8. **Replace frontend code** in `scripts/admin.js` with API integration code

9. **Test with Postman** before deploying

---

**Version**: 1.0
**Last Updated**: January 13, 2026
