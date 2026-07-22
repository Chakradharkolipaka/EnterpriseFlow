import mongoose from 'mongoose';

const challanProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Snapshots - preserve at time of adding to challan
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  }
});

const challanSchema = new mongoose.Schema({
  challanNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  // Customer snapshot
  customerSnapshot: {
    name: String,
    mobile: String,
    businessName: String
  },
  products: [challanProductSchema],
  totalQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'Cancelled'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total quantity before saving
challanProductSchema.pre('save', function(next) {
  if (this.parent) {
    this.parent().totalQuantity = this.parent().products.reduce((sum, p) => sum + p.quantity, 0);
  }
  next();
});

challanSchema.index({ challanNumber: 1 });
challanSchema.index({ customer: 1 });
challanSchema.index({ status: 1 });

// Check if model already exists before creating it
const Challan = mongoose.models.Challan || mongoose.model('Challan', challanSchema);

export default Challan;
