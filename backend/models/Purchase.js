import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    event:         { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketTier:    { type: String,  default: 'General Admission' },
    quantity:      { type: Number,  required: true, min: 1, default: 1 },
    unitPrice:     { type: Number,  required: true },
    totalPrice:    { type: Number,  required: true },
    status:        { type: String,  enum: ['confirmed', 'cancelled', 'refunded'], default: 'confirmed' },
    paymentMethod: { type: String,  enum: ['card', 'cash', 'wallet'], default: 'card' },
  },
  { timestamps: true }
);

export default mongoose.model('Purchase', purchaseSchema);
