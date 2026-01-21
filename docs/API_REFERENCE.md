# API Reference - ESS v1.2

Complete documentation of all available API endpoints for the Employee Self-Service System.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

Login with employee credentials.

**Request Body:**
```json
{
  "employeeId": "EMP001",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "EMP001",
      "name": "John Doe",
      "role": "employee",
      "email": "john@example.com"
    }
  }
}
```

### Logout
**POST** `/auth/logout`

Logout current user.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token
**POST** `/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

---

## Admin Endpoints

### Employee Management

#### List All Employees
**GET** `/admin/employees`

Retrieve all employees with pagination and filtering.

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `search` (string) - Search by name or ID
- `department` (string) - Filter by department
- `status` (string) - Filter by status (active, inactive)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "EMP001",
        "name": "John Doe",
        "email": "john@example.com",
        "department": "IT",
        "role": "employee",
        "status": "active",
        "joinDate": "2023-01-15"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

#### Get Employee Details
**GET** `/admin/employees/:id`

Get detailed information for a specific employee.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "EMP001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "department": "IT",
    "designation": "Software Engineer",
    "role": "employee",
    "status": "active",
    "joinDate": "2023-01-15",
    "leaveBalance": {
      "annual": 15,
      "used": 3,
      "available": 12,
      "sick": 5
    }
  }
}
```

#### Create Employee
**POST** `/admin/employees`

Create a new employee record.

**Request Body:**
```json
{
  "employeeId": "EMP046",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0101",
  "department": "HR",
  "designation": "HR Manager",
  "password": "tempPassword123",
  "role": "employee"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "EMP046",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "message": "Employee created successfully"
  }
}
```

#### Update Employee
**PUT** `/admin/employees/:id`

Update employee information.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "department": "Finance",
  "designation": "Finance Manager",
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "EMP001",
    "message": "Employee updated successfully"
  }
}
```

#### Delete Employee
**DELETE** `/admin/employees/:id`

Deactivate an employee.

**Response (200):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

### Attendance Management

#### Get All Attendance Records
**GET** `/admin/attendance`

Retrieve attendance records with filtering.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `employeeId` (string) - Filter by employee
- `fromDate` (string) - From date (YYYY-MM-DD)
- `toDate` (string) - To date (YYYY-MM-DD)
- `status` (string) - Filter by status (present, absent, leave)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "ATT001",
        "employeeId": "EMP001",
        "date": "2026-01-18",
        "clockIn": "09:00:15",
        "clockOut": "17:30:45",
        "status": "present",
        "location": {
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "workHours": 8.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156
    }
  }
}
```

#### Update Attendance
**PUT** `/admin/attendance/:id`

Manually update attendance record.

**Request Body:**
```json
{
  "clockIn": "09:00:00",
  "clockOut": "17:30:00",
  "status": "present",
  "notes": "Manual adjustment"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "ATT001",
    "message": "Attendance updated successfully"
  }
}
```

### Leave Management

#### Get Leave Balances
**GET** `/admin/leave-balance`

Get leave balances for all employees.

**Query Parameters:**
- `employeeId` (string) - Filter by employee
- `year` (number) - Fiscal year (default: current)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "employeeId": "EMP001",
      "name": "John Doe",
      "annual": {
        "allocated": 15,
        "used": 3,
        "available": 12
      },
      "sick": {
        "allocated": 5,
        "used": 1,
        "available": 4
      },
      "casual": {
        "allocated": 3,
        "used": 0,
        "available": 3
      }
    }
  ]
}
```

#### Update Leave Balance
**PUT** `/admin/leave-balance/:employeeId`

Update employee leave balance.

**Request Body:**
```json
{
  "leaveType": "annual",
  "adjustedValue": 16,
  "reason": "Adjustment for new hire policy"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employeeId": "EMP001",
    "message": "Leave balance updated"
  }
}
```

### Announcement Management

#### List Announcements
**GET** `/admin/announcements`

Get all announcements.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `status` (string) - active, archived

**Response (200):**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "ANN001",
        "title": "System Maintenance",
        "content": "Scheduled maintenance on Sunday...",
        "createdBy": "ADMIN001",
        "createdDate": "2026-01-18",
        "status": "active",
        "visibility": "all"
      }
    ]
  }
}
```

#### Create Announcement
**POST** `/admin/announcements`

Create a new announcement.

**Request Body:**
```json
{
  "title": "Holiday Schedule",
  "content": "The following days are declared holidays...",
  "visibility": "all",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "ANN002",
    "message": "Announcement created successfully"
  }
}
```

#### Update Announcement
**PUT** `/admin/announcements/:id`

Update existing announcement.

**Request Body:**
```json
{
  "title": "Updated Holiday Schedule",
  "content": "Updated holiday information...",
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Announcement updated successfully"
}
```

#### Delete Announcement
**DELETE** `/admin/announcements/:id`

Delete announcement.

**Response (200):**
```json
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

---

## Employee Endpoints

### Attendance

#### Clock In
**POST** `/attendance/clock-in`

Employee clock in with geolocation.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10.5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "recordId": "ATT001",
    "clockInTime": "2026-01-18T09:00:15Z",
    "message": "Clocked in successfully"
  }
}
```

#### Clock Out
**POST** `/attendance/clock-out`

Employee clock out.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clockOutTime": "2026-01-18T17:30:45Z",
    "workHours": 8.5,
    "message": "Clocked out successfully"
  }
}
```

#### Get My Attendance Records
**GET** `/attendance/my-records`

Get personal attendance records.

**Query Parameters:**
- `fromDate` (string) - From date (YYYY-MM-DD)
- `toDate` (string) - To date (YYYY-MM-DD)
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "ATT001",
        "date": "2026-01-18",
        "clockIn": "09:00:15",
        "clockOut": "17:30:45",
        "status": "present",
        "workHours": 8.5
      }
    ]
  }
}
```

### Leave Management

#### Get Leave Balance
**GET** `/leave/balance`

Get personal leave balance.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "annual": {
      "allocated": 15,
      "used": 3,
      "available": 12
    },
    "sick": {
      "allocated": 5,
      "used": 1,
      "available": 4
    },
    "casual": {
      "allocated": 3,
      "used": 0,
      "available": 3
    }
  }
}
```

#### Request Leave
**POST** `/leave/request`

Submit a leave request.

**Request Body:**
```json
{
  "leaveType": "annual",
  "fromDate": "2026-02-01",
  "toDate": "2026-02-05",
  "reason": "Personal reasons",
  "approverId": "EMP002"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "requestId": "LR001",
    "status": "pending",
    "message": "Leave request submitted successfully"
  }
}
```

#### Get Leave Requests
**GET** `/leave/requests`

Get personal leave requests.

**Query Parameters:**
- `status` (string) - pending, approved, rejected
- `page` (number) - Page number

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "LR001",
        "leaveType": "annual",
        "fromDate": "2026-02-01",
        "toDate": "2026-02-05",
        "status": "pending",
        "reason": "Personal reasons",
        "submittedDate": "2026-01-18"
      }
    ]
  }
}
```

### Announcements

#### Get Announcements
**GET** `/announcements`

Get all active announcements.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "ANN001",
        "title": "System Maintenance",
        "content": "Scheduled maintenance on Sunday...",
        "createdDate": "2026-01-18",
        "priority": "high"
      }
    ]
  }
}
```

---

## Approver Endpoints

### Leave Approval

#### Get Pending Leave Requests
**GET** `/approver/leave-requests`

Get leave requests pending approval.

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `employeeId` (string) - Filter by employee

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "LR001",
        "employeeId": "EMP001",
        "employeeName": "John Doe",
        "leaveType": "annual",
        "fromDate": "2026-02-01",
        "toDate": "2026-02-05",
        "status": "pending",
        "reason": "Personal reasons",
        "submittedDate": "2026-01-18"
      }
    ]
  }
}
```

#### Approve Leave Request
**POST** `/approver/leave-requests/:id/approve`

Approve a leave request.

**Request Body:**
```json
{
  "comments": "Approved"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requestId": "LR001",
    "status": "approved",
    "message": "Leave request approved"
  }
}
```

#### Reject Leave Request
**POST** `/approver/leave-requests/:id/reject`

Reject a leave request.

**Request Body:**
```json
{
  "reason": "Insufficient notice period"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requestId": "LR001",
    "status": "rejected",
    "message": "Leave request rejected"
  }
}
```

---

## Error Responses

All endpoints return error responses in the following format:

**400 - Bad Request:**
```json
{
  "success": false,
  "error": "Invalid request parameters",
  "details": "Field 'email' is required"
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- **Standard endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP
- **Admin endpoints:** 50 requests per 15 minutes per user

---

## Pagination

Paginated responses include:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

**Last Updated:** January 2026
**API Version:** 1.2.0
