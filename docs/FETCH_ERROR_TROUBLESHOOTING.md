# Failed to Fetch Error - Troubleshooting Guide

## Problem
"Failed to fetch" error when pressing the Clock In button.

## Root Causes & Solutions

### 1. ✅ **Backend Server Not Running**
**Check if backend is running:**
```bash
# Navigate to backend directory
cd backend

# Start the server
node src/server.js
```
You should see: `✓ Server running on port 5000`

---

### 2. ✅ **CORS Configuration Issue**
**Fixed:** Updated `backend/src/server.js` to allow multiple origins:
- `http://localhost:5000` (local file)
- `http://localhost:3000` (development)
- `http://127.0.0.1:5000`
- `file://` protocol

---

### 3. ✅ **Frontend API Configuration**
**Verify:** Check `frontend/src/scripts/geolocationService.js`
- API_BASE should be: `http://localhost:5000/api`
- Endpoint: `${API_BASE}/attendance/time-in`

---

### 4. ✅ **Browser Console Debugging**
**Check browser console for detailed errors:**
1. Open DevTools (F12)
2. Go to Console tab
3. Try Clock In again
4. Look for:
   - Network error messages
   - CORS errors
   - Geolocation permission denied
   - JSON parsing errors

---

### 5. ✅ **Geolocation Permission**
**Browser may be blocking location access:**
- Check browser permission settings for location
- Allow location access for this application
- Error message will show: "Location permission denied..."

---

### 6. ✅ **Network Request Details**
**If still failing, check:**
1. Open DevTools → Network tab
2. Click Clock In
3. Look for `time-in` request
4. Check:
   - Status code (should be 201 for success)
   - Request payload
   - Response data

---

## Testing Checklist

- [ ] Backend server running on port 5000
- [ ] CORS headers are set correctly
- [ ] Browser allows geolocation
- [ ] API endpoint responds (test with curl):
```bash
curl -X POST http://localhost:5000/api/health
```
- [ ] Frontend loads geolocationService.js
- [ ] Network tab shows successful request (201/200 status)
- [ ] Console shows no errors

---

## Recent Changes Made

1. **Enhanced CORS Configuration** in `backend/src/server.js`
   - Added explicit origin array
   - Added allowed methods and headers

2. **Improved Error Handling** in `frontend/src/scripts/geolocationService.js`
   - Better error messages in console
   - Handles non-JSON responses
   - Detailed logging for debugging

3. **Added Health Check Endpoint**
   - Test endpoint: `GET /api/health`
   - Returns: `{ status: 'OK', message: 'Server is running' }`

---

## Quick Test Command

```bash
# Test backend health
curl -X GET http://localhost:5000/api/health

# Should respond:
# {"status":"OK","message":"Server is running"}
```

---

## If Still Not Working

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh page** (Ctrl+Shift+R)
3. **Check firewall** - Port 5000 may be blocked
4. **Check console output** for specific error messages
5. **Restart backend server**

---

## Contact / Debug Info
- Backend Server: `http://localhost:5000`
- Frontend API Base: `http://localhost:5000/api`
- Attendance endpoints:
  - POST `/api/attendance/time-in`
  - POST `/api/attendance/time-out`
