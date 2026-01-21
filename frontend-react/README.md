# ESS React Frontend

Employee Self-Service (ESS) System - A modern React-based frontend for employee attendance, leave management, and administration.

## Features

- **Authentication**: Login with OTP verification
- **Attendance Tracking**: Clock in/out with geolocation
- **Admin Dashboard**: Manage users, announcements, and leave requests
- **Leave Management**: Request and track leave
- **Real-time Updates**: Live time display and attendance status
- **Responsive Design**: Mobile-friendly interface

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Navigate to the project directory:
```bash
cd frontend-react
```

2. Install dependencies:
```bash
npm install
```


3. Configure environment variables:
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Project Structure

```
frontend-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── OTPVerify.js
│   │   ├── Dashboard.js
│   │   └── Admin.js
│   ├── services/
│   │   ├── apiClient.js
│   │   └── index.js
│   ├── styles/
│   │   └── main.css
│   ├── App.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. All API calls are made through services in the `src/services/` directory:

- **authService**: Login and OTP verification
- **attendanceService**: Clock in/out and attendance records
- **adminService**: User and announcement management
- **leaveService**: Leave request handling
- **geolocationService**: Geolocation and address lookup

## Authentication Flow

1. User enters username and password
2. Backend sends OTP to email
3. User enters OTP code
4. User is authenticated and token is stored
5. Subsequent requests include the token in headers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved © 2026 Employee Self-Service System
