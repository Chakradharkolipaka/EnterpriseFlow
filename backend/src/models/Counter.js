import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    unique: true
  },
  sequence: {
    type: Number,
    required: true,
    default: 0
  }
});

// Check if model already exists before creating it
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export default Counter;
