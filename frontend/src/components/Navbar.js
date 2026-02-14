import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📦 Franchise Management
      </div>

      <ul className="navbar-menu">
        {user?.role === 'Admin' ? (
          <>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <li><Link to="/branches">Branches</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/restock-requests">Restock Requests</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/manager-dashboard">Dashboard</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/staff">Staff</Link></li>
            <li><Link to="/restock-requests">Restock</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-user">
        <span>{user?.username} ({user?.role})</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
