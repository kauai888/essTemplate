/**
 * Frontend Configuration
 * Client-side app configuration
 */

const config = {
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
  },
  app: {
    name: 'ESS - Employee Self-Service',
    version: '1.2.0',
  },
  features: {
    geolocation: true,
    otp: true,
    announcements: true,
    leaveManagement: true,
  },
  localStorage: {
    tokenKey: 'token',
    roleKey: 'role',
    userIdKey: 'userId',
    userDataKey: 'userData',
  },
  routes: {
    login: '/login.html',
    dashboard: '/index.html',
    admin: '/admin.html',
    approver: '/approver.html',
    otp: '/otp-verify.html',
  },
};

export default config;
