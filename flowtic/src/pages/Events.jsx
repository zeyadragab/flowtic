import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, SlidersHorizontal, Flame, CalendarDays, MapPin, ArrowRight, TrendingUp, Users, Star } from 'lucide-react';
import api from '../services/api.js';

const CATS = ['All', 'Music', 'Sports', 'Culture', 'Comedy', 'Theatre', 'Festival'];

const CAT_META = {
  Music:    { color: '#7c3aed', bg: '#f5f3ff', light: 'rgba(124,58,237,0.08)' },
  Sports:   { color: '#059669', bg: '#ecfdf5', light: 'rgba(5,150,105,0.08)'  },
  Culture:  { color: '#d97706', bg: '#fffbeb', light: 'rgba(217,119,6,0.08)'  },
  Comedy:   { color: '#db2777', bg: '#fdf2f8', light: 'rgba(219,39,119,0.08)' },
  Theatre:  { color: '#dc2626', bg: '#fef2f2', light: 'rgba(220,38,38,0.08)'  },
  Festival: { color: '#059669', bg: '#ecfdf5', light: 'rgba(5,150,105,0.08)'  },
};

const STATS = [
  { icon: TrendingUp, value: '2M+',  label: 'Tickets Sold' },
  { icon: Star,       value: '4.9★', label: 'Avg Rating'   },
  { icon: Users,      value: '27',   label: 'Cities'        },
];

/* ─── Magnetic Card ─────────────────────────────────────────────────── */
function MagneticCard({ children, style, className, onMouseEnter, onMouseLeave }) {
  const reduce = useReducedMotion();
  const ref    = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [6, -6]),  { stiffness: 200, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-6, 6]),  { stiffness: 200, damping: 28 });
  const translateY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMove = useCallback((e) => {
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
      style={{
        ...style,
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        y:       reduce ? 0 : translateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating Orb ──────────────────────────────────────────────────── */
function FloatOrb({ size, color, top, left, right, bottom, delay = 0, duration = 8 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      animate={reduce ? {} : {
        y: [0, -30, 0],
        x: [0, 10, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute',
        width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        top, left, right, bottom,
        opacity: 0.55,
        filter: 'blur(2px)',
      }}
    />
  );
}

/* ─── Shimmer overlay on card ───────────────────────────────────────── */
const shimmerVariants = {
  idle:  { x: '-150%', opacity: 0 },
  hover: { x: '150%',  opacity: 1, transition: { duration: 0.55, ease: 'easeInOut' } },
};

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function Events() {
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('All');
  const [sort,    setSort]    = useState('date');
  const [hovered, setHovered] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setLoading(true);
    api.get('/api/events', { params: { limit: 50 } })
      .then(res => setAllEvents(res.data.events || []))
      .catch(() => setError('Failed to load events. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const list = allEvents
    .filter(ev => (cat === 'All' || ev.category === cat) && ev.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'price' ? a.price - b.price : 0);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 32, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section
        style={{ position: 'relative', paddingTop: 120, paddingBottom: 96, overflow: 'hidden', background: 'white' }}
        aria-label="Events page header"
      >
        {/* Animated orbs */}
        <FloatOrb size={560} color="#dbeafe" top="-10%"  right="-8%"  delay={0}   duration={9}  />
        <FloatOrb size={380} color="#eff6ff" bottom="-5%" left="-6%"  delay={2.5} duration={11} />
        <FloatOrb size={200} color="#bfdbfe" top="40%"   left="15%"   delay={1}   duration={7}  />

        {/* Dot grid */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, #bfdbfe 1.2px, transparent 1.2px)',
          backgroundSize: '36px 36px', opacity: 0.28, pointerEvents: 'none',
        }} />

        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: reduce ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 40 }}
          >
            <motion.div whileHover={reduce ? {} : { x: -4 }} style={{ display: 'inline-block' }}>
              <Link to="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 700, color: 'var(--blue-main)',
                textDecoration: 'none', padding: '8px 18px',
                background: 'var(--blue-soft)', borderRadius: 100,
                border: '1px solid rgba(37,99,235,0.15)',
                boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
                transition: 'box-shadow 0.2s',
              }}>
                ← Home
              </Link>
            </motion.div>
          </motion.div>

          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <motion.span
              className="badge"
              style={{ marginBottom: 24, display: 'inline-flex' }}
              animate={reduce ? {} : { boxShadow: ['0 0 0 0 rgba(37,99,235,0.15)', '0 0 0 10px rgba(37,99,235,0)', '0 0 0 0 rgba(37,99,235,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue-main)', display: 'inline-block', marginRight: 2,
                animation: 'pulse-glow 2s ease-in-out infinite' }} />
              Egypt's Premier Events
            </motion.span>

            <motion.h1
              style={{ fontSize: 'clamp(36px, 6vw, 76px)', fontWeight: 900, lineHeight: 1.05,
                letterSpacing: '-2.5px', color: 'var(--text-primary)', marginBottom: 20 }}
            >
              Browse{' '}
              <span className="gradient-text" style={{ position: 'relative', display: 'inline-block' }}>
                All Events
                {/* Animated underline */}
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    position: 'absolute', bottom: -4, left: 0, right: 0, height: 4,
                    background: 'var(--gradient-blue)', borderRadius: 4, display: 'block',
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
                maxWidth: 480, margin: '0 auto 48px', fontWeight: 500 }}
            >
              Discover events across Egypt — book your tickets before they sell out!
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}
            >
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.55 + i * 0.1 }}
                  whileHover={reduce ? {} : { scale: 1.06, y: -4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '16px 24px', background: 'white',
                    borderRadius: 20, border: '1px solid var(--border-subtle)',
                    boxShadow: '0 2px 12px rgba(37,99,235,0.07)',
                    cursor: 'default',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12,
                    background: 'var(--blue-soft)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--blue-main)' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{value}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ STICKY FILTERS ════════════════════════ */}
      <section
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px 0',
          position: 'sticky', top: 72, zIndex: 40,
          boxShadow: '0 4px 24px rgba(37,99,235,0.06)',
        }}
        aria-label="Event filters"
      >
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Search + Sort */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <Search size={15} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                    background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 100,
                    fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
                    outline: 'none', transition: 'all 0.25s', fontFamily: 'inherit',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--blue-main)'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <SlidersHorizontal size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    paddingLeft: 36, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
                    background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 100,
                    fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                    outline: 'none', cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', minWidth: 150,
                  }}
                >
                  <option value="date">By Date</option>
                  <option value="price">Price ↑</option>
                </select>
              </div>
            </div>

            {/* Category pills with animated active indicator */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {CATS.map((c, i) => (
                <motion.button
                  key={c}
                  id={`cat-btn-${c.toLowerCase()}`}
                  onClick={() => setCat(c)}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileHover={reduce ? {} : { scale: 1.06, y: -2 }}
                  whileTap={reduce ? {} : { scale: 0.94 }}
                  style={{
                    position: 'relative', padding: '7px 18px', borderRadius: 100,
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: 'none', fontFamily: 'inherit', letterSpacing: '0.3px',
                    background: cat === c ? 'var(--blue-main)' : 'white',
                    color: cat === c ? 'white' : 'var(--text-secondary)',
                    boxShadow: cat === c ? '0 4px 18px rgba(37,99,235,0.35)' : '0 1px 4px rgba(0,0,0,0.06)',
                    outline: cat === c ? 'none' : '1px solid var(--border-subtle)',
                    transition: 'all 0.22s cubic-bezier(0.23,1,0.32,1)',
                    overflow: 'hidden',
                  }}
                >
                  {c}
                  {/* shimmer on active */}
                  {cat === c && !reduce && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ x: '-150%' }}
                      animate={{ x: '300%' }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute', inset: 0, width: '40%',
                        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </motion.button>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '1px' }}>
                {list.length} result{list.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ GRID ════════════════════════ */}
      <section
        className="section-padding"
        style={{ background: '#f4f8ff' }}
        aria-label="Event listings"
      >
        <div className="container-custom">
          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 16 }}>
              Loading events...
            </div>
          )}
          {/* Error state */}
          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444', fontWeight: 600, fontSize: 16 }}>
              {error}
            </div>
          )}
          <AnimatePresence mode="wait">
            {!loading && !error && list.length > 0 ? (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: 28,
                }}
              >
                {list.map(ev => {
                  const cm = CAT_META[ev.category] || { color: 'var(--blue-main)', bg: 'var(--blue-soft)', light: 'rgba(37,99,235,0.06)' };
                  const pct = Math.min(100, Math.round((ev.sold / ev.seats) * 100));
                  const isHot = pct >= 80;

                  return (
                    <motion.div key={ev._id} variants={cardVariants}>
                      <MagneticCard
                        style={{
                          borderRadius: 28,
                          overflow: 'hidden',
                          background: 'white',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: hovered === ev._id
                            ? `0 24px 56px rgba(37,99,235,0.13), 0 0 0 2px ${cm.color}30`
                            : '0 2px 12px rgba(15,23,42,0.06)',
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHovered(ev._id)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <Link to={`/events/${ev._id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>

                          {/* ── Cover Image ── */}
                          <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                            <motion.img
                              src={ev.image}
                              alt={ev.title}
                              animate={hovered === ev._id && !reduce ? { scale: 1.12 } : { scale: 1 }}
                              transition={{ duration: 0.6, ease: 'easeOut' }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />

                            {/* Animated shimmer over cover on hover */}
                            <motion.div
                              aria-hidden="true"
                              variants={shimmerVariants}
                              initial="idle"
                              animate={hovered === ev._id && !reduce ? 'hover' : 'idle'}
                              style={{
                                position: 'absolute', inset: 0, width: '60%',
                                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%)',
                                pointerEvents: 'none', zIndex: 3,
                              }}
                            />

                            {/* Bottom gradient overlay for legibility */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))', zIndex: 1 }} />

                            {/* Hot badge */}
                            {isHot && (
                              <motion.span
                                animate={reduce ? {} : { scale: [1, 1.06, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{
                                  position: 'absolute', top: 14, left: 14, zIndex: 4,
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  padding: '5px 12px', borderRadius: 100,
                                  background: 'rgba(239,68,68,0.93)', backdropFilter: 'blur(8px)',
                                  fontSize: 10, fontWeight: 800, color: 'white', letterSpacing: '0.4px',
                                }}
                              >
                                <Flame size={10} />
                                SELLING FAST
                              </motion.span>
                            )}

                            {/* Cat chip */}
                            <span style={{
                              position: 'absolute', bottom: 14, right: 14, zIndex: 4,
                              padding: '5px 13px', borderRadius: 100,
                              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)',
                              fontSize: 10, fontWeight: 800, color: cm.color, letterSpacing: '0.4px',
                            }}>
                              {ev.category}
                            </span>
                          </div>

                          {/* ── Body ── */}
                          <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 12 }}>
                              {ev.title}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1, marginBottom: 16 }}>
                              {[
                                { Icon: CalendarDays, text: ev.date },
                                { Icon: MapPin,       text: ev.location },
                              ].map(({ Icon, text }) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
                                  <div style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--blue-soft)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={11} style={{ color: 'var(--blue-main)' }} />
                                  </div>
                                  {text}
                                </div>
                              ))}
                            </div>

                            {/* Availability bar */}
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                  Availability
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 800, color: isHot ? '#ef4444' : cm.color }}>
                                  {pct}% sold
                                </span>
                              </div>
                              <div style={{ height: 5, borderRadius: 100, background: '#f1f5f9', overflow: 'hidden' }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${pct}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                                  style={{
                                    height: '100%', borderRadius: 100,
                                    background: isHot
                                      ? 'linear-gradient(90deg, #f97316, #ef4444)'
                                      : `linear-gradient(90deg, ${cm.color}80, ${cm.color})`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Price + CTA */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 2 }}>
                                  From
                                </div>
                                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                                  {ev.price}{' '}
                                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>EGP</span>
                                </div>
                              </div>

                              <motion.div
                                whileHover={reduce ? {} : { scale: 1.07 }}
                                whileTap={reduce ? {} : { scale: 0.93 }}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 6,
                                  padding: '11px 20px',
                                  background: hovered === ev._id
                                    ? 'var(--blue-deep)'
                                    : 'var(--blue-main)',
                                  borderRadius: 100, fontSize: 11, fontWeight: 800,
                                  color: 'white', letterSpacing: '0.5px',
                                  boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
                                  transition: 'background 0.2s',
                                }}
                              >
                                Book
                                <motion.span
                                  animate={hovered === ev._id && !reduce ? { x: [0, 4, 0] } : { x: 0 }}
                                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.8 }}
                                >
                                  <ArrowRight size={13} />
                                </motion.span>
                              </motion.div>
                            </div>
                          </div>
                        </Link>
                      </MagneticCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : !loading && !error ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 180 }}
                style={{ textAlign: 'center', padding: '100px 0' }}
              >
                <motion.div
                  animate={reduce ? {} : { rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  style={{ fontSize: 72, marginBottom: 20 }}
                >
                  🔍
                </motion.div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>No events found</h3>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Try a different search or category.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
