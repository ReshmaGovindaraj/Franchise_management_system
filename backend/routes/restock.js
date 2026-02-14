const express = require('express');
const router = express.Router();
const restockController = require('../controllers/restockController');
const { isAdmin, isBranchManager, isAuthenticated } = require('../middleware/auth');

// Create restock request
router.post('/', isBranchManager, restockController.createRestockRequest);

// Get all restock requests
router.get('/', isAuthenticated, restockController.getRestockRequests);

// Get restock request by ID
router.get('/:id', isAuthenticated, restockController.getRestockRequestById);

// Approve restock request (Admin only)
router.post('/:id/approve', isAdmin, restockController.approveRestockRequest);

// Reject restock request (Admin only)
router.post('/:id/reject', isAdmin, restockController.rejectRestockRequest);

// Mark as fulfilled (Admin only)
router.post('/:id/fulfill', isAdmin, restockController.fulfillRestockRequest);

module.exports = router;
