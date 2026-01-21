import apiClient from './apiClient';

export const authService = {
  // Login with username and password
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    const data = response.data;
    
    // Return the data from the response, mapping nested data if needed
    if (data.data) {
      return {
        success: data.success,
        message: data.message,
        userId: data.data.userId,
        requiresOTP: data.data.requiresOTP,
        phone: data.data.phone,
        email: data.data.email
      };
    }
    return data;
  },

  // Verify OTP
  verifyOTP: async (userId, otp) => {
    const response = await apiClient.post('/auth/verify-otp', { userId, otp });
    const data = response.data;
    
    // Return the data from the response
    if (data.data) {
      return {
        success: data.success,
        token: data.data.accessToken || data.data.token,
        user: data.data.user || data.data,
        role: data.data.user?.role || data.data.role,
        userId: data.data.user?.id || userId,
        message: data.message
      };
    }
    return data;
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export const attendanceService = {
  // Clock in
  clockIn: async (latitude, longitude, address, accuracy) => {
    const response = await apiClient.post('/attendance/clock-in', {
      latitude,
      longitude,
      address,
      accuracy,
    });
    return response.data;
  },

  // Clock out
  clockOut: async (latitude, longitude, address, accuracy) => {
    const response = await apiClient.post('/attendance/clock-out', {
      latitude,
      longitude,
      address,
      accuracy,
    });
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async () => {
    const response = await apiClient.get('/attendance/today');
    return response.data;
  },

  // Get attendance records
  getAttendanceRecords: async (startDate, endDate) => {
    const response = await apiClient.get('/attendance/records', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get attendance by employee
  getEmployeeAttendance: async (employeeId, month, year) => {
    const response = await apiClient.get(`/attendance/employee/${employeeId}`, {
      params: { month, year },
    });
    return response.data;
  },
};

export const adminService = {
  // Get all users
  getAllUsers: async (page = 1, limit = 20) => {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user details
  getUserDetails: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  // Get all announcements
  getAnnouncements: async () => {
    const response = await apiClient.get('/admin/announcements');
    return response.data;
  },

  // Create announcement
  createAnnouncement: async (announcementData) => {
    const response = await apiClient.post('/admin/announcements', announcementData);
    return response.data;
  },

  // Update announcement
  updateAnnouncement: async (announcementId, announcementData) => {
    const response = await apiClient.put(`/admin/announcements/${announcementId}`, announcementData);
    return response.data;
  },

  // Get system settings
  getSystemSettings: async () => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },

  // Update system settings
  updateSystemSettings: async (settings) => {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  },

  // Get all leave requests
  getLeaveRequests: async () => {
    const response = await apiClient.get('/admin/leave-requests');
    return response.data;
  },

  // Approve leave request
  approveLeaveRequest: async (leaveRequestId, approvalData) => {
    const response = await apiClient.put(
      `/admin/leave-requests/${leaveRequestId}/approve`,
      approvalData
    );
    return response.data;
  },

  // Reject leave request
  rejectLeaveRequest: async (leaveRequestId, rejectionData) => {
    const response = await apiClient.put(
      `/admin/leave-requests/${leaveRequestId}/reject`,
      rejectionData
    );
    return response.data;
  },

  // Get all attendance records
  getAllAttendanceRecords: async (filters = {}) => {
    const response = await apiClient.get('/admin/attendance', { params: filters });
    return response.data;
  },

  // Get department-wise reports
  getDepartmentReport: async (department, month, year) => {
    const response = await apiClient.get('/admin/reports/department', {
      params: { department, month, year },
    });
    return response.data;
  },
};

export const leaveService = {
  // Get leave balance
  getLeaveBalance: async () => {
    const response = await apiClient.get('/leave/balance');
    return response.data;
  },

  // Request leave
  requestLeave: async (leaveData) => {
    const response = await apiClient.post('/leave/request', leaveData);
    return response.data;
  },

  // Get leave requests
  getLeaveRequests: async () => {
    const response = await apiClient.get('/leave/requests');
    return response.data;
  },

  // Cancel leave request
  cancelLeaveRequest: async (leaveRequestId) => {
    const response = await apiClient.put(`/leave/requests/${leaveRequestId}/cancel`);
    return response.data;
  },
};

export const geolocationService = {
  // Get user's current position
  getCurrentPosition: async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  // Get address from coordinates (reverse geocoding)
  getAddressFromCoordinates: async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.address?.country || 'Unknown Location';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Unknown Location';
    }
  },

  // Calculate distance between two coordinates
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};
