import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function BranchManagement({ user }) {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    manager: ''
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/branches');
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

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
        await axios.put(`/api/branches/${editingId}`, formData);
      } else {
        await axios.post('/api/branches', formData);
      }
      fetchBranches();
      setShowModal(false);
      setFormData({ name: '', address: '', city: '', phone: '', email: '', manager: '' });
      setEditingId(null);
    } catch (error) {
      alert('Error saving branch: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (branch) => {
    setFormData(branch);
    setEditingId(branch._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`/api/branches/${id}`);
        fetchBranches();
      } catch (error) {
        alert('Error deleting branch');
      }
    }
  };

  const handleLogout = () => { };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content">
        <div className="page-header">
          <h1>Branch Management</h1>
          <button className="btn btn-primary" onClick={() => {
            setFormData({ name: '', address: '', city: '', phone: '', email: '', manager: '' });
            setEditingId(null);
            setShowModal(true);
          }}>
            Add New Branch
          </button>
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch._id}>
                  <td>{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>{branch.city}</td>
                  <td>{branch.phone}</td>
                  <td>{branch.email}</td>
                  <td>{branch.status}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleEdit(branch)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(branch._id)}>Delete</button>
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
                <h2>{editingId ? 'Edit Branch' : 'Add New Branch'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Branch Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
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

export default BranchManagement;
