import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HERO_STATS = [
  { value: '2M+', label: 'Tickets Sold' },
  { value: '27', label: 'Cities' },
  { value: '99%', label: 'Secure' },
];

const MOCK_EVENTS = [
  { emoji: '🎵', title: 'Jazz Festival Egypt', date: 'Mar 15' },
  { emoji: '⚽', title: 'Derby: Ahly vs Zamalek', date: 'Feb 28' },
  { emoji: '🏛️', title: 'Heritage Exhibition', date: 'Mar 10' },
];

export default function Hero() {
  const reduce = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] } },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: reduce ? 0 : 40, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] } },
  };

  return (
    <section
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 64,
        overflow: 'hidden',
        background: 'white',
      }}
    >
      {/* Background blobs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, #dbeafe 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-8%',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, #eff6ff 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* Floating dots pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, #dbeafe 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Left – text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: 560 }}
          >
            <motion.div variants={itemVariants}>
              <span className="badge" style={{ marginBottom: 24, display: 'inline-flex' }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--blue-main)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                  }}
                />
                Egypt's #1 Event Platform
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 'clamp(44px, 7vw, 80px)',
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: '-2px',
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              Discover{' '}
              <span className="gradient-text">Premier</span>
              <br />
              Events in Egypt.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{
                fontSize: 18,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 460,
                fontWeight: 500,
              }}
            >
              Book tickets for the biggest concerts, sports, and cultural
              festivals — instantly and securely.
            </motion.p>

            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 56 }}
            >
              <Link to="/events" style={{ textDecoration: 'none' }}>
                <motion.span
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  Get Tickets
                  <ArrowRight size={15} />
                </motion.span>
              </Link>
              <Link to="/events" style={{ textDecoration: 'none' }}>
                <motion.span
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '14px 28px',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'white',
                  }}
                >
                  Browse Events
                </motion.span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              style={{
                display: 'flex',
                gap: 32,
                paddingTop: 32,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {HERO_STATS.map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right – mock ticket card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:flex"
            style={{ justifyContent: 'center', position: 'relative' }}
          >
            {/* Decorative ring */}
            <motion.div
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: 480,
                height: 480,
                borderRadius: '50%',
                border: '1px dashed #bfdbfe',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />

            <motion.div
              animate={reduce ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                maxWidth: 380,
                position: 'relative',
              }}
            >
              {/* Main card */}
              <div
                className="glass"
                style={{
                  padding: 32,
                  borderRadius: 32,
                  boxShadow: '0 32px 64px rgba(37,99,235,0.12), 0 0 0 1px rgba(37,99,235,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 4 }}>
                      Featured Events
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Today's Picks</div>
                  </div>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: 'var(--gradient-blue)',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                  >
                    🎟️
                  </div>
                </div>

                {/* Event list items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {MOCK_EVENTS.map((ev, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      whileHover={{ x: 4 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        background: i === 0 ? '#eff6ff' : '#f8fafc',
                        borderRadius: 16,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: i === 0 ? '1px solid #bfdbfe' : '1px solid transparent',
                      }}
                    >
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{ev.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {ev.date}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          background: i === 0 ? 'var(--blue-main)' : 'white',
                          color: i === 0 ? 'white' : 'var(--blue-main)',
                          borderRadius: 100,
                          fontSize: 9,
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          border: i === 0 ? 'none' : '1px solid #bfdbfe',
                          flexShrink: 0,
                        }}
                      >
                        Buy
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA tag */}
                <div
                  style={{
                    marginTop: 20,
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--blue-main)',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  ✨ Smart Ticket Delivery — Instantly
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={reduce ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  background: 'white',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding: '12px 16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ fontSize: 16 }}>🔒</span>
                <span>100% Secure</span>
              </motion.div>

              {/* Floating badge 2 */}
              <motion.div
                animate={reduce ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{
                  position: 'absolute',
                  bottom: -16,
                  left: -20,
                  background: 'var(--blue-main)',
                  borderRadius: 16,
                  padding: '12px 16px',
                  boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                <span style={{ fontSize: 16 }}>🎫</span>
                <span>Instant eTicket</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <motion.div
            animate={reduce ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
