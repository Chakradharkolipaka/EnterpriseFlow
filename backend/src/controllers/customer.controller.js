import Customer from '../models/Customer.js';
import asyncHandler from '../utils/asyncHandler.js';

// Create customer
export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create(req.body);
  
  res.status(201).json({
    success: true,
    data: customer,
    message: 'Customer created successfully'
  });
});

// Get all customers with filters
export const getCustomers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '', status, type } = req.query;
  
  const query = {};
  
  // Search across multiple fields
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { businessName: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status) {
    query.status = status;
  }
  
  if (type) {
    query.customerType = type;
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [items, total] = await Promise.all([
    Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Customer.countDocuments(query)
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

// Get single customer
export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id)
    .populate('notes.createdBy', 'name email');
  
  if (!customer) {
    const error = new Error('Customer not found');
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    success: true,
    data: customer
  });
});

// Update customer
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  
  if (!customer) {
    const error = new Error('Customer not found');
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    success: true,
    data: customer,
    message: 'Customer updated successfully'
  });
});

// Add follow-up note
export const addFollowUpNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  
  if (!text || !text.trim()) {
    const error = new Error('Note text is required');
    error.statusCode = 400;
    throw error;
  }
  
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        notes: {
          text: text.trim(),
          createdBy: req.user.id,
          createdAt: new Date()
        }
      }
    },
    { new: true }
  ).populate('notes.createdBy', 'name email');
  
  if (!customer) {
    const error = new Error('Customer not found');
    error.statusCode = 404;
    throw error;
  }
  
  res.status(200).json({
    success: true,
    data: customer,
    message: 'Follow-up note added successfully'
  });
});
