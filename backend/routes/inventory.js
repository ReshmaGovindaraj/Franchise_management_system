const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { isAdmin, isBranchManager, isAuthenticated } = require('../middleware/auth');

// Get all inventory
router.get('/', isAuthenticated, inventoryController.getInventory);

// Get inventory by ID
router.get('/:id', isAuthenticated, inventoryController.getInventoryById);

// Get low stock items
router.get('/low-stock/items', isAuthenticated, inventoryController.getLowStockItems);

// Create inventory (Admin only)
router.post('/', isAdmin, inventoryController.createInventory);

// Update inventory
router.put('/:id', isBranchManager, inventoryController.updateInventory);

// Delete inventory (Admin only)
router.delete('/:id', isAdmin, inventoryController.deleteInventory);

module.exports = router;
