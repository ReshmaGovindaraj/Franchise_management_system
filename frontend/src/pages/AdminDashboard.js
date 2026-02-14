import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Dashboard.css';

function AdminDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [branchComparison, setBranchComparison] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashResponse, chartResponse, branchResponse] = await Promise.all([
          axios.get('/api/dashboard/admin/summary'),
          axios.get('/api/dashboard/sales-trend'),
          axios.get('/api/dashboard/admin/branch-comparison')
        ]);

        setDashboardData(dashResponse.data);
        // Normalize monthly trend data: convert _id {year, month} to a readable `month` string
        const normalizedChart = (chartResponse.data || []).map(item => {
          const year = item._id?.year || new Date().getFullYear();
          const month = item._id?.month || 0;
          // Format like "YYYY-MM"
          const monthLabel = `${year}-${String(month).padStart(2, '0')}`;
          return { ...item, month: monthLabel };
        });

        // Normalize branch comparison: extract branch name to `branchName`
        const normalizedBranch = (branchResponse.data || []).map(item => ({
          ...item,
          branchName: item.branchDetails && item.branchDetails[0] ? item.branchDetails[0].name : 'N/A'
        }));

        setChartData(normalizedChart);
        setBranchComparison(normalizedBranch);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleLogout = () => {
    // Handle logout
  };

  if (!dashboardData) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="content">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid">
          <div className="stat-card">
            <h3>Total Branches</h3>
            <div className="value">{dashboardData.totalBranches}</div>
          </div>
          <div className="stat-card">
            <h3>Active Branches</h3>
            <div className="value">{dashboardData.activeBranches}</div>
          </div>
          <div className="stat-card">
            <h3>Total Staff</h3>
            <div className="value">{dashboardData.totalStaff}</div>
          </div>
          <div className="stat-card">
            <h3>Monthly Sales</h3>
            <div className="value">₹{dashboardData.monthlySales?.total?.toLocaleString() || 0}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid">
          <div className="card">
            <div className="card-header">Monthly Sales Trend</div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalSales" stroke="#007bff" name="Sales Amount" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-header">Branch Comparison</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchComparison.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branchName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#28a745" name="Total Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="card">
          <div className="card-header">Top Selling Products</div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topSellingProducts?.map((product, index) => (
                <tr key={index}>
                  <td>{product.productDetails?.[0]?.name || 'N/A'}</td>
                  <td>{product.totalQuantity}</td>
                  <td>₹{product.totalSales?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header">⚠️  Low Stock Items</div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.lowStockItems?.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.reorderLevel}</td>
                  <td>{item.branch?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
