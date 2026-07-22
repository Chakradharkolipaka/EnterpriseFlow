import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  minStockAlert: {
    type: Number,
    default: 10,
    min: [0, 'Min stock alert cannot be negative']
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ name: 'text', sku: 'text', category: 'text' });
productSchema.index({ sku: 1 });

// Check if model already exists before creating it
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
