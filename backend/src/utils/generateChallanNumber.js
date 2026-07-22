import mongoose from 'mongoose';

// Counter schema for auto-incrementing challan numbers
const counterSchema = new mongoose.Schema({
  _id: String,
  year: Number,
  sequence: Number
});

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Generate challan number in format: CH-YYYY-XXXXXX
 * Where XXXXXX is a 6-digit zero-padded sequence per year
 */
export const generateChallanNumber = async (session) => {
  const currentYear = new Date().getFullYear();
  const counterId = `challan-${currentYear}`;
  
  const counter = await Counter.findByIdAndUpdate(
    counterId,
    {
      $inc: { sequence: 1 },
      $setOnInsert: { year: currentYear }
    },
    {
      new: true,
      upsert: true,
      session
    }
  );
  
  const paddedSequence = String(counter.sequence).padStart(6, '0');
  return `CH-${currentYear}-${paddedSequence}`;
};
