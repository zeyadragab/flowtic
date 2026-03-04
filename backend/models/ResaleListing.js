import mongoose from 'mongoose';

const resaleListingSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    eventTitle: { type: String, required: true },
    eventDate: { type: String, default: '' },
    eventLocation: { type: String, default: '' },
    sellerName: { type: String, default: 'Anonymous' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    ticketType: { type: String, default: 'General Admission' },
  },
  { timestamps: true }
);

export default mongoose.model('ResaleListing', resaleListingSchema);
