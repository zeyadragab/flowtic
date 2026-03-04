import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET /api/events — list all events with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const sortOptions = {};
    if (sort === 'price-asc') sortOptions.price = 1;
    else if (sort === 'price-desc') sortOptions.price = -1;
    else if (sort === 'date') sortOptions.date = 1;
    else sortOptions.createdAt = -1; // default: newest first

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({ events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id — single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
