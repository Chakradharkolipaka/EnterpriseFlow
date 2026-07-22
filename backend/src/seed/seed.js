import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import Challan from '../models/Challan.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

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

const customers = [
  {
    name: 'Rajesh Kumar',
    mobile: '9876543210',
    email: 'rajesh@retailshop.com',
    businessName: 'Kumar Retail Store',
    gstNumber: '27AABCU9603R1ZM',
    customerType: 'Retail',
    address: '123 MG Road, Mumbai, Maharashtra 400001',
    status: 'Active'
  },
  {
    name: 'Priya Sharma',
    mobile: '9123456789',
    email: 'priya@wholesalers.com',
    businessName: 'Sharma Wholesalers',
    gstNumber: '06AAACP1234Q1Z5',
    customerType: 'Wholesale',
    address: '456 Commercial Street, Bangalore, Karnataka 560001',
    status: 'Active'
  },
  {
    name: 'Amit Patel',
    mobile: '9988776655',
    email: 'amit@distributors.in',
    businessName: 'Patel Distributors',
    gstNumber: '24AAACN2345P1ZZ',
    customerType: 'Distributor',
    address: '789 Industrial Area, Ahmedabad, Gujarat 380001',
    status: 'Active'
  },
  {
    name: 'Sneha Reddy',
    mobile: '9876512345',
    businessName: 'Reddy Enterprises',
    customerType: 'Wholesale',
    address: 'Plot 15, Sector 5, Hyderabad, Telangana 500001',
    status: 'Lead'
  }
];

const products = [
  {
    name: 'Premium Rice 25kg',
    sku: 'RICE-25KG-001',
    category: 'Grains',
    unitPrice: 1250.00,
    currentStock: 500,
    minStockAlert: 50,
    location: 'Warehouse-A-1'
  },
  {
    name: 'Refined Oil 1L',
    sku: 'OIL-1L-001',
    category: 'Oils',
    unitPrice: 180.00,
    currentStock: 1000,
    minStockAlert: 100,
    location: 'Warehouse-A-2'
  },
  {
    name: 'Wheat Flour 10kg',
    sku: 'FLOUR-10KG-001',
    category: 'Grains',
    unitPrice: 450.00,
    currentStock: 300,
    minStockAlert: 40,
    location: 'Warehouse-A-1'
  },
  {
    name: 'Sugar 1kg',
    sku: 'SUGAR-1KG-001',
    category: 'Sweeteners',
    unitPrice: 45.00,
    currentStock: 2000,
    minStockAlert: 200,
    location: 'Warehouse-B-1'
  },
  {
    name: 'Tea Powder 500g',
    sku: 'TEA-500G-001',
    category: 'Beverages',
    unitPrice: 320.00,
    currentStock: 150,
    minStockAlert: 30,
    location: 'Warehouse-B-2'
  },
  {
    name: 'Lentils (Dal) 1kg',
    sku: 'DAL-1KG-001',
    category: 'Pulses',
    unitPrice: 120.00,
    currentStock: 800,
    minStockAlert: 80,
    location: 'Warehouse-A-3'
  },
  {
    name: 'Salt 1kg',
    sku: 'SALT-1KG-001',
    category: 'Condiments',
    unitPrice: 20.00,
    currentStock: 1500,
    minStockAlert: 150,
    location: 'Warehouse-B-3'
  },
  {
    name: 'Cooking Oil 5L',
    sku: 'OIL-5L-001',
    category: 'Oils',
    unitPrice: 850.00,
    currentStock: 40,
    minStockAlert: 50,
    location: 'Warehouse-A-2'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await StockMovement.deleteMany({});
    await Challan.deleteMany({});
    await mongoose.connection.collection('counters').deleteMany({});
    
    console.log('✓ Cleared existing data');

    // Create users
    for (const userData of users) {
      await User.create(userData);
    }
    console.log('✓ Created 4 role users');

    // Create customers
    await Customer.insertMany(customers);
    console.log('✓ Created sample customers');

    // Create products
    await Product.insertMany(products);
    console.log('✓ Created sample products');

    console.log('\n========================================');
    console.log('Database seeded successfully!');
    console.log('========================================\n');
    
    console.log('Test Credentials:');
    console.log('-'.repeat(80));
    users.forEach(user => {
      console.log(`${user.role.padEnd(12)} | ${user.email.padEnd(35)} | ${user.password}`);
    });
    console.log('-'.repeat(80));
    
    console.log(`\nCustomers: ${customers.length}`);
    console.log(`Products: ${products.length}`);
    console.log('\nNote: One product (Cooking Oil 5L) has stock below minimum to test low-stock alerts\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
