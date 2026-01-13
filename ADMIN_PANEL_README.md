# Admin Panel Documentation

## Overview
The Admin Panel is a comprehensive management system for LEXIcore that allows administrators to manage employees, attendance records, leave balances, and company announcements.

## Features

### 1. Employee Management
- **Create Employees**: Add new employees with unique ID, name, email, position, and password
- **Edit Employees**: Modify employee credentials and status
- **Delete Employees**: Remove employees from the system
- **Search**: Find employees by name or ID
- **Status Management**: Set employee status to Active or Inactive

**Access Point**: `pages/admin.html` → Employees Tab

**API Endpoints**:
- `POST /api/admin/employees` - Create new employee
- `GET /api/admin/employees` - Fetch all employees
- `PUT /api/admin/employees/:employeeId` - Update employee
- `DELETE /api/admin/employees/:employeeId` - Delete employee

### 2. Attendance Management
- **Edit Clock In/Out**: Modify employee clock-in and clock-out times
- **Date Management**: Adjust attendance records for specific dates
- **Search**: Filter attendance by employee name
- **Bulk Updates**: Update multiple attendance records

**Access Point**: `pages/admin.html` → Attendance Tab

**API Endpoints**:
- `GET /api/admin/attendance` - Fetch attendance records
- `PUT /api/admin/attendance/:employeeId/:date` - Update attendance

### 3. Leave Balance Management
- **Annual Leave**: Set/update annual leave days
- **Sick Leave**: Manage sick leave allocation
- **Emergency Leave**: Configure emergency leave days
- **Search**: Find employees by name
- **Bulk Edit**: Update leave balances for multiple employees

**Access Point**: `pages/admin.html` → Leave Balance Tab

**API Endpoints**:
- `GET /api/admin/leave-balance` - Fetch leave balances
- `PUT /api/admin/leave-balance/:employeeId` - Update leave balance

### 4. Announcements Management
- **Create Announcements**: Add new company announcements
- **Edit Announcements**: Modify existing announcements
- **Delete Announcements**: Remove announcements
- **Pin Announcements**: Mark important announcements
- **Date Management**: Set announcement dates

**Access Point**: `pages/admin.html` → Announcements Tab

**API Endpoints**:
- `POST /api/admin/announcements` - Create announcement
- `GET /api/admin/announcements` - Fetch announcements
- `PUT /api/admin/announcements/:announcementId` - Update announcement
- `DELETE /api/admin/announcements/:announcementId` - Delete announcement

## File Structure

### Frontend Files
- `pages/admin.html` - Main admin panel interface
- `styles/AdminStyle.css` - Admin panel styling
- `scripts/admin.js` - Admin panel functionality

### Backend Files
- `ess-backend/routes/admin.js` - Admin API routes
- `ess-backend/controllers/adminController.js` - Admin business logic

## How to Access

1. Navigate to `pages/admin.html` in your browser
2. User must be authenticated as an admin
3. The panel opens with the Employees tab by default

## Tab Navigation

- **Employees**: Create, edit, delete, and search employee records
- **Attendance**: Modify employee clock-in and clock-out times
- **Leave Balance**: Adjust annual, sick, and emergency leave days
- **Announcements**: Create and manage company announcements

## Password Requirements

When creating a new employee:
- Password field is required
- Confirm password must match
- Passwords should be at least 6-8 characters long (recommended)
- System uses SHA-256 hashing for password storage

## Security Considerations

- All admin operations should require proper authentication
- Implement role-based access control (RBAC) to restrict admin access
- Log all administrative actions for audit trails
- Validate all input data on both frontend and backend
- Use HTTPS for all communications
- Implement rate limiting on API endpoints

## Future Enhancements

- Bulk import employees via CSV
- Advanced filtering and sorting options
- Export functionality (PDF, Excel)
- Admin activity logs and audit trail
- Role-based permissions management
- Email notifications for announcements
- Attendance analytics and reports
- Leave balance forecasting
- Department management
- Backup and restore functionality

## Backend Integration Notes

The frontend is currently using mock data. To integrate with a real backend:

1. Replace mock data fetching with actual API calls
2. Implement database schema for:
   - Employees
   - Attendance Records
   - Leave Balances
   - Announcements
3. Add authentication middleware to protect admin routes
4. Implement error handling and validation
5. Add database transactions for data consistency

## Example Backend Integration

```javascript
// In scripts/admin.js, replace mock with actual API call:
function createEmployee(employeeData) {
  return fetch('/api/admin/employees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employeeData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Employee created successfully');
      loadEmployees();
    }
  });
}
```

## Support

For issues or questions regarding the admin panel, contact the development team.
