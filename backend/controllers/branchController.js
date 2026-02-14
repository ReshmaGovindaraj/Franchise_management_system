const Branch = require('../models/Branch');
const User = require('../models/User');

// Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate('manager', 'username email');
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate('manager', 'username email');
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new branch (Admin only)
exports.createBranch = async (req, res) => {
  try {
    const { name, address, city, phone, email, manager } = req.body;

    // Validate required fields
    if (!name || !address || !city || !phone || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // If manager is provided, verify it exists
    if (manager) {
      const managerUser = await User.findById(manager);
      if (!managerUser) {
        return res.status(400).json({ message: 'Manager user not found' });
      }
    }

    const branch = new Branch({
      name,
      address,
      city,
      phone,
      email,
      manager: manager || null
    });

    await branch.save();
    res.status(201).json({
      message: 'Branch created successfully',
      branch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  try {
    const { name, address, city, phone, email, manager, status } = req.body;
    
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    if (manager && manager !== '') {
      const managerUser = await User.findById(manager);
      if (!managerUser) {
        return res.status(400).json({ message: 'Manager user not found' });
      }
      branch.manager = manager;
    }

    if (name) branch.name = name;
    if (address) branch.address = address;
    if (city) branch.city = city;
    if (phone) branch.phone = phone;
    if (email) branch.email = email;
    if (status) branch.status = status;

    branch.updatedAt = Date.now();
    await branch.save();

    res.json({
      message: 'Branch updated successfully',
      branch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete branch (Admin only)
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign manager to branch
exports.assignManager = async (req, res) => {
  try {
    const { managerId } = req.body;
    const branchId = req.params.id;

    let branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    branch.manager = managerId;
    await branch.save();

    // Also update user's branch reference
    manager.branch = branchId;
    await manager.save();

    res.json({
      message: 'Manager assigned successfully',
      branch
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
