# ESS (Employee Self-Service) System - Complete Setup & Integration Guide

## Overview

This document provides complete instructions for setting up and running the converted React-based ESS system with the existing Node.js/PostgreSQL backend.

## Project Structure

```
ESS.v1.2 - test/
├── backend/                    # Node.js/Express server
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   └── package.json
├── frontend-react/            # NEW: React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── styles/
│   ├── public/
│   ├── .env
│   └── package.json
├── ess_db.sql                 # Database schema
└── docs/                      # Documentation
```

## Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher (or yarn)
- **PostgreSQL**: v10 or higher
- **Git**: Optional but recommended

## Step 1: Database Setup

1. Create PostgreSQL database:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ess_db;

# Connect to the database
\c ess_db
```

2. Run the database schema:
```bash
# From the project root directory
psql -U postgres -d ess_db -f ess_db.sql
```

3. Verify the tables were created:
```bash
psql -U postgres -d ess_db
\dt  # List all tables
```

## Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env`):
```dotenv
# Server Configuration
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ess_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Geolocation Configuration
GEOFENCE_LATITUDE=40.7128
GEOFENCE_LONGITUDE=-74.0060
GEOFENCE_RADIUS=2
```

4. Start the backend server:
```bash
# Development with nodemon
npm run dev

# OR production
npm start
```

The backend should be running on `http://localhost:5000`

Verify with: `curl http://localhost:5000/api/health`

## Step 3: Frontend Setup

1. Navigate to frontend-react directory:
```bash
cd frontend-react
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env`):
```dotenv
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend should open automatically at `http://localhost:3000`

## Step 4: Access the Application

### Login Page
- URL: `http://localhost:3000/login`
- Test credentials: (configured in database)

### Employee Dashboard
- URL: `http://localhost:3000/` (after login)
- Features:
  - Clock in/out with geolocation
  - View today's attendance
  - See hours worked

### Admin Panel
- URL: `http://localhost:3000/admin` (admin/approver only)
- Features:
  - Manage users
  - View announcements
  - Approve/reject leave requests
  - View attendance records

## API Endpoints Reference

### Authentication
```
POST   /api/auth/login              - Login with credentials
POST   /api/auth/verify-otp         - Verify OTP
POST   /api/auth/logout             - Logout
GET    /api/auth/me                 - Get current user
```

### Attendance
```
POST   /api/attendance/clock-in     - Clock in
POST   /api/attendance/clock-out    - Clock out
GET    /api/attendance/today        - Get today's attendance
GET    /api/attendance/records      - Get attendance records
GET    /api/attendance/employee/:id - Get employee attendance
```

### Admin
```
GET    /api/admin/users             - Get all users
POST   /api/admin/users             - Create user
PUT    /api/admin/users/:id         - Update user
GET    /api/admin/users/:id         - Get user details

GET    /api/admin/announcements     - Get announcements
POST   /api/admin/announcements     - Create announcement
PUT    /api/admin/announcements/:id - Update announcement

GET    /api/admin/leave-requests    - Get leave requests
PUT    /api/admin/leave-requests/:id/approve  - Approve leave
PUT    /api/admin/leave-requests/:id/reject   - Reject leave

GET    /api/admin/attendance        - Get all attendance
GET    /api/admin/reports/department - Department reports
```

### Leave Management
```
GET    /api/leave/balance           - Get leave balance
POST   /api/leave/request           - Request leave
GET    /api/leave/requests          - Get user's leave requests
PUT    /api/leave/requests/:id/cancel - Cancel leave request
```

## Frontend Features

### Components Created

1. **Login Page** (`src/pages/Login.js`)
   - Username and password fields
   - Error handling and validation
   - Redirect to OTP on success

2. **OTP Verification** (`src/pages/OTPVerify.js`)
   - 6-digit OTP input
   - Timer with resend functionality
   - Error handling

3. **Dashboard** (`src/pages/Dashboard.js`)
   - Welcome greeting with date/time
   - Clock in/out with geolocation
   - Attendance summary cards
   - Real-time clock display

4. **Admin Panel** (`src/pages/Admin.js`)
   - User management table
   - Announcement management
   - Leave request approval/rejection
   - Attendance reports

### Services Created

1. **apiClient** (`src/services/apiClient.js`)
   - Axios configuration with interceptors
   - Automatic token attachment
   - Error handling and token refresh

2. **Services** (`src/services/index.js`)
   - `authService`: Authentication operations
   - `attendanceService`: Attendance tracking
   - `adminService`: Admin operations
   - `leaveService`: Leave management
   - `geolocationService`: Location and address handling

### State Management

- **AuthContext** (`src/context/AuthContext.js`)
  - Manages user authentication state
  - Handles login/logout/OTP verification
  - Stores token and user data

- **useAuth Hook** (`src/hooks/useAuth.js`)
  - Custom hook for accessing auth context
  - Geolocation hook for location services

### Routing

- `/login` - Login page (public)
- `/otp-verify/:userId` - OTP verification (public)
- `/` - Dashboard (protected)
- `/admin` - Admin panel (protected, role-based)

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process on port 5000
kill -9 <PID>
```

**Problem**: Database connection error
- Verify PostgreSQL is running
- Check DB credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

**Problem**: CORS errors
- Ensure backend CORS is configured for `http://localhost:3000`
- Check backend `.env` BASE_URL

### Frontend Issues

**Problem**: Geolocation not working
- Enable location permissions in browser
- Check that backend is running
- Verify `REACT_APP_API_URL` is correct

**Problem**: Login fails
- Check backend is running
- Verify test user exists in database
- Check backend logs for errors

**Problem**: Styling issues
- Clear browser cache: Ctrl+Shift+Delete
- Rebuild: `npm run build`
- Check `src/styles/main.css` is loaded

## Development Commands

### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests (if configured)
npm test
```

### Frontend
```bash
cd frontend-react

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build

# Run tests
npm test
```

## Production Deployment

### Build Frontend
```bash
cd frontend-react
npm run build
```

This creates a `build/` folder with optimized production files.

### Serve Built Frontend
```bash
# Using serve package
npm install -g serve
serve -s build -l 3000
```

### Backend Production
```bash
cd backend
NODE_ENV=production npm start
```

### Environment Variables for Production
Update `.env` files with production values:
- Secure JWT_SECRET
- Production database URL
- Production email service
- Production API URL

## Testing the System

1. **Test Login Flow**:
   - Go to `http://localhost:3000/login`
   - Enter credentials
   - Verify OTP received
   - Confirm redirect to dashboard

2. **Test Clock In/Out**:
   - Click "Clock In" on dashboard
   - Allow geolocation permission
   - Verify success message
   - Check attendance record

3. **Test Admin Panel**:
   - Login as admin
   - Navigate to admin panel
   - Manage users and leave requests

## Key Files Modified/Created

### Backend (No changes needed)
The backend API remains unchanged and fully compatible.

### Frontend (NEW)
- `frontend-react/src/App.js` - Main React app with routing
- `frontend-react/src/index.js` - React entry point
- `frontend-react/package.json` - React dependencies
- `frontend-react/public/index.html` - HTML template
- All component files in `src/pages/`, `src/components/`
- Service files in `src/services/`
- Context files in `src/context/`

## Support & Documentation

For more information:
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- Backend API Reference: `docs/API_REFERENCE.md`

## Next Steps

1. ✅ Setup database
2. ✅ Configure and start backend
3. ✅ Configure and start frontend
4. ✅ Test authentication flow
5. ✅ Test attendance features
6. ✅ Test admin panel
7. Deploy to production

---

**Last Updated**: January 2026
**Version**: 1.2.0 (React)
