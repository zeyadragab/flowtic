import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import eventsRouter from './routes/events.js';
import foodRouter from './routes/food.js';
import resaleRouter from './routes/resale.js';
import authRouter from './routes/auth.js';
import adminRouter    from './routes/admin.js';
import purchasesRouter from './routes/purchases.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost origin (any port) and requests with no origin (Postman, etc.)
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/food', foodRouter);
app.use('/api/resale', resaleRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin',     adminRouter);
app.use('/api/purchases', purchasesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EventEG API is running' });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
