import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function InventoryManagement({ user }) {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Laptops',
    quantity: 0,
    reorderLevel: 10,
    price: 0,
    branch: '',
    supplier: ''
  });

  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get('/api/inventory');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await axios.get('/api/branches');
      setBranches(response.data);
      if (user?.role !== 'Admin') {
        setFormData(prev => ({ ...prev, branch: user?.branch?._id || '' }));
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchInventory();
    fetchBranches();
  }, [fetchInventory, fetchBranches, user]);

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
        await axios.put(`/api/inventory/${editingId}`, formData);
      } else {
        await axios.post('/api/inventory', formData);
      }
      fetchInventory();
      setShowModal(false);
      setFormData({ name: '', sku: '', category: 'Laptops', quantity: 0, reorderLevel: 10, price: 0, branch: '', supplier: '' });
      setEditingId(null);
    } catch (error) {
      alert('Error saving inventory: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        fetchInventory();
      } catch (error) {
        alert('Error deleting inventory item');
      }
    }
  };

  const handleLogout = () => { };

  const lowStockCount = inventory.filter(item => item.quantity <= item.reorderLevel).length;

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content">
        <div className="page-header">
          <div>
            <h1>Inventory Management</h1>
            {lowStockCount > 0 && <p style={{ color: '#e74c3c', marginTop: '5px' }}>⚠️ {lowStockCount} items below reorder level</p>}
          </div>
          {user?.role !== 'Branch Manager' && (
            <button className="btn btn-primary" onClick={() => {
              setFormData({ name: '', sku: '', category: 'Laptops', quantity: 0, reorderLevel: 10, price: 0, branch: '', supplier: '' });
              setEditingId(null);
              setShowModal(true);
            }}>
              Add Product
            </button>
          )}
        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Price</th>
                <th>Branch</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} style={{ backgroundColor: item.quantity <= item.reorderLevel ? '#fff3cd' : 'white' }}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.reorderLevel}</td>
                  <td>₹{item.price}</td>
                  <td>{item.branch?.name}</td>
                  <td>
                    {user?.role === 'Admin' && <button className="btn btn-sm btn-primary" onClick={() => handleEdit(item)}>Edit</button>}
                    {user?.role === 'Admin' && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && user?.role === 'Admin' && (
          <div className="modal open">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option>Laptops</option>
                    <option>Mobile Phones</option>
                    <option>Tablets</option>
                    <option>Accessories</option>
                    <option>Peripherals</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required />
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleChange} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} />
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

export default InventoryManagement;
