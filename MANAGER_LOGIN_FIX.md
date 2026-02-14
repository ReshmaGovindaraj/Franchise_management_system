# Quick Reference: Manager Login Fixes

## Root Causes & Solutions

### Issue 1: Sessions Not Persisting (401 on current-user)
```diff
// backend/server.js - BEFORE
app.use(cors());

// backend/server.js - AFTER  
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
```
⚠️ **Critical**: Without `credentials: true`, session cookies aren't sent!

---

### Issue 2: Axios Not Sending Cookies
```diff
// frontend/src/App.js - BEFORE
import axios from 'axios';
import Login from './pages/Login';

// frontend/src/App.js - AFTER
import axios from 'axios';
import Login from './pages/Login';

// Configure axios to send credentials (cookies) with all requests
axios.defaults.withCredentials = true;
```
⚠️ **Critical**: Without this, every request from React loses the session!

---

### Issue 3: Branch Dashboard 500 Error
**Root Cause**: Missing branch validation before accessing `branch.name`

```diff
// dashboard controller getBranchDashboard - BEFORE
const branch = await Branch.findById(branchId);
const totalStaff = await Staff.countDocuments...
// If branch is null, accessing branch.name crashes!

// dashboard controller getBranchDashboard - AFTER
const branch = await Branch.findById(branchId);
if (!branch) {
  return res.status(404).json({ message: 'Branch not found' });
}
const totalStaff = await Staff.countDocuments...
```

---

### Issue 4: No Error Feedback to User
```diff
// frontend/src/pages/ManagerDashboard.js - BEFORE
if (!dashboardData) {
  return <div className="loading">Loading...</div>;
}

// frontend/src/pages/ManagerDashboard.js - AFTER
if (loading) {
  return <div className="loading">Loading dashboard...</div>;
}

if (error) {
  return <div className="alert alert-error">
    <strong>Error:</strong> {error}
    <p>Debug Info:</p>
    <p>User Role: {user?.role}</p>
    <p>Branch ID: {user?.branch?._id}</p>
  </div>;
}
```

---

## Step-by-Step Test Flow

1. **Frontend App.js loads**
   - ✅ Sets `axios.defaults.withCredentials = true`
   - ✅ Calls `/api/auth/current-user` (no session yet → 401, redirect to login)

2. **Manager enters credentials and clicks Login**
   - ✅ POST `/api/auth/login` with `withCredentials: true`
   - ✅ Backend validates email/password
   - ✅ Backend creates session with userId, role, branch
   - ✅ Session cookie sent to browser
   - ✅ Browser stores session cookie (due to CORS `credentials: true`)

3. **Redirect to manager-dashboard triggers**
   - ✅ App.js re-checks auth via `/api/auth/current-user`
   - ✅ Browser sends session cookie automatically (due to `withCredentials`)
   - ✅ Backend validates session exists (req.session.userId is set)
   - ✅ Returns user object with role "Branch Manager"

4. **ManagerDashboard component mounts**
   - ✅ Extracts branchId from user.branch
   - ✅ Calls `/api/dashboard/branch/summary?branchId=<ID>`
   - ✅ Browser sends session cookie
   - ✅ Backend validates session (isBranchManager middleware)
   - ✅ Returns dashboard data

---

## Demo Credentials

```
Admin:
  Email: admin@example.com
  Password: password123
  
Manager 1:
  Email: manager1@example.com
  Password: password123
  
Manager 2:
  Email: manager2@example.com
  Password: password123
```

---

## Verification Checklist

| Step | Expected | How to Verify |
|------|----------|--------------|
| Manager login submits | 200 response with user data | Network tab: `/api/auth/login` |
| Session stored | Session cookie in browser | Application tab: Cookies → localhost |
| Current user check | 200 response with role | Network tab: `/api/auth/current-user` |
| Dashboard loads | 200 response with branch data | Network tab: `/api/dashboard/branch/summary` |
| UI renders | Dashboard visible with stats | Browser shows branch name, staff count, etc. |

---

## Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 on current-user | Session not persisting | Check CORS has `credentials: true` |
| 401 on current-user (2nd) | withCredentials missing on axios | Check `axios.defaults.withCredentials = true` in App.js |
| 500 on dashboard | Branch not found | Verify manager has branch_id in DB |
| Infinite loading | API call pending | Check backend running on 5000 |
| "Loading..." forever | Error not shown | Check browser console for JS errors |

---

## Files Changed

1. ✅ **backend/server.js** - CORS configuration
2. ✅ **frontend/src/App.js** - Axios defaults + role handling  
3. ✅ **frontend/src/pages/Login.js** - withCredentials + logging
4. ✅ **frontend/src/pages/ManagerDashboard.js** - Error handling
5. ✅ **backend/controllers/authController.js** - Debug logging
6. ✅ **backend/controllers/dashboardController.js** - Branch validation

---

## Next Steps

1. Restart backend: `cd backend && npm run dev`
2. Restart frontend: `cd frontend && npm start`
3. Test manager login with `manager1@example.com`
4. Check browser console (F12) for errors
5. If issues persist, share backend console output
