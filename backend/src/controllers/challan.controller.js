import mongoose from 'mongoose';
import Challan from '../models/Challan.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import StockMovement from '../models/StockMovement.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateChallanNumber } from '../utils/generateChallanNumber.js';

// Create challan
export const createChallan = asyncHandler(async (req, res) => {
  const { customer, products, confirmImmediately } = req.body;
  
  if (!products || products.length === 0) {
    const error = new Error('At least one product is required');
    error.statusCode = 400;
    throw error;
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Fetch customer data for snapshot
    const customerDoc = await Customer.findById(customer).session(session);
    if (!customerDoc) {
      throw Object.assign(new Error('Customer not found'), { statusCode: 404 });
    }
    
    // Fetch product data and create snapshots
    const productSnapshots = [];
    let totalQuantity = 0;
    
    for (const item of products) {
      const productDoc = await Product.findById(item.product).session(session);
      if (!productDoc) {
        throw Object.assign(new Error(`Product ${item.product} not found`), { statusCode: 404 });
      }
      
      productSnapshots.push({
        product: productDoc._id,
        name: productDoc.name,
        sku: productDoc.sku,
        unitPrice: productDoc.unitPrice,
        quantity: item.quantity
      });
      
      totalQuantity += item.quantity;
    }
    
    // Generate challan number
    const challanNumber = await generateChallanNumber(session);
    
    // Create challan
    const challan = await Challan.create([{
      challanNumber,
      customer: customerDoc._id,
      customerSnapshot: {
        name: customerDoc.name,
        mobile: customerDoc.mobile,
        businessName: customerDoc.businessName
      },
      products: productSnapshots,
      totalQuantity,
      status: confirmImmediately ? 'Confirmed' : 'Draft',
      createdBy: req.user.id
    }], { session });
    
    // If confirming immediately, deduct stock
    if (confirmImmediately) {
      await deductStock(challan[0], session, req.user.id);
    }
    
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: challan[0],
      message: `Challan created successfully as ${confirmImmediately ? 'Confirmed' : 'Draft'}`
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Helper function to deduct stock
const deductStock = async (challan, session, userId) => {
  const insufficientStock = [];
  
  // Check all products first
  for (const item of challan.products) {
    const product = await Product.findById(item.product).session(session);
    if (product.currentStock < item.quantity) {
      insufficientStock.push({
        sku: item.sku,
        name: item.name,
        required: item.quantity,
        available: product.currentStock
      });
    }
  }
  
  // If any product has insufficient stock, fail the whole operation
  if (insufficientStock.length > 0) {
    const error = new Error('Insufficient stock for one or more products');
    error.statusCode = 400;
    error.errors = insufficientStock.map(item => 
      `${item.name} (${item.sku}): Required ${item.required}, Available ${item.available}`
    );
    throw error;
  }
  
  // All checks passed, now deduct stock
  for (const item of challan.products) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { currentStock: -item.quantity } },
      { session }
    );
    
    // Log stock movement
    await StockMovement.create([{
      product: item.product,
      quantityChanged: item.quantity,
      movementType: 'OUT',
      reason: `Challan confirmed: ${challan.challanNumber}`,
      createdBy: userId,
      timestamp: new Date()
    }], { session });
  }
};

// Get challans with filters
export const getChallans = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, customer } = req.query;
  
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (customer) {
    query.customer = customer;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    Challan.find(query)
      .populate('customer', 'name mobile businessName')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Challan.countDocuments(query)
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      items,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    }
  });
});

// Get single challan
export const getChallan = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id)
    .populate('customer', 'name mobile businessName email')
    .populate('createdBy', 'name email role')
    .populate('products.product', 'currentStock');
  
  if (!challan) {
    const error = new Error('Challan not found');
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    success: true,
    data: challan
  });
});

// Update challan (only when Draft)
export const updateChallan = asyncHandler(async (req, res) => {
  const challan = await Challan.findById(req.params.id);
  
  if (!challan) {
    const error = new Error('Challan not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (challan.status !== 'Draft') {
    const error = new Error('Only draft challans can be edited');
    error.statusCode = 400;
    throw error;
  }
  
  // Update allowed fields
  const { products } = req.body;
  
  if (products && products.length > 0) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Fetch product data and create snapshots
      const productSnapshots = [];
      let totalQuantity = 0;
      
      for (const item of products) {
        const productDoc = await Product.findById(item.product).session(session);
        if (!productDoc) {
          throw Object.assign(new Error(`Product ${item.product} not found`), { statusCode: 404 });
        }
        
        productSnapshots.push({
          product: productDoc._id,
          name: productDoc.name,
          sku: productDoc.sku,
          unitPrice: productDoc.unitPrice,
          quantity: item.quantity
        });
        
        totalQuantity += item.quantity;
      }
      
      challan.products = productSnapshots;
      challan.totalQuantity = totalQuantity;
      await challan.save({ session });
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  res.status(200).json({
    success: true,
    data: challan,
    message: 'Challan updated successfully'
  });
});

// Confirm challan (Draft -> Confirmed)
export const confirmChallan = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const challan = await Challan.findById(req.params.id).session(session);
    
    if (!challan) {
      throw Object.assign(new Error('Challan not found'), { statusCode: 404 });
    }
    
    if (challan.status !== 'Draft') {
      throw Object.assign(new Error('Only draft challans can be confirmed'), { statusCode: 400 });
    }
    
    // Deduct stock
    await deductStock(challan, session, req.user.id);
    
    // Update status
    challan.status = 'Confirmed';
    await challan.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: challan,
      message: 'Challan confirmed successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Cancel challan
export const cancelChallan = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const challan = await Challan.findById(req.params.id).session(session);
    
    if (!challan) {
      throw Object.assign(new Error('Challan not found'), { statusCode: 404 });
    }
    
    if (challan.status === 'Cancelled') {
      throw Object.assign(new Error('Challan is already cancelled'), { statusCode: 400 });
    }
    
    // If it was confirmed, restore stock
    if (challan.status === 'Confirmed') {
      for (const item of challan.products) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { currentStock: item.quantity } },
          { session }
        );
        
        // Log stock movement
        await StockMovement.create([{
          product: item.product,
          quantityChanged: item.quantity,
          movementType: 'IN',
          reason: `Challan cancelled: ${challan.challanNumber}`,
          createdBy: req.user.id,
          timestamp: new Date()
        }], { session });
      }
    }
    
    // Update status
    challan.status = 'Cancelled';
    await challan.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: challan,
      message: 'Challan cancelled successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
