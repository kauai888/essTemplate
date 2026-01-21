# Backend Integration Guide - ESS v1.2

Complete guide for integrating the frontend with the ESS backend API.

## Table of Contents

1. [Overview](#overview)
2. [API Configuration](#api-configuration)
3. [Authentication Integration](#authentication-integration)
4. [Attendance Integration](#attendance-integration)
5. [Leave Management Integration](#leave-management-integration)
6. [Admin Panel Integration](#admin-panel-integration)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## Overview

The ESS frontend communicates with the backend API using:
- **Protocol:** HTTP/HTTPS
- **Format:** JSON
- **Authentication:** JWT tokens
- **Base URL:** `http://localhost:5000/api` (development)

### Key Integration Points

1. **Authentication Module** (`scripts/login.js`)
2. **Attendance Module** (`scripts/main.js`)
3. **Admin Module** (`scripts/admin.js`)
4. **Approver Module** (`scripts/approver.js`)

---

## API Configuration

### Frontend API Setup

The frontend API configuration is located in `src/config/app-config.js`:

```javascript
// app-config.js
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Export for use in other modules
module.exports = API_CONFIG;
```

### Configuration Variables

Update configuration based on environment:

**Development:**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**Staging:**
```javascript
const API_BASE_URL = 'https://staging-api.example.com/api';
```

**Production:**
```javascript
const API_BASE_URL = 'https://api.example.com/api';
```

### Dynamic Configuration

For environment-specific configuration:

```javascript
// app-config.js
const getApiUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000/api';
  } else if (window.location.hostname === 'staging.example.com') {
    return 'https://staging-api.example.com/api';
  } else {
    return 'https://api.example.com/api';
  }
};

const API_BASE_URL = getApiUrl();
```

---

## Authentication Integration

### Login Flow

```javascript
// scripts/login.js
class AuthService {
  static async login(employeeId, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: employeeId,
          password: password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store tokens
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      return data.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } finally {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
```

### Token Refresh

```javascript
class AuthService {
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: refreshToken
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      localStorage.setItem('token', data.data.token);
      return data.data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Redirect to login on token refresh failure
      window.location.href = '/login.html';
      throw error;
    }
  }
}
```

### Authentication Guard

Protect routes that require authentication:

```javascript
function requireAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = '/login.html';
    return false;
  }

  return true;
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) {
    return; // Don't load page if not authenticated
  }
  
  initializeDashboard();
});
```

---

## Attendance Integration

### Clock In Integration

```javascript
// scripts/main.js
class AttendanceService {
  static async clockIn(latitude, longitude) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance/clock-in`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            accuracy: 10.5
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Clock in failed');
      }

      return data.data;
    } catch (error) {
      console.error('Clock in error:', error);
      throw error;
    }
  }

  static async clockOut(latitude, longitude) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance/clock-out`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Clock out failed');
      }

      return data.data;
    } catch (error) {
      console.error('Clock out error:', error);
      throw error;
    }
  }

  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}
```

### Get Attendance Records

```javascript
class AttendanceService {
  static async getMyRecords(fromDate, toDate) {
    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      params.append('page', 1);
      params.append('limit', 30);

      const response = await fetch(
        `${API_BASE_URL}/attendance/my-records?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch records');
      }

      return data.data;
    } catch (error) {
      console.error('Fetch records error:', error);
      throw error;
    }
  }
}
```

### Geolocation Integration

```javascript
// Geolocation service integration
class GeolocationService {
  static async getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        }
      );
    });
  }
}

// Usage in attendance
async function handleClockIn() {
  try {
    const location = await GeolocationService.getLocation();
    const result = await AttendanceService.clockIn(
      location.latitude,
      location.longitude
    );
    displaySuccess('Clocked in successfully');
  } catch (error) {
    displayError(error.message);
  }
}
```

---

## Leave Management Integration

### Get Leave Balance

```javascript
class LeaveService {
  static async getBalance() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/leave/balance`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      return data.data;
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}
```

### Request Leave

```javascript
class LeaveService {
  static async requestLeave(leaveType, fromDate, toDate, reason, approverId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/leave/request`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            leaveType: leaveType,
            fromDate: fromDate,
            toDate: toDate,
            reason: reason,
            approverId: approverId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Leave request failed');
      }

      return data.data;
    } catch (error) {
      console.error('Leave request error:', error);
      throw error;
    }
  }

  static async getLeaveRequests(status) {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', 1);

      const response = await fetch(
        `${API_BASE_URL}/leave/requests?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests');
      }

      return data.data;
    } catch (error) {
      console.error('Get requests error:', error);
      throw error;
    }
  }
}
```

---

## Admin Panel Integration

### List Employees

```javascript
// scripts/admin.js
class AdminService {
  static async getEmployees(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);

      const response = await fetch(
        `${API_BASE_URL}/admin/employees?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch employees');
      }

      return data.data;
    } catch (error) {
      console.error('Get employees error:', error);
      throw error;
    }
  }

  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
}
```

### Create Employee

```javascript
class AdminService {
  static async createEmployee(employeeData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/employees`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(employeeData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee');
      }

      return data.data;
    } catch (error) {
      console.error('Create employee error:', error);
      throw error;
    }
  }
}
```

### Update Employee

```javascript
class AdminService {
  static async updateEmployee(employeeId, updateData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/employees/${employeeId}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updateData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update employee');
      }

      return data.data;
    } catch (error) {
      console.error('Update employee error:', error);
      throw error;
    }
  }
}
```

### Attendance Management

```javascript
class AdminService {
  static async getAttendance(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(
        `${API_BASE_URL}/admin/attendance?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch attendance');
      }

      return data.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      throw error;
    }
  }

  static async updateAttendance(attendanceId, updateData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/attendance/${attendanceId}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updateData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update attendance');
      }

      return data.data;
    } catch (error) {
      console.error('Update attendance error:', error);
      throw error;
    }
  }
}
```

### Announcements Management

```javascript
class AdminService {
  static async getAnnouncements(page = 1) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);

      const response = await fetch(
        `${API_BASE_URL}/admin/announcements?${params}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch announcements');
      }

      return data.data;
    } catch (error) {
      console.error('Get announcements error:', error);
      throw error;
    }
  }

  static async createAnnouncement(announcementData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/announcements`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(announcementData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create announcement');
      }

      return data.data;
    } catch (error) {
      console.error('Create announcement error:', error);
      throw error;
    }
  }
}
```

---

## Error Handling

### Standardized Error Handling

```javascript
class ApiService {
  static async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      // Handle different error types
      switch (response.status) {
        case 400:
          throw new ValidationError(data.error, data.details);
        case 401:
          // Token expired or unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login.html';
          throw new AuthError(data.error);
        case 403:
          throw new ForbiddenError(data.error);
        case 404:
          throw new NotFoundError(data.error);
        case 500:
          throw new ServerError(data.error);
        default:
          throw new ApiError(data.error);
      }
    }

    return data;
  }
}

class ApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends ApiError {
  constructor(message, details) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class AuthError extends ApiError {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}

class ForbiddenError extends ApiError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ServerError extends ApiError {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
  }
}
```

### Error Display to User

```javascript
function displayError(error) {
  let message = 'An error occurred. Please try again.';

  if (error instanceof ValidationError) {
    message = `Validation Error: ${error.message}`;
  } else if (error instanceof AuthError) {
    message = 'Session expired. Please log in again.';
  } else if (error instanceof ForbiddenError) {
    message = 'You do not have permission to perform this action.';
  } else if (error instanceof ServerError) {
    message = 'Server error. Please contact support.';
  } else {
    message = error.message;
  }

  // Display in UI (toast, alert, etc.)
  showNotification(message, 'error');
}
```

---

## Best Practices

### 1. Request/Response Consistency

Always use consistent request/response patterns:

```javascript
// Request format
{
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}

// Response format
{
  success: true/false,
  data: { ... },
  error: "error message",
  message: "additional message"
}
```

### 2. Token Management

Store and manage tokens securely:

```javascript
// Store tokens after login
localStorage.setItem('token', response.token);
localStorage.setItem('refreshToken', response.refreshToken);

// Always include token in requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}

// Clear on logout
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
```

### 3. Loading States

Manage loading states during API calls:

```javascript
async function fetchData() {
  try {
    showLoading(true);
    const data = await ApiService.getData();
    displayData(data);
  } catch (error) {
    displayError(error);
  } finally {
    showLoading(false);
  }
}
```

### 4. Retry Logic

Implement retry logic for failed requests:

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

### 5. Request Timeout

Implement request timeout:

```javascript
function fetchWithTimeout(url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}
```

### 6. Pagination

Handle paginated responses properly:

```javascript
async function loadMore(page) {
  try {
    const data = await ApiService.getEmployees(page);
    appendData(data.employees);
    updatePaginationInfo(data.pagination);
  } catch (error) {
    displayError(error);
  }
}
```

### 7. Caching

Cache frequently accessed data:

```javascript
class CacheService {
  static cache = {};
  static ttl = 5 * 60 * 1000; // 5 minutes

  static set(key, value) {
    this.cache[key] = {
      value,
      timestamp: Date.now()
    };
  }

  static get(key) {
    const item = this.cache[key];
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      delete this.cache[key];
      return null;
    }

    return item.value;
  }

  static clear() {
    this.cache = {};
  }
}
```

---

## Testing Integration

Test API integration with Postman:

1. **Import Collection:**
   - Use the API_REFERENCE.md endpoints

2. **Set Variables:**
   - `{{baseUrl}}` = `http://localhost:5000/api`
   - `{{token}}` = (from login response)

3. **Test Endpoints:**
   - Login → Get token
   - Use token for subsequent requests
   - Verify responses match documentation

---

**Version:** 1.2.0
**Last Updated:** January 2026
