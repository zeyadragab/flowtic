import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, BadgeCheck, ShieldCheck, TrendingUp, Sparkles, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';


const perks = [
  { icon: ShieldCheck, label: 'Verified sellers only' },
  { icon: TrendingUp, label: 'Price capped at 2× face value' },
  { icon: BadgeCheck, label: 'Identity check on every sale' },
];

function MiniMagneticCard({ children, style }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-40, 40], [4, -4]), { stiffness: 200, damping: 25 });
  const ry = useSpring(useTransform(x, [-40, 40], [-4, 4]), { stiffness: 200, damping: 25 });

  const handleMove = useCallback((e) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }, [reduce, x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        transformStyle: 'preserve-3d',
        perspective: 600,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function WhiteMarketSection() {
  const reduce = useReducedMotion();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.get('/api/resale')
      .then(res => setListings(res.data))
      .catch(() => {/* silently keep empty array */});
  }, []);

  return (
    <section
      className="section-padding"
      style={{ background: '#f8fbff', position: 'relative', overflow: 'hidden' }}
      aria-labelledby="whitemarket-heading"
    >
      <div style={{
        position: 'absolute', top: '10%', right: '5%', width: 400, height: 400,
        background: 'radial-gradient(circle, #ecfdf5 0%, transparent 70%)',
        opacity: 0.5, pointerEvents: 'none'
      }} />

      <div className="container-custom">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.span 
              className="badge" 
              style={{ marginBottom: 20, display: 'inline-flex', background: '#ecfdf5', color: '#059669', border: '1px solid rgba(16,185,129,0.15)' }}
            >
              <Sparkles size={10} style={{ marginRight: 4 }} />
              Secondary Market
            </motion.span>
            
            <h2
              id="whitemarket-heading"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 900,
                letterSpacing: '-2px',
                lineHeight: 1.05,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              Safe Ticket{' '}
              <span className="gradient-text" style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Resale.</span>
            </h2>

            <p
              style={{
                fontSize: 18,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                fontWeight: 500,
                marginBottom: 36,
              }}
            >
              The only legal resale marketplace in Egypt. Capped prices, ID-verified identity, and zero scams — 100% fraud-protected.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 44 }}>
              {perks.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 12,
                      background: 'rgba(16,185,129,0.08)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color="#059669" />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
                </motion.div>
              ))}
            </div>

            <Link to="/market" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={reduce ? {} : { scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: 'linear-gradient(135deg,#10b981,#34d399)',
                  padding: '14px 32px', borderRadius: 100, border: 'none',
                  color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                }}
              >
                Browse Market <ArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>

          {/* Right – Interactive listing cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}
          >
            {listings.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                <MiniMagneticCard
                  style={{
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: 'white',
                    borderRadius: 20,
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
                    cursor: 'default',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {item.eventTitle}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {item.verified && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '1px 6px', borderRadius: 100 }}>Verified</span>
                      )}
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <User size={10} /> {item.sellerName}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.5px',
                      paddingRight: 8
                    }}
                  >
                    {item.price} EGP
                  </span>
                </MiniMagneticCard>
              </motion.div>
            ))}

            {/* Bottom Special Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              style={{
                marginTop: 10,
                background: 'linear-gradient(135deg,#064e3b,#042f2e)',
                borderRadius: 24,
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                color: 'white',
                boxShadow: '0 12px 32px rgba(6,78,59,0.25)',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
               {/* Shimmer effect */}
               <motion.div
                  animate={{ x: ['-200%', '300%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0, width: '40%',
                    background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.05), transparent)',
                    pointerEvents: 'none',
                  }}
                />

              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
                  Sell Your Ticket <TrendingUp size={16} />
                </div>
                <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 500 }}>Verified resale is live. List in 60s.</div>
              </div>
              <Link to="/market" style={{ textDecoration: 'none', position: 'relative' }}>
                <motion.button
                  whileHover={{ scale: 1.05, background: '#f8fafc' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '12px 20px',
                    background: 'white',
                    color: '#064e3b',
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  Get Started <ShoppingCart size={13} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
