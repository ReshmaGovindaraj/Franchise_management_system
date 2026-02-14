import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import BranchManagement from './pages/BranchManagement';
import InventoryManagement from './pages/InventoryManagement';
import SalesManagement from './pages/SalesManagement';
import StaffManagement from './pages/StaffManagement';
import RestockRequests from './pages/RestockRequests';
import './styles/App.css';

// Configure axios to send credentials (cookies) with all requests
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/current-user');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        
        {user ? (
          <>
            {user.role === 'Admin' || user.role === 'admin' ? (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
                <Route path="/branches" element={<BranchManagement user={user} />} />
                <Route path="/inventory" element={<InventoryManagement user={user} />} />
                <Route path="/sales" element={<SalesManagement user={user} />} />
                <Route path="/restock-requests" element={<RestockRequests user={user} />} />
                <Route path="/" element={<Navigate to="/admin-dashboard" />} />
              </>
            ) : user.role === 'Branch Manager' || user.role === 'manager' ? (
              <>
                <Route path="/manager-dashboard" element={<ManagerDashboard user={user} />} />
                <Route path="/inventory" element={<InventoryManagement user={user} />} />
                <Route path="/sales" element={<SalesManagement user={user} />} />
                <Route path="/staff" element={<StaffManagement user={user} />} />
                <Route path="/restock-requests" element={<RestockRequests user={user} />} />
                <Route path="/" element={<Navigate to="/manager-dashboard" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
