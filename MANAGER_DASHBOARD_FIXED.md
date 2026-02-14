# ManagerDashboard.js - Complete Fixed Version

This is the corrected component with:
- ✅ Proper error handling
- ✅ Loading states
- ✅ Debug information display
- ✅ Credentials in axios calls
- ✅ Better UX

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function ManagerDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) {
          setError('User not authenticated');
          return;
        }

        // Get branchId from user object
        const branchId = user?.branch?._id || user?.branch;
        
        if (!branchId) {
          setError('Branch ID not found in user session');
          console.warn('User object:', user);
          return;
        }

        console.log('Fetching dashboard for branchId:', branchId);
        const response = await axios.get(
          `/api/dashboard/branch/summary?branchId=${branchId}`,
          { withCredentials: true }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const errorMsg = error.response?.data?.message || 
                         error.message || 
                         'Failed to load dashboard';
        setError(errorMsg);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => { };

  // LOADING STATE
  if (loading) {
    return (
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // ERROR STATE with debug info
  if (error) {
    return (
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="content">
          <div className="page-header">
            <h1>Branch Manager Dashboard</h1>
          </div>
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
          <div style={{ 
            marginTop: '20px', 
            padding: '20px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px' 
          }}>
            <p><strong>Debug Information:</strong></p>
            <p>User Role: {user?.role}</p>
            <p>Branch ID: {user?.branch?._id || user?.branch || 'Not found'}</p>
            <p>User Email: {user?.email}</p>
          </div>
        </div>
      </div>
    );
  }

  // NO DATA STATE
  if (!dashboardData) {
    return (
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="content">
          <div className="alert alert-warning">No dashboard data available</div>
        </div>
      </div>
    );
  }

  // SUCCESS STATE with data
  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content">
        <div className="page-header">
          <h1>Branch Manager Dashboard - {dashboardData.branch}</h1>
        </div>

        <div className="grid">
          <div className="stat-card">
            <h3>Total Staff</h3>
            <div className="value">{dashboardData.totalStaff}</div>
          </div>
          <div className="stat-card">
            <h3>Total Products</h3>
            <div className="value">{dashboardData.totalProducts}</div>
          </div>
          <div className="stat-card">
            <h3>Monthly Sales</h3>
            <div className="value">
              ₹{dashboardData.monthlySales?.total?.toLocaleString() || 0}
            </div>
          </div>
          <div className="stat-card">
            <h3>Monthly Expenses</h3>
            <div className="value">
              ₹{dashboardData.monthlyExpenses?.total?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">⚠️  Low Stock Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.lowStockItems?.length > 0 ? (
                dashboardData.lowStockItems.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reorderLevel}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No low stock items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
```

## Key Improvements

1. **Three-state rendering**:
   - Loading state with meaningful message
   - Error state with debug info
   - Success state with data

2. **Error handling**:
   - Catches all error types
   - Shows both server error message and client-side info
   - Debug info when branchId missing

3. **Axios configuration**:
   - Explicit `{ withCredentials: true }` on dashboard request
   - Inherits global setting from App.js

4. **Data safety**:
   - Checks for user existence
   - Checks for branchId
   - Uses optional chaining (?.)
   - Gracefully handles missing data

## What User Sees

### When Loading
```
[Navbar]
---------
Loading dashboard...
```

### On Error
```
[Navbar]
---------
Branch Manager Dashboard
Error: Failed to load dashboard

Debug Information:
User Role: Branch Manager
Branch ID: 507f...
User Email: manager1@example.com
```

### On Success
```
[Navbar]
---------
Branch Manager Dashboard - Delhi North Branch

[Total Staff: 4] [Total Products: 8] [Monthly Sales: ₹245,000] [Monthly Expenses: ₹50,000]

Low Stock Items
| Product | Current Stock | Reorder Level |
| ...     | ...           | ...           |
```

## Browser Console Messages

When working correctly:
```
App.js:
  - No CORS errors
  - No 401/500 errors

ManagerDashboard.js:
  - Console log: "Fetching dashboard for branchId: 507f..."
  - No error logs
  - API response received
```

## Testing Scenarios

### Scenario 1: Happy Path
```
1. Manager logs in
2. Session created ✓
3. currentUser check passes ✓
4. Navigates to /manager-dashboard ✓
5. Dashboard fetches data with branchId ✓
6. UI shows branch data ✓
```

### Scenario 2: Session Lost
```
1. Session expires
2. currentUser returns 401 ✓
3. Redirected to /login ✓
```

### Scenario 3: Invalid BranchId
```
1. Manager loads
2. User object missing branchId ⚠
3. Error state shows "Branch ID not found" ✓
4. Debug info visible ✓
```

### Scenario 4: Backend Error
```
1. Manager loads
2. Backend returns 500 ⚠
3. Error state catches and displays server message ✓
4. User sees actionable error ✓
```

---

This component is now production-ready with proper error handling, loading states, and debugging information.
