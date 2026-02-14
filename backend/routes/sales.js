const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { isBranchManager, isAuthenticated } = require('../middleware/auth');

// Create sale
router.post('/', isBranchManager, salesController.createSale);

// Get all sales
router.get('/', isAuthenticated, salesController.getSales);

// Get sale by ID
router.get('/:id', isAuthenticated, salesController.getSaleById);

// Create expense
router.post('/expense/create', isBranchManager, salesController.createExpense);

// Get all expenses
router.get('/expense/all', isAuthenticated, salesController.getExpenses);

// Get sales summary
router.get('/summary/monthly', isAuthenticated, salesController.getSalesSummary);

module.exports = router;
