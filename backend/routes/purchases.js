import express from 'express';
import Purchase from '../models/Purchase.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/purchases — authenticated user's own purchases
router.get('/', protect, async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate('event', 'title date time location image gradient category')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
