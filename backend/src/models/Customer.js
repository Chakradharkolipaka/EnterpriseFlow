import mongoose from 'mongoose';

const followUpNoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  customerType: {
    type: String,
    enum: ['Retail', 'Wholesale', 'Distributor'],
    required: [true, 'Customer type is required']
  },
  address: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Lead', 'Active', 'Inactive'],
    default: 'Lead'
  },
  followUpDate: {
    type: Date
  },
  notes: [followUpNoteSchema]
}, {
  timestamps: true
});

// Indexes for search
customerSchema.index({ name: 'text', businessName: 'text', email: 'text', mobile: 'text' });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
