import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantityChanged: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  movementType: {
    type: String,
    enum: ['IN', 'OUT'],
    required: [true, 'Movement type is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for querying by product
stockMovementSchema.index({ product: 1, timestamp: -1 });

// Check if model already exists before creating it
const StockMovement = mongoose.models.StockMovement || mongoose.model('StockMovement', stockMovementSchema);

export default StockMovement;
