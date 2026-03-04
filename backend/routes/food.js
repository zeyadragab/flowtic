import express from 'express';
import FoodItem from '../models/FoodItem.js';

const router = express.Router();

// GET /api/food — list all food items
router.get('/', async (req, res) => {
  try {
    const items = await FoodItem.find({ available: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
