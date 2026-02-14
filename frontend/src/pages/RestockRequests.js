import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function RestockRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    product: '',
    branch: '',
    requestedQuantity: 0,
    reason: ''
  });

  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get('/api/restock');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('/api/inventory');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    fetchRequests();
    fetchProducts();
    fetchBranches();
  }, [fetchRequests, fetchProducts, fetchBranches]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/restock', formData);
      fetchRequests();
      setShowModal(false);
      setFormData({ product: '', branch: user?.branch?._id || '', requestedQuantity: 0, reason: '' });
    } catch (error) {
      alert('Error creating request: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleApprove = async (id) => {
    const quantity = prompt('Enter approved quantity:');
    if (quantity) {
      try {
        await axios.post(`/api/restock/${id}/approve`, { approvedQuantity: parseInt(quantity) });
        fetchRequests();
      } catch (error) {
        alert('Error approving request');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await axios.post(`/api/restock/${id}/reject`);
        fetchRequests();
      } catch (error) {
        alert('Error rejecting request');
      }
    }
  };

  const handleFulfill = async (id) => {
    if (window.confirm('Mark this request as fulfilled?')) {
      try {
        await axios.post(`/api/restock/${id}/fulfill`);
        fetchRequests();
      } catch (error) {
        alert('Error fulfilling request');
      }
    }
  };

  const handleLogout = () => { };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Approved': '#17a2b8',
      'Rejected': '#dc3545',
      'Fulfilled': '#28a745'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content">
        <div className="page-header">
          <h1>Restock Requests</h1>
          {user?.role !== 'Admin' && (
            <button className="btn btn-primary" onClick={() => {
              setFormData({ product: '', branch: user?.branch?._id || '', requestedQuantity: 0, reason: '' });
              setShowModal(true);
            }}>
              Create Request
            </button>
          )}
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Branch</th>
                <th>Requested Qty</th>
                <th>Approved Qty</th>
                <th>Status</th>
                <th>Requested By</th>
                <th>Date</th>
                {user?.role === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.product?.name}</td>
                  <td>{req.branch?.name}</td>
                  <td>{req.requestedQuantity}</td>
                  <td>{req.approvedQuantity || '-'}</td>
                  <td style={{ fontWeight: 'bold', color: getStatusColor(req.status) }}>{req.status}</td>
                  <td>{req.requestedBy?.username}</td>
                  <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                  {user?.role === 'Admin' && (
                    <td>
                      {req.status === 'Pending' && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(req._id)}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(req._id)}>Reject</button>
                        </>
                      )}
                      {req.status === 'Approved' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleFulfill(req._id)}>Fulfill</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && user?.role !== 'Admin' && (
          <div className="modal open">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Create Restock Request</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product</label>
                  <select name="product" value={formData.product} onChange={handleChange} required>
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleChange} required disabled={user?.role === 'Branch Manager'}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Requested Quantity</label>
                  <input type="number" name="requestedQuantity" value={formData.requestedQuantity} onChange={handleChange} min="1" required />
                </div>
                <div className="form-group">
                  <label>Reason</label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" required></textarea>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestockRequests;
