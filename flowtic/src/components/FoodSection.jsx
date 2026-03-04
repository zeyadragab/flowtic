import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Smartphone, Zap, CreditCard, ChefHat } from 'lucide-react';
import api from '../services/api.js';

const features = [
  { icon: Smartphone, label: 'Order on app', color: '#2563eb', bg: '#eff6ff' },
  { icon: Zap, label: 'Express pickup', color: '#0891b2', bg: '#ecfeff' },
  { icon: CreditCard, label: 'Cashless payment', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: ChefHat, label: 'AI suggestions', color: '#d97706', bg: '#fffbeb' },
];

export default function FoodSection() {
  const reduce = useReducedMotion();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    api.get('/api/food')
      .then(res => setMenuItems(res.data))
      .catch(() => {/* silently keep empty array */});
  }, []);

  return (
    <section
      className="section-padding"
      style={{ background: 'white' }}
      aria-labelledby="food-heading"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Venue Services</span>
          <h2
            id="food-heading"
            style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Food & Drinks,{' '}
            <span className="gradient-text">Delivered.</span>
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', fontWeight: 500, maxWidth: 440, margin: '0 auto' }}>
            Don't miss a moment. Order from your seat, pick up express.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* Left – feature pills + menu preview */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Feature pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 32,
              }}
            >
              {features.map(({ icon: Icon, label, color, bg }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={reduce ? {} : { y: -3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 16px',
                    background: bg,
                    border: `1px solid ${color}20`,
                    borderRadius: 100,
                    cursor: 'default',
                  }}
                >
                  <Icon size={14} color={color} />
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Menu card */}
            <div
              className="glass"
              style={{
                padding: 24,
                borderRadius: 28,
                background: 'linear-gradient(135deg, #f8fbff, white)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginBottom: 16 }}>
                Popular Menu
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {menuItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 + 0.2 }}
                    whileHover={reduce ? {} : { x: 4, transition: { duration: 0.15 } }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'white',
                      borderRadius: 16,
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-main)' }}>{item.price} EGP</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right – description */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <h3
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-1px',
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              Order from your seat.
            </h3>
            <p
              style={{
                fontSize: 16,
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                fontWeight: 500,
                marginBottom: 40,
              }}
            >
              Browse the venue's full menu, place your order right in the app, and
              get notified the moment your food is ready for express pickup.
              Zero queues. Zero hassle.
            </p>

            <motion.button
              whileHover={reduce ? {} : { scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline"
            >
              View Full Menu
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
