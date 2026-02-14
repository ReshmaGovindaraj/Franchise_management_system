import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function StaffManagement({ user }) {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Sales Associate',
    salary: 0,
    branch: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const fetchStaff = useCallback(async () => {
    try {
      const response = await axios.get('/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await axios.get('/api/branches');
      setBranches(response.data);
      if (user?.role === 'Branch Manager') {
        setFormData(prev => ({ ...prev, branch: user?.branch?._id || '' }));
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchStaff();
    fetchBranches();
  }, [fetchStaff, fetchBranches]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/staff/${editingId}`, formData);
      } else {
        await axios.post('/api/staff', formData);
      }
      fetchStaff();
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', role: 'Sales Associate', salary: 0, branch: '', joinDate: new Date().toISOString().split('T')[0] });
      setEditingId(null);
    } catch (error) {
      alert('Error saving staff: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (s) => {
    setFormData(s);
    setEditingId(s._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`/api/staff/${id}`);
        fetchStaff();
      } catch (error) {
        alert('Error deleting staff');
      }
    }
  };

  const handleLogout = () => { };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content">
        <div className="page-header">
          <h1>Staff Management</h1>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ name: '', email: '', phone: '', role: 'Sales Associate', salary: 0, branch: user?.branch?._id || '', joinDate: new Date().toISOString().split('T')[0] });
            setEditingId(null);
            setShowModal(true);
          }}>
            Add Staff Member
          </button>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.role}</td>
                  <td>₹{s.salary.toLocaleString()}</td>
                  <td>{s.status}</td>
                  <td>{new Date(s.joinDate).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal open">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} required>
                    <option>Sales Associate</option>
                    <option>Technician</option>
                    <option>Cashier</option>
                    <option>Stock Manager</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleChange} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} required />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;
