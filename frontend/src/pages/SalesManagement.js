import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function SalesManagement({ user }) {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('sales');
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  
  const [saleFormData, setSaleFormData] = useState({
    product: '',
    quantity: 1,
    unitPrice: 0,
    branch: '',
    paymentMethod: 'Cash',
    notes: ''
  });

  const [expenseFormData, setExpenseFormData] = useState({
    category: 'Other',
    amount: 0,
    description: '',
    branch: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = useCallback(async () => {
    try {
      const [salesRes, expensesRes, productsRes, branchesRes] = await Promise.all([
        axios.get('/api/sales'),
        axios.get('/api/sales/expense/all'),
        axios.get('/api/inventory'),
        axios.get('/api/branches')
      ]);
      setSales(salesRes.data);
      setExpenses(expensesRes.data);
      setProducts(productsRes.data);
      setBranches(branchesRes.data);
      
      if (user?.role !== 'Admin') {
        setSaleFormData(prev => ({ ...prev, branch: user?.branch?._id || '' }));
        setExpenseFormData(prev => ({ ...prev, branch: user?.branch?._id || '' }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaleChange = (e) => {
    setSaleFormData({ ...saleFormData, [e.target.name]: e.target.value });
  };

  const handleExpenseChange = (e) => {
    setExpenseFormData({ ...expenseFormData, [e.target.name]: e.target.value });
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sales', saleFormData);
      fetchData();
      setShowSaleModal(false);
      setSaleFormData({ product: '', quantity: 1, unitPrice: 0, branch: '', paymentMethod: 'Cash', notes: '' });
    } catch (error) {
      alert('Error recording sale: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/sales/expense/create', expenseFormData);
      fetchData();
      setShowExpenseModal(false);
      setExpenseFormData({ category: 'Other', amount: 0, description: '', branch: '', expenseDate: new Date().toISOString().split('T')[0] });
    } catch (error) {
      alert('Error recording expense: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => { };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="content">
        <div className="page-header">
          <h1>Sales & Expenses Management</h1>
          <div className="action-buttons">
            <button className="btn btn-success" onClick={() => setShowSaleModal(true)}>Record Sale</button>
            <button className="btn btn-warning" onClick={() => setShowExpenseModal(true)}>Record Expense</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: '20px', borderBottom: '2px solid #eee' }}>
          <button
            style={{
              padding: '10px 20px',
              background: activeTab === 'sales' ? '#007bff' : '#f0f0f0',
              color: activeTab === 'sales' ? 'white' : '#333',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
          <button
            style={{
              padding: '10px 20px',
              background: activeTab === 'expenses' ? '#007bff' : '#f0f0f0',
              color: activeTab === 'expenses' ? 'white' : '#333',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
        </div>

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="card">
            <div className="card-header">Recent Sales</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Branch</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.product?.name}</td>
                    <td>{sale.quantity}</td>
                    <td>₹{sale.unitPrice}</td>
                    <td>₹{sale.totalAmount}</td>
                    <td>{sale.paymentMethod}</td>
                    <td>{sale.branch?.name}</td>
                    <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="card">
            <div className="card-header">Recent Expenses</div>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Branch</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.category}</td>
                    <td>₹{expense.amount}</td>
                    <td>{expense.description}</td>
                    <td>{expense.branch?.name}</td>
                    <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sale Modal */}
        {showSaleModal && (
          <div className="modal open">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Record Sale</h2>
                <button className="close-modal" onClick={() => setShowSaleModal(false)}>×</button>
              </div>
              <form onSubmit={handleSaleSubmit}>
                <div className="form-group">
                  <label>Product</label>
                  <select name="product" value={saleFormData.product} onChange={handleSaleChange} required>
                    <option value="">Select Product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" value={saleFormData.quantity} onChange={handleSaleChange} min="1" required />
                </div>
                <div className="form-group">
                  <label>Unit Price</label>
                  <input type="number" name="unitPrice" value={saleFormData.unitPrice} onChange={handleSaleChange} step="0.01" required />
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={saleFormData.branch} onChange={handleSaleChange} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={saleFormData.paymentMethod} onChange={handleSaleChange} required>
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Check</option>
                    <option>Online</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea name="notes" value={saleFormData.notes} onChange={handleSaleChange} rows="3"></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSaleModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Sale</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expense Modal */}
        {showExpenseModal && (
          <div className="modal open">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Record Expense</h2>
                <button className="close-modal" onClick={() => setShowExpenseModal(false)}>×</button>
              </div>
              <form onSubmit={handleExpenseSubmit}>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={expenseFormData.category} onChange={handleExpenseChange} required>
                    <option>Utilities</option>
                    <option>Rent</option>
                    <option>Salaries</option>
                    <option>Maintenance</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" name="amount" value={expenseFormData.amount} onChange={handleExpenseChange} step="0.01" required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={expenseFormData.description} onChange={handleExpenseChange} rows="3" required></textarea>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch" value={expenseFormData.branch} onChange={handleExpenseChange} required>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="expenseDate" value={expenseFormData.expenseDate} onChange={handleExpenseChange} required />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Expense</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesManagement;
