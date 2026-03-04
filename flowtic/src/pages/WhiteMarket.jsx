import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Search, SlidersHorizontal, ArrowLeft, Shield, CheckCircle2,
  Tag, User, Clock, ShoppingCart, DollarSign, ArrowRight,
  Zap, Sparkles, AlertCircle
} from 'lucide-react';
import api from '../services/api';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getBadge(l) {
  if (l.price < l.originalPrice) return 'Below Market';
  if (l.price > l.originalPrice) return 'Hot';
  return 'Deal';
}

const BADGE_CONFIG = {
  'Below Market': { color: '#059669', bg: '#ecfdf5' },
  'Hot':          { color: '#ef4444', bg: '#fef2f2' },
  'Deal':         { color: '#7c3aed', bg: '#f5f3ff' },
  'Verified':     { color: '#2563eb', bg: '#eff6ff' },
};

/* ─── Magnetic Card ─── */
function MagneticCard({ children, style, onMouseEnter, onMouseLeave }) {
  const reduce = useReducedMotion();
  const ref    = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX  = useSpring(useTransform(y, [-80, 80], [6, -6]),  { stiffness: 200, damping: 28 });
  const rotateY  = useSpring(useTransform(x, [-80, 80], [-6, 6]),  { stiffness: 200, damping: 28 });
  const translateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMove  = useCallback((e) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width  / 2);
    y.set(e.clientY - rect.top  - rect.height / 2);
  }, [reduce, x, y]);

  const handleLeave = useCallback(() => {
    x.set(0); y.set(0); translateY.set(0);
    onMouseLeave?.();
  }, [x, y, translateY, onMouseLeave]);

  const handleEnter = useCallback(() => {
    if (!reduce) translateY.set(-10);
    onMouseEnter?.();
  }, [reduce, translateY, onMouseEnter]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      style={{ ...style, rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, y: reduce ? 0 : translateY, transformStyle: 'preserve-3d', perspective: 800 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating Orb ─── */
function FloatOrb({ size, color, top, left, right, bottom, delay = 0, duration = 8 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      animate={reduce ? {} : { y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        borderRadius: '50%', pointerEvents: 'none', top, left, right, bottom,
        opacity: 0.5, filter: 'blur(2px)',
      }}
    />
  );
}

/* ─── Main Component ─── */
export default function WhiteMarket() {
  const [tab,      setTab]      = useState('buy');
  const [filter,   setFilter]   = useState('');
  const [sold,     setSold]     = useState(false);
  const [hovered,  setHovered]  = useState(null);
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    api.get('/api/resale')
      .then(r => setListings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter(l =>
    l.eventTitle.toLowerCase().includes(filter.toLowerCase())
  );

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden:   { opacity: 0, y: reduce ? 0 : 32, scale: 0.98 },
    visible:  { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ position: 'relative', paddingTop: 140, paddingBottom: 100, overflow: 'hidden', background: 'white' }} aria-label="Market header">
        <FloatOrb size={560} color="#ecfdf5" top="-15%"  right="-10%"  delay={0}   duration={10} />
        <FloatOrb size={400} color="#eff6ff" bottom="-10%" left="-10%" delay={2.5} duration={12} />

        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '40px 40px', opacity: 0.3, pointerEvents: 'none',
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 'var(--s-4)' }}>
            <motion.div whileHover={{ x: -4 }} style={{ display: 'inline-block' }}>
              <Link to="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--s-1)',
                fontSize: 13, fontWeight: 700, color: 'var(--blue-main)',
                textDecoration: 'none', padding: '10px 20px',
                background: 'var(--blue-soft)', borderRadius: 100,
                border: '1px solid rgba(16,185,129,0.15)', boxShadow: 'var(--shadow-sm)',
              }}>
                <ArrowLeft size={16} /> Back Home
              </Link>
            </motion.div>
          </motion.div>

          <div style={{ textAlign: 'center' }}>
            <motion.span
              className="badge"
              style={{ marginBottom: 'var(--s-3)', display: 'inline-flex', background: '#ecfdf5', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}
              animate={reduce ? {} : { boxShadow: ['0 0 0 0 rgba(16,185,129,0.2)', '0 0 0 12px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <Shield size={12} style={{ marginRight: 6 }} /> Premium Resale Infrastructure
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-2.5px', color: 'var(--text-primary)', marginBottom: 'var(--s-2)', lineHeight: 1.05 }}
            >
              🔄 <span style={{ background: 'linear-gradient(135deg,#10b981,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>White Market</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              style={{ fontSize: 19, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 48px', fontWeight: 500, lineHeight: 1.7 }}
            >
              The official secondary marketplace. Fair prices, ID-verified sellers, and zero fraud — guaranteed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
              style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--s-2)' }}
            >
              {[
                { icon: Shield,       text: 'Government ID Verified' },
                { icon: Zap,          text: 'Fast Escrow Transfer' },
                { icon: CheckCircle2, text: 'Buyer Fraud Shield' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 24px', background: 'white', borderRadius: 20,
                  border: '1px solid var(--border-subtle)', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <item.icon size={16} style={{ color: '#059669' }} /> {item.text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-custom" style={{ maxWidth: 1000 }}>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 56 }}>
            <div style={{ display: 'flex', gap: 8, padding: 8, background: 'white', borderRadius: 24, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
              {[
                { id: 'buy',  icon: ShoppingCart, label: 'Secondary Buy' },
                { id: 'sell', icon: DollarSign,   label: 'Resell My Ticket' },
              ].map(t => (
                <motion.button
                  key={t.id} onClick={() => setTab(t.id)}
                  whileHover={reduce ? {} : { scale: 1.03 }}
                  whileTap={reduce ? {} : { scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 28px', borderRadius: 18,
                    fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: tab === t.id ? 'linear-gradient(135deg,#10b981,#34d399)' : 'transparent',
                    color: tab === t.id ? 'white' : 'var(--text-secondary)',
                    transition: 'color 0.3s, background 0.3s',
                    boxShadow: tab === t.id ? '0 8px 20px rgba(16,185,129,0.3)' : 'none',
                  }}
                >
                  <t.icon size={18} /> {t.label}
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'buy' ? (
              <motion.div
                key="buy-tab"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Search */}
                <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto 64px' }}>
                  <Search size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text" placeholder="Search verified listings…" value={filter}
                    onChange={e => setFilter(e.target.value)}
                    style={{
                      width: '100%', padding: '16px 20px 16px 52px', borderRadius: 100,
                      background: 'white', border: '2px solid var(--border-subtle)',
                      fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.2s',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)'; }}
                    onBlur={e =>  { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
                  />
                  <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                    <button style={{ background: 'var(--bg-secondary)', border: 'none', padding: 10, borderRadius: '50%', cursor: 'pointer' }}>
                      <SlidersHorizontal size={16} />
                    </button>
                  </div>
                </div>

                {/* Loading */}
                {loading && (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: 600 }}>Loading listings…</p>
                  </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No listings found</p>
                    <p>Check back soon or clear your search.</p>
                  </div>
                )}

                {/* Listings */}
                {!loading && filtered.length > 0 && (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                  >
                    {filtered.map((l) => {
                      const badge    = getBadge(l);
                      const cfg      = BADGE_CONFIG[badge] || { color: 'var(--text-muted)', bg: 'var(--bg-secondary)' };
                      const isHovered = hovered === l._id;
                      const discount  = l.originalPrice - l.price;
                      const img       = l.event?.image || null;

                      return (
                        <motion.div key={l._id} variants={itemVariants}>
                          <MagneticCard
                            onMouseEnter={() => setHovered(l._id)}
                            onMouseLeave={() => setHovered(null)}
                            style={{
                              display: 'flex', gap: 24, padding: 16, borderRadius: 28,
                              background: 'white', border: '1.5px solid var(--border-subtle)',
                              boxShadow: isHovered ? '0 24px 64px rgba(16,185,129,0.12)' : 'var(--shadow-card)',
                              transition: 'box-shadow 0.4s, border-color 0.4s', alignItems: 'center',
                            }}
                          >
                            {/* Image */}
                            <div style={{ width: 120, height: 120, borderRadius: 20, overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#f0fdf4' }}>
                              {img
                                ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🎟️</div>
                              }
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3))' }} />
                            </div>

                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{l.eventTitle}</h3>
                                <span style={{
                                  padding: '4px 12px', borderRadius: 100, fontSize: 10, fontWeight: 800,
                                  background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25`,
                                  textTransform: 'uppercase', letterSpacing: '0.5px'
                                }}>{badge}</span>
                                {l.verified && (
                                  <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 800, background: '#eff6ff', color: '#2563eb', border: '1px solid #2563eb25', textTransform: 'uppercase' }}>
                                    ✓ Verified
                                  </span>
                                )}
                              </div>

                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tag size={14} style={{ color: 'var(--blue-main)' }} /> {l.ticketType}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={14} style={{ color: '#059669' }} /> {l.sellerName}</span>
                                {l.eventDate && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {l.eventDate}</span>}
                                {l.createdAt && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Listed {timeAgo(l.createdAt)}</span>}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{l.originalPrice.toLocaleString()} EGP</span>
                                <span style={{ fontSize: 24, fontWeight: 900, color: discount > 0 ? '#059669' : 'var(--blue-main)', letterSpacing: '-0.8px' }}>{l.price.toLocaleString()} EGP</span>
                                {discount > 0 && (
                                  <span style={{ fontSize: 11, fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '4px 10px', borderRadius: 100, border: '1px solid rgba(16,185,129,0.15)' }}>
                                    ↓ Save {discount.toLocaleString()} EGP
                                  </span>
                                )}
                              </div>
                            </div>

                            <motion.button
                              whileHover={reduce ? {} : { scale: 1.05, background: 'var(--blue-deep)' }}
                              style={{
                                padding: '16px 32px', borderRadius: 20, background: 'var(--blue-main)',
                                color: 'white', fontWeight: 900, fontSize: 14, border: 'none',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                                boxShadow: 'var(--shadow-blue)', transition: 'background 0.2s', flexShrink: 0
                              }}
                            >
                              Buy Securely <ArrowRight size={18} />
                            </motion.button>
                          </MagneticCard>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* SELL TAB */
              <motion.div
                key="sell-tab"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45 }}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <div style={{ width: '100%', maxWidth: 640 }}>
                  <AnimatePresence mode="wait">
                    {sold ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                        style={{ padding: 64, textAlign: 'center', background: 'white', borderRadius: 32, border: '2px solid #10b98130', boxShadow: 'var(--shadow-lg)' }}
                      >
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8 }} style={{ fontSize: 72, marginBottom: 24 }}>✨</motion.div>
                        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>Resale Successful!</h2>
                        <p style={{ color: '#059669', marginBottom: 40, fontWeight: 600, fontSize: 16 }}>Your ticket is now globally visible on the market.</p>
                        <button
                          onClick={() => setSold(false)}
                          style={{ padding: '16px 48px', borderRadius: 100, background: 'linear-gradient(135deg,#10b981,#34d399)', color: 'white', fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', fontSize: 15 }}
                        >List Another</button>
                      </motion.div>
                    ) : (
                      <motion.div
                        style={{ padding: 48, background: 'white', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)', borderRadius: 32 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                            <DollarSign size={24} />
                          </div>
                          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Resell Your Ticket</h2>
                        </div>
                        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 40, fontWeight: 500 }}>List securely in 60 seconds. Funds are held in escrow for buyer protection.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                          {[
                            { label: 'Event Destination',             ph: 'e.g. Cairo Jazz Festival 2026' },
                            { label: 'Ticket Level',                   ph: 'e.g. General, VIP, Premium...' },
                            { label: 'Original Purchase Price (EGP)',  ph: '350', type: 'number' },
                            { label: 'Your Listing Price (EGP)',       ph: '320', type: 'number' },
                            { label: 'Unique Ticket Hash / Ref #',     ph: 'Found on your confirmation email' },
                          ].map(f => (
                            <div key={f.label}>
                              <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>{f.label}</label>
                              <input
                                type={f.type || 'text'} placeholder={f.ph}
                                style={{
                                  width: '100%', padding: '14px 18px', borderRadius: 16,
                                  border: '1.5px solid var(--border-subtle)', background: 'var(--bg-secondary)',
                                  fontSize: 15, fontWeight: 500, outline: 'none', transition: 'all 0.25s', fontFamily: 'inherit'
                                }}
                                onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.08)'; }}
                                onBlur={e =>  { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.background = 'var(--bg-secondary)'; e.target.style.boxShadow = 'none'; }}
                              />
                            </div>
                          ))}

                          <div style={{ padding: 20, background: '#ecfdf5', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)', display: 'flex', gap: 16 }}>
                            <AlertCircle size={22} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Infrastructure Guarantee</p>
                              <p style={{ fontSize: 12, color: '#059669', lineHeight: 1.6, fontWeight: 500 }}>Resale prices are capped at 2× the original face value to prevent scalping. Sellers receive instant credit once the ticket is verified by our AI layer.</p>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => setSold(true)}
                            whileHover={reduce ? {} : { scale: 1.02, y: -3 }}
                            whileTap={reduce ? {} : { scale: 0.98 }}
                            style={{
                              padding: '18px', borderRadius: 20, background: 'linear-gradient(135deg,#10b981,#34d399)',
                              color: 'white', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                              boxShadow: '0 12px 32px rgba(16,185,129,0.3)', marginTop: 8, fontFamily: 'inherit', letterSpacing: '0.4px'
                            }}
                          >
                            <Sparkles size={20} /> Create Verified Listing
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
