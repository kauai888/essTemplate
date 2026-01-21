module.exports = {
  app: {
    name: 'ESS - Employee Self-Service',
    version: '1.2.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    baseURL: process.env.BASE_URL || 'http://localhost:5000',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  security: {
    bcryptRounds: 10,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  features: {
    geolocationEnabled: process.env.GEOLOCATION_ENABLED === 'true',
    otpEnabled: process.env.OTP_ENABLED === 'true',
    emailNotifications: process.env.EMAIL_NOTIFICATIONS === 'true',
  },
};
