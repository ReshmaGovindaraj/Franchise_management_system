const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { isBranchManager, isAuthenticated } = require('../middleware/auth');

// Get all staff
router.get('/', isAuthenticated, staffController.getAllStaff);

// Get staff by ID
router.get('/:id', isAuthenticated, staffController.getStaffById);

// Create staff
router.post('/', isBranchManager, staffController.createStaff);

// Update staff
router.put('/:id', isBranchManager, staffController.updateStaff);

// Delete staff
router.delete('/:id', isBranchManager, staffController.deleteStaff);

// Record attendance
router.post('/attendance/record', isBranchManager, staffController.recordAttendance);

// Get attendance records
router.get('/attendance/records', isAuthenticated, staffController.getAttendance);

module.exports = router;
