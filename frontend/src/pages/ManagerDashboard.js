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
        const response = await axios.get(`/api/dashboard/branch/summary?branchId=${branchId}`, {
          withCredentials: true
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to load dashboard';
        setError(errorMsg);
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = () => { };

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
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <p><strong>Debug Info:</strong></p>
            <p>User Role: {user?.role}</p>
            <p>Branch ID: {user?.branch?._id || user?.branch || 'Not found'}</p>
            <p>User Email: {user?.email}</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="value">₹{dashboardData.monthlySales?.total?.toLocaleString() || 0}</div>
          </div>
          <div className="stat-card">
            <h3>Monthly Expenses</h3>
            <div className="value">₹{dashboardData.monthlyExpenses?.total?.toLocaleString() || 0}</div>
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
                  <td colSpan="3" style={{ textAlign: 'center' }}>No low stock items</td>
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
