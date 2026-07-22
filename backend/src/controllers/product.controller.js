import mongoose from 'mongoose';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import asyncHandler from '../utils/asyncHandler.js';

// Create product
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  
  res.status(201).json({
    success: true,
    data: product,
    message: 'Product created successfully'
  });
});

// Get all products with filters
export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', category, lowStock } = req.query;
  
  const query = {};
  
  // Search across multiple fields
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (category) {
    query.category = category;
  }
  
  // Low stock filter
  if (lowStock === 'true') {
    query.$expr = { $lte: ['$currentStock', '$minStockAlert'] };
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query)
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

// Get single product
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  // Prevent direct currentStock updates (use stock adjustment endpoint)
  if (req.body.currentStock !== undefined) {
    delete req.body.currentStock;
  }
  
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    success: true,
    data: product,
    message: 'Product updated successfully'
  });
});

// Adjust stock
export const adjustStock = asyncHandler(async (req, res) => {
  const { quantity, movementType, reason } = req.body;
  const productId = req.params.id;
  
  if (!['IN', 'OUT'].includes(movementType)) {
    const error = new Error('Movement type must be IN or OUT');
    error.statusCode = 400;
    throw error;
  }
  
  if (!quantity || quantity <= 0) {
    const error = new Error('Quantity must be a positive number');
    error.statusCode = 400;
    throw error;
  }
  
  if (!reason || !reason.trim()) {
    const error = new Error('Reason is required');
    error.statusCode = 400;
    throw error;
  }
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const product = await Product.findById(productId).session(session);
    
    if (!product) {
      await session.abortTransaction();
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    
    const quantityChange = movementType === 'IN' ? quantity : -quantity;
    const newStock = product.currentStock + quantityChange;
    
    // Prevent negative stock
    if (newStock < 0) {
      await session.abortTransaction();
      const error = new Error(`Insufficient stock. Current: ${product.currentStock}, Requested: ${quantity}`);
      error.statusCode = 400;
      throw error;
    }
    
    // Update stock
    product.currentStock = newStock;
    await product.save({ session });
    
    // Log movement
    await StockMovement.create([{
      product: productId,
      quantityChanged: quantity,
      movementType,
      reason: reason.trim(),
      createdBy: req.user.id,
      timestamp: new Date()
    }], { session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: product,
      message: 'Stock adjusted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// Get stock movement log
export const getStockLog = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const productId = req.params.id;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    StockMovement.find({ product: productId })
      .populate('createdBy', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    StockMovement.countDocuments({ product: productId })
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
