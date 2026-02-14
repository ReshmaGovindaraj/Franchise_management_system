const RestockRequest = require('../models/RestockRequest');
const Inventory = require('../models/Inventory');

// Create restock request
exports.createRestockRequest = async (req, res) => {
  try {
    const { product, branch, requestedQuantity, reason } = req.body;

    if (!product || !branch || !requestedQuantity || !reason) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if product exists
    const inventory = await Inventory.findById(product);
    if (!inventory) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const restockRequest = new RestockRequest({
      product,
      branch,
      requestedQuantity,
      reason,
      requestedBy: req.session.userId
    });

    await restockRequest.save();

    await restockRequest.populate([
      { path: 'product', select: 'name sku' },
      { path: 'branch', select: 'name' },
      { path: 'requestedBy', select: 'username' }
    ]);

    res.status(201).json({
      message: 'Restock request created successfully',
      restockRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all restock requests
exports.getRestockRequests = async (req, res) => {
  try {
    const { status, branchId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (branchId) {
      query.branch = branchId;
    }

    const requests = await RestockRequest.find(query)
      .populate('product', 'name sku')
      .populate('branch', 'name')
      .populate('requestedBy', 'username')
      .populate('approvedBy', 'username')
      .sort({ requestDate: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get restock request by ID
exports.getRestockRequestById = async (req, res) => {
  try {
    const request = await RestockRequest.findById(req.params.id)
      .populate('product')
      .populate('branch')
      .populate('requestedBy', 'username')
      .populate('approvedBy', 'username');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve restock request (Admin only)
exports.approveRestockRequest = async (req, res) => {
  try {
    const { approvedQuantity, adminNotes } = req.body;

    let request = await RestockRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'Approved';
    request.approvedQuantity = approvedQuantity || request.requestedQuantity;
    request.approvedBy = req.session.userId;
    request.approvalDate = Date.now();
    request.adminNotes = adminNotes || '';

    await request.save();

    await request.populate([
      { path: 'product', select: 'name sku' },
      { path: 'branch', select: 'name' },
      { path: 'requestedBy', select: 'username' },
      { path: 'approvedBy', select: 'username' }
    ]);

    res.json({
      message: 'Restock request approved successfully',
      restockRequest: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject restock request (Admin only)
exports.rejectRestockRequest = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    let request = await RestockRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'Rejected';
    request.approvedBy = req.session.userId;
    request.approvalDate = Date.now();
    request.adminNotes = adminNotes || '';

    await request.save();

    await request.populate([
      { path: 'product', select: 'name sku' },
      { path: 'branch', select: 'name' },
      { path: 'requestedBy', select: 'username' },
      { path: 'approvedBy', select: 'username' }
    ]);

    res.json({
      message: 'Restock request rejected successfully',
      restockRequest: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as fulfilled
exports.fulfillRestockRequest = async (req, res) => {
  try {
    let request = await RestockRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Approved') {
      return res.status(400).json({ message: 'Only approved requests can be fulfilled' });
    }

    request.status = 'Fulfilled';
    await request.save();

    // Update inventory
    const inventory = await Inventory.findById(request.product);
    if (inventory) {
      inventory.quantity += request.approvedQuantity;
      inventory.lastRestocked = Date.now();
      await inventory.save();
    }

    await request.populate([
      { path: 'product', select: 'name sku' },
      { path: 'branch', select: 'name' },
      { path: 'requestedBy', select: 'username' },
      { path: 'approvedBy', select: 'username' }
    ]);

    res.json({
      message: 'Restock request fulfilled successfully',
      restockRequest: request
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
