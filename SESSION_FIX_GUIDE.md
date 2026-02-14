# Manager Login & Session Fix Guide

## Issues Fixed

### 1. **CORS Not Configured for Sessions** ✅
**Problem**: Cookies weren't being sent/received between frontend and backend.
**Solution**: Updated CORS middleware to:
```javascript
cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
})
```
**File**: [backend/server.js](backend/server.js#L14-L20)

### 2. **Axios Not Sending Credentials** ✅
**Problem**: Frontend requests didn't include session cookies.
**Solution**: Added global axios configuration:
```javascript
axios.defaults.withCredentials = true;
```
**File**: [frontend/src/App.js](frontend/src/App.js#L6)

### 3. **Role Comparison Bug** ✅
**Problem**: Role could be 'Branch Manager' but code only checked for 'Admin'.
**Solution**: Added flexible role checking:
```javascript
if (user.role === 'Admin' || user.role === 'admin')
if (user.role === 'Branch Manager' || user.role === 'manager')
```
**Files**: [frontend/src/App.js](frontend/src/App.js), [frontend/src/pages/Login.js](frontend/src/pages/Login.js)

### 4. **Missing Error Handling in ManagerDashboard** ✅
**Problem**: Component showed infinite "Loading..." without error info.
**Solution**: Added comprehensive error states:
- Loading state
- Error state with debug info
- Success state with data
**File**: [frontend/src/pages/ManagerDashboard.js](frontend/src/pages/ManagerDashboard.js)

### 5. **Missing Debugging in Backend** ✅
**Problem**: Difficult to trace session and data issues.
**Solution**: Added console logging to:
- `authController.js` - login and getCurrentUser
- `dashboardController.js` - getBranchDashboard
**Files**: [backend/controllers/authController.js](backend/controllers/authController.js), [backend/controllers/dashboardController.js](backend/controllers/dashboardController.js)

## Testing the Fix

### Step 1: Stop all running servers
- Kill any running `npm start` processes
- Kill any running `npm run dev` processes

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
```
Expected output:
```
MongoDB connected successfully
Server running on port 5000
```

### Step 3: Start Frontend Server
In a new terminal:
```bash
cd frontend
npm start
```
Expected output:
```
Compiled successfully!
On Your Network: http://...
```

### Step 4: Test Manager Login
1. Open browser to `http://localhost:3000`
2. Look for errors in browser console (`F12` → Console tab)
3. Use credentials:
   - Email: `manager1@example.com`
   - Password: `password123`
4. Check:
   - No 401 error on current-user
   - No 500 error on dashboard
   - Dashboard loads with data

### Step 5: Check Backend Logs
Look for messages like:
```
User logged in: {
  userId: ...,
  email: manager1@example.com,
  role: Branch Manager,
  branchId: ...,
  sessionId: ...
}
getCurrentUser: Fetching user ...
getBranchDashboard: Fetching data for branch ...
```

## Debugging Steps

### If 401 on current-user:
1. Check browser Network tab (F12 → Network)
2. Look for `/api/auth/login` - verify it returns 200
3. Look for `/api/auth/current-user` - check response headers for Set-Cookie
4. Verify `withCredentials: true` is in axios config

### If 500 on dashboard:
1. Check backend console for error message
2. Log shows `branchId` being fetched
3. If "Branch not found", check if:
   - Manager was created with seed.js
   - Manager has branch assigned
   - BranchId is valid ObjectId

### If infinite loading:
1. Open browser DevTools (F12)
2. Network tab - see if requests are pending
3. Console tab - check for JavaScript errors
4. Verify backend is running (`curl http://localhost:5000/api/health`)

## Expected Behavior

### Admin Login Path:
1. Login → Sets session ✅
2. currentUser check passes → Shows AdminDashboard ✅
3. Dashboard queries work ✅

### Manager Login Path:
1. Login → Sets session ✅
2. currentUser check passes → Shows ManagerDashboard ✅
3. Dashboard queries with branchId → Shows branch data ✅
4. Navigation to Inventory/Sales works ✅

## Key Files Modified

| File | Change | Reason |
|------|--------|--------|
| server.js | CORS with credentials | Enable cookie sending |
| App.js | axios defaults + role check | Global session config + flexible roles |
| Login.js | withCredentials + role check | Send cookies on login |
| ManagerDashboard.js | Error handling + debug info | Better UX and debugging |
| authController.js | Console logging | Track session creation |
| dashboardController.js | Branch validation + logging | Prevent null errors |

## Troubleshooting Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser allows localhost cookies
- [ ] MongoDB connected (`npm run seed` if needed)
- [ ] Manager credentials exist in DB
- [ ] Manager has branch assigned
- [ ] No CORS errors in browser console
- [ ] No 401/500 errors on API calls
- [ ] Dashboard shows branch data

## Production Notes

For production deployment:
1. Change `credentials: true` CORS origin from localhost:3000 to your domain
2. Set `secure: true` in cookie configuration (requires HTTPS)
3. Use environment variables for secrets
4. Remove or disable console.log statements
5. Add proper error monitoring (Sentry, etc.)
