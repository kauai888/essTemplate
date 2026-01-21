# Project Refactoring Migration Guide

## Overview

This document explains the refactoring changes made to the ESS project structure and provides guidance on updating your code.

## What Changed

### Directory Structure

**Before:**
```
ESS.v1.2/
├── pages/
├── scripts/
├── styles/
├── ess-backend/
├── TestFiles/
└── [Documentation files in root]
```

**After:**
```
ESS.v1.2/
├── frontend/
│   ├── public/          (contains old pages/)
│   ├── src/
│   │   ├── scripts/
│   │   ├── styles/
│   │   └── config/
│   └── .env.example
│
├── backend/
│   ├── src/             (contains old ess-backend/)
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   └── .env.example
│
├── docs/                (all documentation)
├── tests/               (TestFiles/)
└── PROJECT_STRUCTURE.md
```

## File Migration Map

### Frontend Files

| Old Path | New Path |
|----------|----------|
| `pages/index.html` | `frontend/public/index.html` |
| `pages/login.html` | `frontend/public/login.html` |
| `pages/admin.html` | `frontend/public/admin.html` |
| `pages/approver.html` | `frontend/public/approver.html` |
| `scripts/main.js` | `frontend/src/scripts/main.js` |
| `scripts/login.js` | `frontend/src/scripts/login.js` |
| `scripts/admin.js` | `frontend/src/scripts/admin.js` |
| `styles/dashboardStyle.css` | `frontend/src/styles/dashboardStyle.css` |
| `styles/loginStyle.css` | `frontend/src/styles/loginStyle.css` |

### Backend Files

| Old Path | New Path |
|----------|----------|
| `ess-backend/server.js` | `backend/src/server.js` |
| `ess-backend/controllers/` | `backend/src/controllers/` |
| `ess-backend/models/` | `backend/src/models/` |
| `ess-backend/routes/` | `backend/src/routes/` |
| `ess-backend/services/` | `backend/src/services/` |

### New Files (Added)

| Path | Purpose |
|------|---------|
| `backend/src/middleware/auth.js` | Authentication middleware |
| `backend/src/middleware/errorHandler.js` | Error handling |
| `backend/src/middleware/validation.js` | Request validation |
| `backend/src/utils/jwt.js` | JWT utilities |
| `backend/src/utils/password.js` | Password utilities |
| `backend/src/utils/response.js` | Response formatting |
| `backend/src/config/app.js` | App configuration |
| `backend/src/config/database.js` | Database configuration |
| `frontend/src/config/app-config.js` | Frontend configuration |
| `backend/.env.example` | Backend environment template |
| `frontend/.env.example` | Frontend environment template |

### Documentation Migration

| Old Path | New Path |
|----------|----------|
| `ADMIN_AUTHENTICATION.md` | `docs/ADMIN_AUTHENTICATION.md` |
| `ADMIN_PANEL_README.md` | `docs/ADMIN_PANEL_README.md` |
| All other `.md` files | `docs/` |

### Test Files

| Old Path | New Path |
|----------|----------|
| `TestFiles/admin-setup-helper.html` | `tests/admin-setup-helper.html` |

## Updating Your Code

### Frontend HTML Updates

Update script and CSS references in HTML files:

**Old:**
```html
<script src="../scripts/main.js"></script>
<link rel="stylesheet" href="../styles/dashboardStyle.css">
```

**New:**
```html
<!-- Path depends on where public/ is served from -->
<script src="./scripts/main.js"></script>
<link rel="stylesheet" href="./styles/dashboardStyle.css">
```

Or if using a build tool, import from src/:
```html
<script type="module" src="../src/scripts/main.js"></script>
```

### Backend Import Updates

Update require() paths in backend files:

**Old:**
```javascript
const config = require('./config');
const authRoute = require('./routes/auth');
```

**New:**
```javascript
const config = require('./config/app');
const authRoute = require('./routes/auth');
const { verifyToken, isAdmin } = require('./middleware/auth');
const { successResponse, errorResponse } = require('./utils/response');
```

### Using New Middleware

In your route files:

```javascript
const express = require('express');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validateRequest, sanitizeInput } = require('../middleware/validation');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Protected route
router.get('/admin/users', 
  sanitizeInput,
  verifyToken,
  isAdmin,
  asyncHandler(async (req, res) => {
    // Your controller logic
  })
);

module.exports = router;
```

### Using New Utilities

**JWT Utilities:**
```javascript
const { generateToken, verifyToken } = require('../utils/jwt');

const token = generateToken({ userId: user.id, role: user.role });
const decoded = verifyToken(token);
```

**Password Utilities:**
```javascript
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');

const validation = validatePasswordStrength(password);
const hashedPassword = await hashPassword(password);
const isValid = await comparePassword(password, hashedPassword);
```

**Response Utilities:**
```javascript
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');

// Success response
successResponse(res, { id: 1, name: 'John' }, 'User created', 201);

// Error response
errorResponse(res, 'Invalid credentials', 401);

// Paginated response
paginatedResponse(res, users, totalCount, page, limit, 'Users fetched');
```

### Environment Variables

**Backend (.env):**
```bash
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_NAME=ess_dev
JWT_SECRET=your-secret-key
```

**Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GEOLOCATION_ENABLED=true
```

## Configuration Files

### Backend Configuration

Access config in your controllers:

```javascript
const config = require('../config/app');

const maxAttempts = config.security.maxLoginAttempts;
const jwtSecret = config.jwt.secret;
const dbConfig = require('../config/database');
```

### Frontend Configuration

```javascript
import config from '../config/app-config.js';

const apiUrl = config.api.baseURL;
const tokenKey = config.localStorage.tokenKey;
```

## Server.js Updates

If your old `ess-backend/server.js` needs updating:

**Old:**
```javascript
const express = require('express');
const app = express();

app.use(require('./routes/auth'));
app.use(require('./routes/attendance'));
```

**New:**
```javascript
const express = require('express');
const config = require('./config/app');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/admin', require('./routes/admin'));

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.app.port, () => {
  console.log(`Server running on port ${config.app.port}`);
});
```

## Package.json Updates

### Backend package.json

Add new dependencies:
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5"
  },
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  }
}
```

### Frontend package.json (Optional)

```json
{
  "name": "ess-frontend",
  "version": "1.2.0",
  "scripts": {
    "start": "http-server public",
    "build": "echo 'No build needed for vanilla JS'"
  }
}
```

## Testing Updates

Update test references:

**Old:**
```javascript
const authController = require('../../controllers/authController');
```

**New:**
```javascript
const authController = require('../../src/controllers/authController');
```

## Git Workflow

After refactoring:

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "refactor: reorganize project structure with middleware and utilities"

# Push
git push origin main
```

## Cleanup

Once all imports are updated:

```bash
# Remove old directories
rm -rf pages scripts styles ess-backend TestFiles

# Remove old markdown files (already in docs/)
rm -f ADMIN_*.md BACKEND_*.md GEOLOCATION_*.md LOCATION_*.md OTP_*.md

# Verify structure
ls -la
```

## Troubleshooting

### Issue: Files not found after migration

**Solution:** Check that import paths are relative to the new file location.

```javascript
// ✅ Correct - from backend/src/routes/admin.js
const config = require('../config/app');
const { isAdmin } = require('../middleware/auth');

// ❌ Wrong - won't find files
const config = require('./config/app');
```

### Issue: Frontend scripts not loading

**Solution:** Ensure HTML script tags reference correct paths from `frontend/public/`:

```html
<!-- ✅ Correct -->
<script src="./scripts/main.js"></script>

<!-- ❌ Wrong -->
<script src="../scripts/main.js"></script>
```

### Issue: Environment variables not loading

**Solution:** Ensure `.env` file is in correct directory and loaded before use:

```javascript
// At top of server.js (before all other requires)
require('dotenv').config();

const config = require('./config/app');
```

## Benefits of New Structure

✅ **Clear separation** between frontend and backend
✅ **Organized middleware** for reusable functionality
✅ **Centralized configuration** for easier management
✅ **Utility functions** reduce code duplication
✅ **Better scalability** as project grows
✅ **Improved maintainability** with logical organization
✅ **Environment management** with .env files
✅ **Error handling** standardized across app

## Next Steps

1. ✅ Review this migration guide
2. ✅ Update all import statements
3. ✅ Test frontend and backend
4. ✅ Update documentation as needed
5. ✅ Commit changes to git
6. ✅ Deploy to production when ready

---

**For questions or issues, refer to:**
- `docs/` - All documentation
- `PROJECT_STRUCTURE.md` - Project structure overview
- Backend README in `backend/` directory
