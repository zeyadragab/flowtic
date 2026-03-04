import { protect } from './auth.js';

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

export const protectAdmin = [protect, adminOnly];
