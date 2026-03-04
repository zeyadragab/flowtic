import mongoose from 'mongoose';

const ticketTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Number, required: true },
  total: { type: Number, required: true },
  description: { type: String, default: '' },
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Music', 'Sports', 'Culture', 'Comedy', 'Theatre', 'Festival'],
    },
    date: { type: String, required: true },
    time: { type: String, default: '' },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    hot: { type: Boolean, default: false },
    seats: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    gradient: [{ type: String }],
    ticketTiers: [ticketTierSchema],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    attendees: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual: availability percentage
eventSchema.virtual('availabilityPct').get(function () {
  if (this.seats === 0) return 0;
  return Math.round((this.sold / this.seats) * 100);
});

eventSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Event', eventSchema);
