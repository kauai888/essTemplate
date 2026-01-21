# ESS React Frontend - Advanced Features & Customization

## Additional Components You Can Add

### 1. Leave Request Form Component

```javascript
// src/components/LeaveRequestForm.js
import React, { useState } from 'react';
import { leaveService } from '../services';

const LeaveRequestForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    leave_type: 'casual',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await leaveService.requestLeave(formData);
      onSuccess?.();
      setFormData({ leave_type: 'casual', start_date: '', end_date: '', reason: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="form-group">
        <label>Leave Type</label>
        <select
          value={formData.leave_type}
          onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
        >
          <option value="casual">Casual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="earned">Earned Leave</option>
        </select>
      </div>

      <div className="form-group">
        <label>Start Date</label>
        <input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date</label>
        <input
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Reason</label>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData({...formData, reason: e.target.value})}
          placeholder="Enter reason for leave"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Request Leave'}
      </button>
    </form>
  );
};

export default LeaveRequestForm;
```

### 2. Attendance History Component

```javascript
// src/components/AttendanceHistory.js
import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services';

const AttendanceHistory = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttendance();
  }, [startDate, endDate]);

  const loadAttendance = async () => {
    try {
      const data = await attendanceService.getAttendanceRecords(startDate, endDate);
      setRecords(data.records || []);
    } catch (err) {
      setError('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Clock In</th>
          <th>Clock Out</th>
          <th>Hours Worked</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td>{new Date(record.attendance_date).toLocaleDateString()}</td>
            <td>{record.time_in ? new Date(record.time_in).toLocaleTimeString() : '-'}</td>
            <td>{record.time_out ? new Date(record.time_out).toLocaleTimeString() : '-'}</td>
            <td>{record.hours_worked?.toFixed(2) || '-'} hrs</td>
            <td>
              <span className={`status-badge status-${record.status}`}>
                {record.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AttendanceHistory;
```

### 3. User Profile Component

```javascript
// src/components/UserProfile.js
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-card">
      <h2>Profile Information</h2>
      
      <div className="profile-section">
        <div className="profile-field">
          <label>Employee ID</label>
          <p>{user.employee_id}</p>
        </div>
        
        <div className="profile-field">
          <label>Full Name</label>
          <p>{user.first_name} {user.last_name}</p>
        </div>
        
        <div className="profile-field">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
        
        <div className="profile-field">
          <label>Department</label>
          <p>{user.department}</p>
        </div>
        
        <div className="profile-field">
          <label>Designation</label>
          <p>{user.designation}</p>
        </div>
        
        <div className="profile-field">
          <label>Role</label>
          <p>{user.role}</p>
        </div>
      </div>
      
      <button 
        className="btn btn-primary"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? 'Cancel' : 'Edit Profile'}
      </button>
    </div>
  );
};

export default UserProfile;
```

## Adding New Pages

To add new pages to the application:

1. Create page file in `src/pages/`:
```javascript
// src/pages/YourNewPage.js
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const YourNewPage = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper">
      <h1>Your New Page</h1>
      {/* Page content */}
    </div>
  );
};

export default YourNewPage;
```

2. Add route in `src/App.js`:
```javascript
import YourNewPage from './pages/YourNewPage';

// Add to Routes:
<Route
  path="/your-new-page"
  element={
    <ProtectedRoute>
      <YourNewPage />
    </ProtectedRoute>
  }
/>
```

## Customizing Styles

The application uses CSS custom properties (variables). Edit `src/styles/main.css`:

```css
:root {
  /* Change primary color */
  --color-primary: #your-color;
  
  /* Change spacing */
  --spacing-lg: 20px;
  
  /* Change font */
  --font-family-body: "Your Font";
}
```

## Adding Authentication Checks

Use the `useAuth` hook to check user roles:

```javascript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, role } = useAuth();

  if (role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
};
```

## API Error Handling

The API client automatically handles common errors:

```javascript
import { attendanceService } from '../services';

try {
  await attendanceService.clockIn(lat, lon, address, accuracy);
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired - redirect to login
  } else if (error.response?.status === 403) {
    // Permission denied
  } else if (error.response?.status === 422) {
    // Validation error
    console.log(error.response.data.errors);
  }
}
```

## Optimization Tips

1. **Code Splitting**: Use React.lazy() for large components
2. **Memoization**: Use React.memo() for expensive components
3. **State Management**: Use Context API effectively
4. **CSS**: Minimize CSS files for production
5. **Images**: Optimize images before deployment

## Performance Monitoring

Add React DevTools:
```bash
npm install --save-dev react-devtools
```

## Building for Production

```bash
cd frontend-react
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

## Environment Variables

Available environment variables:

```
# API Configuration
REACT_APP_API_URL=                  # Backend API URL
REACT_APP_API_TIMEOUT=              # Request timeout

# Application
REACT_APP_APP_NAME=                 # App name
REACT_APP_VERSION=                  # App version

# Features
REACT_APP_ENABLE_GEOLOCATION=true   # Enable location features
REACT_APP_ENABLE_OTP=true           # Enable OTP
```

## Common Customizations

### Change Login Colors
In `src/pages/Login.js`, modify the gradient:
```javascript
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Add More Admin Tabs
In `src/pages/Admin.js`, add buttons and content sections:
```javascript
<button 
  className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
  onClick={() => setActiveTab('reports')}
>
  Reports
</button>
```

### Customize Toast Notifications
Replace alert divs with a toast library like `react-toastify`:
```bash
npm install react-toastify
```

## TypeScript Support (Optional)

To add TypeScript support:
```bash
npm install --save-dev typescript @types/react @types/react-dom
```

Then rename `.js` files to `.tsx`.

## Testing (Optional)

Add testing libraries:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## Further Customization

For more advanced features:
1. State management: Consider Redux or Zustand
2. Data visualization: Add Chart.js or Recharts
3. Form handling: Use React Hook Form
4. Validation: Use Yup or Zod
5. Notifications: Add react-toastify

---

**Happy Customizing! 🚀**
