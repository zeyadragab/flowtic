import express from 'express';
import ResaleListing from '../models/ResaleListing.js';

const router = express.Router();

// GET /api/resale — list resale listings
router.get('/', async (req, res) => {
  try {
    const listings = await ResaleListing.find()
      .populate('event', 'title image gradient')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
