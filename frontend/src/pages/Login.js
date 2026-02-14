import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', formData, {
        withCredentials: true
      });
      
      console.log('Login response:', response.data);
      setUser(response.data);
      
      if (response.data.role === 'Admin' || response.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (response.data.role === 'Branch Manager' || response.data.role === 'manager') {
        navigate('/manager-dashboard');
      } else {
        console.warn('Unknown role:', response.data.role);
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Franchise Management System</h1>
        <p className="subtitle">Please login to continue</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="credentials-hint">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin@example.com / password123</p>
          <p>Manager: manager1@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
