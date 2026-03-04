/**
 * Usage:
 *   node seed/makeAdmin.js your@email.com
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];
if (!email) { console.error('Usage: node seed/makeAdmin.js <email>'); process.exit(1); }

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  { role: 'admin' },
  { new: true }
);

if (!user) {
  console.error(`❌ No user found with email: ${email}`);
} else {
  console.log(`✅ ${user.firstName} ${user.lastName} (${user.email}) is now an admin`);
}

await mongoose.disconnect();
