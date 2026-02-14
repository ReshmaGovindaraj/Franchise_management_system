const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');
const Expense = require('../models/Expense');

// Create sale
exports.createSale = async (req, res) => {
  try {
    const { product, quantity, unitPrice, branch, paymentMethod, notes } = req.body;

    if (!product || !quantity || !unitPrice || !branch || !paymentMethod) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check inventory
    const inventory = await Inventory.findById(product);
    if (!inventory || inventory.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient inventory' });
    }

    const totalAmount = quantity * unitPrice;

    const sale = new Sale({
      product,
      quantity,
      unitPrice,
      totalAmount,
      branch,
      paymentMethod,
      notes: notes || ''
    });

    await sale.save();

    // Update inventory
    inventory.quantity -= quantity;
    await inventory.save();

    res.status(201).json({
      message: 'Sale recorded successfully',
      sale: await sale.populate([
        { path: 'product', select: 'name sku' },
        { path: 'branch', select: 'name' }
      ])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sales
exports.getSales = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    let query = {};

    if (branchId) {
      query.branch = branchId;
    } else if (req.session.role === 'Branch Manager') {
      query.branch = req.session.branch._id;
    }

    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sale.find(query)
      .populate('product', 'name sku')
      .populate('branch', 'name')
      .sort({ saleDate: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('product')
      .populate('branch');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, description, branch, expenseDate } = req.body;

    if (!category || !amount || !description || !branch) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const expense = new Expense({
      category,
      amount,
      description,
      branch,
      expenseDate: expenseDate || new Date(),
      createdBy: req.session.userId
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense recorded successfully',
      expense: await expense.populate([
        { path: 'branch', select: 'name' },
        { path: 'createdBy', select: 'username' }
      ])
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    let query = {};

    if (branchId) {
      query.branch = branchId;
    } else if (req.session.role === 'Branch Manager') {
      query.branch = req.session.branch._id;
    }

    if (startDate && endDate) {
      query.expenseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query)
      .populate('branch', 'name')
      .populate('createdBy', 'username')
      .sort({ expenseDate: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales summary
exports.getSalesSummary = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    let matchStage = {};

    if (branchId) {
      matchStage.branch = require('mongoose').Types.ObjectId(branchId);
    }

    if (startDate && endDate) {
      matchStage.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Sale.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalQuantity: { $sum: '$quantity' },
          averorageOrderValue: { $avg: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(summary[0] || { totalSales: 0, totalQuantity: 0, averageOrderValue: 0, count: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
