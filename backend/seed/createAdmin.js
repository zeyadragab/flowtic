import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

import User from '../models/User.js';

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const adminData = {
      firstName: 'Admin',
      lastName:  'User',
      email:     'admin@flowtic.com',
      password:  'admin123',
      role:      'admin',
    };

    // If admin already exists, update role; otherwise create new
    const existing = await User.findOne({ email: adminData.email });

    if (existing) {
      existing.role = 'admin';
      await existing.save();
      console.log(`\n✅ Existing user promoted to admin`);
    } else {
      const admin = new User(adminData);
      await admin.save(); // password is auto-hashed by the model
      console.log(`\n✅ Admin user created`);
    }

    console.log('─────────────────────────────');
    console.log(`  Email    : ${adminData.email}`);
    console.log(`  Password : ${adminData.password}`);
    console.log(`  Role     : admin`);
    console.log('─────────────────────────────');
    console.log('Login at /login then go to /admin');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
