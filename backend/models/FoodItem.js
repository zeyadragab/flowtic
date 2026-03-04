import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    emoji: { type: String, default: '🍽️' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('FoodItem', foodItemSchema);
