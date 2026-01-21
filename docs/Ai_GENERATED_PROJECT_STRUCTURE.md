# ESS - Employee Self-Service System v1.2

A comprehensive Employee Self-Service platform with admin panel, attendance tracking, leave management, and announcements.

## 📁 Project Structure

```
ESS.v1.2/
├── docs/                          # Documentation
│   ├── ADMIN_AUTHENTICATION.md
│   ├── ADMIN_PANEL_README.md
│   ├── API_REFERENCE.md
│   ├── SETUP_GUIDE.md
│   └── ...
│
├── frontend/                       # Frontend Application
│   ├── public/                     # Static HTML files
│   │   ├── index.html              # Dashboard
│   │   ├── login.html              # Login page
│   │   ├── admin.html              # Admin panel
│   │   ├── approver.html           # Approver panel
│   │   └── otp-verify.html         # OTP verification
│   │
│   ├── src/
│   │   ├── scripts/                # JavaScript files
│   │   │   ├── main.js             # Main dashboard script
│   │   │   ├── login.js            # Login logic
│   │   │   ├── admin.js            # Admin panel logic
│   │   │   └── approver.js         # Approver logic
│   │   │
│   │   ├── styles/                 # CSS files
│   │   │   ├── dashboardStyle.css
│   │   │   ├── loginStyle.css
│   │   │   ├── AdminStyle.css
│   │   │   └── ApproverStyle.css
│   │   │
│   │   ├── config/
│   │   │   └── app-config.js       # Frontend configuration
│   │   │
│   │   └── assets/                 # Images, icons, etc.
│   │
│   ├── .env.example                # Environment variables template
│   └── package.json
│
├── backend/                        # Backend API
│   ├── src/
│   │   ├── controllers/            # Business logic
│   │   │   ├── authController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── adminController.js
│   │   │   └── ...
│   │   │
│   │   ├── models/                 # Database models
│   │   │   ├── userModels.js
│   │   │   ├── attendanceModels.js
│   │   │   └── ...
│   │   │
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.js
│   │   │   ├── attendance.js
│   │   │   ├── admin.js
│   │   │   └── ...
│   │   │
│   │   ├── services/               # Business services
│   │   │   ├── geolocationService.js
│   │   │   └── ...
│   │   │
│   │   ├── middleware/             # Custom middleware
│   │   │   ├── auth.js             # Authentication
│   │   │   ├── errorHandler.js     # Error handling
│   │   │   ├── validation.js       # Request validation
│   │   │   └── ...
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── jwt.js              # JWT utilities
│   │   │   ├── password.js         # Password utilities
│   │   │   ├── response.js         # Response formatting
│   │   │   └── ...
│   │   │
│   │   ├── config/                 # Configuration files
│   │   │   ├── app.js              # App config
│   │   │   ├── database.js         # Database config
│   │   │   └── ...
│   │   │
│   │   └── server.js               # Express server
│   │
│   ├── .env.example                # Environment variables template
│   ├── package.json
│   └── README.md                   # Backend documentation
│
├── tests/                          # Testing utilities
│   └── admin-setup-helper.html     # Admin setup helper for testing
│
├── Flowcharts/                     # System flowcharts
├── Images/                         # Project images
├── .gitignore
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn
- Database (PostgreSQL recommended)

### Backend Setup

1. **Clone and navigate:**
```bash
cd ESS.v1.2/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start server:**
```bash
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**
```bash
cd ESS.v1.2/frontend
```

2. **Setup environment (optional):**
```bash
cp .env.example .env
```

3. **Open in browser:**
Open `public/login.html` in your browser or serve with a local server:
```bash
npx http-server public
```

### Testing Without Backend

Use the admin setup helper to test locally:
1. Open `tests/admin-setup-helper.html` in your browser
2. Enter admin credentials
3. Click "Setup Admin Access"
4. Access the admin panel

## 📋 Features

### Admin Panel
- ✅ Employee management (create, read, update, delete)
- ✅ Attendance management and clock in/out editing
- ✅ Leave balance management
- ✅ Announcement management
- ✅ Role-based access control
- ✅ Search and filtering

### Employee Dashboard
- ✅ Clock in/out with geolocation
- ✅ Attendance history
- ✅ Leave requests and balance
- ✅ OTP verification
- ✅ Announcements feed

### Approver Panel
- ✅ Leave request approval
- ✅ Attendance verification
- ✅ Report generation

## 🔐 Authentication

### Roles
- `admin` - Full system access
- `employee` - Basic employee features
- `approver` - Leave and attendance approval

### Default Test Credentials
Use the admin setup helper to test:
- **Admin ID:** `ADMIN001`
- **Password:** `admin123`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Admin
- `GET /api/admin/employees` - List employees
- `POST /api/admin/employees` - Create employee
- `PUT /api/admin/employees/:id` - Update employee
- `DELETE /api/admin/employees/:id` - Delete employee
- `GET /api/admin/attendance` - List attendance
- `PUT /api/admin/attendance` - Update attendance
- `GET /api/admin/leave-balance` - List leave balances
- `GET /api/admin/announcements` - List announcements
- `POST /api/admin/announcements` - Create announcement

### Employee
- `GET /api/attendance/my-records` - My attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/leave/balance` - Leave balance
- `POST /api/leave/request` - Request leave
- `GET /api/announcements` - Get announcements

## 📝 Configuration

### Backend Configuration (`backend/src/config/`)

**app.js** - Application settings
- JWT configuration
- Security settings
- Feature flags
- CORS configuration

**database.js** - Database connection
- Development/Testing/Production configs
- Connection pooling
- Logging options

### Frontend Configuration (`frontend/src/config/`)

**app-config.js** - Client-side settings
- API base URL
- Feature toggles
- Storage keys
- Route mappings

## 🛡️ Security Features

- JWT authentication with token refresh
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- Error handling middleware
- CORS protection
- Rate limiting (configurable)

## 📚 Documentation

Detailed documentation in `/docs/`:

- **ADMIN_AUTHENTICATION.md** - Admin panel authentication guide
- **ADMIN_PANEL_README.md** - Admin panel features and usage
- **API_REFERENCE.md** - Complete API documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **BACKEND_INTEGRATION.md** - Backend integration guide

## 🧪 Testing

### Local Testing (No Backend)
1. Open `tests/admin-setup-helper.html`
2. Configure admin credentials
3. Access `frontend/public/admin.html`

### API Testing
Use Postman or similar tool to test endpoints:
1. Import `/docs/API_REFERENCE.md`
2. Set authorization headers
3. Test endpoints

### Unit Testing
```bash
cd backend
npm test
```

## 🚢 Deployment

### Frontend Deployment
- Build for production (if using a build tool)
- Deploy to static hosting (GitHub Pages, Netlify, Vercel)
- Configure API endpoints in `.env`

### Backend Deployment
- Set environment variables in production environment
- Use process manager (PM2, systemd, etc.)
- Configure database connection
- Enable SSL/HTTPS
- Setup logging and monitoring

## 📦 Dependencies

### Backend
- Express.js - Web framework
- jsonwebtoken - JWT handling
- bcryptjs - Password hashing
- sequelize - ORM (if using)
- cors - CORS middleware
- dotenv - Environment variables

### Frontend
- Vanilla JavaScript (no framework)
- HTML5
- CSS3
- No external dependencies

## 🤝 Contributing

1. Create a feature branch
2. Commit changes
3. Push to branch
4. Create a Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 👥 Support

For issues and questions:
1. Check `/docs/` for documentation
2. Review existing issues
3. Create a new issue with details

## 📞 Contact

- **Project Owner:** oneComa
- **Repository:** https://github.com/oneComa/ESS-v1.2

---

**Version:** 1.2.0
**Last Updated:** January 13, 2026
**Status:** Production Ready ✅
