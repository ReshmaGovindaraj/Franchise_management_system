const mongoose = require('mongoose');

const restockRequestSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  requestedQuantity: {
    type: Number,
    required: true
  },
  approvedQuantity: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Fulfilled'],
    default: 'Pending'
  },
  reason: {
    type: String,
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RestockRequest', restockRequestSchema);
