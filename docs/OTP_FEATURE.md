# OTP Feature Documentation

## Overview
Two-Factor Authentication (2FA) using One-Time Password (OTP) has been implemented to enhance the security of the Employee Self Service (ESS) platform. Users must now verify their identity with a 6-digit OTP sent to their registered email after entering their credentials.

## Features

### 1. OTP Generation & Delivery
- **Automatic OTP Generation**: A 6-digit OTP is generated when a user submits their login credentials
- **Expiry Time**: OTP expires after 10 minutes
- **Email Delivery**: OTP is sent to the user's registered sim
- **In-Memory Storage**: OTP is stored server-side for validation (use Redis in production)

### 2. OTP Verification Page
- **User-Friendly Interface**: Clean, intuitive design for entering 6-digit OTP
- **Auto-Focus**: Automatic focus movement between input fields
- **Paste Support**: Users can paste the entire 6-digit code
- **Timer Display**: Shows remaining time for OTP validity (10 minutes)
- **Error Handling**: Clear error messages for invalid or expired OTP
- **Resend Functionality**: Users can request a new OTP (max 3 attempts)

### 3. Security Features
- **Time-Limited OTP**: Expires after 10 minutes
- **Attempt Validation**: OTP is verified against server-stored value
- **Session Storage**: User info is temporarily stored in sessionStorage
- **Token Generation**: JWT token is only issued after successful OTP verification
- **Secure Flow**: User cannot bypass OTP verification

## Login Flow

```
1. User enters credentials (username/password)
   ↓
2. Server validates credentials
   ↓
3. Server generates 6-digit OTP and sends to sim
   ↓
4. Server returns userId and email, requires OTP flag
   ↓
5. Frontend redirects to OTP verification page
   ↓
6. User enters 6-digit OTP
   ↓
7. Frontend sends OTP to backend for verification
   ↓
8. Server validates OTP and generates JWT token
   ↓
9. Frontend stores token and redirects to Dashboard
```

## Backend Implementation

### Modified Files

#### `authController.js`
- **`login()` function**: 
  - Validates username/password
  - Generates 6-digit OTP
  - Stores OTP with expiry (10 minutes)
  - Returns userId and requiresOTP flag instead of token
  - Logs OTP to console (in production, send via email service)

- **`verifyOTP()` function** (NEW):
  - Validates userId and OTP
  - Checks OTP expiry
  - Validates OTP against stored value
  - Generates JWT token on success
  - Clears OTP from storage after verification

#### `auth.js` (Routes)
- Added `/api/auth/verify-otp` POST endpoint

### User Data (Dummy)
```javascript
const users = [
  { 
    id: 1, 
    username: 'employee1', 
    password: bcrypt.hashSync('password123', 8), 
    role: 'employee',
    email: 'employee1@company.com'
  },
  { 
    id: 2, 
    username: 'manager1', 
    password: bcrypt.hashSync('managerpass', 8), 
    role: 'approver',
    email: 'manager1@company.com'
  }
];
```

## Frontend Implementation

### Modified Files

#### `login.html`
- Form validation before submission
- Error/success message display
- Communicates with `/api/auth/login` endpoint
- Stores user info in sessionStorage
- Redirects to OTP verification page on success

#### `otp-verify.html` (NEW)
- 6 input fields for OTP digits
- Auto-focus between fields
- Paste support for full OTP code
- 10-minute countdown timer
- Resend OTP functionality (max 3 attempts)
- Communicates with `/api/auth/verify-otp` endpoint
- Stores JWT token in localStorage on success

## API Endpoints

### 1. POST `/api/auth/login`
**Request:**
```json
{
  "username": "employee1",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "message": "OTP sent to registered email",
  "userId": 1,
  "email": "employee1@company.com",
  "requiresOTP": true
}
```

**Response (Failure):**
```json
{
  "message": "Invalid password"
}
```

### 2. POST `/api/auth/verify-otp`
**Request:**
```json
{
  "userId": 1,
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "employee",
  "userId": 1
}
```

**Response (Failure):**
```json
{
  "message": "Invalid OTP"
}
```

## Testing the Feature

### Test Credentials:
- **Employee**: username: `employee1`, password: `password123`
- **Manager**: username: `manager1`, password: `managerpass`

### Testing Steps:
1. Navigate to login page
2. Enter test credentials
3. Check server console for OTP (currently logged to console)
4. Copy OTP and enter in verification page
5. Successfully redirected to dashboard

## OTP Codes for Testing:
When you submit the login form, the OTP will be logged to the server console:
```
OTP for user employee1: 123456
```

Copy this code and paste it into the OTP verification page within 10 minutes.

## Production Considerations

### 1. Email Service Integration
Replace console logging with an actual email service:
```javascript
// Example using nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

await transporter.sendMail({
  to: user.email,
  subject: 'Your OTP for ESS Login',
  html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
});
```

### 2. Redis Integration
Replace in-memory OTP storage with Redis for distributed systems:
```javascript
const redis = require('redis');
const client = redis.createClient();

// Store OTP
await client.setex(`otp:${userId}`, 600, otp);

// Retrieve OTP
const storedOTP = await client.get(`otp:${userId}`);
```

### 3. OTP Method Options
Consider offering multiple delivery methods:
- Email (current)
- SMS (requires Twilio or similar)
- Authenticator App (Google Authenticator, Microsoft Authenticator)

### 4. Rate Limiting
Add rate limiting to prevent brute force attacks:
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

router.post('/login', loginLimiter, login);
```

### 5. Environment Variables
Secure sensitive data:
```
JWT_SECRET=your-secret-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
REDIS_URL=redis://localhost:6379
OTP_EXPIRY=600 (10 minutes in seconds)
```

## Files Modified/Created

### Modified:
- `ess-backend/controllers/authController.js` - Added OTP generation and verification logic
- `ess-backend/routes/auth.js` - Added verify-otp endpoint
- `LoginUI/login.html` - Updated to support OTP flow

### Created:
- `LoginUI/otp-verify.html` - OTP verification page
- `OTP_FEATURE.md` - This documentation file

## Troubleshooting

### Issue: OTP not appearing in console
- **Solution**: Ensure server is running on port 5000
- **Check**: `node server.js` in ess-backend directory

### Issue: OTP page not loading
- **Solution**: Check userId is passed in URL and sessionStorage
- **Check**: Browser console for errors

### Issue: "OTP expired" error
- **Solution**: OTP expires after 10 minutes, request a new one
- **Check**: Check system time synchronization

### Issue: CORS errors
- **Solution**: Ensure CORS is enabled in server.js
- **Check**: `app.use(cors())` is present in server.js

## Future Enhancements

1. **Biometric OTP**: Support fingerprint/face recognition for OTP bypass
2. **OTP History**: Track OTP usage for security audits
3. **Device Trust**: Remember trusted devices to skip OTP
4. **Backup Codes**: Generate backup codes for account recovery
5. **SMS Fallback**: Send OTP via SMS if email fails
6. **IP Whitelisting**: Skip OTP for trusted IP addresses
