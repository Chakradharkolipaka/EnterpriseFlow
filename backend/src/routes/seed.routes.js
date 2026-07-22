import express from 'express';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Counter from '../models/Counter.js';

const router = express.Router();

// Quick test endpoint
router.get('/test-db', async (req, res) => {
  try {
    await connectDB();
    const userCount = await User.countDocuments();
    const customerCount = await Customer.countDocuments();
    const productCount = await Product.countDocuments();
    
    res.status(200).json({
      success: true,
      message: 'Database connection works',
      data: {
        users: userCount,
        customers: customerCount,
        products: productCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Temporary seed endpoint - REMOVE AFTER SEEDING
router.post('/seed-database', async (req, res) => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Starting database seed...');

    // Clear existing data with timeout protection
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Counter.deleteMany({});
    console.log('Cleared successfully');

    // Create users (one by one so password hashing pre-save hook fires)
    console.log('Creating users...');
    const users = [
      {
        name: 'Admin User',
        email: 'admin@enterpriseflow.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Sales User',
        email: 'sales@enterpriseflow.com',
        password: 'sales123',
        role: 'sales'
      },
      {
        name: 'Warehouse User',
        email: 'warehouse@enterpriseflow.com',
        password: 'warehouse123',
        role: 'warehouse'
      },
      {
        name: 'Accounts User',
        email: 'accounts@enterpriseflow.com',
        password: 'accounts123',
        role: 'accounts'
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      user._id = new mongoose.Types.ObjectId();
      await user.save();
    }
    console.log('Users created');

    // Create customers (one by one with explicit _id to avoid serverless issue)
    console.log('Creating customers...');
    const customers = [
      {
        name: 'Rajesh Kumar',
        mobile: '9876543210',
        email: 'rajesh@example.com',
        businessName: 'Kumar Electronics',
        customerType: 'Retail',
        status: 'Active',
        address: '123 MG Road, Bangalore'
      },
      {
        name: 'Priya Singh',
        mobile: '9876543211',
        email: 'priya@example.com',
        businessName: 'Singh Traders',
        customerType: 'Wholesale',
        status: 'Active',
        address: '456 Mall Road, Delhi'
      },
      {
        name: 'Amit Patel',
        mobile: '9876543212',
        email: 'amit@example.com',
        businessName: 'Patel Distributors',
        customerType: 'Distributor',
        status: 'Active',
        address: '789 Ring Road, Ahmedabad'
      },
      {
        name: 'Sneha Reddy',
        mobile: '9876543213',
        email: 'sneha@example.com',
        businessName: 'Reddy Store',
        customerType: 'Retail',
        status: 'Lead',
        address: '321 Tank Bund, Hyderabad'
      }
    ];

    for (const custData of customers) {
      const customer = new Customer(custData);
      customer._id = new mongoose.Types.ObjectId();
      await customer.save();
    }
    console.log('Customers created');

    // Create products (one by one with explicit _id to avoid serverless issue)
    console.log('Creating products...');
    const products = [
      {
        name: 'Laptop HP 15s',
        sku: 'LAP-001',
        category: 'Gadgets',
        unitPrice: 45000,
        currentStock: 25,
        minStockAlert: 10
      },
      {
        name: 'Mouse Logitech',
        sku: 'MOU-001',
        category: 'Gadgets',
        unitPrice: 500,
        currentStock: 150,
        minStockAlert: 50
      },
      {
        name: 'Keyboard Mechanical',
        sku: 'KEY-001',
        category: 'Gadgets',
        unitPrice: 3500,
        currentStock: 80,
        minStockAlert: 30
      },
      {
        name: "Men's T-Shirt",
        sku: 'TSH-001',
        category: 'Apparel',
        unitPrice: 500,
        currentStock: 200,
        minStockAlert: 50
      },
      {
        name: "Women's Jeans",
        sku: 'JNS-001',
        category: 'Apparel',
        unitPrice: 1500,
        currentStock: 120,
        minStockAlert: 40
      },
      {
        name: 'Running Shoes Nike',
        sku: 'SHO-001',
        category: 'Footwear',
        unitPrice: 4500,
        currentStock: 60,
        minStockAlert: 20
      },
      {
        name: 'Backpack Wildcraft',
        sku: 'BAG-001',
        category: 'Accessories',
        unitPrice: 2000,
        currentStock: 45,
        minStockAlert: 15
      },
      {
        name: 'Water Bottle',
        sku: 'BOT-001',
        category: 'Accessories',
        unitPrice: 300,
        currentStock: 5,
        minStockAlert: 20
      }
    ];

    for (const prodData of products) {
      const product = new Product(prodData);
      product._id = new mongoose.Types.ObjectId();
      await product.save();
    }
    console.log('Products created');

    // Initialize counter
    console.log('Creating counter...');
    const counter = new Counter({ year: new Date().getFullYear(), sequence: 0 });
    counter._id = new mongoose.Types.ObjectId();
    await counter.save();
    console.log('Counter created');

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: users.length,
        customers: customers.length,
        products: products.length
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Seed failed',
      error: error.message
    });
  }
});

export default router;
