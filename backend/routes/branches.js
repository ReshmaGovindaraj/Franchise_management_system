const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { isAdmin, isBranchManager, isAuthenticated } = require('../middleware/auth');

// Get all branches
router.get('/', isAuthenticated, branchController.getAllBranches);

// Get branch by ID
router.get('/:id', isAuthenticated, branchController.getBranchById);

// Create new branch (Admin only)
router.post('/', isAdmin, branchController.createBranch);

// Update branch (Admin only)
router.put('/:id', isAdmin, branchController.updateBranch);

// Delete branch (Admin only)
router.delete('/:id', isAdmin, branchController.deleteBranch);

// Assign manager to branch (Admin only)
router.post('/:id/assign-manager', isAdmin, branchController.assignManager);

module.exports = router;
