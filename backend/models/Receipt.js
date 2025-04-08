const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    receiptFile: { type: String, required: true },
  }, 
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('Receipt', receiptSchema);
