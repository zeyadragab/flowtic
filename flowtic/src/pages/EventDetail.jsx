import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import {
  motion, useReducedMotion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
} from 'framer-motion';
import {
  ArrowLeft, CalendarDays, MapPin, Clock, Tag, Ticket,
  ScanFace, Zap, UtensilsCrossed, CheckCircle2, ChevronRight,
  Shield, Sparkles, Star, Users,
} from 'lucide-react';

/* ─── Category meta for color mapping ──────────────────────────────── */
const CAT_META = {
  Music:    { catColor: '#7c3aed', catBg: '#f5f3ff' },
  Sports:   { catColor: '#059669', catBg: '#ecfdf5' },
  Culture:  { catColor: '#d97706', catBg: '#fffbeb' },
  Comedy:   { catColor: '#db2777', catBg: '#fdf2f8' },
  Theatre:  { catColor: '#dc2626', catBg: '#fef2f2' },
  Festival: { catColor: '#059669', catBg: '#ecfdf5' },
};

/* Normalise API response to the shape the UI expects */
function normalizeEvent(raw) {
  const meta = CAT_META[raw.category] || { catColor: '#2563eb', catBg: '#eff6ff' };
  return {
    ...raw,
    img:      raw.image,
    gFrom:    raw.gradient?.[0] || '#2563eb',
    cat:      raw.category,
    catColor: meta.catColor,
    catBg:    meta.catBg,
    loc:      raw.location,
    reviews:  raw.rating,
    desc:     raw.description,
    tiers:    (raw.ticketTiers || []).map(t => ({
      n:     t.name,
      p:     t.price,
      avail: t.available,
      total: t.total,
    })),
  };
}

const AI_FEATURES = [
  { icon: ScanFace, title: 'Face ID Entry',   desc: 'Zero queues, biometric gates', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Zap,      title: 'Smart Routes',    desc: 'AI picks the fastest entrance',  color: '#2563eb', bg: '#eff6ff' },
  { icon: UtensilsCrossed, title: 'Seat Delivery', desc: 'Food delivered to you',    color: '#d97706', bg: '#fffbeb' },
];

/* ─── Floating orb ───────────────────────────────────────────────────── */
function FloatOrb({ size, color, top, left, right, bottom, delay = 0, speed = 7 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      animate={reduce ? {} : { y: [0, -24, 0], x: [0, 8, 0] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', width: size, height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        borderRadius: '50%', pointerEvents: 'none',
        top, left, right, bottom, opacity: 0.5, filter: 'blur(1px)',
      }}
    />
  );
}

/* ─── Ripple Button ──────────────────────────────────────────────────── */
function RippleButton({ onClick, children, style, disabled }) {
  const reduce = useReducedMotion();
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled) return;
    if (!reduce) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples(r => [...r, { id, x, y }]);
      setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    }
    onClick?.();
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={reduce ? {} : { y: -3, boxShadow: '0 20px 48px rgba(37,99,235,0.4)' }}
      whileTap={reduce ? {} : { scale: 0.97 }}
      style={{
        position: 'relative', overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {ripples.map(({ id, x, y }) => (
        <motion.span
          key={id}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: x, top: y,
            width: 80, height: 80,
            marginLeft: -40, marginTop: -40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
            pointerEvents: 'none',
          }}
        />
      ))}
      {children}
    </motion.button>
  );
}

/* ─── Stat chip ─────────────────────────────────────────────────────── */
function StatChip({ icon: Icon, label, value, color }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={reduce ? {} : { scale: 1.06, y: -3 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px',
        background: 'white', borderRadius: 16,
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 10px rgba(37,99,235,0.07)',
        cursor: 'default',
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 10,
        background: color + '15', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color }}>
        <Icon size={16} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 2 }}>{label}</div>
      </div>
    </motion.div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────── */
export default function EventDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [ev,     setEv]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [tier, setTier]     = useState(0);
  const [qty,  setQty]      = useState(1);
  const [booked, setBooked] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setLoading(true);
    setTier(0);
    api.get(`/api/events/${id}`)
      .then(res => setEv(normalizeEvent(res.data)))
      .catch(() => setError('Event not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  /* Cursor-tracking image card */
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-120, 120], [14, -14]), { stiffness: 120, damping: 22 });
  const ry = useSpring(useTransform(mx, [-120, 120], [-14, 14]), { stiffness: 120, damping: 22 });

  const handleCardMove = useCallback((e) => {
    if (reduce) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width  / 2);
    my.set(e.clientY - rect.top  - rect.height / 2);
  }, [reduce, mx, my]);
  const handleCardLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)' }}>
      Loading event...
    </div>
  );
  if (error || !ev) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{error || 'Event not found.'}</p>
      <Link to="/events" style={{ color: 'var(--blue-main)', fontWeight: 700 }}>← Back to Events</Link>
    </div>
  );

  const selected = ev.tiers[tier] || ev.tiers[0];
  const total    = (selected?.p || 0) * qty;
  const availPct = selected?.total < 9999
    ? Math.round(((selected.total - selected.avail) / selected.total) * 100)
    : 0;

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => navigate('/dashboard'), 2800);
  };

  const reveal = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] },
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section
        style={{ position: 'relative', paddingTop: 104, paddingBottom: 88, overflow: 'hidden' }}
        aria-label={`${ev.title} hero`}
      >
        {/* Gradient wash from the event colour */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${ev.gFrom}10 0%, transparent 55%)`,
          pointerEvents: 'none',
        }} />

        {/* Animated orbs */}
        <FloatOrb size={520} color="#dbeafe" top="-8%"   right="-6%"  delay={0}   speed={10} />
        <FloatOrb size={320} color="#eff6ff" bottom="-8%" left="-4%"  delay={2}   speed={13} />
        <FloatOrb size={180} color={ev.gFrom + '30'} top="30%" left="10%" delay={1} speed={8} />

        {/* Dot grid */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, #bfdbfe 1.2px, transparent 1.2px)',
          backgroundSize: '36px 36px', opacity: 0.25, pointerEvents: 'none',
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
              <Link to="/events" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 700, color: 'var(--blue-main)',
                textDecoration: 'none', padding: '8px 18px',
                background: 'var(--blue-soft)', borderRadius: 100,
                border: '1px solid rgba(37,99,235,0.15)',
                boxShadow: '0 2px 8px rgba(37,99,235,0.1)',
              }}>
                <ArrowLeft size={14} />
                All Events
              </Link>
            </motion.div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 56, alignItems: 'center' }}>

            {/* ── Left: title + meta ── */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Category badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  marginBottom: 20, padding: '6px 16px',
                  background: ev.catBg, color: ev.catColor,
                  borderRadius: 100, fontSize: 10, fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  border: `1px solid ${ev.catColor}25`,
                  boxShadow: `0 4px 16px ${ev.catColor}18`,
                }}
              >
                <Tag size={10} />
                {ev.cat}
              </motion.span>

              {/* Title */}
              <h1 style={{
                fontSize: 'clamp(28px, 4vw, 54px)',
                fontWeight: 900, lineHeight: 1.08,
                letterSpacing: '-1.5px', color: 'var(--text-primary)', marginBottom: 28,
              }}>
                {ev.title}
              </h1>

              {/* Meta info chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                {[
                  { icon: CalendarDays, text: ev.date },
                  { icon: Clock,        text: ev.time },
                  { icon: MapPin,       text: ev.loc  },
                ].map(({ icon: Icon, text }) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      background: 'white', borderRadius: 14,
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
                      fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
                    }}
                  >
                    <Icon size={14} style={{ color: 'var(--blue-main)', flexShrink: 0 }} />
                    {text}
                  </motion.div>
                ))}
              </div>

              {/* Social proof stats */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
              >
                <StatChip icon={Star}  label="Rating"    value={ev.reviews + '★'} color={ev.catColor} />
                <StatChip icon={Users} label="Attendees" value={ev.attendees}      color="#2563eb"     />
                <StatChip icon={Shield} label="Secure"   value="100%"              color="#059669"     />
              </motion.div>
            </motion.div>

            {/* ── Right: 3D Image Card ── */}
            <motion.div
              className="hidden lg:flex"
              style={{ justifyContent: 'center', position: 'relative', flexShrink: 0 }}
              initial={{ opacity: 0, x: reduce ? 0 : 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Outer spinning ring */}
              <motion.div
                aria-hidden="true"
                animate={reduce ? {} : { rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: 380, height: 380,
                  borderRadius: '50%', border: '1.5px dashed #bfdbfe',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)', pointerEvents: 'none',
                }}
              />
              {/* Inner spinning ring (reversed) */}
              <motion.div
                aria-hidden="true"
                animate={reduce ? {} : { rotate: -360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', width: 300, height: 300,
                  borderRadius: '50%', border: '1px dashed #bfdbfe88',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)', pointerEvents: 'none',
                }}
              />

              {/* 3D Image Card */}
              <motion.div
                ref={cardRef}
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
                animate={reduce ? {} : { y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  rotateX: reduce ? 0 : rx,
                  rotateY: reduce ? 0 : ry,
                  transformStyle: 'preserve-3d',
                  perspective: 900,
                  width: 320, height: 320, borderRadius: 40,
                  overflow: 'hidden',
                  boxShadow: '0 32px 80px rgba(37,99,235,0.18), 0 8px 24px rgba(0,0,0,0.1)',
                  position: 'relative', cursor: 'default',
                }}
              >
                <motion.img
                  src={ev.img}
                  alt={ev.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Inner glow & Vignette */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 40,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%), linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))',
                  pointerEvents: 'none',
                }} />

                {/* Floating badge: Secure */}
                <motion.div
                  animate={reduce ? {} : { y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{
                    position: 'absolute', top: 20, right: 20, zIndex: 10,
                    background: 'white', borderRadius: 14,
                    padding: '10px 14px',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 12, fontWeight: 800, color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Shield size={14} style={{ color: '#059669' }} />
                  Secure
                </motion.div>

                {/* Floating badge: Instant ticket */}
                <motion.div
                  animate={reduce ? {} : { y: [0, -7, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  style={{
                    position: 'absolute', bottom: 20, right: 20, zIndex: 10,
                    background: 'var(--blue-main)', borderRadius: 14,
                    padding: '10px 14px',
                    boxShadow: '0 8px 28px rgba(37,99,235,0.35)',
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 12, fontWeight: 800, color: 'white',
                  }}
                >
                  <Sparkles size={14} />
                  Instant
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ BODY ════════════════════════ */}
      <section style={{ background: '#f4f8ff', padding: '64px 0 96px' }}>
        <div
          className="container-custom"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: 40, alignItems: 'start' }}
        >

          {/* ── LEFT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* About */}
            <motion.div {...(reduce ? {} : reveal)}
              style={{
                background: 'white', borderRadius: 28, padding: 40,
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 16px rgba(37,99,235,0.06)',
              }}
            >
              <span className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>About</span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                About This Event
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.85, fontWeight: 500 }}>
                {ev.desc}
              </p>

              {/* Decorative line */}
              <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  marginTop: 28, height: 3, borderRadius: 100,
                  background: `linear-gradient(90deg, ${ev.catColor}, ${ev.catColor}20)`,
                }}
              />
            </motion.div>

            {/* AI Features */}
            <motion.div
              {...(reduce ? {} : { ...reveal, transition: { duration: 0.65, ease: [0.23,1,0.32,1], delay: 0.08 } })}
              style={{
                background: 'white', borderRadius: 28, padding: 40,
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 16px rgba(37,99,235,0.06)',
              }}
            >
              <span className="badge" style={{
                marginBottom: 20, display: 'inline-flex',
                background: '#f5f3ff', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)',
              }}>
                <Sparkles size={10} />
                AI-Enhanced
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 32 }}>
                Smart Experience Features
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
                {AI_FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
                  <motion.div
                    key={title}
                    initial={reduce ? {} : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    whileHover={reduce ? {} : {
                      y: -8,
                      boxShadow: `0 20px 40px ${color}20`,
                      transition: { duration: 0.25 },
                    }}
                    style={{
                      padding: '28px 20px', borderRadius: 22, background: bg,
                      border: `1px solid ${color}20`, textAlign: 'center',
                      cursor: 'default', position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* Shimmer on hover */}
                    <motion.div
                      aria-hidden="true"
                      initial={{ x: '-150%', opacity: 0 }}
                      whileHover={{ x: '250%', opacity: 1 }}
                      transition={{ duration: 0.55 }}
                      style={{
                        position: 'absolute', inset: 0, width: '50%',
                        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <motion.div
                      whileHover={reduce ? {} : { scale: 1.15, rotate: -8 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      style={{
                        width: 56, height: 56, borderRadius: '50%', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color, margin: '0 auto 16px',
                        boxShadow: `0 6px 20px ${color}25`,
                      }}
                    >
                      <Icon size={26} />
                    </motion.div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Venue Map */}
            <motion.div
              {...(reduce ? {} : { ...reveal, transition: { duration: 0.65, ease: [0.23,1,0.32,1], delay: 0.14 } })}
              style={{
                background: 'white', borderRadius: 28, overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 16px rgba(37,99,235,0.06)',
              }}
            >
              <div style={{ padding: '24px 32px 20px', display: 'flex', alignItems: 'center', gap: 12,
                borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--blue-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  🗺️
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Interactive Venue Map
                </h2>
              </div>

              <div style={{
                height: 240, position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #eff6ff, #f8fbff)',
              }}>
                {/* Animated grid */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(circle, #bfdbfe 1px, transparent 1px)',
                  backgroundSize: '28px 28px', opacity: 0.5,
                }} />
                {/* Pulse ring on venue */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div
                    animate={reduce ? {} : { scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%',
                      border: '2px solid var(--blue-main)', pointerEvents: 'none' }}
                  />
                  <motion.div
                    animate={reduce ? {} : { scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                    style={{ position: 'absolute', width: 52, height: 52, borderRadius: '50%',
                      border: '2px solid var(--blue-main)', pointerEvents: 'none' }}
                  />
                  <div style={{ width: 48, height: 48, borderRadius: '50%',
                    background: 'var(--blue-main)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 22, position: 'relative', zIndex: 1,
                    boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
                    🏟️
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Interactive map · AI-assigned entrance on e-ticket
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Booking ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <AnimatePresence mode="wait">
              {booked ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    padding: 40, textAlign: 'center', borderRadius: 28,
                    background: 'linear-gradient(135deg, #ecfdf5, #f0fdf4)',
                    border: '1.5px solid rgba(5,150,105,0.3)',
                    boxShadow: '0 16px 56px rgba(5,150,105,0.12)',
                  }}
                >
                  <motion.div
                    animate={reduce ? {} : { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ fontSize: 64, marginBottom: 16 }}
                  >
                    🎟️
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250, delay: 0.4 }}
                  >
                    <CheckCircle2 size={36} style={{ color: '#059669', marginBottom: 14 }} />
                  </motion.div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}>
                    Booking Confirmed!
                  </h3>
                  <p style={{ fontSize: 14, color: '#059669', fontWeight: 700, marginBottom: 8 }}>
                    Your e-ticket has been sent.
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                    Redirecting to dashboard…
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, y: reduce ? 0 : 36 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    padding: 32, borderRadius: 28, position: 'sticky', top: 100,
                    background: 'white', border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 40px rgba(37,99,235,0.08)',
                  }}
                >
                  <span className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
                    <Ticket size={10} />
                    Select Tickets
                  </span>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>
                    Choose Your Tier
                  </h2>

                  {/* Tier selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                    {ev.tiers.map(({ n, p, avail, total: tierTotal }, i) => {
                      const soldPct = tierTotal < 9999 ? Math.round(((tierTotal - avail) / tierTotal) * 100) : 0;
                      const isActive = tier === i;
                      const isLow = avail < 20 && tierTotal < 9999;
                      return (
                        <motion.button
                          key={n}
                          id={`tier-btn-${i}`}
                          onClick={() => setTier(i)}
                          whileHover={reduce ? {} : { scale: 1.025 }}
                          whileTap={reduce ? {} : { scale: 0.975 }}
                          style={{
                            display: 'flex', flexDirection: 'column',
                            padding: '16px 20px', borderRadius: 18,
                            cursor: 'pointer', border: 'none',
                            width: '100%', textAlign: 'left',
                            fontFamily: 'inherit', position: 'relative', overflow: 'hidden',
                            background: isActive ? ev.catBg : '#f8fbff',
                            outline: isActive
                              ? `2px solid ${ev.catColor}`
                              : '1.5px solid var(--border-subtle)',
                            outlineOffset: '-1.5px',
                            boxShadow: isActive ? `0 6px 24px ${ev.catColor}20` : 'none',
                            transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
                          }}
                        >
                          {/* Active shimmer */}
                          {isActive && !reduce && (
                            <motion.span
                              aria-hidden="true"
                              initial={{ x: '-150%' }}
                              animate={{ x: '300%' }}
                              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5 }}
                              style={{
                                position: 'absolute', inset: 0, width: '35%',
                                background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.5), transparent)',
                                pointerEvents: 'none',
                              }}
                            />
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{n}</div>
                              {isLow && (
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', marginTop: 2 }}>
                                  ⚡ Only {avail} left!
                                </div>
                              )}
                              {!isLow && tierTotal < 9999 && (
                                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {avail.toLocaleString()} remaining
                                </div>
                              )}
                            </div>
                            <div style={{
                              fontSize: 18, fontWeight: 900,
                              color: isActive ? ev.catColor : 'var(--text-primary)',
                              letterSpacing: '-0.5px',
                            }}>
                              {p} <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>EGP</span>
                            </div>
                          </div>

                          {/* Mini availability bar */}
                          {tierTotal < 9999 && (
                            <div style={{ height: 4, borderRadius: 100, background: '#f1f5f9', overflow: 'hidden' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${soldPct}%` }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                style={{
                                  height: '100%', borderRadius: 100,
                                  background: soldPct > 80
                                    ? 'linear-gradient(90deg, #f97316, #ef4444)'
                                    : `linear-gradient(90deg, ${ev.catColor}80, ${ev.catColor})`,
                                }}
                              />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>Quantity</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <motion.button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        whileHover={reduce ? {} : { scale: 1.1 }}
                        whileTap={reduce ? {} : { scale: 0.9 }}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: '#f1f5f9', border: '1.5px solid var(--border-subtle)',
                          cursor: 'pointer', fontSize: 20, fontWeight: 700,
                          color: 'var(--text-primary)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontFamily: 'inherit',
                        }}
                      >−</motion.button>

                      <AnimatePresence mode="wait">
                        <motion.span
                          key={qty}
                          initial={{ opacity: 0, y: -8, scale: 0.8 }}
                          animate={{ opacity: 1, y:  0, scale: 1 }}
                          exit={{ opacity: 0, y:  8, scale: 0.8 }}
                          transition={{ duration: 0.18 }}
                          style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)',
                            minWidth: 30, textAlign: 'center', display: 'block' }}
                        >
                          {qty}
                        </motion.span>
                      </AnimatePresence>

                      <motion.button
                        onClick={() => setQty(q => Math.min(10, q + 1))}
                        whileHover={reduce ? {} : { scale: 1.1 }}
                        whileTap={reduce ? {} : { scale: 0.9 }}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: 'var(--blue-main)', border: 'none',
                          cursor: 'pointer', fontSize: 20, fontWeight: 700,
                          color: 'white', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontFamily: 'inherit',
                          boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                        }}
                      >+</motion.button>
                    </div>
                  </div>

                  {/* Total */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', marginBottom: 20,
                    background: 'var(--blue-soft)', borderRadius: 16,
                    border: '1px solid rgba(37,99,235,0.12)',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>Total</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={total}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          fontSize: 26, fontWeight: 900, letterSpacing: '-1px',
                          background: 'var(--gradient-blue)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {total.toLocaleString()} EGP
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {/* Ripple Book Button */}
                  <RippleButton
                    onClick={handleBook}
                    style={{
                      width: '100%', padding: '16px 24px',
                      background: 'var(--gradient-blue)',
                      border: 'none', borderRadius: 18,
                      fontSize: 15, fontWeight: 800, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 8px 28px rgba(37,99,235,0.35)',
                      fontFamily: 'inherit',
                      letterSpacing: '0.3px',
                    }}
                  >
                    <Ticket size={17} />
                    Book Now
                    <motion.span
                      animate={reduce ? {} : { x: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <ChevronRight size={17} />
                    </motion.span>
                  </RippleButton>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    marginTop: 14, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                    <Shield size={11} style={{ color: 'var(--blue-main)' }} />
                    Secure checkout · Instant e-ticket delivery
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pre-order food */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link to="/food" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={reduce ? {} : {
                    y: -6,
                    boxShadow: '0 24px 48px rgba(217,119,6,0.15)',
                    borderColor: 'rgba(217,119,6,0.4)',
                  }}
                  style={{
                    padding: '20px 24px', borderRadius: 24,
                    display: 'flex', alignItems: 'center', gap: 16,
                    background: '#fffbeb', border: '1.5px solid rgba(217,119,6,0.2)',
                    boxShadow: '0 4px 20px rgba(217,119,6,0.08)',
                    transition: 'all 0.28s cubic-bezier(0.23,1,0.32,1)',
                    cursor: 'pointer', overflow: 'hidden', position: 'relative',
                  }}
                >
                  <motion.div
                    whileHover={reduce ? {} : { rotate: [0, -15, 15, 0] }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 52, height: 52, borderRadius: 16,
                      background: 'rgba(217,119,6,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}
                  >
                    🍕
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                      Pre-order Food &amp; Drinks
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Ready and waiting when you arrive
                    </p>
                  </div>
                  <motion.div
                    animate={reduce ? {} : { x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <ChevronRight size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
