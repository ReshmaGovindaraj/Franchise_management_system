const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAdmin, isBranchManager, isAuthenticated } = require('../middleware/auth');

// Admin dashboard
router.get('/admin/summary', isAdmin, dashboardController.getAdminDashboard);

// Branch dashboard
router.get('/branch/summary', isBranchManager, dashboardController.getBranchDashboard);

// Branch comparison (Admin only)
router.get('/admin/branch-comparison', isAdmin, dashboardController.getBranchComparison);

// Monthly sales trend
router.get('/sales-trend', isAuthenticated, dashboardController.getMonthlySalesTrend);

// Revenue by category
router.get('/revenue-by-category', isAuthenticated, dashboardController.getRevenueByCategory);

module.exports = router;
