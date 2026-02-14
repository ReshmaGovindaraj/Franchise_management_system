const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Laptops', 'Mobile Phones', 'Tablets', 'Accessories', 'Peripherals', 'Other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    default: 10
  },
  price: {
    type: Number,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  supplier: {
    type: String,
    default: ''
  },
  lastRestocked: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inventory', inventorySchema);
