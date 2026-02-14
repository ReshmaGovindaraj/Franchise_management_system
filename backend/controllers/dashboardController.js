const mongoose = require('mongoose');
const Branch = require('../models/Branch');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const Inventory = require('../models/Inventory');
const Staff = require('../models/Staff');

// Get admin dashboard summary
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalBranches = await Branch.countDocuments();
    const activeBranches = await Branch.countDocuments({ status: 'Active' });
    const totalStaff = await Staff.countDocuments();
    
    // Total sales for the month
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    }).limit(5);

    const topSellingProducts = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$product',
          totalQuantity: { $sum: '$quantity' },
          totalSales: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'inventories',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      }
    ]);

    res.json({
      totalBranches,
      activeBranches,
      totalStaff,
      monthlySales: monthlySales[0] || { total: 0, count: 0 },
      lowStockItems,
      topSellingProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get branch dashboard summary
exports.getBranchDashboard = async (req, res) => {
  try {
    // Try to get branchId from query parameter first, then from session
    let branchId = req.query.branchId;
    
    if (!branchId && req.session.branch) {
      branchId = typeof req.session.branch === 'object' ? req.session.branch._id : req.session.branch;
    }
    
    if (!branchId) {
      console.warn('getBranchDashboard: Branch ID not found', {
        queryBranchId: req.query.branchId,
        sessionBranch: req.session.branch,
        userId: req.session.userId
      });
      return res.status(400).json({ message: 'Branch ID is required' });
    }

    console.log('getBranchDashboard: Fetching data for branch', branchId);
    
    const branch = await Branch.findById(branchId);
    if (!branch) {
      console.error('getBranchDashboard: Branch not found for ID', branchId);
      return res.status(404).json({ message: 'Branch not found' });
    }

    const totalStaff = await Staff.countDocuments({ branch: branchId });
    const totalProducts = await Inventory.countDocuments({ branch: branchId });
    
    // Sales for the month
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(branchId),
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          branch: new mongoose.Types.ObjectId(branchId),
          expenseDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const lowStockItems = await Inventory.find({
      branch: branchId,
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    }).limit(5);

    res.json({
      branch: branch.name,
      totalStaff,
      totalProducts,
      monthlySales: monthlySales[0] || { total: 0, count: 0 },
      monthlyExpenses: monthlyExpenses[0] || { total: 0 },
      lowStockItems
    });
  } catch (error) {
    console.error('getBranchDashboard error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get branch comparison (Admin only)
exports.getBranchComparison = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const branchComparison = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$branch',
          totalSales: { $sum: '$totalAmount' },
          totalTransactions: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    res.json(branchComparison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get monthly sales trend
exports.getMonthlySalesTrend = async (req, res) => {
  try {
    const { branchId, months = 12 } = req.query;
    
    let matchStage = {};
    if (branchId) {
      matchStage.branch = new mongoose.Types.ObjectId(branchId);
    }

    const trend = await Sale.aggregate([
      {
        $match: {
          ...matchStage,
          saleDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - months))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' }
          },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(trend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue by category
exports.getRevenueByCategory = async (req, res) => {
  try {
    const { branchId } = req.query;
    
    let matchStage = {};
    if (branchId) {
      matchStage.branch = new mongoose.Types.ObjectId(branchId);
    }

    const revenueByCategory = await Sale.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'inventories',
          localField: 'product',
          foreignField: '_id',
          as: 'productData'
        }
      },
      { $unwind: '$productData' },
      {
        $group: {
          _id: '$productData.category',
          totalRevenue: { $sum: '$totalAmount' },
          totalItems: { $sum: '$quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json(revenueByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
