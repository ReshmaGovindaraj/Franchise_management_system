const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Branch = require('./models/Branch');
const Staff = require('./models/Staff');
const Inventory = require('./models/Inventory');
const Sale = require('./models/Sale');
const Expense = require('./models/Expense');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/franchise-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Branch.deleteMany({}),
      Staff.deleteMany({}),
      Inventory.deleteMany({}),
      Sale.deleteMany({}),
      Expense.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create Admin User
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create Branches
    const branches = await Branch.insertMany([
      {
        name: 'Delhi North Branch',
        address: '123 Main Street, Sector 5',
        city: 'Delhi',
        phone: '9876543210',
        email: 'delhi-north@example.com',
        status: 'Active'
      },
      {
        name: 'Mumbai Central Branch',
        address: '456 Business Park, Fort',
        city: 'Mumbai',
        phone: '9876543211',
        email: 'mumbai@example.com',
        status: 'Active'
      },
      {
        name: 'Bangalore Tech Branch',
        address: '789 IT Hub, Whitefield',
        city: 'Bangalore',
        phone: '9876543212',
        email: 'bangalore@example.com',
        status: 'Active'
      }
    ]);
    console.log('Branches created:', branches.length);

    // Create Branch Manager Users
    const managerUsers = [];
    for (let i = 0; i < branches.length; i++) {
      const manager = new User({
        username: `manager${i + 1}`,
        email: `manager${i + 1}@example.com`,
        password: 'password123',
        role: 'Branch Manager',
        branch: branches[i]._id
      });
      await manager.save();
      managerUsers.push(manager);
      branches[i].manager = manager._id;
    }
    await Promise.all(branches.map(b => b.save()));
    console.log('Branch managers created');

    // Create Staff
    const staffRoles = ['Sales Associate', 'Technician', 'Cashier', 'Stock Manager'];
    const staff = [];
    
    for (const branch of branches) {
      for (let i = 0; i < 4; i++) {
        const employee = new Staff({
          name: `${branch.name} - ${staffRoles[i]} ${i + 1}`,
          email: `staff-${branch._id}-${i}@example.com`,
          phone: `987654${Math.random().toString().slice(2, 8)}`,
          role: staffRoles[i],
          salary: 20000 + Math.random() * 30000,
          branch: branch._id,
          status: 'Active'
        });
        await employee.save();
        staff.push(employee);
      }
    }
    console.log('Staff created:', staff.length);

    // Create Products
    const products = [
      { name: 'Dell XPS 13', category: 'Laptops', price: 89999 },
      { name: 'HP Pavilion 15', category: 'Laptops', price: 49999 },
      { name: 'iPhone 14 Pro', category: 'Mobile Phones', price: 129999 },
      { name: 'Samsung S23', category: 'Mobile Phones', price: 74999 },
      { name: 'iPad Air', category: 'Tablets', price: 59999 },
      { name: 'USB-C Cable', category: 'Accessories', price: 599 },
      { name: 'Wireless Mouse', category: 'Peripherals', price: 1999 },
      { name: 'USB Hub', category: 'Peripherals', price: 2999 }
    ];

    const inventory = [];
    let skuCounter = 1000;

    for (const branch of branches) {
      for (const product of products) {
        const item = new Inventory({
          name: product.name,
          sku: `SKU-${skuCounter++}`,
          category: product.category,
          quantity: Math.floor(Math.random() * 100) + 5,
          reorderLevel: 10,
          price: product.price,
          branch: branch._id,
          supplier: 'Tech Distributors Ltd'
        });
        await item.save();
        inventory.push(item);
      }
    }
    console.log('Inventory created:', inventory.length);

    // Create Sample Sales
    for (const branch of branches) {
      const branchInventory = inventory.filter(inv => inv.branch.equals(branch._id));
      
      for (let i = 0; i < 10; i++) {
        const randomProduct = branchInventory[Math.floor(Math.random() * branchInventory.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        
        if (randomProduct.quantity >= quantity) {
          const sale = new Sale({
            product: randomProduct._id,
            quantity: quantity,
            unitPrice: randomProduct.price,
            totalAmount: randomProduct.price * quantity,
            branch: branch._id,
            paymentMethod: ['Cash', 'Card', 'Online'][Math.floor(Math.random() * 3)],
            saleDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
          await sale.save();
          randomProduct.quantity -= quantity;
          await randomProduct.save();
        }
      }
    }
    console.log('Sales created');

    // Create Sample Expenses
    const expenseCategories = ['Utilities', 'Rent', 'Salaries', 'Maintenance', 'Marketing'];
    
    for (const branch of branches) {
      for (let i = 0; i < 5; i++) {
        const expense = new Expense({
          category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
          amount: Math.floor(Math.random() * 50000) + 5000,
          description: 'Monthly expense entry',
          branch: branch._id,
          expenseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          createdBy: managerUsers[branches.indexOf(branch)]._id
        });
        await expense.save();
      }
    }
    console.log('Expenses created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Manager 1: manager1@example.com / password123');
    console.log('Manager 2: manager2@example.com / password123');
    console.log('Manager 3: manager3@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
