import express from 'express';
import User          from '../models/User.js';
import Event         from '../models/Event.js';
import FoodItem      from '../models/FoodItem.js';
import ResaleListing from '../models/ResaleListing.js';
import Purchase      from '../models/Purchase.js';
import { protectAdmin } from '../middleware/admin.js';

const router = express.Router();
router.use(protectAdmin);

// ── ANALYTICS ────────────────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const [totalUsers, totalEvents, totalFood, totalResale, totalPurchases] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      FoodItem.countDocuments(),
      ResaleListing.countDocuments(),
      Purchase.countDocuments(),
    ]);

    const revenueAgg = await Purchase.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Revenue by month — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const revenueByMonth = await Purchase.aggregate([
      { $match: { status: 'confirmed', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          count:   { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Sales by event category
    const salesByCategory = await Purchase.aggregate([
      { $match: { status: 'confirmed' } },
      { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'ev' } },
      { $unwind: '$ev' },
      { $group: { _id: '$ev.category', revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
    ]);

    // Top 5 events by revenue
    const topEvents = await Purchase.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: '$event', revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'ev' } },
      { $unwind: '$ev' },
      { $project: { title: '$ev.title', category: '$ev.category', revenue: 1, count: 1 } },
    ]);

    // Payment method breakdown
    const paymentBreakdown = await Purchase.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]);

    // Recent purchases
    const recentPurchases = await Purchase.find()
      .populate('user',  'firstName lastName email')
      .populate('event', 'title category')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: { totalUsers, totalEvents, totalFood, totalResale, totalPurchases, totalRevenue },
      revenueByMonth,
      salesByCategory,
      topEvents,
      paymentBreakdown,
      recentPurchases,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── USERS ────────────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { search, role, page = 1, limit = 15 } = req.query;
    const q = {};
    if (search) q.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName:  { $regex: search, $options: 'i' } },
      { email:     { $regex: search, $options: 'i' } },
    ];
    if (role) q.role = role;
    const total = await User.countDocuments(q);
    const users = await User.find(q)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, firstName, lastName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(role && { role }), ...(firstName && { firstName }), ...(lastName && { lastName }) },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot delete your own account' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── EVENTS ───────────────────────────────────────────────────────────────────
router.get('/events', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 15 } = req.query;
    const q = {};
    if (search) q.title = { $regex: search, $options: 'i' };
    if (category && category !== 'All') q.category = category;
    const total = await Event.countDocuments(q);
    const events = await Event.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── FOOD ─────────────────────────────────────────────────────────────────────
router.get('/food', async (req, res) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const q = {};
    if (search) q.$or = [
      { name:     { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
    const total = await FoodItem.countDocuments(q);
    const items = await FoodItem.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/food', async (req, res) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/food/:id', async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Food item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/food/:id', async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── RESALE ───────────────────────────────────────────────────────────────────
router.get('/resale', async (req, res) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const q = {};
    if (search) q.eventTitle = { $regex: search, $options: 'i' };
    const total = await ResaleListing.countDocuments(q);
    const listings = await ResaleListing.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/resale/:id', async (req, res) => {
  try {
    const listing = await ResaleListing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/resale/:id', async (req, res) => {
  try {
    await ResaleListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PURCHASES ────────────────────────────────────────────────────────────────
router.get('/purchases', async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const q = {};
    if (status) q.status = status;
    const total = await Purchase.countDocuments(q);
    const purchases = await Purchase.find(q)
      .populate('user',  'firstName lastName email')
      .populate('event', 'title category')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ purchases, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/purchases', async (req, res) => {
  try {
    const purchase = await Purchase.create(req.body);
    await purchase.populate('user',  'firstName lastName email');
    await purchase.populate('event', 'title category');
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/purchases/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('user',  'firstName lastName email')
      .populate('event', 'title category');
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/purchases/:id', async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
