import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

import Event from '../models/Event.js';
import FoodItem from '../models/FoodItem.js';
import ResaleListing from '../models/ResaleListing.js';

const events = [
  {
    title: 'Cairo Jazz Festival 2026',
    category: 'Music',
    date: 'Mar 15, 2026',
    time: '7:00 PM',
    location: 'Cairo Opera House, Zamalek',
    description: "Experience the finest jazz artists from Egypt and around the world. An unforgettable night of improvisation, soul, and rhythm under Cairo's skyline. Join thousands of music lovers for a truly world-class performance.",
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop',
    price: 250,
    hot: true,
    seats: 1200,
    sold: 960,
    gradient: ['#7c3aed', '#a855f7'],
    rating: 4.8,
    attendees: 12000,
    ticketTiers: [
      { name: 'General', price: 250, available: 240, total: 1200, description: 'General admission standing area' },
      { name: 'VIP', price: 550, available: 32, total: 200, description: 'Reserved seating with complimentary drinks' },
      { name: 'Premium', price: 950, available: 8, total: 50, description: 'Front-row seats with backstage access' },
    ],
  },
  {
    title: 'Al-Ahly vs Zamalek — El Classico',
    category: 'Sports',
    date: 'Feb 28, 2026',
    time: '8:30 PM',
    location: 'Cairo International Stadium',
    description: "The biggest derby in African football. El Classico returns — 75,000 fans, 90 minutes of pure adrenaline. Two giants of Egyptian football collide again. Don't miss a single second.",
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
    price: 350,
    hot: true,
    seats: 400,
    sold: 380,
    gradient: ['#059669', '#34d399'],
    rating: 4.9,
    attendees: 75000,
    ticketTiers: [
      { name: 'East Stand', price: 350, available: 20, total: 400, description: 'General stadium seating' },
      { name: 'West VIP', price: 700, available: 5, total: 80, description: 'Premium seating with lounge access' },
      { name: 'Skybox', price: 1500, available: 2, total: 10, description: 'Private skybox with catering' },
    ],
  },
  {
    title: 'Pharaonic Heritage Exhibition',
    category: 'Culture',
    date: 'Mar–Apr 2026',
    time: '9 AM – 8 PM',
    location: 'Grand Egyptian Museum, Giza',
    description: "Walk through 5,000 years of Egyptian civilisation. Over 4,000 artefacts including Tutankhamun's golden throne — now on display for the first time. A journey through time like no other.",
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1000&auto=format&fit=crop',
    price: 150,
    hot: false,
    seats: 9999,
    sold: 2000,
    gradient: ['#d97706', '#f59e0b'],
    rating: 4.7,
    attendees: 8000,
    ticketTiers: [
      { name: 'Adult', price: 150, available: 9999, total: 9999, description: 'Full adult admission' },
      { name: 'Student', price: 75, available: 9999, total: 9999, description: 'Valid student ID required' },
      { name: 'Family (4)', price: 400, available: 9999, total: 9999, description: '2 adults + 2 children under 12' },
    ],
  },
  {
    title: 'Stand-Up Night — Cairo Edition',
    category: 'Comedy',
    date: 'Mar 8, 2026',
    time: '9:00 PM',
    location: 'El Sawy Culturewheel, Zamalek',
    description: "Cairo's funniest night is back. Six top Egyptian comedians, two hours of non-stop laughter. Warning: may cause uncontrollable giggling. Suitable for all ages 16+.",
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop',
    price: 200,
    hot: false,
    seats: 200,
    sold: 160,
    gradient: ['#db2777', '#f472b6'],
    rating: 4.6,
    attendees: 500,
    ticketTiers: [
      { name: 'Standard', price: 200, available: 40, total: 200, description: 'General admission seating' },
      { name: 'Front Row', price: 350, available: 10, total: 50, description: 'Premium front-row seats' },
    ],
  },
  {
    title: 'Alexandria Rock Fest 2026',
    category: 'Music',
    date: 'Apr 5, 2026',
    time: '6:00 PM',
    location: 'Mediterranean Arena, Alexandria',
    description: "Egypt's biggest rock festival returns to Alexandria. 10+ bands, fireworks, and the Mediterranean as your backdrop. A night of pure energy.",
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop',
    price: 300,
    hot: false,
    seats: 800,
    sold: 520,
    gradient: ['#7c3aed', '#6366f1'],
    rating: 4.7,
    attendees: 5000,
    ticketTiers: [
      { name: 'General', price: 300, available: 280, total: 800, description: 'Standing general admission' },
      { name: 'VIP', price: 650, available: 45, total: 150, description: 'Elevated VIP platform with bar' },
    ],
  },
  {
    title: 'Egypt Swimming Championship',
    category: 'Sports',
    date: 'Mar 20, 2026',
    time: '10:00 AM',
    location: 'Cairo Aquatic Center',
    description: 'Watch Egypt\'s top swimmers compete for national glory. Five events, one champion — witness athletic excellence at its finest.',
    image: 'https://images.unsplash.com/photo-1530549387074-6b21c8169760?q=80&w=1000&auto=format&fit=crop',
    price: 100,
    hot: false,
    seats: 500,
    sold: 210,
    gradient: ['#0284c7', '#38bdf8'],
    rating: 4.4,
    attendees: 1200,
    ticketTiers: [
      { name: 'General', price: 100, available: 290, total: 500, description: 'General bleacher seating' },
      { name: 'Poolside', price: 200, available: 80, total: 120, description: 'Poolside reserved seats' },
    ],
  },
  {
    title: 'Modern Art Biennale Cairo',
    category: 'Culture',
    date: 'Apr 12, 2026',
    time: '10 AM – 9 PM',
    location: 'Zamalek Art Gallery',
    description: 'Cairo\'s premier contemporary art event. 60 artists from 20 countries, interactive installations, and live art sessions. Culture at its finest.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000&auto=format&fit=crop',
    price: 80,
    hot: false,
    seats: 300,
    sold: 88,
    gradient: ['#d97706', '#ea580c'],
    rating: 4.5,
    attendees: 2000,
    ticketTiers: [
      { name: 'Day Pass', price: 80, available: 212, total: 300, description: 'Full day gallery access' },
      { name: 'Season Pass', price: 200, available: 50, total: 80, description: 'All-week unlimited access' },
    ],
  },
  {
    title: 'Macbeth — Cairo Modern Theatre',
    category: 'Theatre',
    date: 'Mar 25, 2026',
    time: '8:00 PM',
    location: 'Cairo Cultural Palace',
    description: 'Shakespeare\'s masterpiece reimagined in modern Cairo. A gripping tale of power, ambition, and betrayal performed by Egypt\'s finest theatre company.',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop',
    price: 180,
    hot: false,
    seats: 250,
    sold: 180,
    gradient: ['#dc2626', '#ef4444'],
    rating: 4.8,
    attendees: 800,
    ticketTiers: [
      { name: 'Standard', price: 180, available: 70, total: 250, description: 'Main hall seating' },
      { name: 'Premium', price: 320, available: 20, total: 60, description: 'Orchestra-level premium seats' },
    ],
  },
  {
    title: 'Sharm El-Sheikh Beach Festival',
    category: 'Festival',
    date: 'May 1, 2026',
    time: 'All Day',
    location: 'Naama Bay, Sharm El-Sheikh',
    description: 'Three days of music, food, and sun on the Red Sea. 30+ artists, beach parties, and the best street food in Egypt — all in paradise. An experience you won\'t forget.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
    price: 500,
    hot: true,
    seats: 2000,
    sold: 1600,
    gradient: ['#059669', '#34d399'],
    rating: 4.9,
    attendees: 20000,
    ticketTiers: [
      { name: 'Day Pass', price: 500, available: 400, total: 2000, description: 'Single day admission' },
      { name: 'Weekend', price: 1200, available: 120, total: 500, description: '3-day festival pass' },
      { name: 'VIP All-in', price: 2500, available: 15, total: 50, description: 'VIP pass with hotel package' },
    ],
  },
  {
    title: 'Cairo Gymnastics Open',
    category: 'Sports',
    date: 'Apr 18, 2026',
    time: '11:00 AM',
    location: 'Sporting Club, Alexandria',
    description: 'Elite gymnasts from across Egypt and the Arab world compete in this prestigious open championship. Witness breathtaking routines and athleticism.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
    price: 120,
    hot: false,
    seats: 400,
    sold: 140,
    gradient: ['#059669', '#10b981'],
    rating: 4.3,
    attendees: 1500,
    ticketTiers: [
      { name: 'General', price: 120, available: 260, total: 400, description: 'General bleacher seating' },
    ],
  },
  {
    title: 'Cairo Symphony Orchestra Night',
    category: 'Music',
    date: 'Mar 30, 2026',
    time: '8:00 PM',
    location: 'Cairo Opera House',
    description: "An enchanting evening with Egypt's premier orchestra performing Beethoven, Mozart, and special Egyptian compositions. A cultural night you'll treasure forever.",
    image: 'https://images.unsplash.com/photo-1465847793335-241927508ebb?q=80&w=1000&auto=format&fit=crop',
    price: 220,
    hot: false,
    seats: 600,
    sold: 350,
    gradient: ['#7c3aed', '#8b5cf6'],
    rating: 4.9,
    attendees: 3000,
    ticketTiers: [
      { name: 'Standard', price: 220, available: 250, total: 600, description: 'Rear stalls seating' },
      { name: 'Premium', price: 480, available: 80, total: 150, description: 'Orchestra-level prime seats' },
      { name: 'Box Seats', price: 900, available: 10, total: 20, description: 'Private box with refreshments' },
    ],
  },
  {
    title: 'Egypt Fitness Expo 2026',
    category: 'Sports',
    date: 'Apr 2, 2026',
    time: '9:00 AM',
    location: 'CICC, New Cairo',
    description: "Egypt's largest fitness and wellness exhibition. 200+ brands, live competitions, masterclasses from top athletes, and the best supplements in Egypt. Get inspired.",
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    price: 150,
    hot: false,
    seats: 1500,
    sold: 600,
    gradient: ['#059669', '#065f46'],
    rating: 4.5,
    attendees: 8000,
    ticketTiers: [
      { name: 'Day Pass', price: 150, available: 900, total: 1500, description: 'Full day expo access' },
      { name: '3-Day Pass', price: 350, available: 200, total: 400, description: 'All 3 days unlimited access' },
      { name: 'VIP Pass', price: 750, available: 25, total: 50, description: 'VIP lane + athlete meet & greet' },
    ],
  },
];

const foodItems = [
  { name: 'Classic Burger', price: 85, category: 'Burgers', description: 'Juicy beef patty with fresh lettuce, tomato, and house sauce', emoji: '🍔', available: true },
  { name: 'Margherita Pizza', price: 120, category: 'Pizza', description: 'Wood-fired pizza with San Marzano tomato and fresh mozzarella', emoji: '🍕', available: true },
  { name: 'Iced Latte', price: 45, category: 'Drinks', description: 'Cold brew espresso over ice with whole milk', emoji: '🥤', available: true },
  { name: 'Nachos Platter', price: 95, category: 'Snacks', description: 'Crispy tortilla chips with guacamole, salsa, and cheese dip', emoji: '🌮', available: true },
];

const resaleListings = [
  {
    eventTitle: 'Cairo Jazz Festival 2026',
    eventDate: 'Mar 15, 2026',
    eventLocation: 'Cairo Opera House',
    sellerName: 'Ahmed M.',
    price: 220,
    originalPrice: 250,
    verified: true,
    ticketType: 'General',
  },
  {
    eventTitle: 'Al-Ahly vs Zamalek — El Classico',
    eventDate: 'Feb 28, 2026',
    eventLocation: 'Cairo International Stadium',
    sellerName: 'Sara K.',
    price: 395,
    originalPrice: 350,
    verified: true,
    ticketType: 'East Stand',
  },
  {
    eventTitle: 'Heritage Exhibition',
    eventDate: 'Mar–Apr 2026',
    eventLocation: 'Grand Egyptian Museum',
    sellerName: 'Omar F.',
    price: 145,
    originalPrice: 150,
    verified: true,
    ticketType: 'Adult',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    await FoodItem.deleteMany({});
    await ResaleListing.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert events
    const insertedEvents = await Event.insertMany(events);
    console.log(`📅 Seeded ${insertedEvents.length} events`);

    // Insert food items
    const insertedFood = await FoodItem.insertMany(foodItems);
    console.log(`🍔 Seeded ${insertedFood.length} food items`);

    // Insert resale listings (link first 3 events)
    const listingsWithRefs = resaleListings.map((listing, i) => ({
      ...listing,
      event: insertedEvents[i]?._id || null,
    }));
    const insertedListings = await ResaleListing.insertMany(listingsWithRefs);
    console.log(`🎫 Seeded ${insertedListings.length} resale listings`);

    console.log('\n✅ Database seeded successfully!');
    console.log('You can now start your server with: node index.js');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
