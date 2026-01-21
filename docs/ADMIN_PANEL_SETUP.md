# Admin Panel Setup & Implementation Guide

## Overview
A complete admin panel system has been created for LEXIcore ESS v1.2 with the following capabilities:
- Employee account creation/deletion with password management
- Attendance record editing (clock in/out times)
- Leave balance management (annual, sick, emergency)
- Company announcement creation and management

## Files Created/Modified

### New Files Created:

1. **pages/admin.html** (3,500+ lines)
   - Complete admin dashboard with tabbed interface
   - Employee management section with create/edit/delete
   - Attendance editing interface
   - Leave balance management
   - Announcements management system
   - Modal forms for all operations

2. **styles/AdminStyle.css** (500+ lines)
   - Professional admin panel styling
   - Responsive design for all screen sizes
   - Tab navigation styling
   - Form and modal styling
   - Table layout and interactions

3. **scripts/admin.js** (400+ lines)
   - Tab switching functionality
   - Form handling for all admin operations
   - Search and filter capabilities
   - Modal management
   - Sign out functionality

4. **ess-backend/routes/admin.js** (200+ lines)
   - Employee CRUD endpoints
   - Attendance management endpoints
   - Leave balance management endpoints
   - Announcements CRUD endpoints

5. **ess-backend/controllers/adminController.js** (400+ lines)
   - Employee management logic
   - Attendance management logic
   - Leave balance management logic
   - Announcements management logic
   - Password hashing functionality

6. **ADMIN_PANEL_README.md**
   - Comprehensive documentation
   - Feature overview
   - API endpoint reference
   - Security considerations
   - Future enhancement suggestions

### Files Modified:

1. **ess-backend/server.js**
   - Added admin routes import
   - Registered admin API endpoints at `/api/admin`

2. **pages/index.html**
   - Added "Admin Panel" button in navigation for quick access

## Features Implemented

### 1. Employee Management
✅ Create new employees with:
- Unique Employee ID
- Full name
- Email address
- Job position
- Password (with confirmation)
- Active/Inactive status

✅ Edit employee information
✅ Delete employees
✅ Search employees by name or ID
✅ View all employees in table format

### 2. Attendance Management
✅ Edit clock-in times
✅ Edit clock-out times
✅ Adjust attendance records for past dates
✅ Search by employee name
✅ View all attendance records

### 3. Leave Balance Management
✅ Manage Annual Leave days
✅ Manage Sick Leave days
✅ Manage Emergency Leave days
✅ Search employees
✅ Update leave balances for individual employees

### 4. Announcements Management
✅ Create new announcements
✅ Edit existing announcements
✅ Delete announcements
✅ Pin important announcements
✅ Set announcement dates
✅ View all announcements in a card layout

## How to Use

### Accessing the Admin Panel

**Option 1**: Click "Admin Panel" button in navigation on dashboard
**Option 2**: Direct URL: `http://localhost/pages/admin.html`

### Creating an Employee

1. Go to Admin Panel → Employees Tab
2. Click "+ Create Employee" button
3. Fill in the form:
   - Employee ID (e.g., EMP001)
   - Full Name
   - Email
   - Position
   - Password
   - Confirm Password
4. Click "Save Employee"

### Editing Attendance

1. Go to Admin Panel → Attendance Tab
2. Find the employee in the table
3. Click "Edit" button (✎)
4. Update clock-in/out times
5. Click "Update Attendance"

### Managing Leave Balances

1. Go to Admin Panel → Leave Balance Tab
2. Find the employee in the table
3. Click "Edit" button (✎)
4. Update leave days for each category
5. Click "Update Leave Balance"

### Creating Announcements

1. Go to Admin Panel → Announcements Tab
2. Click "+ Create Announcement" button
3. Fill in:
   - Title
   - Content
   - Date
   - Pin option (optional)
4. Click "Save Announcement"

## API Endpoints

### Employees
```
POST   /api/admin/employees              - Create employee
GET    /api/admin/employees              - Get all employees
PUT    /api/admin/employees/:employeeId  - Update employee
DELETE /api/admin/employees/:employeeId  - Delete employee
```

### Attendance
```
GET    /api/admin/attendance             - Get attendance records
PUT    /api/admin/attendance/:employeeId/:date - Update attendance
```

### Leave Balance
```
GET    /api/admin/leave-balance          - Get leave balances
PUT    /api/admin/leave-balance/:employeeId - Update leave balance
```

### Announcements
```
POST   /api/admin/announcements          - Create announcement
GET    /api/admin/announcements          - Get all announcements
PUT    /api/admin/announcements/:announcementId - Update announcement
DELETE /api/admin/announcements/:announcementId - Delete announcement
```

## Backend Integration Steps

The admin panel currently uses mock data. To integrate with your backend:

### Step 1: Update Employee Forms
Replace mock data with actual API calls in `scripts/admin.js`:

```javascript
// Example: Create Employee
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
      headers: { 'Content-Type': 'application/json' },
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

### Step 2: Implement Database Models

Create Mongoose schemas or database tables for:
- Employees (id, name, email, position, passwordHash, status)
- Attendance (employeeId, date, clockIn, clockOut)
- LeaveBalance (employeeId, annualLeave, sickLeave, emergencyLeave)
- Announcements (id, title, content, date, pinned, createdAt)

### Step 3: Update Controllers

Implement actual database operations in `controllers/adminController.js`

### Step 4: Add Authentication

Protect admin routes with middleware:
```javascript
// In routes/admin.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Unauthorized' });
  }
};

router.use(isAdmin); // Apply to all admin routes
```

## Security Considerations

⚠️ **Important**: Before deploying to production:

1. **Authentication**: Add admin authentication middleware
2. **Authorization**: Implement role-based access control
3. **Validation**: Validate all inputs on both frontend and backend
4. **Password Security**: Use bcrypt instead of SHA-256 for production
5. **HTTPS**: Always use HTTPS for admin operations
6. **Logging**: Log all admin actions for audit trails
7. **Rate Limiting**: Implement rate limiting on sensitive endpoints
8. **Input Sanitization**: Sanitize all user inputs to prevent injection attacks

## Testing

### Manual Testing Checklist
- [ ] Create new employee
- [ ] Edit employee information
- [ ] Delete employee
- [ ] Edit attendance record
- [ ] Update leave balance
- [ ] Create announcement
- [ ] Edit announcement
- [ ] Delete announcement
- [ ] Pin/unpin announcement
- [ ] Search functionality works
- [ ] Modal closes on outside click
- [ ] Form validation works

### API Testing
Use Postman or similar tool to test endpoints:
```
POST http://localhost:5000/api/admin/employees
{
  "employeeId": "EMP001",
  "name": "Test User",
  "email": "test@company.com",
  "position": "Developer",
  "password": "secure123",
  "status": "Active"
}
```

## Troubleshooting

### Admin Panel Not Loading
- Check browser console for JavaScript errors
- Verify AdminStyle.css is linked correctly
- Ensure admin.js file is loading

### API Endpoints Not Working
- Check that server.js includes admin routes
- Verify backend server is running on port 5000
- Check CORS settings

### Forms Not Submitting
- Check browser console for validation errors
- Ensure all required fields are filled
- Verify form IDs match in HTML and JavaScript

## Future Enhancements

1. **Bulk Operations**
   - Import employees from CSV
   - Bulk attendance updates
   - Bulk announcement creation

2. **Advanced Features**
   - Department management
   - Role management
   - Permissions control
   - Backup/restore functionality

3. **Reporting**
   - Attendance reports
   - Leave usage analytics
   - Employee statistics
   - Export to PDF/Excel

4. **Notifications**
   - Email notifications for announcements
   - SMS alerts for important updates
   - In-app notifications

5. **Analytics**
   - Dashboard with key metrics
   - Charts and graphs
   - Trend analysis
   - Performance monitoring

## Support & Maintenance

For questions or issues:
1. Check ADMIN_PANEL_README.md for detailed documentation
2. Review console logs for error messages
3. Test API endpoints with Postman
4. Check database connections

---

**Admin Panel Version**: 1.0
**Created**: January 2026
**Last Updated**: January 13, 2026
