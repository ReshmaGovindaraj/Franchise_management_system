const Inventory = require('../models/Inventory');

// Get all inventory items for a branch
exports.getInventory = async (req, res) => {
  try {
    const { branchId } = req.query;
    let query = {};
    
    if (branchId) {
      query.branch = branchId;
    } else if (req.session.role === 'Branch Manager') {
      query.branch = req.session.branch._id;
    }

    const inventory = await Inventory.find(query)
      .populate('branch', 'name')
      .sort({ createdAt: -1 });
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inventory item by ID
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate('branch', 'name');
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new inventory item (Admin only)
exports.createInventory = async (req, res) => {
  try {
    const { name, sku, category, quantity, reorderLevel, price, branch, supplier } = req.body;

    if (!name || !sku || !category || !price || !branch) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const inventory = new Inventory({
      name,
      sku,
      category,
      quantity: quantity || 0,
      reorderLevel: reorderLevel || 10,
      price,
      branch,
      supplier: supplier || ''
    });

    await inventory.save();
    
    res.status(201).json({
      message: 'Inventory item created successfully',
      inventory: await inventory.populate('branch', 'name')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update inventory
exports.updateInventory = async (req, res) => {
  try {
    const { name, category, quantity, reorderLevel, price, supplier } = req.body;
    
    let inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (name) inventory.name = name;
    if (category) inventory.category = category;
    if (quantity !== undefined) inventory.quantity = quantity;
    if (reorderLevel) inventory.reorderLevel = reorderLevel;
    if (price) inventory.price = price;
    if (supplier) inventory.supplier = supplier;

    inventory.updatedAt = Date.now();
    await inventory.save();

    res.json({
      message: 'Inventory updated successfully',
      inventory: await inventory.populate('branch', 'name')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete inventory item
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const { branchId } = req.query;
    let query = { $expr: { $lte: ['$quantity', '$reorderLevel'] } };
    
    if (branchId) {
      query.branch = branchId;
    } else if (req.session.role === 'Branch Manager') {
      query.branch = req.session.branch._id;
    }

    const lowStockItems = await Inventory.find(query)
      .populate('branch', 'name')
      .sort({ quantity: 1 });
    
    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
